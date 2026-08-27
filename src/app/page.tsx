"use client";

import { useState } from "react";
import { LandingPage } from "@/components/landing-page";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleGenerate = async (
    idea: string,
    options?: { projectType?: string; techStack?: string; experienceLevel?: string }
  ) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, ...options }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate architecture");
      }

      const data = await response.json();

      // Store in localStorage and navigate
      localStorage.setItem("archai-architecture", JSON.stringify(data));
      router.push("/architecture");
    } catch {
      alert("Failed to generate architecture. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return <LandingPage onGenerate={handleGenerate} isGenerating={isGenerating} />;
}
