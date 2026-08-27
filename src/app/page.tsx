"use client";

import { useState } from "react";
import { LandingPage } from "@/components/landing-page";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = async (
    idea: string,
    options?: { projectType?: string; techStack?: string; experienceLevel?: string }
  ) => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, ...options }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate architecture");
      }

      localStorage.setItem("archai-architecture", JSON.stringify(data));
      router.push("/architecture");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <LandingPage onGenerate={handleGenerate} isGenerating={isGenerating} />
      {error && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md bg-destructive/90 text-white px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm">
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-xs underline mt-1 opacity-80 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
