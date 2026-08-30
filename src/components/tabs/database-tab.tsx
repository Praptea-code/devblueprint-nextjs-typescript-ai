"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Key, Link } from "lucide-react";
import type { ArchitectureResponse } from "@/types";

interface DatabaseTabProps {
  data: ArchitectureResponse;
}

const NOSQL_KEYWORDS = [
  "mongodb",
  "mongo",
  "mongoose",
  "firebase",
  "firestore",
  "dynamodb",
  "cassandra",
  "couchdb",
  "couchbase",
  "redis",
  "neo4j",
  "elasticsearch",
  "elastic",
  "cosmos",
  "documentdb",
  "rethinkdb",
  "arangodb",
];

function isNoSQLDatabase(type: string): boolean {
  const normalized = type.toLowerCase();
  return NOSQL_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

export function DatabaseTab({ data }: DatabaseTabProps) {
  const [view, setView] = useState("visual");
  const isNoSQL = isNoSQLDatabase(data.database.type);

  const visualSchema = (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.database.tables.map((table) => (
          <div
            key={table.name}
            className="rounded-lg border border-border/50 bg-background/50 overflow-hidden"
          >
            <div className="px-4 py-2 bg-primary/10 border-b border-border/30">
              <h4 className="text-sm font-semibold">{table.name}</h4>
              <p className="text-xs text-muted-foreground">{table.description}</p>
            </div>
            <div className="divide-y divide-border/30">
              {table.columns.map((col) => (
                <div
                  key={col.name}
                  className="flex items-center justify-between px-4 py-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    {col.isPrimaryKey && (
                      <Key className="w-3 h-3 text-yellow-500" />
                    )}
                    {col.isForeignKey && (
                      <Link className="w-3 h-3 text-blue-500" />
                    )}
                    <span className="font-mono font-medium">{col.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-mono text-[11px]">
                      {col.type}
                    </span>
                    {col.isPrimaryKey && (
                      <Badge variant="outline" className="text-[9px] px-1 py-0">
                        PK
                      </Badge>
                    )}
                    {col.isForeignKey && (
                      <Badge variant="outline" className="text-[9px] px-1 py-0">
                        FK
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {data.database.relationships.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Relationships</h4>
          <div className="grid gap-2 md:grid-cols-2">
            {data.database.relationships.map((rel, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30 text-sm"
              >
                <Badge variant="secondary" className="shrink-0">
                  {rel.type}
                </Badge>
                <span className="font-mono text-xs">
                  {rel.from} → {rel.to}
                </span>
                <span className="text-muted-foreground text-xs ml-auto">
                  {rel.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              Database Schema
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{data.database.type}</Badge>
              <Tabs value={view} onValueChange={setView}>
                <TabsList className="h-8">
                  <TabsTrigger value="visual" className="text-xs px-3">
                    Visual
                  </TabsTrigger>
                  <TabsTrigger value="sql" className="text-xs px-3">
                    SQL
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{data.database.description}</p>
        </CardHeader>
        <CardContent>
          {view === "visual" && visualSchema}
          {view === "sql" &&
            (isNoSQL ? (
              <div className="space-y-4">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm">
                  <span className="text-amber-600 dark:text-amber-400">
                    SQL syntax isn&apos;t applicable for {data.database.type} —
                    showing visual schema instead.
                  </span>
                </div>
                {visualSchema}
              </div>
            ) : (
              <pre className="p-4 rounded-lg bg-background/80 border border-border/50 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                {generateSQL(data)}
              </pre>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}

function generateSQL(data: ArchitectureResponse): string {
  const lines: string[] = [];

  data.database.tables.forEach((table) => {
    lines.push(`CREATE TABLE ${table.name} (`);
    const colDefs = table.columns.map((col) => {
      let def = `  ${col.name} ${col.type}`;
      if (col.isPrimaryKey) def += " PRIMARY KEY";
      if (!col.nullable && !col.isPrimaryKey) def += " NOT NULL";
      if (col.isForeignKey && col.references) {
        def += ` REFERENCES ${col.references}`;
      }
      return def;
    });

    const pks = table.columns.filter((c) => c.isPrimaryKey);
    if (pks.length > 1) {
      colDefs.push(`  PRIMARY KEY (${pks.map((p) => p.name).join(", ")})`);
    }

    lines.push(colDefs.join(",\n"));
    lines.push(");\n");
  });

  return lines.join("\n");
}
