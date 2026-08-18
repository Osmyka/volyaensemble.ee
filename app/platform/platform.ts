/**
 * Platform detection for the mobile shell.
 *
 * The layout itself never depends on this — that is decided by viewport width
 * in CSS, so the server can send one HTML document to every device and
 * Cloudflare can cache it. What lives here are the few behaviours that genuinely
 * differ between iOS Safari and Android Chrome and cannot be feature-detected:
 * the home-indicator inset, Safari's collapsing bottom toolbar, and the
 * address-bar tint Chrome takes from `theme-color`.
 *
 * Everything is computed on the client after mount. Rendering different markup
 * per user agent would both poison the shared CDN cache and break hydration.
 */

export type Platform = "ios" | "android" | "other";

export interface PlatformInfo {
  platform: Platform;
  /** Running from the home screen rather than a browser tab. */
  standalone: boolean;
  /** Coarse pointer — a finger rather than a mouse. */
  touch: boolean;
}

/** Server render and the first client paint agree on this. */
export const unknownPlatform: PlatformInfo = {
  platform: "other",
  standalone: false,
  touch: false,
};

/**
 * iPadOS reports itself as "Macintosh", so a Mac that accepts more than one
 * touch point is really an iPad.
 */
export function detectPlatform(navigatorLike: Navigator): Platform {
  const uaData = (navigatorLike as Navigator & { userAgentData?: { platform?: string } }).userAgentData;
  const hinted = uaData?.platform?.toLowerCase();
  if (hinted === "android") return "android";
  if (hinted === "ios") return "ios";

  const ua = navigatorLike.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Macintosh/.test(ua) && navigatorLike.maxTouchPoints > 1) return "ios";
  return "other";
}

export function detectStandalone(windowLike: Window): boolean {
  // Safari predates the standard and still only exposes navigator.standalone.
  const legacy = (windowLike.navigator as Navigator & { standalone?: boolean }).standalone;
  if (typeof legacy === "boolean") return legacy;
  return windowLike.matchMedia("(display-mode: standalone)").matches;
}

export function readPlatform(windowLike: Window): PlatformInfo {
  return {
    platform: detectPlatform(windowLike.navigator),
    standalone: detectStandalone(windowLike),
    touch: windowLike.matchMedia("(pointer: coarse)").matches,
  };
}
