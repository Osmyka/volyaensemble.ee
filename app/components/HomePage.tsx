"use client";

import { Fragment, useState } from "react";
import { addresses, links, organisation, telHref } from "../i18n/contacts";
import { localePath, type Locale } from "../i18n/config";
import type { Dictionary } from "../i18n/types";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { lines, withNumber } from "./text";

export function HomePage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const schedulePath = localePath(locale, "/schedule");

  // Header and footer navigate to the same anchors; one list keeps them aligned.
  const nav = [
    { label: dict.nav.about, href: "#about" },
    { label: dict.nav.schedule, href: "#schedule" },
    { label: dict.nav.gallery, href: "#gallery" },
    { label: dict.nav.contact, href: "#contact" },
  ];

  return (
    <main className={darkTheme ? "site dark-mode" : "site"}>
      <nav className="nav wrap">
        <a className="brand" href="#top" aria-label={dict.nav.brandHome}><img src="/logo-volya.webp" alt="VOLYA" width={960} height={386} /></a>
        <div className={`navlinks ${menuOpen ? "open" : ""}`}>
          {nav.map(item => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
          <LanguageSwitcher locale={locale} page="/" dict={dict} onNavigate={() => setMenuOpen(false)} />
        </div>
        <button className="theme-toggle" onClick={() => setDarkTheme(!darkTheme)} aria-label={dict.nav.toggleTheme}><span>{darkTheme ? "☼" : "☾"}</span><small>{darkTheme ? dict.nav.themeLight : dict.nav.themeDark}</small></button>
        <a className="nav-cta" href={links.joinForm} target="_blank" rel="noreferrer">{dict.nav.join} <b>↗</b></a>
        <button className="menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={dict.nav.openMenu}>☰</button>
      </nav>

      <section className="hero wrap" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="dot" /> {dict.hero.eyebrow}</p>
          <img className="hero-brand" src="/logo-volya.webp" alt="VOLYA" width={960} height={386} />
          <p className="hero-text">{dict.hero.text}</p>
          <div className="hero-actions"><a className="button dark" href={links.joinForm} target="_blank" rel="noreferrer">{dict.hero.joinCta} <span>↗</span></a><a className="play" href={links.video} target="_blank" rel="noreferrer"><span>▶</span> {dict.hero.videoLabel}</a></div>
          <div className="hero-note"><strong>{dict.hero.countValue}</strong><span>{lines(dict.hero.countCaption)}</span></div>
          <div className="union-note"><img src="/logo-sum.webp" alt={dict.hero.unionLogoAlt} width={220} height={347} /><div><b>{lines(dict.hero.unionText)}</b><a href={links.union} target="_blank" rel="noreferrer">{dict.hero.unionLink} <i>↗</i></a></div></div>
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
        <div className="about-content"><h2>{dict.about.headingTop}<br /><em>{dict.about.headingEm}</em></h2><div className="about-body"><p>{dict.about.lead}</p><p className="muted">{dict.about.muted}</p><a className="text-link" href="#contact">{dict.about.link} <span>↗</span></a></div></div>
        <div className="values">{dict.about.values.map(value => <div key={value.number}><b>{value.number}</b><strong>{value.title}</strong><span>{value.text}</span></div>)}</div>
      </section>

      <section className="schedule wrap" id="schedule"><div className="schedule-head"><div className="section-label">{dict.schedule.label}</div><h2>{dict.schedule.headingTop} <em>{dict.schedule.headingEm}</em></h2><p>{dict.schedule.text} <strong>{dict.schedule.textStrong}</strong></p></div><div className="schedule-card"><div className="card-top"><span>{dict.schedule.cardTitle}</span><a href={schedulePath}>{dict.schedule.cardLink} ↗</a></div><div className="card-description"><p><b>{dict.place.choreography}</b> — {dict.schedule.choreographyFrequency}</p><p><b>{dict.place.vocal}</b> — {dict.schedule.vocalFrequency}</p></div>{dict.schedule.classes.map(entry => <div className="class" key={entry.day}><div><small>{entry.day}</small><strong>{entry.time}</strong></div><span>{entry.kind} <b>{entry.ages}</b></span></div>)}<a className="button yellow" href={schedulePath}>{dict.schedule.fullScheduleCta} <span>↗</span></a></div></section>

      <section className="team wrap" id="team"><div className="team-head"><div><div className="section-label">{dict.team.label}</div><h2>{dict.team.headingTop}<br /><em>{dict.team.headingEm}</em></h2></div><p>{dict.team.text}</p></div><div className="team-photo-placeholder"><span>{dict.team.photoPlaceholder}</span><strong>{dict.team.photoCaption}</strong></div><div className="teachers">{dict.team.teachers.map((subject, index) => <div key={index}><div className={`teacher-photo teacher-photo-${index + 1}`} /><b>{String(index + 1).padStart(2, "0")}</b><strong>{dict.team.role}</strong><span>{subject}</span></div>)}</div></section>

      <section className="place wrap"><div className="place-photo"><img src="/place-volya.webp" alt={dict.place.photoAlt} width={1400} height={1400} loading="lazy" decoding="async" /></div><div className="place-copy"><div className="section-label">{dict.place.label}</div><h2>{dict.place.headingTop}<br /><em>{dict.place.headingEm}</em></h2><p>{dict.place.text}</p><div className="address"><span>⌖</span><div><a href={addresses.choreography.map} target="_blank" rel="noreferrer"><strong>{dict.place.choreography}</strong><br />{addresses.choreography.street} ↗</a><br /><br /><a href={addresses.vocal.map} target="_blank" rel="noreferrer"><strong>{dict.place.vocal}</strong><br />{addresses.vocal.street} ↗</a><br /><br /><a href={addresses.culturalCentre.map} target="_blank" rel="noreferrer"><strong>{dict.place.culturalCentre}</strong><br />{addresses.culturalCentre.street} ↗</a></div></div></div></section>

      <section className="gallery wrap" id="gallery"><div className="gallery-head"><div><div className="section-label">{dict.gallery.label}</div><h2>{dict.gallery.headingTop} <em>{dict.gallery.headingEm}</em></h2></div><a className="text-link" href={links.instagram} target="_blank" rel="noreferrer">{dict.gallery.link} <span>↗</span></a></div><div className="gallery-grid">{Array.from({ length: 6 }, (_, index) => <div className={`g-${["one", "two", "three", "four", "five", "six"][index]}`} key={index}><img src={`/moments-${index + 1}.webp`} alt={withNumber(dict.gallery.photoAlt, index + 1)} width={1000} height={800} loading="lazy" decoding="async" /></div>)}</div></section>

      <section className="join" id="join"><div className="wrap join-inner"><div className="section-label">{dict.join.label}</div><h2>{dict.join.headingTop}<br /><em>{dict.join.headingEm}</em></h2><p>{dict.join.text}</p><a className="button yellow" href={links.joinForm} target="_blank" rel="noreferrer">{dict.join.cta} <span>↗</span></a><div className="join-mark">VOLYA<br /><small>{lines(dict.join.markCaption)}</small></div></div></section>

      <footer className="footer wrap" id="contact"><div className="footer-brand"><a className="brand" href="#top"><img src="/logo-volya.webp" alt="VOLYA" width={960} height={386} loading="lazy" decoding="async" /></a><p>{lines(dict.footer.tagline)}</p></div><div className="footer-contact"><small>{dict.footer.contactsTitle}</small><a href={`mailto:${links.email}`}>{links.email} ↗</a>{links.phones.map(phone => <a key={phone} href={telHref(phone)}>{phone} ↗</a>)}<a href={links.telegram} target="_blank" rel="noreferrer">{dict.footer.telegram} ↗</a><p>{organisation.name}<br />{organisation.registryCode}</p></div><div><small>{dict.footer.navigationTitle}</small>{nav.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</div><div><small>{dict.footer.followTitle}</small><a href={links.instagram} target="_blank" rel="noreferrer">Instagram ↗</a><a href={links.facebook} target="_blank" rel="noreferrer">Facebook ↗</a><a href={`mailto:${links.email}`}>{dict.footer.email} ↗</a></div><div className="footer-legal">{lines(dict.footer.legal)}<br /><br />{dict.footer.madeWith}</div></footer>
    </main>
  );
}
