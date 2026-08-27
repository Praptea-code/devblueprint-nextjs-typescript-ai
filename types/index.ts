export interface ProjectInput {
  idea: string;
  projectType?: string;
  techStack?: string;
  experienceLevel?: string;
}

export interface GeneratedArchitecture {
  overview: {
    projectName: string;
    description: string;
    problemStatement: string;
    targetUsers: string[];
  };
  features: {
    name: string;
    description: string;
    priority: "high" | "medium" | "low";
  }[];
  userRoles: {
    role: string;
    description: string;
    permissions: string[];
  }[];
  techStack: {
    category: string;
    technology: string;
    reason: string;
  }[];
  systemArchitecture: {
    description: string;
    components: {
      name: string;
      type: string;
      description: string;
    }[];
    connections: {
      from: string;
      to: string;
      label: string;
    }[];
  };
  frontendArchitecture: {
    description: string;
    structure: string;
    stateManagement: string;
    routing: string;
  };
  backendArchitecture: {
    description: string;
    pattern: string;
    structure: string;
  };
  database: {
    type: string;
    description: string;
    tables: {
      name: string;
      description: string;
      columns: {
        name: string;
        type: string;
        isPrimaryKey?: boolean;
        isForeignKey?: boolean;
        references?: string;
        nullable?: boolean;
      }[];
    }[];
    relationships: {
      from: string;
      to: string;
      type: "one-to-one" | "one-to-many" | "many-to-many";
      description: string;
    }[];
  };
  apiEndpoints: {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    path: string;
    description: string;
    requiresAuth: boolean;
    requestBody?: string;
    responseExample: string;
  }[];
  authentication: {
    approach: string;
    mechanisms: string[];
    sessionManagement: string;
  };
  externalServices: {
    name: string;
    purpose: string;
    integration: string;
  }[];
  folderStructure: string;
  dataFlow: {
    step: number;
    description: string;
  }[];
  securityConsiderations: string[];
  scalabilityConsiderations: string[];
  deploymentArchitecture: {
    provider: string;
    services: string[];
    description: string;
  };
  roadmap: {
    phase: number;
    name: string;
    tasks: string[];
    estimatedDuration: string;
  }[];
  futureImprovements: string[];
}
