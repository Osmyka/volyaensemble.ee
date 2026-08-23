import { localePath, type Locale, type SitePage } from "../i18n/config";
import type { Dictionary } from "../i18n/types";
import { JoinButton } from "./JoinButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "../theme/theme";

/**
 * One header for the whole site.
 *
 * The entries are the same everywhere; only their targets change. On the home
 * page the section entries are anchors that scroll; on a subpage they carry the
 * path back to the home page, because there is no `#gallery` there to scroll
 * to. The logo does the same job, which is why a subpage needs no separate
 * "back" link.
 *
 * On a phone the links are hidden and the tab bar at the foot of the page
 * carries the navigation instead; the logo, theme, language and join controls
 * stay.
 */
export function SiteHeader({
  locale,
  dict,
  page,
}: {
  locale: Locale;
  dict: Dictionary;
  page: SitePage;
}) {
  const home = localePath(locale, "/");
  const onHome = page === "/";
  const hash = (id: string) => (onHome ? `#${id}` : `${home}#${id}`);

  const nav = [
    { id: "about", label: dict.nav.about, href: hash("about") },
    {
      id: "schedule",
      label: dict.nav.schedule,
      // The home page has a schedule section to scroll to; elsewhere the entry
      // means the timetable itself.
      href: onHome ? "#schedule" : localePath(locale, "/schedule"),
    },
    { id: "merch", label: dict.nav.merch, href: localePath(locale, "/merch") },
    { id: "gallery", label: dict.nav.gallery, href: hash("gallery") },
    { id: "contact", label: dict.nav.contact, href: hash("contact") },
  ];

  const current = page === "/schedule" ? "schedule" : page === "/merch" ? "merch" : null;


  return (
    <nav className="nav wrap">
      <a className="brand" href={onHome ? "#top" : home} aria-label={dict.nav.brandHome}>
        <img src="/logo-volya.webp" alt="VOLYA" width={960} height={386} />
      </a>
      <div className="navlinks">
        {nav.map(item => (
          <a
            key={item.id}
            href={item.href}
            className={item.id === current ? "is-current" : undefined}
            aria-current={item.id === current ? "page" : undefined}
          >
            {item.label}
          </a>
        ))}
      </div>
      <div className="nav-tools">
        <ThemeToggle label={dict.nav.toggleTheme} lightLabel={dict.nav.themeLight} darkLabel={dict.nav.themeDark} />
        <LanguageSwitcher locale={locale} page={page} dict={dict} />
        <JoinButton locale={locale} className="nav-cta" label={dict.nav.join} />
      </div>
    </nav>
  );
}
