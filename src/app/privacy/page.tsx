import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteNav>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to home
        </Link>
        <ThemeToggle />
      </SiteNav>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
            <p className="mt-2 text-sm text-muted-foreground">Last updated: August 30, 2026</p>
          </div>

          <p className="text-sm text-foreground leading-relaxed">
            ArchAI is a tool for generating technical architecture blueprints from
            project ideas. This policy explains what data ArchAI handles and how.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">No Accounts, No Server-Side Storage</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ArchAI does not require sign-up or login. There are no user accounts,
              and we do not operate a database that stores your project ideas,
              generated blueprints, or personal information on our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">What Data Is Processed</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When you describe a project idea and click &quot;Generate Architecture,&quot;
              that text (along with any optional details you provide, such as
              project type, tech stack preference, or experience level) is sent to a
              third-party AI provider (OpenAI, Anthropic, or Groq, depending on
              configuration) solely to generate your architecture blueprint. We do
              not retain a copy of this request on our servers after the response is
              returned to you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Local Storage</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your generated blueprints and generation history are stored only in
              your browser&apos;s local storage (localStorage). This data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>
                Never leaves your device except for the initial generation request
                described above.
              </li>
              <li>Is not accessible to us or any other user.</li>
              <li>
                Persists only on the device/browser you used, and will be lost if
                you clear your browser data.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Third-Party AI Providers</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Depending on configuration, your idea text is sent to one of: OpenAI,
              Anthropic, or Groq. Each of these providers has its own privacy policy
              and data handling practices governing data sent to their APIs. We
              encourage you to review their respective policies if you have concerns
              about how prompt data is used or retained by them.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Cookies and Tracking</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ArchAI does not use tracking cookies or third-party analytics or
              advertising scripts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Children&apos;s Privacy</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ArchAI is not directed at children under 13 and does not knowingly
              collect information from children.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Changes to This Policy</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We may update this policy as ArchAI evolves. Continued use of the app
              after changes constitutes acceptance of the revised policy.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
