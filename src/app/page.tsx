"use client";

import { useState, useEffect, useRef } from "react";
import { LandingPage } from "@/components/landing-page";
import { useRouter } from "next/navigation";
import {
  addToHistory,
  getHistory,
  removeFromHistory,
  type HistoryEntry,
} from "@/lib/utils/history";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const historyRef = useRef<HistoryEntry[]>([]);
  const router = useRouter();

  useEffect(() => {
    const entries = getHistory();
    historyRef.current = entries;
    // Use a microtask to defer state update
    queueMicrotask(() => setHistory(entries));
  }, []);

  const handleGenerate = async (
    idea: string,
    options?: { projectType?: string; techStack?: string; experienceLevel?: string; region?: string }
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

      addToHistory(idea, data);
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

  const handleHistoryClick = (entry: HistoryEntry) => {
    localStorage.setItem("archai-architecture", JSON.stringify(entry.data));
    router.push("/architecture");
  };

  const handleDeleteHistory = (id: string) => {
    removeFromHistory(id);
    setHistory((prev) => prev.filter((h) => h.id !== id));
    historyRef.current = historyRef.current.filter((h) => h.id !== id);
  };

  return (
    <div>
      <LandingPage
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        history={history}
        onHistoryClick={handleHistoryClick}
        onDeleteHistory={handleDeleteHistory}
      />

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
