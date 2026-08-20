"use client";

import { useState } from "react";
import type { MerchItem } from "../merch/catalog";
import { merchMailto } from "../merch/catalog";
import { links } from "../i18n/contacts";
import type { Dictionary } from "../i18n/types";
import { ActionLink } from "./ActionLink";
import { withTokens } from "./text";

function MerchShot({ kind, alt }: { kind: MerchItem["id"]; alt: string }) {
  return (
    <div className={`merch-shot merch-shot--${kind}`} role="img" aria-label={alt}>
      <div className="merch-garment">
        <img src="/logo-volya.webp" alt="" width={960} height={386} />
      </div>
    </div>
  );
}

/**
 * The only interactive part of the merch page: picking a size rewrites the
 * `mailto:` link. Kept in its own client module so the page around it stays a
 * server component, like the schedule subpage.
 */
export function MerchCard({ item, dict }: { item: MerchItem; dict: Dictionary }) {
  const product = dict.merchPage.products[item.id];
  const [size, setSize] = useState<string | null>(item.sizes[0] ?? null);
  const subject = withTokens(dict.merchPage.orderSubject, { name: product.name });
  // One-size pieces use a body without the `{size}` token, so the mail does not
  // read "size: one size".
  const body = size
    ? withTokens(dict.merchPage.orderBody, { name: product.name, size })
    : withTokens(dict.merchPage.orderBodyOneSize, { name: product.name });

  return (
    <article className="merch-card">
      <MerchShot kind={item.id} alt={product.alt} />
      <h2>{product.name}</h2>
      <p>{product.blurb}</p>
      {item.sizes.length > 0 ? (
        <div className="merch-sizes">
          <span id={`sizes-${item.id}`}>{dict.merchPage.sizesLabel}</span>
          {/* A radio group, not a row of toggles: exactly one size is chosen. */}
          <div role="radiogroup" aria-labelledby={`sizes-${item.id}`}>
            {item.sizes.map(option => (
              <button
                type="button"
                key={option}
                role="radio"
                aria-checked={option === size}
                tabIndex={option === size ? 0 : -1}
                className={option === size ? "is-selected" : undefined}
                onClick={() => setSize(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="merch-onesize">{dict.merchPage.oneSize}</p>
      )}
      <ActionLink variant="button" tone="navy" href={merchMailto(links.email, subject, body)}>
        {dict.merchPage.orderCta}
      </ActionLink>
    </article>
  );
}
