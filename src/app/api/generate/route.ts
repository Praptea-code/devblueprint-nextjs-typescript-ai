import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getAIProvider } from "@/lib/ai/provider";
import { generateRequestSchema } from "@/lib/validation/architecture";

const hasUpstashEnv =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

// Sliding-window limit: 5 requests per IP per hour. Only enabled once the
// Upstash Redis credentials are configured (local dev / builds without the
// env vars run unthrottled).
const ratelimit =
  hasUpstashEnv &&
  new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: true,
  });

function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    return xff.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip")?.trim() || "anonymous";
}

export async function POST(request: Request) {
  try {
    if (ratelimit) {
      const ip = getClientIp(request);
      const { success, reset } = await ratelimit.limit(ip);

      if (!success) {
        const retryMs = Math.max(reset - Date.now(), 0);
        const retrySeconds = Math.max(1, Math.ceil(retryMs / 1000));
        const retryMinutes = Math.max(1, Math.ceil(retrySeconds / 60));
        return NextResponse.json(
          {
            error: `Rate limit reached. Please try again in ${retryMinutes} minute${
              retryMinutes === 1 ? "" : "s"
            }.`,
            reset,
          },
          {
            status: 429,
            headers: { "Retry-After": String(retrySeconds) },
          }
        );
      }
    }

    const body = await request.json();
    const parsed = generateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid request" },
        { status: 400 }
      );
    }

    const provider = getAIProvider();
    const architecture = await provider.generateArchitecture(parsed.data);

    return NextResponse.json(architecture);
  } catch (error) {
    console.error("Architecture generation failed:", error);

    const message =
      error instanceof Error ? error.message : "Failed to generate architecture";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
