import { PageShell } from "@/components/PageShell";
import { fetchTeamByEmail } from "@/lib/fetch-team-by-email";
import { Loader2, PartyPopper } from "lucide-react";
import {
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";

type LookupUiState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; teamName: string }
  | { status: "not_found" }
  | { status: "error"; message: string }
  | { status: "validation"; message: string };

type CommunityCopy = {
  readonly communityName: string;
  readonly communityAbbrev: string;
  readonly brandTagline: string;
  readonly brandHeadline: string;
  readonly aboutSectionHeading: string;
  readonly eventTitle: string;
  readonly eventIntro: string;
  readonly successEmoji: string;
  readonly communitySiteUrl: string;
  readonly communityEventsUrl: string;
  readonly supportEmail: string;
  readonly brandLogoSrc: string;
};

const DEFAULT_SUCCESS_EMOJI = "🎉";

const COMMUNITY_SITE_DEFAULTS: CommunityCopy = {
  communityName: "Digital Dreamers Den",
  communityAbbrev: "D3",
  brandTagline: "BUILDING THE FUTURE",
  brandHeadline: "Dream. Build. Grow.",
  aboutSectionHeading: "About this event",
  eventTitle: "Welcome to the Anniversary Meetup Activity",
  eventIntro:
    "Find your team name using your registered email. This is your chance to do more than just code—connect, collaborate, and network with the community!",
  successEmoji: DEFAULT_SUCCESS_EMOJI,
  communitySiteUrl: "https://digitaldreamersden.in/",
  communityEventsUrl: "https://digitaldreamersden.in/#events",
  supportEmail: "d3communityofficial@gmail.com",
  brandLogoSrc: "/full_logo.png",
};

function readEnvString(
  key: keyof ImportMetaEnv,
  fallback: string,
): string {
  const raw: unknown = import.meta.env[key];
  if (typeof raw !== "string") {
    return fallback;
  }
  const trimmed: string = raw.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function readCelebrationEmoji(): string {
  const raw: unknown = import.meta.env.VITE_SUCCESS_EMOJI;
  if (typeof raw !== "string") {
    return DEFAULT_SUCCESS_EMOJI;
  }
  const trimmed: string = raw.trim();
  if (trimmed.length === 0 || trimmed.toLowerCase() === "none") {
    return "";
  }
  return trimmed;
}

function useCommunityCopy(): CommunityCopy {
  return useMemo((): CommunityCopy => {
    return {
      communityName: readEnvString(
        "VITE_COMMUNITY_NAME",
        COMMUNITY_SITE_DEFAULTS.communityName,
      ),
      communityAbbrev: readEnvString(
        "VITE_COMMUNITY_ABBREV",
        COMMUNITY_SITE_DEFAULTS.communityAbbrev,
      ),
      brandTagline: readEnvString(
        "VITE_BRAND_TAGLINE",
        COMMUNITY_SITE_DEFAULTS.brandTagline,
      ),
      brandHeadline: readEnvString(
        "VITE_BRAND_HEADLINE",
        COMMUNITY_SITE_DEFAULTS.brandHeadline,
      ),
      aboutSectionHeading: readEnvString(
        "VITE_EVENT_ABOUT_HEADING",
        COMMUNITY_SITE_DEFAULTS.aboutSectionHeading,
      ),
      eventTitle: readEnvString(
        "VITE_EVENT_TITLE",
        COMMUNITY_SITE_DEFAULTS.eventTitle,
      ),
      eventIntro: readEnvString(
        "VITE_EVENT_INTRO",
        COMMUNITY_SITE_DEFAULTS.eventIntro,
      ),
      successEmoji: readCelebrationEmoji(),
      communitySiteUrl: readEnvString(
        "VITE_COMMUNITY_SITE_URL",
        COMMUNITY_SITE_DEFAULTS.communitySiteUrl,
      ),
      communityEventsUrl: readEnvString(
        "VITE_COMMUNITY_EVENTS_URL",
        COMMUNITY_SITE_DEFAULTS.communityEventsUrl,
      ),
      supportEmail: readEnvString(
        "VITE_SUPPORT_EMAIL",
        COMMUNITY_SITE_DEFAULTS.supportEmail,
      ),
      brandLogoSrc: readEnvString(
        "VITE_BRAND_LOGO_SRC",
        COMMUNITY_SITE_DEFAULTS.brandLogoSrc,
      ),
    };
  }, []);
}

type CelebrationVisualProps = {
  readonly emoji: string;
};

function CelebrationVisual(props: CelebrationVisualProps): JSX.Element {
  const hasEmoji: boolean = props.emoji.length > 0;
  return (
    <div
      className="flex items-center justify-center gap-3 sm:gap-4"
      aria-hidden
    >
      {hasEmoji ? (
        <span
          className="text-5xl leading-none sm:text-6xl"
          style={{
            fontFamily:
              'system-ui, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
          }}
        >
          {props.emoji}
        </span>
      ) : null}
      <PartyPopper
        className={
          hasEmoji
            ? "h-11 w-11 shrink-0 text-primary sm:h-12 sm:w-12"
            : "h-16 w-16 shrink-0 text-primary sm:h-20 sm:w-20"
        }
        strokeWidth={1.75}
      />
    </div>
  );
}

export default function TeamLookupPage(): JSX.Element {
  const copy: CommunityCopy = useCommunityCopy();
  const successDialogRef = useRef<HTMLDialogElement>(null);
  const [emailInput, setEmailInput] = useState<string>("");
  const [lookupState, setLookupState] = useState<LookupUiState>({
    status: "idle",
  });

  useEffect(() => {
    if (lookupState.status !== "success") {
      return;
    }
    const dialog: HTMLDialogElement | null = successDialogRef.current;
    if (dialog == null || dialog.open) {
      return;
    }
    dialog.showModal();
  }, [lookupState]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const trimmed: string = emailInput.trim();
    if (!trimmed) {
      setLookupState({
        status: "validation",
        message: "Enter the email you registered with.",
      });
      return;
    }
    setLookupState({ status: "loading" });
    const outcome = await fetchTeamByEmail(trimmed);
    if (outcome.kind === "found") {
      setLookupState({
        status: "success",
        teamName: outcome.teamName,
      });
      return;
    }
    if (outcome.kind === "not_found") {
      setLookupState({ status: "not_found" });
      return;
    }
    setLookupState({ status: "error", message: outcome.message });
  }

  function executeCloseSuccessDialog(): void {
    successDialogRef.current?.close();
  }

  function handleReset(): void {
    successDialogRef.current?.close();
    setEmailInput("");
    setLookupState({ status: "idle" });
  }

  const isLoading: boolean = lookupState.status === "loading";
  const isSuccess: boolean = lookupState.status === "success";
  const successTeamName: string | null =
    lookupState.status === "success" ? lookupState.teamName : null;
  const logoAlt: string = `${copy.communityName} (${copy.communityAbbrev}) logo`;
  return (
    <PageShell mainClassName="relative z-10">
      <main className="relative mx-auto flex min-h-dvh max-w-lg flex-col justify-center p-6 md:p-12">
        <div className="grid gap-4">
          <header className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-5 sm:text-left">
            <img
              src={copy.brandLogoSrc}
              width="auto"
              height="auto"
              alt={logoAlt}
              className="shrink-0 rounded-2xl border border-border bg-card object-cover shadow-sm"
            />
          </header>

          <h1
            id="about-heading"
            className="text-xl font-extrabold leading-tight tracking-tight text-[var(--color-text)] sm:text-3xl"
          >
            {copy.eventTitle}
          </h1>

          <section
            className="rounded-bento bg-[var(--gradient-hero)]"
            aria-labelledby="about-heading"
          >
            <p className="max-w-prose text-base font-medium leading-relaxed text-muted">
              {copy.eventIntro}
            </p>
          </section>

          <section
            className="rounded-bento border border-border bg-card p-3 shadow-bento"
            aria-labelledby="lookup-heading"
          >
            <h2
              id="lookup-heading"
              className="text-lg font-bold text-[var(--color-text)]"
            >
              {isSuccess ? "Your team name" : "Enter your email"}
            </h2>
            {isSuccess ? (
              <p className="mt-1 text-sm font-medium text-muted">
                Save this name for check-ins and activities.
              </p>
            ) : null}

            {!isSuccess && (
            <form className="mt-3 space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  aria-label="Registered email"
                  placeholder="you@example.com"
                  value={emailInput}
                  disabled={isLoading}
                  onChange={(event) => {
                    setEmailInput(event.target.value);
                    if (lookupState.status === "validation") {
                      setLookupState({ status: "idle" });
                    }
                  }}
                  className="w-full rounded-xl border border-border bg-[var(--color-card)] px-4 py-4 text-base font-medium text-[var(--color-text)] shadow-inner outline-none ring-primary/25 placeholder:text-muted focus:border-primary focus:ring-2 disabled:opacity-60"
                />
              </div>

              {(lookupState.status === "validation" ||
                lookupState.status === "error") && (
                <p
                  className="text-sm font-semibold text-red-600"
                  role="alert"
                >
                  {lookupState.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 text-base font-extrabold text-white shadow-lg shadow-primary/25 transition hover:bg-[var(--color-primary-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    Finding your team…
                  </>
                ) : (
                  "Find my team"
                )}
              </button>
            </form>
            )}

            {!isSuccess && lookupState.status === "not_found" && (
              <div
                className="mt-6 rounded-xl border border-border bg-[var(--color-surface)] p-4"
                role="status"
              >
                <p className="text-base font-semibold text-[var(--color-text)]">
                  We couldn&apos;t find that email.
                </p>
                <p className="mt-2 text-sm font-medium text-muted">
                  Double-check spelling, or use the same address you registered
                  with. Ask an organizer if you still need help.
                </p>
              </div>
            )}

            {isSuccess && successTeamName != null && (
              <div
                className="mt-6 rounded-xl border border-primary/30 bg-[var(--color-surface)] p-6 text-center"
                role="status"
                aria-live="polite"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-muted">
                  You&apos;re on
                </p>
                <p className="mt-2 text-3xl font-extrabold leading-tight text-[var(--color-text)] sm:text-4xl">
                  {successTeamName}
                </p>
                <button
                  type="button"
                  className="mt-6 w-full rounded-xl border border-border bg-card py-3 text-sm font-bold text-[var(--color-text)] transition hover:bg-[var(--color-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  onClick={handleReset}
                >
                  Look up another email
                </button>
              </div>
            )}
          </section>
        </div>

        <footer className="mt-10 flex flex-col items-center gap-2 pb-6 text-center text-xs font-medium text-muted sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-3 sm:gap-y-1">
          <a
            href={copy.communitySiteUrl}
            className="text-[var(--color-text)] underline-offset-2 hover:text-primary hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {copy.communityName}
          </a>
          <span className="hidden sm:inline" aria-hidden>
            ·
          </span>
          <Link
            to="/milestones"
            className="underline-offset-2 hover:text-primary hover:underline"
          >
            View milestones
          </Link>
        </footer>
      </main>

      <dialog
        ref={successDialogRef}
        className="success-dialog max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8"
        aria-labelledby="success-dialog-title"
        aria-describedby="success-dialog-team"
      >
        {successTeamName != null ? (
          <div className="text-center">
            <CelebrationVisual emoji={copy.successEmoji} />
            <p
              id="success-dialog-title"
              className="mt-5 text-sm font-semibold uppercase tracking-wide text-muted"
            >
              You&apos;re on
            </p>
            <p
              id="success-dialog-team"
              className="mt-2 break-words text-3xl font-extrabold leading-tight text-[var(--color-text)] sm:text-4xl"
            >
              {successTeamName}
            </p>
            <p className="mt-4 text-base font-medium text-muted">
              See you inside—welcome to the Den.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:justify-center">
              <button
                type="button"
                className="min-h-[48px] w-full rounded-xl bg-primary px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:bg-[var(--color-primary-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto sm:min-w-[140px]"
                onClick={executeCloseSuccessDialog}
              >
                Got it
              </button>
              <button
                type="button"
                className="min-h-[48px] w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-[var(--color-text)] transition hover:bg-[var(--color-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto sm:min-w-[140px]"
                onClick={handleReset}
              >
                Look up another email
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </PageShell>
  );
}
