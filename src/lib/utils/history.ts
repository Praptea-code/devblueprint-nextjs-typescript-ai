import type { ArchitectureResponse } from "@/types";

const HISTORY_KEY = "archai-history";
const MAX_HISTORY = 10;

export interface HistoryEntry {
  id: string;
  projectName: string;
  description: string;
  idea: string;
  timestamp: number;
  data: ArchitectureResponse;
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function addToHistory(idea: string, data: ArchitectureResponse): HistoryEntry {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    projectName: data.overview.projectName,
    description: data.overview.description,
    idea,
    timestamp: Date.now(),
    data,
  };

  const history = getHistory();
  const updated = [entry, ...history.filter((h) => h.idea !== idea)].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return entry;
}

export function removeFromHistory(id: string): void {
  const history = getHistory();
  const updated = history.filter((h) => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
