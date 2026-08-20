"use client";

import { Fragment } from "react";
import { addresses, links, organisation, teacherNames, telHref } from "../i18n/contacts";
import { localePath, type Locale } from "../i18n/config";
import type { Dictionary } from "../i18n/types";
import { BottomNav } from "../mobile/BottomNav";
import { ActionLink, LinkMark } from "./ActionLink";
import { JoinButton } from "./JoinButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { lines, withNumber } from "./text";
import { ThemeShell, ThemeToggle } from "../theme/theme";

export function HomePage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const schedulePath = localePath(locale, "/schedule");
  const merchPath = localePath(locale, "/merch");

  // Header and footer navigate to the same entries; one list keeps them
  // aligned. Merch is the one destination that is a page, not an anchor.
  const nav = [
    { label: dict.nav.about, href: "#about" },
    { label: dict.nav.schedule, href: "#schedule" },
    { label: dict.nav.merch, href: merchPath },
    { label: dict.nav.gallery, href: "#gallery" },
    { label: dict.nav.contact, href: "#contact" },
  ];

  return (
    <ThemeShell className="site">
      <nav className="nav wrap">
        <a className="brand" href="#top" aria-label={dict.nav.brandHome}><img src="/logo-volya.webp" alt="VOLYA" width={960} height={386} /></a>
        <div className="navlinks">
          {nav.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}
        </div>
        <div className="nav-tools">
          <ThemeToggle label={dict.nav.toggleTheme} lightLabel={dict.nav.themeLight} darkLabel={dict.nav.themeDark} />
          <LanguageSwitcher locale={locale} page="/" dict={dict} />
          <JoinButton className="nav-cta" label={dict.nav.join} />
        </div>
      </nav>

      <section className="hero wrap" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="dot" /> {dict.hero.eyebrow}</p>
          <img className="hero-brand" src="/logo-volya.webp" alt="VOLYA" width={960} height={386} />
          <p className="hero-text">{dict.hero.text}</p>
          <div className="hero-actions">
            <ActionLink variant="button" tone="navy" href={links.joinForm} external>{dict.hero.joinCta}</ActionLink>
            <ActionLink variant="play" href={links.video} external>{dict.hero.videoLabel}</ActionLink>
          </div>
          <div className="hero-note"><strong>{dict.hero.countValue}</strong><span>{lines(dict.hero.countCaption)}</span></div>
          <div className="union-note"><img src="/logo-sum.webp" alt={dict.hero.unionLogoAlt} width={220} height={347} /><div><b>{lines(dict.hero.unionText)}</b><ActionLink variant="text" href={links.union} external>{dict.hero.unionLink}</ActionLink></div></div>
        </div>
        <div className="hero-visual">
          <div className="hero-image" role="img" aria-label={dict.hero.photoAlt} />
          <div className="year">{dict.hero.foundedLabel}<br /><strong>{dict.hero.foundedYear}</strong></div>
          <div className="scribble">{dict.hero.scribble[0]}<br />{dict.hero.scribble[1]}<br /><b>{dict.hero.scribble[2]}</b> ✦</div>
        </div>
      </section>

      {/* Only the ✦ separators may be `span`s — `.ticker span` colours them
          yellow, so wrapping the words too would recolour the whole line. */}
      <section className="ticker"><div>{[...dict.ticker, ...dict.ticker.slice(0, 3)].map((word, index) => <Fragment key={index}>{index > 0 && <>{" "}<span>✦</span>{" "}</>}{word}</Fragment>)}</div></section>

      <section className="about wrap" id="about">
        <div className="section-label">{dict.about.label}</div>
        <div className="about-content"><h2>{dict.about.headingTop}<br /><em>{dict.about.headingEm}</em></h2><div className="about-body"><p>{dict.about.lead}</p><p className="muted">{dict.about.muted}</p><ActionLink variant="text" href="#contact">{dict.about.link}</ActionLink></div></div>
        <div className="values">{dict.about.values.map(value => <div key={value.number}><b>{value.number}</b><strong>{value.title}</strong><span>{value.text}</span></div>)}</div>
      </section>

      <section className="schedule wrap" id="schedule"><span className="schedule-watermark" aria-hidden="true">{dict.schedule.watermark}</span><div className="schedule-head"><div className="section-label">{dict.schedule.label}</div><h2>{dict.schedule.headingTop} <em>{dict.schedule.headingEm}</em></h2><p>{dict.schedule.text} <strong>{dict.schedule.textStrong}</strong></p></div><div className="schedule-card"><div className="card-top"><span>{dict.schedule.cardTitle}</span><ActionLink variant="text" href={schedulePath}>{dict.schedule.cardLink}</ActionLink></div><div className="card-description"><p><b>{dict.place.choreography}</b> — {dict.schedule.choreographyFrequency}</p><p><b>{dict.place.vocal}</b> — {dict.schedule.vocalFrequency}</p></div>{dict.schedule.classes.map(entry => <div className="class" key={entry.day}><div><small>{entry.day}</small><strong>{entry.time}</strong></div><span>{entry.kind} <b>{entry.ages}</b></span></div>)}<ActionLink variant="button" tone="light" href={schedulePath}>{dict.schedule.fullScheduleCta}</ActionLink></div></section>

      <section className="team wrap" id="team"><div className="team-head"><div><div className="section-label">{dict.team.label}</div><h2>{dict.team.headingTop}<br /><em>{dict.team.headingEm}</em></h2></div><p>{dict.team.text}</p></div><div className="team-photo-placeholder"><span>{dict.team.photoPlaceholder}</span><strong>{dict.team.photoCaption}</strong>{/* Sits below the photo; the stylesheet positions it. Real markup so the
          two lines can carry the same white/italic-serif pairing as the h2
          above, which a CSS `content` string could never do. */}
        <h2 className="teachers-heading">{dict.team.teachersHeadingTop}<br /><em>{dict.team.teachersHeadingEm}</em></h2></div><div className="teachers">{teacherNames.map((name, index) => <div key={name}><div className={`teacher-photo teacher-photo-${index + 1}`} /><b>{String(index + 1).padStart(2, "0")}</b><strong>{name}</strong><span>{dict.team.roles[index]}</span></div>)}</div></section>

      <section className="place wrap"><div className="place-photo"><img src="/place-volya.webp" alt={dict.place.photoAlt} width={1400} height={1400} loading="lazy" decoding="async" /></div><div className="place-copy"><div className="section-label">{dict.place.label}</div><h2>{dict.place.headingTop}<br /><em>{dict.place.headingEm}</em></h2><p>{dict.place.text}</p><div className="address"><span>⌖</span><div><a className="address-link" href={addresses.choreography.map} target="_blank" rel="noreferrer"><strong>{dict.place.choreography}</strong><br />{addresses.choreography.street} <LinkMark /></a><br /><br /><a className="address-link" href={addresses.vocal.map} target="_blank" rel="noreferrer"><strong>{dict.place.vocal}</strong><br />{addresses.vocal.street} <LinkMark /></a><br /><br /><a className="address-link" href={addresses.culturalCentre.map} target="_blank" rel="noreferrer"><strong>{dict.place.culturalCentre}</strong><br />{addresses.culturalCentre.street} <LinkMark /></a></div></div></div></section>

      <section className="gallery wrap" id="gallery"><div className="gallery-head"><div><div className="section-label">{dict.gallery.label}</div><h2>{dict.gallery.headingTop} <em>{dict.gallery.headingEm}</em></h2></div><ActionLink variant="text" href={links.instagram} external>{dict.gallery.link}</ActionLink></div><div className="gallery-grid">{Array.from({ length: 6 }, (_, index) => <div className={`g-${["one", "two", "three", "four", "five", "six"][index]}`} key={index}><img src={`/moments-${index + 1}.webp`} alt={withNumber(dict.gallery.photoAlt, index + 1)} width={1000} height={800} loading="lazy" decoding="async" /></div>)}</div></section>

      <section className="join" id="join"><div className="wrap join-inner"><div className="section-label">{dict.join.label}</div><h2>{dict.join.headingTop}<br /><em>{dict.join.headingEm}</em></h2><p>{dict.join.text}</p><ActionLink variant="button" tone="light" href={links.joinForm} external>{dict.join.cta}</ActionLink><div className="join-mark">VOLYA<br /><small>{lines(dict.join.markCaption)}</small></div></div></section>

      <footer className="footer wrap" id="contact">
        <div className="footer-brand">
          <a className="brand" href="#top"><img src="/logo-volya.webp" alt="VOLYA" width={960} height={386} loading="lazy" decoding="async" /></a>
          <p>{lines(dict.footer.tagline)}</p>
        </div>
        <div className="footer-contact">
          <small>{dict.footer.contactsTitle}</small>
          <div className="footer-actions">
            <ActionLink variant="chip" href={`mailto:${links.email}`}>{links.email}</ActionLink>
            {links.phones.map(phone => <ActionLink variant="chip" href={telHref(phone)} key={phone}>{phone}</ActionLink>)}
            <ActionLink variant="chip" href={links.telegram} external>{dict.footer.telegram}</ActionLink>
          </div>
          <p>{organisation.name}<br />{organisation.registryCode}</p>
        </div>
        <div>
          <small>{dict.footer.navigationTitle}</small>
          {nav.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}
        </div>
        <div>
          <small>{dict.footer.followTitle}</small>
          <div className="footer-actions">
            <ActionLink variant="chip" href={links.instagram} external>Instagram</ActionLink>
            <ActionLink variant="chip" href={links.facebook} external>Facebook</ActionLink>
            <ActionLink variant="chip" href={`mailto:${links.email}`}>{dict.footer.email}</ActionLink>
          </div>
        </div>
        <div className="footer-legal">{lines(dict.footer.legal)}<br /><br />{dict.footer.madeWith}</div>
      </footer>

      <BottomNav locale={locale} dict={dict} page="/" />
    </ThemeShell>
  );
}
