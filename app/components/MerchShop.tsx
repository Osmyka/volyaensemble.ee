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
import type { Locale } from "../i18n/config";
import type { Dictionary } from "../i18n/types";
import { LinkMark } from "./ActionLink";

/**
 * The shop: a grid of pieces, the order dialog behind each one, and the size
 * chart the dialog can open. All of it is one client island so the page around
 * it — hero, copy, chrome — stays a server component.
 *
 * There is no shop back end. The dialog collects what the ensemble needs to
 * know and hands it to the visitor's mail client, exactly as the prototype did.
 */
export function MerchShop({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const copy = dict.merchPage;
  const [openId, setOpenId] = useState<MerchItem["id"] | null>(null);
  const item = merchItems.find(entry => entry.id === openId) ?? null;

  return (
    <>
      <div className="product-grid">
        {merchItems.map(entry => {
          const product = copy.products[entry.id];
          return (
            <article key={entry.id} className="product-card">
              {/* The whole card is the target, but only the heading carries the
                  button — a nested one would double every tab stop. */}
              <div className="product-image">
                <img src={entry.image} alt={product.alt} loading="lazy" width={800} height={800} />
              </div>
              <div className="product-meta">
                <h3>
                  <button type="button" onClick={() => setOpenId(entry.id)}>
                    {product.name}
                  </button>
                </h3>
                <p>{product.description}</p>
                <p className="product-price">
                  <strong className="price">{entry.price}</strong>
                  <span className="order-hint">{copy.modal.headingTop}<LinkMark /></span>
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {item && (
        <OrderDialog item={item} locale={locale} dict={dict} onClose={() => setOpenId(null)} />
      )}
    </>
  );
}

function OrderDialog({
  item,
  locale,
  dict,
  onClose,
}: {
  item: MerchItem;
  locale: Locale;
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
  const namedSizes = item.sizeChoices;

  const [variant, setVariant] = useState<string>(variants?.[0]?.id ?? "");
  const [style, setStyle] = useState<string>(styles?.[0] ?? "");
  const [bodyType, setBodyType] = useState<BodyType>("men");
  const [size, setSize] = useState("");
  const [namedSize, setNamedSize] = useState<string>(namedSizes?.[0] ?? "");
  const [quantity, setQuantity] = useState("1");
  const [guideOpen, setGuideOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");

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

  /**
   * The order goes to the spreadsheet through our own endpoint. If that fails —
   * the sheet is unreachable, the visitor is offline — the mail client opens
   * with the same order in it, so nothing is lost on the way.
   */
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const order = {
      product: item.id,
      productName: `${product.name} — ${item.price}`,
      variant: variantLabel,
      bodyType: asksForSize ? modal.bodyTypes[bodyType] : "",
      style: style ? modal.styles[style as "zip" | "plain"] : "",
      size: asksForSize
        ? size
        : namedSize
          ? product.sizeChoices?.[namedSize]?.name ?? namedSize
          : "",
      quantity: asksForSize || namedSize ? quantity : "",
      participant: String(data.get("participant") ?? ""),
      contact: String(data.get("contact") ?? ""),
      details: String(data.get("details") ?? ""),
      locale,
      website: String(data.get("website") ?? ""),
    };

    setStatus("sending");
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(order),
      });
      if (!response.ok) throw new Error(String(response.status));
      const result = (await response.json()) as { ok?: boolean };
      if (!result.ok) throw new Error("rejected");
      setStatus("sent");
      return;
    } catch {
      setStatus("failed");
      openMail(order);
    }
  };

  /** The order as an e-mail, used when the endpoint could not take it. */
  const openMail = (order: Record<string, string>) => {
    const lines = [
      `${copy.mail.product}: ${order.productName}`,
      order.variant && `${copy.mail.colour}: ${order.variant}`,
      order.style && `${copy.mail.style}: ${order.style}`,
      `${copy.mail.participant}: ${orNotSpecified(order.participant)}`,
      order.bodyType && `${copy.mail.bodyType}: ${order.bodyType}`,
      order.size && `${copy.mail.size}: ${order.size}`,
      order.quantity && `${copy.mail.quantity}: ${order.quantity}`,
      `${copy.mail.contact}: ${order.contact}`,
      `${copy.mail.details}: ${orNotSpecified(order.details)}`,
    ].filter(Boolean);

    window.location.href = merchMailto(links.email, copy.mail.subject, lines.join("\n"));
  };

  return (
    <div className="merch-modal">
      {/* A real button, so the backdrop closes on Enter and Space too. */}
      <button
        className="modal-backdrop"
        type="button"
        aria-label={modal.close}
        onClick={onClose}
      />
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
                {modal.sizeGuideCta}
              </button>

            </>
          )}

          {namedSizes && (
            <fieldset className="merch-choice merch-choice--stacked">
              <legend>{modal.sizeLabel}</legend>
              {namedSizes.map(option => (
                <label key={option} className="choice choice--detailed">
                  <input
                    type="radio"
                    name="named-size"
                    value={option}
                    checked={option === namedSize}
                    onChange={() => setNamedSize(option)}
                  />
                  <strong>{product.sizeChoices?.[option]?.name}</strong>
                  <small>{product.sizeChoices?.[option]?.note}</small>
                </label>
              ))}
            </fieldset>
          )}

          {(asksForSize || namedSizes) && (
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

          {/* Off-screen and unlabelled: a person never fills this in. */}
          <input className="merch-trap" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <button className="merch-submit" type="submit" disabled={status === "sending" || status === "sent"}>
            {status === "sending" ? modal.sending : status === "sent" ? modal.sent : modal.submit}
            {status === "sent" ? null : <LinkMark />}
          </button>
          {status === "sent" && <p className="merch-status">{modal.sentNote}</p>}
          {status === "failed" && <p className="merch-status merch-status--failed">{modal.failed}</p>}
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
      <button
        className="modal-backdrop"
        type="button"
        aria-label={copy.modal.close}
        onClick={onClose}
      />
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
