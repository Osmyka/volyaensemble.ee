# Merch orders and registrations → Google Sheets

An order placed in the shop dialog, or a form filled in on `/join`, is written
to its own spreadsheet.
Nothing on the site holds the spreadsheets' address: the browser posts to
`/api/order` on our own Worker, and the Worker forwards it to an Apps Script web
app whose URL lives in a secret.

A web app open to "Anyone" trusts whoever knows its URL, and a URL is not a
credential — it leaks through logs, screenshots and forwarded messages. So the
Worker also sends a shared token, and the script refuses any write without it.
That is what stops the sheets being filled with junk; the secrecy of the URL is
only the first fence.

The script can do exactly one thing: append a row to one of the five
spreadsheets whose ids are written into it. It cannot read them, cannot be
pointed at another spreadsheet, and returns nothing but `{ok: …}`. That matters,
because a web app runs with the owner's own Google permissions.

If the write fails for any reason — the script is down, the visitor is offline,
the secret is missing — the dialog falls back to opening a pre-filled e-mail to
`volya@ukraine.ee`, exactly as it did before. An order is never lost silently.

## The pieces

| Where | What it does |
| --- | --- |
| `app/components/MerchShop.tsx` | Posts an order, shows sending / sent / failed, opens the mail fallback |
| `app/components/JoinForm.tsx` | The same for a registration |
| `worker/index.ts` → `/api/order`, `/api/join` | Validates the submission, drops bot ones, forwards it |
| `docs/orders-apps-script.gs` | Runs in Google, appends a row to the right sheet |

## Setting it up

1. Open any of the five spreadsheets → **Extensions → Apps Script**.
2. Replace `Code.gs` with [`forms-apps-script.gs`](forms-apps-script.gs), save.
3. **Deploy → New deployment → Web app**, with *Execute as: Me* and *Who has
   access: Anyone*. Authorise when Google asks. The script writes as you, so the
   spreadsheets need no sharing changes.
4. In Apps Script: **Project Settings → Script Properties → Add**, with the
   property `ORDERS_TOKEN` and a long random string as its value. Generate one
   with `openssl rand -hex 24`.
5. Copy the deployment URL and store both halves as Worker secrets:

```bash
npx wrangler secret put ORDERS_WEBHOOK_URL --name volyaensemble-ee
```

```bash
npx wrangler secret put ORDERS_TOKEN --name volyaensemble-ee
```

6. Redeploy the site, or the Worker will not see the secrets.

Until both secrets are set `/api/order` answers `503 unconfigured` and every
order arrives by e-mail instead — the site keeps working, it just does not fill
the sheets yet. The same is true in reverse: if the script has no
`ORDERS_TOKEN` property, it refuses every write rather than accepting anonymous
ones.

## If the token ever leaks

Change the Script Property and the Worker secret to a new value, then redeploy
the script (Deploy → Manage deployments → edit → Version: New). Nothing else
needs touching, and orders fall back to e-mail in the gap between the two.

## Adding a product

Add the spreadsheet id to `SHEETS` in the Apps Script file, keyed by the same
id the catalogue uses, then **Deploy → Manage deployments → edit → Version:
New**. Editing the file alone changes nothing: the old version keeps serving.

## Columns per sheet

Verified against the live sheets:

| Product | Columns after the timestamp |
| --- | --- |
| tshirt | Варіант футболки · Тип футболки · Розмір · Кількість · Імʼя · Email · Деталі |
| hoodie | Варіант кофти або худі · Тип кофти · Розмірна категорія · Розмір · Кількість · Імʼя · Email · Деталі |
| backpack | Колір рюкзака · Імʼя · Email · Деталі |
| tote | Імʼя · Email · Деталі |
| cap | Колір · Розмір · Імʼя · Email · Деталі |
| join | Прізвище та Імʼя · Вік · Дата народження · Батьки · Телефон · Email · Напрям · Досвід хореографії · Досвід вокалу |

The form always sends everything it collected; a sheet simply takes the parts
it has columns for. Adding «Кількість» to the cap, backpack or tote sheet is
enough to start recording quantity there — no code change.

The registration sheet has no column for the closing question («яким би Ви
хотіли бачити цей колектив»). The form asks it and sends the answer, but it is
dropped on arrival until a column named «Побажання» exists.

## How columns are matched

The script fills each column by reading the sheet's own header row, so the
columns may sit in any order and a sheet may leave some out. A heading it does
not recognise is left blank rather than guessed at — the recognised ones are
listed in `COLUMNS` at the top of the script, including both apostrophe
spellings of «Ім'я та прізвище».

Headings too long or too decorated for that list — the registration sheet
spells its questions out in full, emoji included — are matched on a phrase
instead, in `PHRASES`. So «(для вокальної) 🎤 Чи займалися раніше вокалом?…»
is recognised by the word «вокал» alone and survives an edit to the wording.
