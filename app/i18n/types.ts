/**
 * Every translatable string on the site. Adding a key here makes TypeScript
 * flag the locale files that still need it, so a language cannot silently
 * fall behind.
 *
 * Proper nouns stay out: street addresses, "VOLYA", "VOLYA PRO", "SUM",
 * phone numbers and the registry code are identical in every language and
 * live in `app/i18n/contacts.ts`.
 */
export interface Dictionary {
  meta: {
    home: { title: string; description: string; ogDescription: string };
    schedule: { title: string; description: string };
    merch: { title: string; description: string };
  };
  nav: {
    /** Phone tab bar only — the desktop header has no "home" entry. */
    home: string;
    /** Accessible name for the phone tab bar. */
    mobileNav: string;
    about: string;
    schedule: string;
    gallery: string;
    contact: string;
    /** Footer and merch-page label; the homepage entry uses `hero.merchCta`. */
    merch: string;
    /** Header CTA and the aria-label on the logo. */
    join: string;
    brandHome: string;
    languageLabel: string;
    toggleTheme: string;
    themeDark: string;
    themeLight: string;
  };
  hero: {
    eyebrow: string;
    text: string;
    joinCta: string;
    /** Homepage merch entry — sits in the hero, not in the header. */
    merchCta: string;
    videoLabel: string;
    countValue: string;
    countCaption: string;
    unionText: string;
    unionLink: string;
    unionLogoAlt: string;
    photoAlt: string;
    foundedLabel: string;
    foundedYear: string;
    scribble: [string, string, string];
  };
  /** Repeated marquee words between the hero and the about section. */
  ticker: string[];
  about: {
    label: string;
    headingTop: string;
    headingEm: string;
    lead: string;
    muted: string;
    link: string;
    values: { number: string; title: string; text: string }[];
  };
  schedule: {
    label: string;
    headingTop: string;
    headingEm: string;
    text: string;
    /** Rendered bold at the end of `text`. */
    textStrong: string;
    cardTitle: string;
    cardLink: string;
    choreographyFrequency: string;
    vocalFrequency: string;
    classes: { day: string; time: string; kind: string; ages: string }[];
    fullScheduleCta: string;
    /** Oversized faded word behind the section. Decorative. */
    watermark: string;
  };
  team: {
    label: string;
    headingTop: string;
    headingEm: string;
    text: string;
    photoPlaceholder: string;
    photoCaption: string;
    /** Second heading in the section, above the teachers' photo. */
    teachersHeadingTop: string;
    teachersHeadingEm: string;
    /** One per teacher, in the same order as `teacherNames` in contacts.ts. */
    roles: [string, string, string, string];
  };
  place: {
    label: string;
    headingTop: string;
    headingEm: string;
    text: string;
    photoAlt: string;
    /** Address labels; the street lines themselves are proper nouns. */
    choreography: string;
    vocal: string;
    culturalCentre: string;
  };
  gallery: {
    label: string;
    headingTop: string;
    headingEm: string;
    link: string;
    /** `{n}` is replaced with the photo number. */
    photoAlt: string;
  };
  join: {
    label: string;
    headingTop: string;
    headingEm: string;
    text: string;
    cta: string;
    markCaption: string;
  };
  footer: {
    tagline: string;
    contactsTitle: string;
    navigationTitle: string;
    followTitle: string;
    telegram: string;
    email: string;
    organisation: string;
    legal: string;
    madeWith: string;
  };
  schedulePage: {
    back: string;
    label: string;
    headingTop: string;
    headingEm: string;
    text: string;
    legendDance: string;
    legendVocal: string;
    tableNote: string;
    dayColumn: string;
    days: [string, string, string, string, string, string];
    kinds: { dance: string; vocal: string; pro: string };
    detailChoreography: string;
    detailVocal: string;
    choreographyFrequency: string;
    vocalFrequency: string;
    cta: string;
  };
  merchPage: {
    back: string;
    label: string;
    headingTop: string;
    headingEm: string;
    text: string;
    /** Oversized faded word behind the intro. Decorative. */
    watermark: string;
    sizesLabel: string;
    oneSize: string;
    orderCta: string;
    orderSubject: string;
    orderBody: string;
    pickup: string;
    support: string;
    contactTitle: string;
    contactText: string;
    products: {
      tee: { name: string; blurb: string; alt: string };
      hoodie: { name: string; blurb: string; alt: string };
      tote: { name: string; blurb: string; alt: string };
      cap: { name: string; blurb: string; alt: string };
    };
  };
}
