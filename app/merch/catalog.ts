/**
 * Language-neutral merch catalogue. Names and blurbs live in the dictionaries;
 * ids here must match `Dictionary.merchPage.products`.
 */

export const merchItems = [
  { id: "tee", mock: "tee", sizes: ["XS", "S", "M", "L", "XL", "XXL"] },
  { id: "hoodie", mock: "hoodie", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "tote", mock: "tote", sizes: [] },
  { id: "cap", mock: "cap", sizes: ["S/M", "L/XL"] },
] as const;

export type MerchItemId = (typeof merchItems)[number]["id"];
export type MerchMock = (typeof merchItems)[number]["mock"];

export function merchMailto(email: string, subject: string, body: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
