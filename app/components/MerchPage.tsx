import "./schedule.css";
import "./schedule-overrides.css";
import "./merch.css";
import { merchItems } from "../merch/catalog";
import { links } from "../i18n/contacts";
import { localePath, type Locale } from "../i18n/config";
import type { Dictionary } from "../i18n/types";
import { BottomNav } from "../mobile/BottomNav";
import { ActionLink } from "./ActionLink";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MerchCard } from "./MerchCard";

export function MerchPage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <main className="merch-page">
      <header className="schedule-nav">
        <a href={localePath(locale, "/")} className="back">← {dict.merchPage.back}</a>
        <img src="/logo-volya.webp" alt="VOLYA" width={960} height={386} />
        <div className="schedule-nav-actions">
          <LanguageSwitcher locale={locale} page="/merch" dict={dict} />
          <ActionLink className="schedule-join" variant="button" tone="gold" href={links.joinForm} external>
            {dict.nav.join}
          </ActionLink>
        </div>
      </header>

      <section className="merch-intro">
        <span className="merch-watermark" aria-hidden="true">{dict.merchPage.watermark}</span>
        <div className="section-label">{dict.merchPage.label}</div>
        <h1>{dict.merchPage.headingTop}<br /><em>{dict.merchPage.headingEm}</em></h1>
        <p>{dict.merchPage.text}</p>
      </section>

      <section className="merch-grid" aria-label={dict.nav.merch}>
        {merchItems.map(item => (
          <MerchCard key={item.id} item={item} dict={dict} />
        ))}
      </section>

      <section className="merch-contact">
        <div>
          <span>01</span>
          <h2>{dict.merchPage.contactTitle}</h2>
          <p>{dict.merchPage.contactText}</p>
        </div>
        <div>
          <span>02</span>
          <h2>{dict.merchPage.pickupTitle}</h2>
          <p>{dict.merchPage.pickup} {dict.merchPage.support}</p>
        </div>
        <div className="merch-contact-actions">
          <ActionLink variant="button" tone="navy" href={`mailto:${links.email}`}>{links.email}</ActionLink>
          <ActionLink variant="button" tone="gold" href={links.telegram} external>{dict.footer.telegram}</ActionLink>
        </div>
      </section>

      <BottomNav locale={locale} dict={dict} page="/merch" />
    </main>
  );
}
