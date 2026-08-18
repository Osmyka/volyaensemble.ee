"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which of the given sections is currently in view, so the tab bar can
 * highlight it while the page scrolls.
 *
 * The observer's top margin discounts the sticky header, and the bottom margin
 * keeps the *upper* section highlighted until the next one is genuinely the
 * subject of the screen rather than just peeking in.
 */
export function useActiveSection(sectionIds: string[], enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || sectionIds.length === 0) return;

    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    let visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        // Whichever qualifying section shows the most of itself wins.
        const best = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
        setActive(best ? best[0] : null);
      },
      { rootMargin: "-88px 0px -45% 0px", threshold: [0.05, 0.25, 0.5, 0.75] },
    );

    for (const el of elements) observer.observe(el);
    return () => {
      observer.disconnect();
      visible = new Map();
    };
  }, [sectionIds.join(","), enabled]);

  return active;
}
