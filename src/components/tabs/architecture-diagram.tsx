"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network } from "lucide-react";
import type { ArchitectureResponse } from "@/types";

interface ArchitectureDiagramProps {
  data: ArchitectureResponse;
}

const COMPONENT_COLORS: Record<string, string> = {
  Frontend: "#6366f1",
  "API Gateway": "#f59e0b",
  "Backend Service": "#10b981",
  Database: "#ef4444",
  "External Service": "#8b5cf6",
  default: "#6b7280",
};

function getNodeColor(type: string): string {
  for (const [key, color] of Object.entries(COMPONENT_COLORS)) {
    if (type.toLowerCase().includes(key.toLowerCase())) {
      return color;
    }
  }
  return COMPONENT_COLORS.default;
}

export function ArchitectureDiagram({ data }: ArchitectureDiagramProps) {
  const { nodes, edges } = useMemo(() => {
    const components = data.systemArchitecture.components;
    const connections = data.systemArchitecture.connections;

    const nodeMap = new Map<string, number>();
    const cols = Math.ceil(Math.sqrt(components.length));

    const flowNodes: Node[] = components.map((comp, i) => {
      nodeMap.set(comp.name, i);
      const row = Math.floor(i / cols);
      const col = i % cols;
      return {
        id: comp.name,
        position: { x: col * 280, y: row * 150 },
        data: {
          label: (
            <div className="text-center p-1">
              <div className="text-xs font-semibold">{comp.name}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{comp.type}</div>
            </div>
          ),
        },
        style: {
          background: `${getNodeColor(comp.type)}20`,
          border: `1px solid ${getNodeColor(comp.type)}60`,
          borderRadius: "8px",
          padding: "8px 16px",
          width: 200,
        },
      };
    });

    const flowEdges: Edge[] = connections.map((conn, i) => ({
      id: `e-${i}`,
      source: conn.from,
      target: conn.to,
      label: conn.label,
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 1.5 },
      labelStyle: { fill: "#a1a1aa", fontSize: 10 },
      labelBgStyle: { fill: "#18181b", fillOpacity: 0.9 },
      labelBgPadding: [4, 4] as [number, number],
    }));

    return { nodes: flowNodes, edges: flowEdges };
  }, [data]);

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Network className="w-4 h-4 text-primary" />
            System Architecture
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {data.systemArchitecture.description}
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] rounded-lg border border-border/50 bg-background/50 overflow-hidden">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              attributionPosition="bottom-left"
              defaultEdgeOptions={{
                type: "smoothstep",
              }}
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#27272a" gap={20} size={1} />
              <Controls className="!bg-card !border-border/50" />
              <MiniMap
                nodeColor={(n) => {
                  const comp = data.systemArchitecture.components.find(
                    (c) => c.name === n.id
                  );
                  return comp ? getNodeColor(comp.type) : "#6b7280";
                }}
                maskColor="rgba(0,0,0,0.7)"
                className="!bg-card !border-border/50"
              />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>

      {/* Frontend & Backend Architecture */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm">Frontend Architecture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground text-xs">Description:</span>
              <p className="mt-1">{data.frontendArchitecture.description}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Structure:</span>
              <p className="mt-1">{data.frontendArchitecture.structure}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">State Management:</span>
              <p className="mt-1">{data.frontendArchitecture.stateManagement}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Routing:</span>
              <p className="mt-1">{data.frontendArchitecture.routing}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm">Backend Architecture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground text-xs">Description:</span>
              <p className="mt-1">{data.backendArchitecture.description}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Pattern:</span>
              <p className="mt-1">{data.backendArchitecture.pattern}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Structure:</span>
              <p className="mt-1">{data.backendArchitecture.structure}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Flow */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-sm">Data Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.dataFlow.map((step) => (
              <div key={step.step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                  {step.step}
                </div>
                <p className="text-sm text-muted-foreground pt-0.5">{step.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deployment */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-sm">Deployment Architecture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Provider: </span>
            {data.deploymentArchitecture.provider}
          </p>
          <p>{data.deploymentArchitecture.description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.deploymentArchitecture.services.map((svc) => (
              <span
                key={svc}
                className="px-2 py-1 rounded bg-primary/10 text-primary text-xs"
              >
                {svc}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
