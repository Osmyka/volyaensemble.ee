import "./schedule.css";
import "./schedule-overrides.css";
import "./merch.css";
import { merchMailto } from "../merch/catalog";
import { links } from "../i18n/contacts";
import { localePath, type Locale } from "../i18n/config";
import type { Dictionary } from "../i18n/types";
import { BottomNav } from "../mobile/BottomNav";
import { ActionLink } from "./ActionLink";
import { JoinButton } from "./JoinButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MerchShop } from "./MerchShop";
import { ThemeShell, ThemeToggle } from "../theme/theme";

/**
 * The shop page. Chrome matches the schedule subpage — back link, logo,
 * language switcher — and the sections below follow the merch prototype:
 * a gold hero, the collection grid, then the ordering note.
 */
export function MerchPage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const copy = dict.merchPage;

  return (
    <ThemeShell className="merch-page">
      <header className="schedule-nav">
        <a href={localePath(locale, "/")} className="back">← {copy.back}</a>
        <img src="/logo-volya.webp" alt="VOLYA" width={960} height={386} />
        <div className="schedule-nav-actions">
          <ThemeToggle label={dict.nav.toggleTheme} lightLabel={dict.nav.themeLight} darkLabel={dict.nav.themeDark} />
          <LanguageSwitcher locale={locale} page="/merch" dict={dict} />
          <JoinButton className="schedule-join" label={dict.nav.join} />
        </div>
      </header>

      <section className="shop-hero">
        <span className="shop-hero-mark" aria-hidden="true">✦</span>
        <p className="eyebrow"><span>{copy.eyebrow}</span><i /><span>{copy.eyebrowPlace}</span></p>
        <h1>{copy.headingTop}<br /><em>{copy.headingEm}</em></h1>
        <p className="shop-hero-text">{copy.text}</p>
        <a className="scroll-cue" href="#products"><span aria-hidden="true">↓</span> {copy.scrollCue}</a>
      </section>

      <section className="products-section" id="products" aria-label={dict.nav.merch}>
        <div className="section-intro">
          <p className="section-number">{copy.collectionLabel}</p>
          <h2>{copy.collectionTitle}</h2>
          <p>{copy.collectionText}</p>
        </div>
        <MerchShop dict={dict} />
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
