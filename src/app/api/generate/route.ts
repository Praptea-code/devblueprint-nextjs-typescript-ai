import { NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai/provider";
import { generateRequestSchema } from "@/lib/validation/architecture";

export async function POST(request: Request) {
  try {
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
