/**
 * Tab icons. Inline SVG on purpose: an icon font or sprite would be another
 * network round trip, and the strict CSP on the deployed Worker blocks
 * anything fetched from a third-party host.
 *
 * All of them share one 24×24 grid and inherit `currentColor`, so the active
 * state is a single colour change.
 */

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function HomeIcon() {
  return (
    <svg {...base}>
      <path d="M3 10.2 12 3.5l9 6.7" />
      <path d="M5.4 9v10.5h13.2V9" />
      <path d="M9.8 19.5v-5.7h4.4v5.7" />
    </svg>
  );
}

/** Calendar — the class timetable. */
export function ScheduleIcon() {
  return (
    <svg {...base}>
      <rect x="3.2" y="5" width="17.6" height="15.5" rx="3" />
      <path d="M3.2 9.8h17.6M8.2 3.5v3M15.8 3.5v3" />
      <circle cx="8.4" cy="14.2" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14.2" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Photographs — the gallery. */
export function GalleryIcon() {
  return (
    <svg {...base}>
      <rect x="3.2" y="4.6" width="17.6" height="14.8" rx="3" />
      <circle cx="8.7" cy="9.6" r="1.7" />
      <path d="m3.9 16.6 4.3-4a2 2 0 0 1 2.7 0l3 2.8" />
      <path d="m14.2 13.2 1.7-1.5a2 2 0 0 1 2.7 0l2.2 2" />
    </svg>
  );
}

/** Envelope — contacts. */
export function ContactIcon() {
  return (
    <svg {...base}>
      <rect x="3" y="5.4" width="18" height="13.2" rx="3" />
      <path d="m4.4 8 6.5 4.6a2 2 0 0 0 2.2 0L19.6 8" />
    </svg>
  );
}

/** A tote bag — the shop. */
export function MerchIcon() {
  return (
    <svg {...base}>
      <path d="M5.4 8.2h13.2l1 11.1a1.6 1.6 0 0 1-1.6 1.7H6a1.6 1.6 0 0 1-1.6-1.7Z" />
      <path d="M8.8 10.4V7.2a3.2 3.2 0 0 1 6.4 0v3.2" />
    </svg>
  );
}

/** Sunflower, echoing the logo — the join call to action. */
export function JoinIcon() {
  return (
    <svg {...base}>
      <circle cx="12" cy="10.4" r="2.9" />
      <path d="M12 3.6v1.8M12 15.4v1.8M5.2 10.4H7M17 10.4h1.8M7.2 5.6l1.3 1.3M15.5 12.9l1.3 1.3M16.8 5.6l-1.3 1.3M8.5 12.9l-1.3 1.3" />
      <path d="M12 17.2v3.2" />
    </svg>
  );
}
