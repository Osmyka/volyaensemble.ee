# Translations

All visible text lives here. No copy is hard-coded in components, and none is
hidden in CSS `content` any more.

## Files

| File | Purpose |
| --- | --- |
| `types.ts` | The `Dictionary` shape — every translatable key |
| `uk.ts` | Ukrainian, the source language |
| `et.ts` | Estonian — **draft, needs a native proofread** |
| `en.ts` | English |
| `contacts.ts` | Language-neutral data: URLs, addresses, phones, registry code |
| `config.ts` | Locale list, default locale, URL helpers |

## URLs

Ukrainian owns the bare paths; the others are prefixed.

| Locale | Home | Schedule |
| --- | --- | --- |
| uk | `/` | `/schedule` |
| et | `/et` | `/et/schedule` |
| en | `/en` | `/en/schedule` |

Each page emits `hreflang` links for all three plus `x-default` pointing at
Ukrainian, so search engines treat them as translations rather than duplicates.

## Editing copy

Change the string in the relevant locale file — that is the whole task. Two
conventions:

- `\n` marks a deliberate line break and renders as `<br>`. Keep the breaks
  where the design needs them; they are not paragraph separators.
- `{n}` in `gallery.photoAlt` is replaced with the photo number.

## Adding a key

Add it to `types.ts` first. TypeScript then fails the build for every locale
file that lacks it, so no language can silently fall behind.

## Adding a language

1. Add the code to `locales` in `config.ts` and give it a name in
   `localeNames` and a tag in `localeTags`.
2. Copy `uk.ts` to `<code>.ts` and translate it.
3. Register it in `index.ts`.
4. Create `app/(<code>)/layout.tsx` plus `app/(<code>)/<code>/page.tsx` and
   `app/(<code>)/<code>/schedule/page.tsx`, mirroring the `(et)` group.

Each locale needs its own route group because the group's layout is what sets
`<html lang>`.

## Known gap

`et.ts` was drafted by translating `uk.ts` and has not been reviewed by a
native speaker. It is marketing copy aimed at an Estonian audience, so tone and
case endings matter — get it proofread before promoting the Estonian version.
