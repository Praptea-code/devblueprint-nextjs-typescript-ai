"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Sparkles,
  Code2,
  Database,
  Layers,
  Loader2,
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
  {
    title: "Food Delivery App",
    idea: "Build a food delivery application with real-time order tracking, restaurant management, payment processing, driver assignment, and customer reviews.",
  },
  {
    title: "Project Management Tool",
    idea: "Design a project management tool like Jira with kanban boards, sprint planning, time tracking, team collaboration, and reporting dashboards.",
  },
];

interface LandingPageProps {
  onGenerate: (idea: string, options?: { projectType?: string; techStack?: string; experienceLevel?: string }) => void;
  isGenerating: boolean;
}

export function LandingPage({ onGenerate, isGenerating }: LandingPageProps) {
  const [idea, setIdea] = useState("");
  const [projectType, setProjectType] = useState("");
  const [techStack, setTechStack] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [showOptions, setShowOptions] = useState(false);

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
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Layers className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-lg">ArchAI</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="hidden sm:flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              AI-Powered
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Full Architecture
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl w-full space-y-8">
          {/* Title */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Architecture Generation
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
          </div>

          {/* Input Card */}
          <Card className="border-border/50 bg-card/50">
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
                  className="min-h-[120px] resize-none bg-background border-border/50 text-base placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              {/* Optional fields toggle */}
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {showOptions ? "Hide options" : "Add optional details +"}
              </button>

              {/* Optional fields */}
              {showOptions && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Project Type
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      disabled={isGenerating}
                      className="w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
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
                      className="w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
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
                      className="w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Any</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={!idea.trim() || isGenerating}
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
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
            </CardContent>
          </Card>

          {/* Example Ideas */}
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
                  className="text-left p-3 rounded-lg border border-border/50 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all text-sm group"
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
      <footer className="border-t border-border/50 py-6 text-center text-sm text-muted-foreground">
        <p>ArchAI — Built for developers who dream in architecture</p>
      </footer>
    </div>
  );
}
