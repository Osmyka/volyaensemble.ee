import { localeNames, localePath, localeTags, locales, type Locale } from "../i18n/config";
import type { Dictionary } from "../i18n/types";

/**
 * Compact segmented control for the header. Each entry is a real link to the
 * same page in another language, so the choice is shareable and crawlable —
 * `hrefLang` tells search engines these are translations of one another.
 */
export function LanguageSwitcher({
  locale,
  page,
  dict,
}: {
  locale: Locale;
  page: "/" | "/schedule";
  dict: Dictionary;
}) {
  return (
    <nav className="lang" aria-label={dict.nav.languageLabel}>
      <ul>
        {locales.map(candidate => (
          <li key={candidate}>
            <a
              href={localePath(candidate, page)}
              hrefLang={localeTags[candidate]}
              lang={localeTags[candidate]}
              aria-current={candidate === locale ? "true" : undefined}
            >
              {localeNames[candidate]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
