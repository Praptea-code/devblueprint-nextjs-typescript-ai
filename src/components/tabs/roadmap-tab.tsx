"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, Clock, CheckCircle2 } from "lucide-react";
import type { ArchitectureResponse } from "@/types";

interface RoadmapTabProps {
  data: ArchitectureResponse;
}

const PHASE_COLORS = [
  "bg-blue-500/20 text-blue-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-amber-500/20 text-amber-400",
  "bg-purple-500/20 text-purple-400",
  "bg-pink-500/20 text-pink-400",
  "bg-cyan-500/20 text-cyan-400",
  "bg-red-500/20 text-red-400",
];

export function RoadmapTab({ data }: RoadmapTabProps) {
  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Map className="w-4 h-4 text-primary" />
            Development Roadmap
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {data.roadmap.length} phases &middot;{" "}
            {data.roadmap.reduce((acc, r) => acc + r.tasks.length, 0)} total tasks
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border/50" />

            <div className="space-y-6">
              {data.roadmap.map((phase) => (
                <div key={phase.phase} className="relative flex gap-4">
                  {/* Phase indicator */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                      PHASE_COLORS[(phase.phase - 1) % PHASE_COLORS.length]
                    } border border-border/50`}
                  >
                    {phase.phase}
                  </div>

                  {/* Phase content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-sm font-semibold">{phase.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {phase.estimatedDuration}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 ml-1">
                      {phase.tasks.map((task, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-muted-foreground/50 shrink-0" />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Future Improvements */}
      {data.futureImprovements.length > 0 && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm">Future Improvements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {data.futureImprovements.map((improvement, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-2 rounded bg-background/50 border border-border/30 text-sm text-muted-foreground"
                >
                  <span className="text-primary font-mono text-xs mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {improvement}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
