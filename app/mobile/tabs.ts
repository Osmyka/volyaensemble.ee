import { links } from "../i18n/contacts";
import { localePath, type Locale } from "../i18n/config";
import type { Dictionary } from "../i18n/types";

export type TabId = "home" | "schedule" | "gallery" | "contact" | "join";

export interface Tab {
  id: TabId;
  label: string;
  href: string;
  /** Section this tab tracks while scrolling the home page. */
  section?: string;
  external?: boolean;
}

/**
 * Five destinations, the practical maximum before targets get too narrow to
 * hit on a phone. "Schedule" points at the full timetable page rather than the
 * summary section — on a phone that is what people actually came for.
 *
 * Hash tabs need an absolute path because the schedule page has no such
 * sections to scroll to.
 */
export function buildTabs(locale: Locale, dict: Dictionary, page: "/" | "/schedule"): Tab[] {
  const home = localePath(locale, "/");
  const onHome = page === "/";
  const hash = (id: string) => (onHome ? `#${id}` : `${home}#${id}`);

  return [
    { id: "home", label: dict.nav.home, href: onHome ? "#top" : home, section: "top" },
    { id: "schedule", label: dict.nav.schedule, href: localePath(locale, "/schedule") },
    { id: "gallery", label: dict.nav.gallery, href: hash("gallery"), section: "gallery" },
    { id: "contact", label: dict.nav.contact, href: hash("contact"), section: "contact" },
    { id: "join", label: dict.nav.join, href: links.joinForm, external: true },
  ];
}
