"use client";

import { useEffect, useRef, useState } from "react";
import { localeNames, localePath, localeTags, locales, type Locale } from "../i18n/config";
import type { Dictionary } from "../i18n/types";

/**
 * Replaces the old `href="#"` placeholder. Each entry is a real link to the
 * same page in another language, so the choice is shareable and crawlable —
 * `hrefLang` tells search engines these are translations of one another.
 */
export function LanguageSwitcher({
  locale,
  page,
  dict,
  onNavigate,
}: {
  locale: Locale;
  page: "/" | "/schedule";
  dict: Dictionary;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  // A click anywhere else, or Escape, closes the menu.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="lang" ref={container}>
      <button
        type="button"
        className="lang-toggle"
        aria-label={dict.nav.languageLabel}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen(!open)}
      >
        {localeNames[locale]} <small>⌄</small>
      </button>
      <ul className={`lang-menu ${open ? "open" : ""}`} role="menu">
        {locales.map(candidate => (
          <li key={candidate} role="none">
            <a
              role="menuitem"
              href={localePath(candidate, page)}
              hrefLang={localeTags[candidate]}
              lang={localeTags[candidate]}
              aria-current={candidate === locale ? "true" : undefined}
              onClick={onNavigate}
            >
              {localeNames[candidate]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
