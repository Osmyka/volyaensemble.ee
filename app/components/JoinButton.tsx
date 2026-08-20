import { links } from "../i18n/contacts";
import { JoinIcon } from "../mobile/icons";
import { LinkMark } from "./ActionLink";

/**
 * The one call to action in the header, the same on every page.
 *
 * On a desktop it reads as the site's gold button. On a phone the header has
 * no room for a label beside the logo and the language switcher, so it
 * collapses to a gold disc carrying the sunflower — the mark it used to have
 * in the tab bar, which now holds five destinations and no action.
 *
 * Both forms are in the markup and chosen in CSS, so one cached document still
 * serves every device.
 */
export function JoinButton({ label, className }: { label: string; className?: string }) {
  return (
    <a
      className={["action-link", "action-link--button", "action-link--gold", "join-cta", className]
        .filter(Boolean)
        .join(" ")}
      href={links.joinForm}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
    >
      <span className="join-cta-mark" aria-hidden="true"><JoinIcon /></span>
      <span className="action-link-label">{label}</span>
      <LinkMark />
    </a>
  );
}
