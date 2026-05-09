import { PageShell } from "@/components/PageShell";
import { ArrowLeft, Bot, Presentation, Workflow } from "lucide-react";
import { Link } from "react-router-dom";

const MILESTONES: readonly {
  readonly step: number;
  readonly timeLabel: string;
  readonly title: string;
  readonly goal: string;
  readonly body: string;
  readonly icon: typeof Bot;
}[] = [
  {
    step: 1,
    timeLabel: "0–15 min",
    title: "Define the Persona",
    goal: 'Establish the "Who" and "What."',
    body:
      "Clearly define your agent's role, its specific objective, and the tools it needs (like web search or a calculator). By minute 15, you should have your environment set up and your base prompt or configuration initialized.",
    icon: Bot,
  },
  {
    step: 2,
    timeLabel: "15–45 min",
    title: "Architect the Flow",
    goal: "Connect the logic.",
    body:
      'This is the core building phase. Use your framework of choice to wire the agent’s reasoning paths. The milestone is hit when your agent can successfully take an input, process it through its logic "brain," and move toward a solution without manual intervention.',
    icon: Workflow,
  },
  {
    step: 3,
    timeLabel: "45–60 min",
    title: "The Live Demo",
    goal: 'Ship the "Vibe."',
    body:
      'The final sprint is for refining the output and catching edge cases. To complete the challenge, your agent must successfully execute a "live mission"—producing a final, structured result that proves it can handle the task it was built for.',
    icon: Presentation,
  },
];

export default function MilestonesPage(): JSX.Element {
  return (
    <PageShell mainClassName="relative z-10">
      <main className="mx-auto min-h-dvh max-w-2xl px-4 py-8 sm:px-6 sm:py-12 md:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          Back to Team Lookup
        </Link>

        <header className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Agent sprint
          </p>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-[var(--color-text)] sm:text-3xl">
            Vibe &amp; Build: The 60-Minute Agent Sprint
          </h1>
        </header>

        <section
          className="mt-6 rounded-bento border border-border/80 bg-[var(--gradient-hero)] p-5 shadow-sm sm:p-6"
          aria-labelledby="sprint-intro-heading"
        >
          <h2 id="sprint-intro-heading" className="sr-only">
            About this sprint
          </h2>
          <p className="text-base font-medium leading-relaxed text-[var(--color-text)]">
            One hour. No overthinking. Just pure flow. This challenge invites you
            to lean into &quot;vibe coding&quot;—using natural language and
            AI-assisted tools to manifest a functional AI agent from scratch.
            Whether you&apos;re a seasoned dev or a curious builder, it&apos;s
            time to see how fast you can turn a prompt into a product.
          </p>
        </section>

        <div
          className="my-8 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent"
          aria-hidden
        />

        <section aria-labelledby="milestones-heading">
          <h2
            id="milestones-heading"
            className="text-lg font-extrabold text-[var(--color-text)] sm:text-xl"
          >
            The three-step milestones
          </h2>
          <p className="mt-1 text-sm font-medium text-muted">
            Track your progress through the hour—each block builds on the last.
          </p>

          <ol className="mt-8 space-y-6">
            {MILESTONES.map((item, index) => {
              const Icon = item.icon;
              const isLast: boolean = index === MILESTONES.length - 1;
              return (
                <li key={item.step} className="relative flex gap-4 sm:gap-5">
                  <div className="flex flex-col items-center">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-sm"
                      aria-hidden
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    {!isLast ? (
                      <div
                        className="mt-2 w-px flex-1 min-h-[1.5rem] bg-border"
                        aria-hidden
                      />
                    ) : null}
                  </div>
                  <article className="min-w-0 flex-1 rounded-bento border border-border bg-card p-4 shadow-bento sm:p-5">
                    <div className="flex flex-wrap items-center gap-2 gap-y-1">
                      <span className="inline-flex items-center rounded-full bg-[var(--color-surface)] px-2.5 py-0.5 text-xs font-bold tabular-nums text-[var(--color-text)] ring-1 ring-border">
                        Step {item.step}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide text-primary">
                        {item.timeLabel}
                      </span>
                    </div>
                    <h3 className="mt-3 text-base font-extrabold text-[var(--color-text)] sm:text-lg">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm font-bold text-[var(--color-text)]">
                      The goal: {item.goal}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-muted">
                      {item.body}
                    </p>
                  </article>
                </li>
              );
            })}
          </ol>
        </section>
      </main>
    </PageShell>
  );
}
