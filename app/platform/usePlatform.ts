"use client";

import { useEffect, useState } from "react";
import { readPlatform, unknownPlatform, type PlatformInfo } from "./platform";

/**
 * Publishes the detected platform as `data-platform` / `data-standalone` on
 * `<html>` so stylesheets can target iOS or Android without any component
 * having to thread the value through props.
 *
 * The first render deliberately returns `unknownPlatform` — it must match what
 * the server produced, or React discards the markup and re-renders the page.
 */
export function usePlatform(): PlatformInfo {
  const [info, setInfo] = useState<PlatformInfo>(unknownPlatform);

  useEffect(() => {
    const apply = () => {
      const next = readPlatform(window);
      setInfo(next);
      const root = document.documentElement;
      root.dataset.platform = next.platform;
      root.dataset.standalone = String(next.standalone);
    };

    apply();

    // Installing to the home screen flips display-mode without a reload.
    const standalone = window.matchMedia("(display-mode: standalone)");
    standalone.addEventListener("change", apply);
    return () => standalone.removeEventListener("change", apply);
  }, []);

  return info;
}
