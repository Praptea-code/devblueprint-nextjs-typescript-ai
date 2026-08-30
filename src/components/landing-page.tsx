"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteNav } from "@/components/site-nav";
import { HeroOrbit } from "@/components/hero-orbit";
import type { HistoryEntry } from "@/lib/utils/history";
import {
  ArrowRight,
  Sparkles,
  Loader2,
  History,
  Clock,
  Trash2,
  ChevronDown,
  GitBranch,
  Star,
  Zap,
  Plus,
} from "lucide-react";

const EXAMPLE_IDEAS = [
  {
    title: "Hospital Appointment System",
    idea: "Build a hospital appointment system where patients can book appointments through WhatsApp, doctors can manage their schedules, and admins can view analytics.",
  },
  {
    title: "E-Learning Platform",
    idea: "Create an e-learning platform with live video classes, course management, student progress tracking, quizzes, and a certificate generation system.",
  },
];

interface LandingPageProps {
  onGenerate: (idea: string, options?: { projectType?: string; techStack?: string; experienceLevel?: string }) => void;
  isGenerating: boolean;
  history: HistoryEntry[];
  onHistoryClick: (entry: HistoryEntry) => void;
  onDeleteHistory: (id: string) => void;
}

export function LandingPage({
  onGenerate,
  isGenerating,
  history,
  onHistoryClick,
  onDeleteHistory,
}: LandingPageProps) {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  const [idea, setIdea] = useState("");
  const [projectType, setProjectType] = useState("");
  const [techStack, setTechStack] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [activityIdx, setActivityIdx] = useState(0);
  const historyRef = useRef<HTMLDivElement>(null);

  // Hydration-safe theme detection: don't read the resolved theme until the
  // client has mounted, so the logo doesn't flash/mismatch on first render.
  const logoSrc =
    !mounted || resolvedTheme !== "dark" ? "/logo.png" : "/logo2.png";

  // Runtime measurement of the hero + inner content column so the orbit's
  // rings and icons are sized/placed against the REAL rendered bounds.
  const mainRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [orbit, setOrbit] = useState<{
    w: number;
    h: number;
    content: { left: number; top: number; w: number; h: number };
  } | null>(null);

  useEffect(() => {
    const measure = () => {
      const hero = mainRef.current;
      const content = contentRef.current;
      if (!hero || !content) return;
      const hr = hero.getBoundingClientRect();
      const cr = content.getBoundingClientRect();
      setOrbit({
        w: hr.width,
        h: hr.height,
        content: { left: cr.left - hr.left, top: cr.top - hr.top, w: cr.width, h: cr.height },
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (mainRef.current) ro.observe(mainRef.current);
    if (contentRef.current) ro.observe(contentRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivityIdx((i) => (i + 1) % EXAMPLE_IDEAS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!historyOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setHistoryOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHistoryOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [historyOpen]);

  const handleSubmit = () => {
    if (!idea.trim()) return;
    onGenerate(idea, {
      projectType: projectType || undefined,
      techStack: techStack || undefined,
      experienceLevel: experienceLevel || undefined,
    });
  };

  const handleExampleClick = (exampleIdea: string) => {
    setIdea(exampleIdea);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <SiteNav>
        <div className="hidden sm:flex items-center gap-5">
              <div className="relative" ref={historyRef}>
                <button
                  type="button"
                  onClick={() => setHistoryOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={historyOpen}
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <History className="w-3.5 h-3.5" />
                  Recent
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${historyOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {historyOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-lg border border-border bg-popover text-popover-foreground shadow-lg overflow-hidden z-50">
                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/50">
                      Recent architectures
                    </div>
                    {history.length === 0 ? (
                      <p className="px-3 py-4 text-sm text-muted-foreground text-center">
                        No recent architectures yet
                      </p>
                    ) : (
                      <div className="max-h-72 overflow-y-auto">
                        {history.map((entry) => (
                          <div
                            key={entry.id}
                            role="menuitem"
                            className="group flex items-center justify-between gap-2 px-3 py-2 cursor-pointer hover:bg-muted/60 transition-colors"
                            onClick={() => {
                              onHistoryClick(entry);
                              setHistoryOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {entry.projectName}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {entry.idea}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              aria-label={`Delete ${entry.projectName}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteHistory(entry.id);
                              }}
                              className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-destructive hover:bg-muted transition-opacity"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <ThemeToggle />
          </SiteNav>

      {/* Hero Section */}
      <main ref={mainRef} className="relative flex-1 flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 pt-[67px] sm:pt-[83px] pb-[67px] sm:pb-[83px]">
        <HeroOrbit
          heroWidth={orbit?.w ?? null}
          heroHeight={orbit?.h ?? null}
          contentRect={orbit?.content ?? null}
        />
        <div ref={contentRef} className="relative z-10 max-w-3xl w-full space-y-8">
          {/* Title */}
          <div className="text-center space-y-4">
            {/* Top badges */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://github.com/Praptea-code/devblueprint-nextjs-typescript-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/50 bg-card/40 text-sm text-muted-foreground hover:bg-card/70 hover:text-foreground transition-colors"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                Open Source on GitHub
              </a>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Architecture Generation
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Turn your idea into a
              <br />
              <span className="text-primary">build-ready architecture</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Describe your project idea and get a complete technical blueprint
              with architecture diagrams, database schemas, API designs, and more.
            </p>

            {/* Floating activity card */}
            <div className="flex justify-center">
              <div
                key={activityIdx}
                className="inline-flex items-center gap-2 rounded-lg border border-border/50 bg-card/60 px-3 py-2 text-sm text-muted-foreground shadow-sm animate-in fade-in slide-in-from-top-1 duration-300"
              >
                <Zap className="w-4 h-4 text-primary shrink-0" />
                <span>
                  Someone generated a{" "}
                  <span className="font-medium text-foreground">
                    {EXAMPLE_IDEAS[activityIdx].title}
                  </span>{" "}
                  blueprint · 2 min ago
                </span>
              </div>
            </div>
          </div>

          {/* Input Card */}
          <Card className="border-black/10 bg-card/50 shadow-sm dark:border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="idea"
                  className="text-sm font-medium text-foreground"
                >
                  Describe your project idea
                </label>
                <Textarea
                  id="idea"
                  placeholder="e.g., I want to build a hospital appointment system where patients can book appointments through WhatsApp..."
                  className="min-h-[120px] resize-none bg-background border-black/15 shadow-sm dark:border-border/50 text-base placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              {/* Optional fields */}
              {showOptions && (
                <div
                  id="optional-fields"
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-1 duration-200"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Project Type
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      disabled={isGenerating}
                      className="w-full rounded-md border border-black/15 bg-background shadow-sm px-3 py-2 text-sm dark:border-border/50 focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Any</option>
                      <option value="web-app">Web Application</option>
                      <option value="mobile-app">Mobile Application</option>
                      <option value="api">REST API</option>
                      <option value="fullstack">Full-Stack Application</option>
                      <option value="saas">SaaS Platform</option>
                      <option value="e-commerce">E-Commerce</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Preferred Tech Stack
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Next.js, Python"
                      value={techStack}
                      onChange={(e) => setTechStack(e.target.value)}
                      disabled={isGenerating}
                      className="w-full rounded-md border border-black/15 bg-background shadow-sm px-3 py-2 text-sm dark:border-border/50 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Experience Level
                    </label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      disabled={isGenerating}
                      className="w-full rounded-md border border-black/15 bg-background shadow-sm px-3 py-2 text-sm dark:border-border/50 focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Any</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Action row: optional-details toggle + generate, centered */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Optional fields toggle */}
                <button
                  type="button"
                  onClick={() => setShowOptions(!showOptions)}
                  aria-expanded={showOptions}
                  aria-controls="optional-fields"
                  className="group flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors cursor-pointer hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-md -ml-1 px-1 py-0.5"
                >
                  <Plus
                    className={`w-4 h-4 transition-transform duration-200 group-hover:text-primary ${
                      showOptions ? "rotate-45" : ""
                    }`}
                  />
                  {showOptions ? "Hide optional details" : "Add optional details"}
                </button>

                <Button
                  onClick={handleSubmit}
                  disabled={!idea.trim() || isGenerating}
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Architecture...
                    </>
                  ) : (
                    <>
                      Generate Architecture
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Example ideas (below hero) */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Or try one of these examples:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXAMPLE_IDEAS.map((example) => (
                <button
                  key={example.title}
                  onClick={() => handleExampleClick(example.idea)}
                  disabled={isGenerating}
                  className="text-left p-3 rounded-lg border border-black/10 bg-card/30 shadow-sm hover:bg-card/60 hover:border-primary/30 dark:border-border/50 transition-all text-sm group"
                >
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {example.title}
                  </span>
                  <span className="block text-muted-foreground text-xs mt-1 line-clamp-2">
                    {example.idea}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-start gap-8 sm:gap-12">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Image
                  src={logoSrc}
                  alt="ArchAI logo"
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                />
                <span className="font-semibold text-lg text-foreground">ArchAI</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                ArchAI: Built for developers who dream in architecture. Turn ideas
                into complete technical blueprints.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm">
              <div className="space-y-2">
                <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Legal
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Resources
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://github.com/Praptea-code/devblueprint-nextjs-typescript-ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>© 2026 ArchAI</p>
            <p>All data is stored locally in your browser.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
