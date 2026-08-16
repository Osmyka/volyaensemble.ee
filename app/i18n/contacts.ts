/**
 * Values that are the same in every language: external URLs, street addresses,
 * phone numbers and the registry code. Keeping them out of the dictionaries
 * means a typo can only ever happen once.
 */
export const links = {
  joinForm: "https://forms.gle/BfqdNshRtWhtw2QX9",
  video: "https://youtu.be/xZsTxucTU_I?si=1cc7ph9DHfeFINiU",
  union: "https://cym.ee",
  instagram: "https://www.instagram.com/volya_eesti?igsh=MTBkdTcwOWtmNzZjMQ==",
  facebook: "https://www.facebook.com/share/1Bu16UiqZp/?mibextid=wwXIfr",
  telegram: "https://t.me/volya_ee",
  email: "volya@ukraine.ee",
  phones: ["+372 5377 4435", "+372 5300 7761"],
} as const;

export const addresses = {
  choreography: { street: "Madara 14, Tallinn", map: "https://maps.google.com/?q=Madara+14+Tallinn" },
  vocal: { street: "Maneeži 3, Tallinn", map: "https://maps.google.com/?q=Maneezi+3+Tallinn" },
  culturalCentre: { street: "Salme tn 12, 10413 Tallinn", map: "https://maps.google.com/?q=Salme+tn+12+Tallinn" },
} as const;

/**
 * Names are spelled the same way in every language, so they live here rather
 * than in the dictionaries. Roles are translated — see `team.roles`.
 * Order matches `team.roles`.
 */
export const teacherNames = [
  "Anastasiia Kozachok",
  "Vitalina Musiienko",
  "Kateryna Chalova",
  "Kateryna Otchenashko",
] as const;

export const organisation = {
  name: "Ukraina Noorsoo Liit Eestis",
  registryCode: "80163437",
} as const;

/** `tel:` needs the digits without spaces. */
export const telHref = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;
