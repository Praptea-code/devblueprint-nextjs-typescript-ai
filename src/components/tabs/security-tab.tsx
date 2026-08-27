"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Scale, Lock } from "lucide-react";
import type { ArchitectureResponse } from "@/types";

interface SecurityTabProps {
  data: ArchitectureResponse;
}

export function SecurityTab({ data }: SecurityTabProps) {
  return (
    <div className="space-y-6">
      {/* Authentication */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            Authentication & Authorization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Approach</h4>
            <p className="text-sm text-muted-foreground">
              {data.authentication.approach}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Mechanisms</h4>
            <div className="flex flex-wrap gap-2">
              {data.authentication.mechanisms.map((mech) => (
                <Badge key={mech} variant="secondary">
                  {mech}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Session Management</h4>
            <p className="text-sm text-muted-foreground">
              {data.authentication.sessionManagement}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Security Considerations */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Security Considerations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.securityConsiderations.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30"
              >
                <Badge variant="outline" className="shrink-0 text-[10px]">
                  {String(i + 1).padStart(2, "0")}
                </Badge>
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scalability */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            Scalability Considerations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.scalabilityConsiderations.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30"
              >
                <Badge variant="outline" className="shrink-0 text-[10px]">
                  {String(i + 1).padStart(2, "0")}
                </Badge>
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
