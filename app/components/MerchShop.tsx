"use client";

import { useEffect, useState } from "react";
import {
  bodyTypes,
  merchItems,
  merchMailto,
  sizeGuides,
  sizeOptions,
  type BodyType,
  type MerchItem,
} from "../merch/catalog";
import { links } from "../i18n/contacts";
import type { Dictionary } from "../i18n/types";

/**
 * The shop: a grid of pieces, the order dialog behind each one, and the size
 * chart the dialog can open. All of it is one client island so the page around
 * it — hero, copy, chrome — stays a server component.
 *
 * There is no shop back end. The dialog collects what the ensemble needs to
 * know and hands it to the visitor's mail client, exactly as the prototype did.
 */
export function MerchShop({ dict }: { dict: Dictionary }) {
  const copy = dict.merchPage;
  const [openId, setOpenId] = useState<MerchItem["id"] | null>(null);
  const item = merchItems.find(entry => entry.id === openId) ?? null;

  return (
    <>
      <div className="product-grid">
        {merchItems.map(entry => {
          const product = copy.products[entry.id];
          return (
            <article
              key={entry.id}
              className={entry.featured ? "product-card featured" : "product-card"}
            >
              {/* The whole card is the target, but only the heading link is
                  focusable — a nested button would double every tab stop. */}
              <div className="product-image">
                <img src={entry.image} alt={product.alt} loading="lazy" width={800} height={800} />
              </div>
              <div className="product-meta">
                <div>
                  <h3>
                    <button type="button" onClick={() => setOpenId(entry.id)}>
                      {product.name}
                    </button>
                  </h3>
                  <p>{product.description}</p>
                </div>
                <strong className="price">{entry.price}</strong>
              </div>
            </article>
          );
        })}
      </div>

      {item && <OrderDialog item={item} dict={dict} onClose={() => setOpenId(null)} />}
    </>
  );
}

function OrderDialog({
  item,
  dict,
  onClose,
}: {
  item: MerchItem;
  dict: Dictionary;
  onClose: () => void;
}) {
  const copy = dict.merchPage;
  const modal = copy.modal;
  const product = copy.products[item.id];
  const variants = item.variants;
  const styles = item.styles;
  const guides = item.sizeGuide ?? sizeGuides;
  const asksForSize = item.sizing === "shirt";

  const [variant, setVariant] = useState<string>(variants?.[0]?.id ?? "");
  const [style, setStyle] = useState<string>(styles?.[0] ?? "");
  const [bodyType, setBodyType] = useState<BodyType>("men");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [guideOpen, setGuideOpen] = useState(false);

  // Escape closes the topmost layer, and the page behind the dialog must not
  // scroll away under it.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (guideOpen) setGuideOpen(false);
      else onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("modal-open");
    };
  }, [guideOpen, onClose]);

  const missing = copy.mail.notSpecified;
  const orNotSpecified = (value: string) => value || missing;
  const variantLabel = variant ? product.variants?.[variant] ?? "" : "";

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      `${copy.mail.product}: ${product.name} — ${item.price}`,
      variantLabel && `${copy.mail.colour}: ${variantLabel}`,
      style && `${copy.mail.style}: ${modal.styles[style as "zip" | "plain"]}`,
      `${copy.mail.participant}: ${orNotSpecified(String(data.get("participant") ?? ""))}`,
      asksForSize && `${copy.mail.bodyType}: ${modal.bodyTypes[bodyType]}`,
      asksForSize && `${copy.mail.size}: ${orNotSpecified(size)}`,
      asksForSize && `${copy.mail.quantity}: ${quantity}`,
      `${copy.mail.contact}: ${String(data.get("contact") ?? "")}`,
      `${copy.mail.details}: ${orNotSpecified(String(data.get("details") ?? ""))}`,
    ].filter(Boolean);

    window.location.href = merchMailto(links.email, copy.mail.subject, lines.join("\n"));
  };

  return (
    <div className="merch-modal">
      <div className="modal-backdrop" onClick={onClose} />
      <section
        className="order-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-title"
      >
        <button className="modal-close" type="button" aria-label={modal.close} onClick={onClose}>
          ×
        </button>
        <p className="section-number">{modal.label}</p>
        <h2 id="order-title">
          {modal.headingTop}
          <br />
          <em>{product.orderNoun}</em>
        </h2>
        <p className="selected-product">
          {modal.selectedProduct}
          <strong>
            {product.name} — {item.price}
          </strong>
        </p>

        {variants && (
          <div className="variant-picker">
            <p id="variant-title">{product.variantTitle}</p>
            <div className="variant-list" role="radiogroup" aria-labelledby="variant-title">
              {variants.map(option => (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={option.id === variant}
                  tabIndex={option.id === variant ? 0 : -1}
                  className={option.id === variant ? "variant selected" : "variant"}
                  onClick={() => setVariant(option.id)}
                >
                  <img src={option.image} alt="" loading="lazy" width={400} height={400} />
                  <span>{product.variants?.[option.id]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {styles && (
          <fieldset className="merch-choice">
            <legend>{modal.styleLegend}</legend>
            {styles.map(option => (
              <label key={option} className="choice">
                <input
                  type="radio"
                  name="style"
                  value={option}
                  checked={option === style}
                  onChange={() => setStyle(option)}
                />
                {modal.styles[option]}
              </label>
            ))}
          </fieldset>
        )}

        <form onSubmit={submit}>
          {asksForSize && (
            <>
              <fieldset className="merch-choice">
                <legend>{item.id === "tshirt" ? modal.shirtTypeLegend : modal.bodyTypeLegend}</legend>
                {bodyTypes.map(option => (
                  <label key={option} className="choice">
                    <input
                      type="radio"
                      name="body-type"
                      value={option}
                      checked={option === bodyType}
                      onChange={() => {
                        setBodyType(option);
                        // The size lists differ per body type, so a size picked
                        // for one is not valid for the next.
                        setSize("");
                      }}
                    />
                    {modal.bodyTypes[option]}
                  </label>
                ))}
              </fieldset>

              <label>
                {modal.sizeLabel}
                <select
                  name="size"
                  value={size}
                  required
                  onChange={event => setSize(event.target.value)}
                >
                  <option value="">{modal.sizePlaceholder}</option>
                  {sizeOptions[bodyType].map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <button className="size-guide-button" type="button" onClick={() => setGuideOpen(true)}>
                {modal.sizeGuideCta} ↗
              </button>

              <label>
                {modal.quantityLabel}
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={quantity}
                  onChange={event => setQuantity(event.target.value)}
                />
              </label>
            </>
          )}

          <label>
            {modal.participantLabel}
            <input name="participant" required />
          </label>
          <label>
            {modal.emailLabel}
            <input type="email" name="contact" required />
          </label>
          <label>
            {modal.detailsLabel}
            <textarea name="details" rows={3} />
          </label>
          <button className="merch-submit" type="submit">
            {modal.submit} <span aria-hidden="true">↗</span>
          </button>
        </form>
      </section>

      {guideOpen && <SizeGuide dict={dict} guides={guides} onClose={() => setGuideOpen(false)} />}
    </div>
  );
}

function SizeGuide({
  dict,
  guides,
  onClose,
}: {
  dict: Dictionary;
  guides: Record<BodyType, string>;
  onClose: () => void;
}) {
  const copy = dict.merchPage;
  const [tab, setTab] = useState<BodyType>("men");

  return (
    <div className="merch-modal size-modal">
      <div className="modal-backdrop" onClick={onClose} />
      <section
        className="size-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
      >
        <button
          className="modal-close"
          type="button"
          aria-label={copy.modal.close}
          onClick={onClose}
        >
          ×
        </button>
        <p className="section-number">{copy.sizeGuide.label}</p>
        <h2 id="size-guide-title">
          {copy.sizeGuide.headingTop}
          <br />
          <em>{copy.sizeGuide.headingEm}</em>
        </h2>
        <div className="size-tabs" role="tablist">
          {bodyTypes.map(option => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={option === tab}
              className={option === tab ? "is-selected" : undefined}
              onClick={() => setTab(option)}
            >
              {copy.modal.bodyTypes[option]}
            </button>
          ))}
        </div>
        <img
          className="size-guide-image"
          src={guides[tab]}
          alt={`${copy.sizeGuide.imageAlt} — ${copy.modal.bodyTypes[tab]}`}
          width={1400}
          height={700}
        />
      </section>
    </div>
  );
}
