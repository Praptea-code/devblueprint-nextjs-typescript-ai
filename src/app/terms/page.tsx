import Link from "next/link";
import { Layers } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
              <Layers className="w-3 h-3 text-primary" />
            </div>
            <span className="font-semibold text-sm text-foreground">ArchAI</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated: 2026</p>
        <div className="prose prose-neutral dark:prose-invert max-w-none text-sm space-y-4 text-muted-foreground">
          <p>
            This is a placeholder Terms of Service for ArchAI, a local single-user
            tool with no account system.
          </p>
          <p>
            ArchAI may send the project ideas and options you submit to an
            external AI provider to generate architecture blueprints. The
            resulting blueprint is stored only in your browser&apos;s localStorage.
          </p>
          <p>
            The generated content is provided &quot;as is&quot; for informational
            purposes and is not professional advice. ArchAI does not accept
            liability for decisions made based on generated output.
          </p>
        </div>
      </main>
    </div>
  );
}
