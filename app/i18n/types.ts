/**
 * Every translatable string on the site. Adding a key here makes TypeScript
 * flag the locale files that still need it, so a language cannot silently
 * fall behind.
 *
 * Proper nouns stay out: street addresses, "VOLYA", "VOLYA PRO", "SUM",
 * phone numbers and the registry code are identical in every language and
 * live in `app/i18n/contacts.ts`.
 */
/**
 * One merch piece. `orderNoun` completes "Order …" in the dialog title;
 * `variantTitle` names the colour picker for pieces that have one.
 */
export interface MerchProduct {
  name: string;
  description: string;
  alt: string;
  orderNoun: string;
  variantTitle?: string;
  variants?: Record<string, string>;
  /** Named sizes: a label, and the line of detail under it. */
  sizeChoices?: Record<string, { name: string; note: string }>;
}

export interface Dictionary {
  meta: {
    home: { title: string; description: string; ogDescription: string };
    schedule: { title: string; description: string };
    merch: { title: string; description: string };
    join: { title: string; description: string };
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
    /** Header, footer and the phone tab bar. */
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
    organisation: string;
    legal: string;
    madeWith: string;
  };
  schedulePage: {
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
  /**
   * The registration form. `sectionNote` lines only appear once the matching
   * section is chosen, and `parentNote` only for a participant under 18.
   */
  joinPage: {
    label: string;
    headingTop: string;
    headingEm: string;
    text: string;
    nameLabel: string;
    nameHint: string;
    ageLabel: string;
    birthLabel: string;
    parentLabel: string;
    parentNote: string;
    phoneLabel: string;
    phoneHint: string;
    emailLabel: string;
    sectionLabel: string;
    sections: { dance: string; vocal: string; both: string };
    danceLabel: string;
    vocalLabel: string;
    experienceHint: string;
    wishesTitle: string;
    wishesText: string;
    wishesLabel: string;
    thanks: string;
    submit: string;
    sending: string;
    sent: string;
    sentNote: string;
    failed: string;
    /** Column labels for the registration e-mail used when the write fails. */
    mail: {
      subject: string;
      name: string;
      age: string;
      birth: string;
      parent: string;
      phone: string;
      email: string;
      section: string;
      dance: string;
      vocal: string;
      wishes: string;
      notSpecified: string;
    };
  };
  merchPage: {
    label: string;
    headingTop: string;
    headingEm: string;
    text: string;
    collectionTitle: string;
    orderTitle: string;
    orderText: string;
    orderCta: string;
    /** The order dialog, opened by picking a piece from the grid. */
    modal: {
      label: string;
      headingTop: string;
      close: string;
      selectedProduct: string;
      bodyTypeLegend: string;
      /** T-shirts ask for a cut, everything else for a size category. */
      shirtTypeLegend: string;
      bodyTypes: { men: string; women: string; kids: string };
      styleLegend: string;
      styles: { zip: string; plain: string };
      sizeLabel: string;
      sizePlaceholder: string;
      sizeGuideCta: string;
      quantityLabel: string;
      participantLabel: string;
      emailLabel: string;
      detailsLabel: string;
      submit: string;
      /** The order form's states: in flight, accepted, and fallen back to mail. */
      sending: string;
      sent: string;
      sentNote: string;
      failed: string;
    };
    sizeGuide: {
      label: string;
      headingTop: string;
      headingEm: string;
      imageAlt: string;
    };
    /** Labels for the order e-mail. `{token}` values are filled from the form. */
    mail: {
      subject: string;
      product: string;
      colour: string;
      style: string;
      participant: string;
      bodyType: string;
      size: string;
      quantity: string;
      contact: string;
      details: string;
      notSpecified: string;
    };
    products: {
      tshirt: MerchProduct & { variants: { black: string; white: string; lilac: string } };
      hoodie: MerchProduct & { variants: { black: string; blue: string } };
      backpack: MerchProduct & { variants: { blue: string; black: string } };
      tote: MerchProduct;
      cap: MerchProduct & {
        variants: { black: string; white: string };
        sizeChoices: { kids: { name: string; note: string }; adult: { name: string; note: string } };
      };
    };
  };
}
