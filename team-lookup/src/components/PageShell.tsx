import type { ReactNode } from "react";

type PageShellProps = {
  readonly children: ReactNode;
  readonly mainClassName?: string;
};

export function PageShell(props: PageShellProps): JSX.Element {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[var(--color-bg)] antialiased selection:bg-primary/20 selection:text-[var(--color-text)]">
      <div
        className="pointer-events-none absolute inset-0 hero-grid opacity-60"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 hero-stripes opacity-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-1/4 top-0 h-[420px] w-[420px] rounded-full bg-[var(--blur-radial)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-[-10%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_center,rgb(0_102_255/0.06),transparent_55%)] blur-3xl"
        aria-hidden
      />
      <div className={props.mainClassName ?? ""}>{props.children}</div>
    </div>
  );
}
