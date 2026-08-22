import { links, organisation, telHref } from "../i18n/contacts";
import { localePath, type Locale, type SitePage } from "../i18n/config";
import type { Dictionary } from "../i18n/types";
import { ActionLink } from "./ActionLink";
import { lines } from "./text";

/**
 * One footer for the whole site, in the same box as the header.
 *
 * Its navigation column mirrors the header's, so the entries and their targets
 * are worked out the same way: anchors on the home page, paths from a subpage.
 */
export function SiteFooter({
  locale,
  dict,
  page,
}: {
  locale: Locale;
  dict: Dictionary;
  page: SitePage;
}) {
  const home = localePath(locale, "/");
  const onHome = page === "/";
  const hash = (id: string) => (onHome ? `#${id}` : `${home}#${id}`);

  const nav = [
    { id: "about", label: dict.nav.about, href: hash("about") },
    {
      id: "schedule",
      label: dict.nav.schedule,
      href: onHome ? "#schedule" : localePath(locale, "/schedule"),
    },
    { id: "merch", label: dict.nav.merch, href: localePath(locale, "/merch") },
    { id: "gallery", label: dict.nav.gallery, href: hash("gallery") },
    { id: "contact", label: dict.nav.contact, href: hash("contact") },
  ];

  return (
    <footer className="footer wrap" id="contact">
      <div className="footer-brand">
        <a className="brand" href={onHome ? "#top" : home}>
          <img src="/logo-volya.webp" alt="VOLYA" width={960} height={386} loading="lazy" decoding="async" />
        </a>
        <p>{lines(dict.footer.tagline)}</p>
      </div>
      <div className="footer-contact">
        <small>{dict.footer.contactsTitle}</small>
        <div className="footer-actions">
          <ActionLink variant="chip" href={`mailto:${links.email}`}>{links.email}</ActionLink>
          {links.phones.map(phone => (
            <ActionLink variant="chip" href={telHref(phone)} key={phone}>{phone}</ActionLink>
          ))}
          <ActionLink variant="chip" href={links.telegram} external>{dict.footer.telegram}</ActionLink>
        </div>
      </div>
      <div>
        <small>{dict.footer.navigationTitle}</small>
        {nav.map(item => <a key={item.id} href={item.href}>{item.label}</a>)}
      </div>
      <div>
        <small>{dict.footer.followTitle}</small>
        <div className="footer-actions">
          <ActionLink variant="chip" href={links.instagram} external>Instagram</ActionLink>
          <ActionLink variant="chip" href={links.facebook} external>Facebook</ActionLink>
        </div>
      </div>
      {/* Copyright, the legal entity behind the ensemble, and the sign-off. */}
      <div className="footer-legal">
        {lines(dict.footer.legal)}
        <br /><br />
        {organisation.name}<br />{organisation.registryCode}
        <br /><br />
        {dict.footer.madeWith}
      </div>
    </footer>
  );
}
