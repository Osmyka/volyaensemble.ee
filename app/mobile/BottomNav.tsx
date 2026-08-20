"use client";

import { usePlatform } from "../platform/usePlatform";
import type { Locale, SitePage } from "../i18n/config";
import type { Dictionary } from "../i18n/types";
import { ContactIcon, GalleryIcon, HomeIcon, JoinIcon, MerchIcon, ScheduleIcon } from "./icons";
import { buildTabs, type TabId } from "./tabs";
import { useActiveSection } from "./useActiveSection";

const icons: Record<TabId, () => React.JSX.Element> = {
  home: HomeIcon,
  schedule: ScheduleIcon,
  merch: MerchIcon,
  gallery: GalleryIcon,
  contact: ContactIcon,
  join: JoinIcon,
};

/**
 * The phone-sized navigation bar.
 *
 * It is always present in the HTML and revealed by a media query, so the server
 * sends one document to every device and the CDN can cache it. `usePlatform`
 * only stamps `<html>` with the platform for the stylesheet's benefit — nothing
 * here renders differently between iOS and Android.
 */
export function BottomNav({
  locale,
  dict,
  page,
}: {
  locale: Locale;
  dict: Dictionary;
  page: SitePage;
}) {
  usePlatform();

  const tabs = buildTabs(locale, dict, page);
  const sections = tabs.filter(tab => tab.section).map(tab => tab.section as string);
  const activeSection = useActiveSection(sections, page === "/");

  const isActive = (id: TabId) => {
    if (page === "/merch") return id === "merch";
    if (page === "/schedule") return id === "schedule";
    if (id === "home") return activeSection === "top" || activeSection === null;
    const tab = tabs.find(entry => entry.id === id);
    return tab?.section ? activeSection === tab.section : false;
  };

  return (
    <nav className="tabbar" aria-label={dict.nav.mobileNav}>
      <ul>
        {tabs.map(tab => {
          const Icon = icons[tab.id];
          const active = isActive(tab.id);
          return (
            <li key={tab.id}>
              <a
                href={tab.href}
                className={["tab", tab.id === "join" && "tab-cta", active && "is-active"].filter(Boolean).join(" ")}
                aria-current={active ? "page" : undefined}
                {...(tab.external ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                <span className="tab-icon"><Icon /></span>
                <span className="tab-label">{tab.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
