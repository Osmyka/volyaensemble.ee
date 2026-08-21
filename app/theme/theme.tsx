"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

/**
 * The site's light / dark switch.
 *
 * The choice is remembered in `localStorage` so it survives a move between the
 * home page and a subpage — each page is its own document, so without that the
 * theme would reset on every navigation.
 *
 * The server always renders the light theme: the stored choice is only known in
 * the browser, and a document that varied per visitor could not be cached at
 * the edge. `ThemeShell` adds the class once React hydrates.
 */

const storageKey = "volya-theme";

/** Same-tab subscribers. The `storage` event only fires in *other* tabs. */
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readStored() {
  try {
    return window.localStorage.getItem(storageKey) === "dark";
  } catch {
    // Private modes can refuse storage; the light theme is a fine fallback.
    return false;
  }
}

/** The server has no storage to read, so it always renders the light theme. */
const readServer = () => false;

function store(dark: boolean) {
  try {
    window.localStorage.setItem(storageKey, dark ? "dark" : "light");
  } catch {
    // Ignored for the same reason as above — the class still applies.
  }
  listeners.forEach(listener => listener());
}

const ThemeContext = createContext<{ dark: boolean; toggle: () => void }>({
  dark: false,
  toggle: () => {},
});

export function ThemeShell({ className, children }: { className: string; children: ReactNode }) {
  const dark = useSyncExternalStore(subscribe, readStored, readServer);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => store(!dark) }}>
      <main className={dark ? `${className} dark-mode` : className}>{children}</main>
    </ThemeContext.Provider>
  );
}

/**
 * The button itself. It reads the shell's state, so every page's header shows
 * the same control whether the page around it is a client component or not.
 */
export function ThemeToggle({
  label,
  lightLabel,
  darkLabel,
}: {
  label: string;
  lightLabel: string;
  darkLabel: string;
}) {
  const { dark, toggle } = useContext(ThemeContext);

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={dark}
    >
      <span aria-hidden="true">{dark ? "☼" : "☾"}</span>
      <small>{dark ? lightLabel : darkLabel}</small>
    </button>
  );
}
