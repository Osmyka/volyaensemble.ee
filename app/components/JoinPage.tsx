import "./schedule.css";
import "./schedule-overrides.css";
import "./merch.css";
import "./join.css";
import type { Locale } from "../i18n/config";
import type { Dictionary } from "../i18n/types";
import { BottomNav } from "../mobile/BottomNav";
import { JoinForm } from "./JoinForm";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { ThemeShell } from "../theme/theme";

/**
 * Registration. The intro is the same block the schedule and merch subpages
 * open with; the form below it is the one client island on the page.
 */
export function JoinPage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const copy = dict.joinPage;

  return (
    <ThemeShell className="merch-page join-page">
      <SiteHeader locale={locale} dict={dict} page="/join" />

      <section className="merch-intro">
        <div className="section-label">{copy.label}</div>
        <h1>{copy.headingTop}<br /><em>{copy.headingEm}</em></h1>
        <p>{copy.text}</p>
      </section>

      <section className="join-section">
        <JoinForm locale={locale} dict={dict} />
      </section>

      <SiteFooter locale={locale} dict={dict} page="/join" />

      <BottomNav locale={locale} dict={dict} page="/join" />
    </ThemeShell>
  );
}
