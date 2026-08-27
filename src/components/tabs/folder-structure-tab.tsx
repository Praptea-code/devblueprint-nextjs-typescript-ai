"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderTree, Copy, Check } from "lucide-react";
import type { ArchitectureResponse } from "@/types";

interface FolderStructureTabProps {
  data: ArchitectureResponse;
}

export function FolderStructureTab({ data }: FolderStructureTabProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(data.folderStructure);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-primary" />
              Project Folder Structure
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <Check className="h-3.5 w-3.5 mr-1.5" />
              ) : (
                <Copy className="h-3.5 w-3.5 mr-1.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="p-4 rounded-lg bg-background/80 border border-border/50 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {data.folderStructure}
          </pre>
        </CardContent>
      </Card>

      {/* External Services */}
      {data.externalServices.length > 0 && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm">External Services & APIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {data.externalServices.map((svc) => (
                <div
                  key={svc.name}
                  className="p-3 rounded-lg bg-background/50 border border-border/30 space-y-1"
                >
                  <h4 className="text-sm font-medium">{svc.name}</h4>
                  <p className="text-xs text-muted-foreground">{svc.purpose}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Integration:</span> {svc.integration}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
