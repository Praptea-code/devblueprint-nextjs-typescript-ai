import { z } from "zod";

const featureSchema = z.object({
  name: z.string(),
  description: z.string(),
  priority: z.enum(["high", "medium", "low"]),
});

const userRoleSchema = z.object({
  role: z.string(),
  description: z.string(),
  permissions: z.array(z.string()),
});

const techStackItemSchema = z.object({
  category: z.string(),
  technology: z.string(),
  reason: z.string(),
});

const architectureComponentSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string(),
});

const connectionSchema = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string(),
});

const systemArchitectureSchema = z.object({
  description: z.string(),
  components: z.array(architectureComponentSchema),
  connections: z.array(connectionSchema),
});

const frontendArchitectureSchema = z.object({
  description: z.string(),
  structure: z.string(),
  stateManagement: z.string(),
  routing: z.string(),
});

const backendArchitectureSchema = z.object({
  description: z.string(),
  pattern: z.string(),
  structure: z.string(),
});

const columnSchema = z.object({
  name: z.string(),
  type: z.string(),
  isPrimaryKey: z.boolean().optional(),
  isForeignKey: z.boolean().optional(),
  references: z.string().optional(),
  nullable: z.boolean().optional(),
});

const tableSchema = z.object({
  name: z.string(),
  description: z.string(),
  columns: z.array(columnSchema),
});

const relationshipSchema = z.object({
  from: z.string(),
  to: z.string(),
  type: z.enum(["one-to-one", "one-to-many", "many-to-many"]),
  description: z.string(),
});

const databaseSchema = z.object({
  type: z.string(),
  description: z.string(),
  tables: z.array(tableSchema),
  relationships: z.array(relationshipSchema),
});

const apiEndpointSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  path: z.string(),
  description: z.string(),
  requiresAuth: z.boolean(),
  requestBody: z.string().optional(),
  responseExample: z.string(),
});

const authenticationSchema = z.object({
  approach: z.string(),
  mechanisms: z.array(z.string()),
  sessionManagement: z.string(),
});

const externalServiceSchema = z.object({
  name: z.string(),
  purpose: z.string(),
  integration: z.string(),
});

const dataFlowStepSchema = z.object({
  step: z.number(),
  description: z.string(),
});

const deploymentArchitectureSchema = z.object({
  provider: z.string(),
  services: z.array(z.string()),
  description: z.string(),
});

const roadmapPhaseSchema = z.object({
  phase: z.number(),
  name: z.string(),
  tasks: z.array(z.string()),
  estimatedDuration: z.string(),
});

export const architectureSchema = z.object({
  overview: z.object({
    projectName: z.string(),
    description: z.string(),
    problemStatement: z.string(),
    targetUsers: z.array(z.string()),
  }),
  features: z.array(featureSchema),
  userRoles: z.array(userRoleSchema),
  techStack: z.array(techStackItemSchema),
  systemArchitecture: systemArchitectureSchema,
  frontendArchitecture: frontendArchitectureSchema,
  backendArchitecture: backendArchitectureSchema,
  database: databaseSchema,
  apiEndpoints: z.array(apiEndpointSchema),
  authentication: authenticationSchema,
  externalServices: z.array(externalServiceSchema),
  folderStructure: z.string(),
  dataFlow: z.array(dataFlowStepSchema),
  securityConsiderations: z.array(z.string()),
  scalabilityConsiderations: z.array(z.string()),
  deploymentArchitecture: deploymentArchitectureSchema,
  roadmap: z.array(roadmapPhaseSchema),
  futureImprovements: z.array(z.string()),
});

export type ArchitectureResponse = z.infer<typeof architectureSchema>;
