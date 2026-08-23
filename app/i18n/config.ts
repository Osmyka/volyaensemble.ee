/** Locale plumbing shared by the route trees and the language switcher. */

export const locales = ["uk", "et", "en"] as const;

export type Locale = (typeof locales)[number];

/** Ukrainian is the audience's language, so it owns the bare URLs. */
export const defaultLocale: Locale = "uk";

/** Shown in the header switcher. Each language names itself. */
export const localeNames: Record<Locale, string> = {
  uk: "UA",
  et: "ET",
  en: "EN",
};

/** `lang` attribute and `hreflang` value for each locale. */
export const localeTags: Record<Locale, string> = {
  uk: "uk",
  et: "et",
  en: "en",
};

/** Pages that exist in every locale. */
export type SitePage = "/" | "/schedule" | "/merch" | "/join";

/**
 * Path for `page` in `locale`. The default locale has no prefix, so
 * localePath("uk", "/schedule") is "/schedule" and localePath("et", "/schedule")
 * is "/et/schedule".
 */
export function localePath(locale: Locale, page: SitePage): string {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  if (page === "/") return prefix || "/";
  return `${prefix}${page}`;
}
