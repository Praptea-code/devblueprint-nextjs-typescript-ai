# ArchAI

**Turn your idea into a build-ready architecture.**

ArchAI is an AI-powered tool that transforms natural language project ideas into complete technical blueprints, including architecture diagrams, database schemas, API designs, folder structures, and development roadmaps.

## Features

- **Project Idea Input**: Describe your idea in plain English with optional preferences
- **AI Architecture Generation**: Get a complete technical blueprint powered by LLM
- **Architecture Diagram**: Interactive system architecture visualization with React Flow
- **Database Schema**: Visual ER diagrams and SQL schema output
- **API Explorer**: Browse all generated endpoints with request/response details
- **Folder Structure**: Production-ready project structure with copy support
- **Development Roadmap**: Phased plan with actionable tasks and time estimates
- **Security & Scalability**: Authentication approach and security considerations
- **Export**: Download as Markdown or JSON, or copy everything to clipboard
- **History**: Recent architectures saved in local storage

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Diagrams | React Flow (@xyflow/react) |
| Validation | Zod |
| Icons | Lucide React |
| AI Provider | OpenAI / Anthropic (swappable) |

## Project Structure

```
archai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate/route.ts     # AI generation endpoint
│   │   ├── architecture/page.tsx     # Architecture workspace
│   │   └── page.tsx                  # Landing page
│   ├── components/
│   │   ├── tabs/                     # Workspace tab components
│   │   │   ├── overview-tab.tsx
│   │   │   ├── architecture-diagram.tsx
│   │   │   ├── database-tab.tsx
│   │   │   ├── api-explorer.tsx
│   │   │   ├── folder-structure-tab.tsx
│   │   │   ├── roadmap-tab.tsx
│   │   │   └── security-tab.tsx
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── landing-page.tsx
│   │   └── architecture-skeleton.tsx
│   ├── lib/
│   │   ├── ai/
│   │   │   └── provider.ts           # AI provider abstraction
│   │   ├── validation/
│   │   │   └── architecture.ts       # Zod schema
│   │   └── utils/
│   │       ├── utils.ts
│   │       └── history.ts            # Local storage history
│   └── types/
│       └── index.ts                  # TypeScript types
├── .env.example
├── package.json
└── tsconfig.json
```

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Description | Required |
|----------|-------------|----------|
| `AI_PROVIDER` | `"openai"`, `"anthropic"`, or `"groq"` | Yes |
| `OPENAI_API_KEY` | OpenAI API key | If using OpenAI |
| `ANTHROPIC_API_KEY` | Anthropic API key | If using Anthropic |
| `GROQ_API_KEY` | Groq API key | If using Groq |
| `AI_MODEL` | Model name (defaults to provider's best) | No |

## Local Setup

```bash
# Clone the repository
git clone https://github.com/Praptea-code/devblueprint-nextjs-typescript-ai.git
cd devblueprint-nextjs-typescript-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How AI Generation Works

1. User enters a project idea with optional preferences
2. The frontend sends a POST request to `/api/generate`
3. The server-side route calls the configured AI provider (OpenAI or Anthropic)
4. The AI generates a structured JSON response matching the architecture schema
5. The response is validated against a strict Zod schema
6. If invalid, the error is handled gracefully; if valid, it's displayed in the workspace
7. The architecture is saved to local storage for history

API keys are **never** exposed to the browser; all AI calls happen server-side.

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Future Improvements

- Database persistence for architecture history
- User authentication and saved projects
- PDF export
- Collaborative architecture editing
- More AI providers (Google Gemini, etc.)
- Architecture comparison view
- Share architecture via URL
- Custom template support

## License

MIT
