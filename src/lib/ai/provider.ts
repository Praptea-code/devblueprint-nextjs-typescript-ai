import { architectureSchema, type ArchitectureResponse } from "../validation/architecture";

export interface GenerateOptions {
  idea: string;
  projectType?: string;
  techStack?: string;
  experienceLevel?: string;
}

export interface AIProvider {
  generateArchitecture(options: GenerateOptions): Promise<ArchitectureResponse>;
}

const SYSTEM_PROMPT = `You are an expert software architect. Given a project idea, generate a complete technical architecture blueprint.

You MUST respond with valid JSON that matches this exact structure:
{
  "overview": {
    "projectName": "string",
    "description": "string",
    "problemStatement": "string",
    "targetUsers": ["string"]
  },
  "features": [
    {
      "name": "string",
      "description": "string",
      "priority": "high" | "medium" | "low"
    }
  ],
  "userRoles": [
    {
      "role": "string",
      "description": "string",
      "permissions": ["string"]
    }
  ],
  "techStack": [
    {
      "category": "string (e.g., Frontend, Backend, Database, etc.)",
      "technology": "string",
      "reason": "string"
    }
  ],
  "systemArchitecture": {
    "description": "string",
    "components": [
      {
        "name": "string",
        "type": "string (e.g., Frontend, API Gateway, Backend Service, Database, External Service)",
        "description": "string"
      }
    ],
    "connections": [
      {
        "from": "string (component name)",
        "to": "string (component name)",
        "label": "string (e.g., HTTP, WebSocket, SQL Query)"
      }
    ]
  },
  "frontendArchitecture": {
    "description": "string",
    "structure": "string",
    "stateManagement": "string",
    "routing": "string"
  },
  "backendArchitecture": {
    "description": "string",
    "pattern": "string (e.g., MVC, Microservices, Serverless)",
    "structure": "string"
  },
  "database": {
    "type": "string (e.g., PostgreSQL, MongoDB)",
    "description": "string",
    "tables": [
      {
        "name": "string",
        "description": "string",
        "columns": [
          {
            "name": "string",
            "type": "string (e.g., UUID, VARCHAR(255), TEXT, INTEGER, BOOLEAN, TIMESTAMP)",
            "isPrimaryKey": true,
            "isForeignKey": false,
            "references": "table_name.column_name (if foreign key)",
            "nullable": false
          }
        ]
      }
    ],
    "relationships": [
      {
        "from": "string (table name)",
        "to": "string (table name)",
        "type": "one-to-one" | "one-to-many" | "many-to-many",
        "description": "string"
      }
    ]
  },
  "apiEndpoints": [
    {
      "method": "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
      "path": "string (e.g., /api/users)",
      "description": "string",
      "requiresAuth": true,
      "requestBody": "string describing the request body (for POST/PUT/PATCH)",
      "responseExample": "string showing example JSON response"
    }
  ],
  "authentication": {
    "approach": "string",
    "mechanisms": ["string"],
    "sessionManagement": "string"
  },
  "externalServices": [
    {
      "name": "string",
      "purpose": "string",
      "integration": "string"
    }
  ],
  "folderStructure": "string (multi-line folder tree)",
  "dataFlow": [
    {
      "step": 1,
      "description": "string"
    }
  ],
  "securityConsiderations": ["string"],
  "scalabilityConsiderations": ["string"],
  "deploymentArchitecture": {
    "provider": "string",
    "services": ["string"],
    "description": "string"
  },
  "roadmap": [
    {
      "phase": 1,
      "name": "string",
      "tasks": ["string"],
      "estimatedDuration": "string (e.g., 1-2 weeks)"
    }
  ],
  "futureImprovements": ["string"]
}

Be thorough and specific. Generate realistic database schemas with proper types, relationships, and constraints. Include 8-15 API endpoints. Include 4-6 roadmap phases. The folder structure should be production-ready and match the recommended tech stack.

IMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no explanation.`;

function buildUserPrompt(options: GenerateOptions): string {
  let prompt = `Project Idea: ${options.idea}`;
  if (options.projectType) {
    prompt += `\nProject Type: ${options.projectType}`;
  }
  if (options.techStack) {
    prompt += `\nPreferred Tech Stack: ${options.techStack}`;
  }
  if (options.experienceLevel) {
    prompt += `\nDeveloper Experience Level: ${options.experienceLevel}`;
  }
  return prompt;
}

function parseAndValidateResponse(raw: string): ArchitectureResponse {
  // Strip markdown code fences if present
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  const parsed = JSON.parse(cleaned);
  const result = architectureSchema.safeParse(parsed);

  if (!result.success) {
    console.error("Validation errors:", result.error.flatten());
    throw new Error(
      `Invalid architecture response: ${result.error.issues.map((i) => i.message).join(", ")}`
    );
  }

  return result.data;
}

export function createOpenAIProvider(): AIProvider {
  return {
    async generateArchitecture(options: GenerateOptions): Promise<ArchitectureResponse> {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

      const model = process.env.AI_MODEL || "gpt-4o";

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildUserPrompt(options) },
          ],
          temperature: 0.7,
          max_tokens: 8000,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${error}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("No content in OpenAI response");
      }

      return parseAndValidateResponse(content);
    },
  };
}

export function createAnthropicProvider(): AIProvider {
  return {
    async generateArchitecture(options: GenerateOptions): Promise<ArchitectureResponse> {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

      const model = process.env.AI_MODEL || "claude-sonnet-4-20250514";

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 8000,
          system: SYSTEM_PROMPT,
          messages: [
            { role: "user", content: buildUserPrompt(options) },
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Anthropic API error: ${error}`);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text;

      if (!content) {
        throw new Error("No content in Anthropic response");
      }

      return parseAndValidateResponse(content);
    },
  };
}

export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER || "openai";

  switch (provider) {
    case "anthropic":
      return createAnthropicProvider();
    case "openai":
    default:
      return createOpenAIProvider();
  }
}
