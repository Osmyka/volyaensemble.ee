import "./schedule.css";
import "./schedule-overrides.css";
import "./merch.css";
import { merchMailto } from "../merch/catalog";
import { links } from "../i18n/contacts";
import type { Locale } from "../i18n/config";
import type { Dictionary } from "../i18n/types";
import { BottomNav } from "../mobile/BottomNav";
import { ActionLink } from "./ActionLink";
import { MerchShop } from "./MerchShop";
import { SiteHeader } from "./SiteHeader";
import { ThemeShell } from "../theme/theme";

/**
 * The shop page, laid out like the schedule subpage: the same intro block, the
 * same card treatment on the grid below it, then the ordering band.
 */
export function MerchPage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const copy = dict.merchPage;

  return (
    <ThemeShell className="merch-page">
      <SiteHeader locale={locale} dict={dict} page="/merch" />

      {/* Same shape as the schedule subpage: label, heading, one line of copy. */}
      <section className="merch-intro">
        <div className="section-label">{copy.label}</div>
        <h1>{copy.headingTop}<br /><em>{copy.headingEm}</em></h1>
        <p>{copy.text}</p>
      </section>

      <section className="products-section" id="products" aria-label={dict.nav.merch}>
        <h2>{copy.collectionTitle}</h2>
        <MerchShop locale={locale} dict={dict} />
      </section>

      <section className="order-note">
        <div>
          <p className="section-number">{copy.orderLabel}</p>
          <h2>{copy.orderTitle}</h2>
        </div>
        <div className="order-copy">
          <p>{copy.orderText}</p>
          <div className="order-actions">
            <ActionLink variant="button" tone="gold" href={merchMailto(links.email, copy.mail.subject, "")}>
              {copy.orderCta}
            </ActionLink>
            <ActionLink variant="button" tone="navy" href={links.telegram} external>
              {dict.footer.telegram}
            </ActionLink>
          </div>
        </div>
      </section>

      <BottomNav locale={locale} dict={dict} page="/merch" />
    </ThemeShell>
  );
}
