import type { Metadata } from "next";
import "../globals.css";
import "../concept.css";
import "../logo.css";
import "../language.css";
import { getDictionary } from "../i18n";
import { localePath, localeTags, locales, type Locale } from "../i18n/config";

/**
 * Each locale gets its own root layout inside a route group so the `lang`
 * attribute is correct in the served HTML rather than patched in afterwards.
 */
export function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={localeTags[locale]}>
      <body>{children}</body>
    </html>
  );
}

/**
 * Per-page metadata including the `hreflang` set, which tells search engines
 * that the three locales are translations of one page rather than duplicates.
 */
export function pageMetadata(locale: Locale, page: "/" | "/schedule"): Metadata {
  const dict = getDictionary(locale);
  const copy = page === "/" ? dict.meta.home : dict.meta.schedule;
  const languages = Object.fromEntries(
    locales.map(candidate => [localeTags[candidate], localePath(candidate, page)]),
  );

  return {
    metadataBase: new URL("https://volyaensemble.ee"),
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: localePath(locale, page),
      languages: { ...languages, "x-default": localePath("uk", page) },
    },
    openGraph: {
      type: "website",
      locale: localeTags[locale],
      url: localePath(locale, page),
      title: copy.title,
      description: page === "/" ? dict.meta.home.ogDescription : copy.description,
      images: ["/og.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: page === "/" ? dict.meta.home.ogDescription : copy.description,
      images: ["/og.jpg"],
    },
  };
}
