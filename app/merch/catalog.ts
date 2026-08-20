/**
 * Language-neutral merch catalogue. Names and blurbs live in the dictionaries;
 * ids here must match `Dictionary.merchPage.products`. The id doubles as the
 * mockup modifier in `merch.css`, so a piece needs no second key.
 */

export const merchItems = [
  { id: "tee", sizes: ["XS", "S", "M", "L", "XL", "XXL"] },
  { id: "hoodie", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "tote", sizes: [] },
  { id: "cap", sizes: ["S/M", "L/XL"] },
] as const;

export type MerchItem = (typeof merchItems)[number];
export type MerchItemId = MerchItem["id"];

export function merchMailto(email: string, subject: string, body: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
