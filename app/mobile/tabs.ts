import { links } from "../i18n/contacts";
import { localePath, type Locale, type SitePage } from "../i18n/config";
import type { Dictionary } from "../i18n/types";

export type TabId = "home" | "schedule" | "merch" | "gallery" | "contact" | "join";

export interface Tab {
  id: TabId;
  label: string;
  href: string;
  /** Section this tab tracks while scrolling the home page. */
  section?: string;
  external?: boolean;
}

/**
 * Six destinations. "Schedule" and "Merch" point at their own pages rather
 * than at a summary section — on a phone that is what people came for.
 *
 * Hash tabs need an absolute path because the schedule and merch pages have
 * no such sections to scroll to.
 */
export function buildTabs(locale: Locale, dict: Dictionary, page: SitePage): Tab[] {
  const home = localePath(locale, "/");
  const onHome = page === "/";
  const hash = (id: string) => (onHome ? `#${id}` : `${home}#${id}`);

  return [
    { id: "home", label: dict.nav.home, href: onHome ? "#top" : home, section: "top" },
    { id: "schedule", label: dict.nav.schedule, href: localePath(locale, "/schedule") },
    { id: "merch", label: dict.nav.merch, href: localePath(locale, "/merch") },
    { id: "gallery", label: dict.nav.gallery, href: hash("gallery"), section: "gallery" },
    { id: "contact", label: dict.nav.contact, href: hash("contact"), section: "contact" },
    { id: "join", label: dict.nav.join, href: links.joinForm, external: true },
  ];
}
