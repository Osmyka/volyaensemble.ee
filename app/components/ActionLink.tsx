import type { ReactNode } from "react";

/**
 * Replaces the old ↗ / ▶ characters. One component covers the site's
 * clickable actions — hero CTAs, footer chips, text links — so they all
 * read as buttons in the same navy/gold language as the tab bar.
 */

const glyph = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

function ArrowGlyph() {
  return (
    <svg {...glyph}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg {...glyph} fill="currentColor" stroke="none">
      <path d="M9 6.8v10.4L19 12 9 6.8Z" />
    </svg>
  );
}

export function LinkMark({ kind = "arrow" }: { kind?: "arrow" | "play" }) {
  return (
    <span className={`action-mark action-mark--${kind}`} aria-hidden="true">
      {kind === "play" ? <PlayGlyph /> : <ArrowGlyph />}
    </span>
  );
}

type Variant = "button" | "play" | "chip" | "text";
type Tone = "navy" | "gold" | "light";

export function ActionLink({
  href,
  children,
  variant = "button",
  tone = "navy",
  external = false,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  tone?: Tone;
  external?: boolean;
  className?: string;
}) {
  const classes = [
    "action-link",
    `action-link--${variant}`,
    variant === "button" ? `action-link--${tone}` : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      className={classes}
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {variant === "play" && <LinkMark kind="play" />}
      <span className="action-link-label">{children}</span>
      {variant !== "play" && <LinkMark />}
    </a>
  );
}
