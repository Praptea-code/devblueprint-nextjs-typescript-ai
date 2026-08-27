"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Copy,
  Layers,
  Check,
} from "lucide-react";
import type { ArchitectureResponse } from "@/types";
import { OverviewTab } from "@/components/tabs/overview-tab";
import { ArchitectureDiagram } from "@/components/tabs/architecture-diagram";
import { DatabaseTab } from "@/components/tabs/database-tab";
import { ApiExplorer } from "@/components/tabs/api-explorer";
import { FolderStructureTab } from "@/components/tabs/folder-structure-tab";
import { RoadmapTab } from "@/components/tabs/roadmap-tab";
import { SecurityTab } from "@/components/tabs/security-tab";

function useStoredArchitecture() {
  const router = useRouter();
  const [architecture, setArchitecture] = useState<ArchitectureResponse | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("archai-architecture");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ArchitectureResponse;
        // Use a microtask to avoid cascading renders
        queueMicrotask(() => setArchitecture(parsed));
      } catch {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  return architecture;
}

export default function ArchitecturePage() {
  const architecture = useStoredArchitecture();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    if (!architecture) return;
    await navigator.clipboard.writeText(JSON.stringify(architecture, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    if (!architecture) return;
    const blob = new Blob([JSON.stringify(architecture, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${architecture.overview.projectName.toLowerCase().replace(/\s+/g, "-")}-architecture.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    if (!architecture) return;
    const md = generateMarkdown(architecture);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${architecture.overview.projectName.toLowerCase().replace(/\s+/g, "-")}-architecture.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!architecture) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                <Layers className="w-3 h-3 text-primary" />
              </div>
              <span className="font-semibold text-sm">{architecture.overview.projectName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyAll}>
              {copied ? (
                <Check className="h-3.5 w-3.5 mr-1.5" />
              ) : (
                <Copy className="h-3.5 w-3.5 mr-1.5" />
              )}
              {copied ? "Copied" : "Copy All"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportMarkdown}>
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Markdown
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportJSON}>
              <Download className="h-3.5 w-3.5 mr-1.5" />
              JSON
            </Button>
          </div>
        </div>
      </header>

      {/* Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="folder">Folder Structure</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab data={architecture} />
          </TabsContent>
          <TabsContent value="architecture">
            <ArchitectureDiagram data={architecture} />
          </TabsContent>
          <TabsContent value="database">
            <DatabaseTab data={architecture} />
          </TabsContent>
          <TabsContent value="api">
            <ApiExplorer data={architecture} />
          </TabsContent>
          <TabsContent value="folder">
            <FolderStructureTab data={architecture} />
          </TabsContent>
          <TabsContent value="roadmap">
            <RoadmapTab data={architecture} />
          </TabsContent>
          <TabsContent value="security">
            <SecurityTab data={architecture} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function generateMarkdown(data: ArchitectureResponse): string {
  const lines: string[] = [];
  lines.push(`# ${data.overview.projectName}`);
  lines.push("");
  lines.push(`## Overview`);
  lines.push(data.overview.description);
  lines.push("");
  lines.push(`### Problem Statement`);
  lines.push(data.overview.problemStatement);
  lines.push("");
  lines.push(`### Target Users`);
  data.overview.targetUsers.forEach((u) => lines.push(`- ${u}`));
  lines.push("");

  lines.push(`## Features`);
  data.features.forEach((f) => {
    lines.push(`### ${f.name} (${f.priority})`);
    lines.push(f.description);
    lines.push("");
  });

  lines.push(`## Tech Stack`);
  data.techStack.forEach((t) => {
    lines.push(`- **${t.category}**: ${t.technology} — ${t.reason}`);
  });
  lines.push("");

  lines.push(`## API Endpoints`);
  data.apiEndpoints.forEach((ep) => {
    lines.push(`### ${ep.method} ${ep.path}`);
    lines.push(ep.description);
    lines.push("");
  });

  lines.push(`## Database`);
  lines.push(`Type: ${data.database.type}`);
  data.database.tables.forEach((t) => {
    lines.push(`### ${t.name}`);
    lines.push(t.description);
    t.columns.forEach((c) => {
      lines.push(`- \`${c.name}\` ${c.type}${c.isPrimaryKey ? " (PK)" : ""}${c.isForeignKey ? ` (FK → ${c.references})` : ""}`);
    });
    lines.push("");
  });

  lines.push(`## Roadmap`);
  data.roadmap.forEach((r) => {
    lines.push(`### Phase ${r.phase}: ${r.name} (${r.estimatedDuration})`);
    r.tasks.forEach((t) => lines.push(`- [ ] ${t}`));
    lines.push("");
  });

  lines.push(`## Security Considerations`);
  data.securityConsiderations.forEach((s) => lines.push(`- ${s}`));
  lines.push("");

  lines.push(`## Scalability Considerations`);
  data.scalabilityConsiderations.forEach((s) => lines.push(`- ${s}`));
  lines.push("");

  lines.push(`## Future Improvements`);
  data.futureImprovements.forEach((f) => lines.push(`- ${f}`));

  return lines.join("\n");
}
