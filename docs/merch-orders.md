# Merch orders → Google Sheets

An order placed in the shop dialog is written to that product's spreadsheet.
Nothing on the site holds the spreadsheets' address: the browser posts to
`/api/order` on our own Worker, and the Worker forwards it to an Apps Script web
app whose URL lives in a secret. A public address would let anyone fill the
sheets with junk.

If the write fails for any reason — the script is down, the visitor is offline,
the secret is missing — the dialog falls back to opening a pre-filled e-mail to
`volya@ukraine.ee`, exactly as it did before. An order is never lost silently.

## The pieces

| Where | What it does |
| --- | --- |
| `app/components/MerchShop.tsx` | Posts the order, shows sending / sent / failed, opens the mail fallback |
| `worker/index.ts` → `/api/order` | Validates the order, drops bot submissions, forwards it |
| `docs/orders-apps-script.gs` | Runs in Google, appends a row to the right sheet |

## Setting it up

1. Open any of the five spreadsheets → **Extensions → Apps Script**.
2. Replace `Code.gs` with [`orders-apps-script.gs`](orders-apps-script.gs), save.
3. **Deploy → New deployment → Web app**, with *Execute as: Me* and *Who has
   access: Anyone*. Authorise when Google asks. The script writes as you, so the
   spreadsheets need no sharing changes.
4. Copy the deployment URL and store it as the Worker's secret:

```bash
npx wrangler secret put ORDERS_WEBHOOK_URL --name volyaensemble-ee
```

5. Redeploy the site, or the Worker will not see the secret.

Until step 4 is done `/api/order` answers `503 unconfigured` and every order
arrives by e-mail instead — the site keeps working, it just does not fill the
sheets yet.

## Adding a product

Add the spreadsheet id to `SHEETS` in the Apps Script file, keyed by the same
id the catalogue uses, then **Deploy → Manage deployments → edit → Version:
New**. Editing the file alone changes nothing: the old version keeps serving.

## Columns

The script fills each column by reading the sheet's own header row, so the
columns may sit in any order and a sheet may leave some out. A heading it does
not recognise is left blank rather than guessed at — the recognised ones are
listed in `COLUMNS` at the top of the script, including both apostrophe
spellings of «Ім'я та прізвище».
