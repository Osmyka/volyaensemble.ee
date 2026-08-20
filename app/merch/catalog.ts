/**
 * Language-neutral merch catalogue: ids, prices and photographs. Names,
 * descriptions and variant labels live in the dictionaries — ids here must
 * match `Dictionary.merchPage.products`.
 *
 * `sizing` decides which fields the order form shows:
 *   "shirt"  — body-type radios (men / women / kids) and a size list
 *   "none"   — no size fields at all
 * `sizeGuide` overrides the default size charts for a piece that has its own.
 */

/** The three body types the size charts are drawn for. */
export const bodyTypes = ["men", "women", "kids"] as const;
export type BodyType = (typeof bodyTypes)[number];

export const sizeOptions: Record<BodyType, readonly string[]> = {
  men: ["S", "M", "L", "XL", "XXL", "XXXL"],
  women: ["XS", "S", "M", "L", "XL"],
  kids: ["128", "134", "140", "146", "152", "158", "164", "170"],
};

/** The five pieces on offer. Ids double as the dictionary keys. */
export type MerchItemId = "tshirt" | "hoodie" | "backpack" | "tote" | "cap";

export interface MerchItem {
  id: MerchItemId;
  price: string;
  image: string;
  sizing: "shirt" | "none";
  variants?: readonly { id: string; image: string }[];
  styles?: readonly ("zip" | "plain")[];
  sizeGuide?: Record<BodyType, string>;
}

export const merchItems: readonly MerchItem[] = [
  {
    id: "tshirt",
    price: "€10",
    image: "/merch/tshirt-white.webp",
    sizing: "shirt",
    variants: [
      { id: "black", image: "/merch/tshirt-black.webp" },
      { id: "white", image: "/merch/tshirt-white.webp" },
      { id: "lilac", image: "/merch/tshirt-lilac.webp" },
    ],
  },
  {
    id: "hoodie",
    price: "€25",
    image: "/merch/hoodie-black-full.webp",
    sizing: "shirt",
    /* Zip or no zip is a hoodie-only question. */
    styles: ["zip", "plain"],
    sizeGuide: {
      men: "/merch/hoodie-men-zip.webp",
      women: "/merch/hoodie-women-zip.webp",
      kids: "/merch/hoodie-kids-zip.webp",
    },
    variants: [
      { id: "black", image: "/merch/hoodie-black-full.webp" },
      { id: "blue", image: "/merch/hoodie-blue.webp" },
    ],
  },
  {
    id: "backpack",
    price: "€20",
    image: "/merch/backpack-volya.webp",
    sizing: "none",
    variants: [
      { id: "blue", image: "/merch/backpack-volya.webp" },
      { id: "black", image: "/merch/backpack-black.webp" },
    ],
  },
  { id: "tote", price: "€15", image: "/merch/tote-volya.webp", sizing: "none" },
  { id: "cap", price: "€15", image: "/merch/cap-volya.webp", sizing: "none" },
];

export const sizeGuides: Record<BodyType, string> = {
  men: "/merch/size-men.webp",
  women: "/merch/size-women.webp",
  kids: "/merch/size-kids.webp",
};

export function merchMailto(email: string, subject: string, body: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
