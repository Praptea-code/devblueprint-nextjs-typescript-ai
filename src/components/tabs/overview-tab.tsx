"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, Target, Zap, Server } from "lucide-react";
import type { ArchitectureResponse } from "@/types";

interface OverviewTabProps {
  data: ArchitectureResponse;
}

export function OverviewTab({ data }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            {data.overview.description}
          </p>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-2">Problem Statement</h4>
            <p className="text-sm text-muted-foreground">{data.overview.problemStatement}</p>
          </div>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Target Users
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.overview.targetUsers.map((user) => (
                <Badge key={user} variant="secondary">
                  {user}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Key Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {data.features.map((feature) => (
              <div
                key={feature.name}
                className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30"
              >
                <Badge
                  variant={
                    feature.priority === "high"
                      ? "default"
                      : feature.priority === "medium"
                      ? "secondary"
                      : "outline"
                  }
                  className="mt-0.5 shrink-0"
                >
                  {feature.priority}
                </Badge>
                <div>
                  <h4 className="text-sm font-medium">{feature.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Roles */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            User Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.userRoles.map((role) => (
              <div
                key={role.role}
                className="p-4 rounded-lg bg-background/50 border border-border/30 space-y-2"
              >
                <h4 className="text-sm font-semibold">{role.role}</h4>
                <p className="text-xs text-muted-foreground">{role.description}</p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((perm) => (
                    <Badge key={perm} variant="outline" className="text-[10px]">
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Server className="w-4 h-4 text-primary" />
            Recommended Tech Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {data.techStack.map((tech) => (
              <div
                key={tech.technology}
                className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30"
              >
                <Badge variant="secondary" className="mt-0.5 shrink-0">
                  {tech.category}
                </Badge>
                <div>
                  <h4 className="text-sm font-medium">{tech.technology}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{tech.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
