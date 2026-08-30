"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code2, Shield, ShieldOff } from "lucide-react";
import type { ArchitectureResponse } from "@/types";

interface ApiExplorerProps {
  data: ArchitectureResponse;
}

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  POST: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PUT: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
  PATCH: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export function ApiExplorer({ data }: ApiExplorerProps) {
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" />
            API Endpoints
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {data.apiEndpoints.length} endpoints generated
          </p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-2">
              {data.apiEndpoints.map((ep) => {
                const key = `${ep.method}-${ep.path}`;
                const isExpanded = expandedEndpoint === key;

                return (
                  <div
                    key={key}
                    className="rounded-lg border border-border/50 bg-background/50 overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedEndpoint(isExpanded ? null : key)
                      }
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
                    >
                      <Badge
                        variant="outline"
                        className={`font-mono text-xs shrink-0 ${METHOD_COLORS[ep.method]}`}
                      >
                        {ep.method}
                      </Badge>
                      <span className="font-mono text-sm">{ep.path}</span>
                      <span className="text-muted-foreground text-xs ml-auto hidden sm:block">
                        {ep.description}
                      </span>
                      {ep.requiresAuth ? (
                        <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      ) : (
                        <ShieldOff className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-3 border-t border-border/30">
                        <p className="text-sm text-muted-foreground pt-3">
                          {ep.description}
                        </p>

                        <div className="flex items-center gap-2">
                          {ep.requiresAuth ? (
                            <Badge variant="secondary" className="text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              Auth Required
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              <ShieldOff className="w-3 h-3 mr-1" />
                              No Auth
                            </Badge>
                          )}
                        </div>

                        {ep.authorizationNotes && (
                          <div>
                            <h5 className="text-xs font-medium text-muted-foreground mb-1">
                              Authorization Notes
                            </h5>
                            <p className="text-sm border border-border/30 rounded bg-amber-500/5 text-foreground p-3">
                              {ep.authorizationNotes}
                            </p>
                          </div>
                        )}

                        {ep.requestBody && (
                          <div>
                            <h5 className="text-xs font-medium text-muted-foreground mb-1">
                              Request Body
                            </h5>
                            <pre className="p-3 rounded bg-background/80 border border-border/30 text-xs font-mono overflow-x-auto">
                              {ep.requestBody}
                            </pre>
                          </div>
                        )}

                        <div>
                          <h5 className="text-xs font-medium text-muted-foreground mb-1">
                            Response Example
                          </h5>
                          <pre className="p-3 rounded bg-background/80 border border-border/30 text-xs font-mono overflow-x-auto">
                            {ep.responseExample}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
