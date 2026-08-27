"use client";

import { useState, useEffect, useRef } from "react";
import { LandingPage } from "@/components/landing-page";
import { useRouter } from "next/navigation";
import {
  addToHistory,
  getHistory,
  type HistoryEntry,
} from "@/lib/utils/history";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Trash2 } from "lucide-react";

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

  return (
    <div>
      <LandingPage onGenerate={handleGenerate} isGenerating={isGenerating} />

      {/* Recent Architectures */}
      {history.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Recent architectures
            </p>
            <div className="space-y-2">
              {history.map((entry) => (
                <Card
                  key={entry.id}
                  className="border-border/50 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all cursor-pointer group"
                  onClick={() => handleHistoryClick(entry)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-sm font-medium truncate">
                          {entry.projectName}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {entry.idea}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Would remove from history
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

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
