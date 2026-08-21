/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  /**
   * Apps Script web app that appends a merch order to its spreadsheet. Set with
   * `wrangler secret put ORDERS_WEBHOOK_URL`; the address stays server-side so
   * the sheets cannot be filled with junk by anyone who reads the page source.
   */
  ORDERS_WEBHOOK_URL?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

/** The pieces the shop sells; anything else is not an order. */
const products = ["tshirt", "hoodie", "backpack", "tote", "cap"];

/** Every field the order form can send, and the longest value each may carry. */
const orderFields: Record<string, number> = {
  product: 40,
  productName: 120,
  variant: 80,
  bodyType: 40,
  style: 40,
  size: 40,
  quantity: 8,
  participant: 200,
  contact: 200,
  details: 2000,
  locale: 8,
};

/**
 * Takes a merch order and hands it to the spreadsheet.
 *
 * The browser never sees where it goes. Failures are reported plainly, because
 * the form falls back to opening an e-mail when this does not work — an order
 * must not be lost just because a spreadsheet was unreachable.
 */
async function handleOrder(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json({ ok: false, error: "method" }, 405);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "malformed" }, 400);
  }

  // A field no person can see: filled in means a bot filled the form.
  if (typeof body.website === "string" && body.website.length > 0) return json({ ok: true });

  const order: Record<string, string> = {};
  for (const [field, limit] of Object.entries(orderFields)) {
    const value = body[field];
    if (typeof value !== "string") continue;
    order[field] = value.slice(0, limit);
  }

  if (!products.includes(order.product ?? "")) return json({ ok: false, error: "product" }, 400);
  if (!order.participant || !order.contact) return json({ ok: false, error: "incomplete" }, 400);

  // Checked after validation, so a misconfigured deployment still rejects
  // nonsense rather than answering "unconfigured" to everything.
  if (!env.ORDERS_WEBHOOK_URL) return json({ ok: false, error: "unconfigured" }, 503);

  const response = await fetch(env.ORDERS_WEBHOOK_URL, {
    method: "POST",
    // Apps Script rejects a preflight, and text/plain avoids provoking one.
    headers: { "content-type": "text/plain;charset=utf-8" },
    body: JSON.stringify(order),
  });

  if (!response.ok) return json({ ok: false, error: "upstream" }, 502);

  const result = (await response.json().catch(() => ({ ok: false }))) as { ok?: boolean };
  return result.ok ? json({ ok: true }) : json({ ok: false, error: "sheet" }, 502);
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/order") return handleOrder(request, env);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
