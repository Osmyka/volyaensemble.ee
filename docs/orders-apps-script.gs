/**
 * VOLYA merch orders → Google Sheets.
 *
 * One script serves every product: it looks the spreadsheet up by product id,
 * reads that sheet's own header row, and fills each column by its title. So a
 * sheet can have its columns in any order, and adding or removing one needs no
 * change here — only a header the list below knows about.
 *
 * A web app deployed for "Anyone" is reachable by anyone who learns its URL,
 * so a shared token is required on every write: the address alone is not a
 * credential. The token lives in Script Properties, never in this file.
 *
 * ── Setting it up ────────────────────────────────────────────────────────────
 * 1. Open any of the five spreadsheets → Extensions → Apps Script.
 * 2. Replace the contents of Code.gs with this file and Save.
 * 3. Project Settings (the gear) → Script Properties → Add script property:
 *      Property: ORDERS_TOKEN
 *      Value:    a long random string, the same one the Worker will hold
 * 4. Deploy → New deployment → type "Web app".
 *      Execute as:      Me
 *      Who has access:  Anyone
 *    Authorise when Google asks — the script writes as you, which is why the
 *    spreadsheets need no sharing changes. The only permission it should ask
 *    for is access to spreadsheets.
 * 5. Copy the deployment URL (https://script.google.com/macros/s/…/exec) and
 *    hand it to the site: it goes into the Worker secret ORDERS_WEBHOOK_URL,
 *    never into the browser.
 * 6. Re-deploy (Deploy → Manage deployments → edit → Version: New) after any
 *    change to this file, or the old version keeps running.
 */

/** Product id from the site → the spreadsheet that collects it. */
var SHEETS = {
  tshirt: "1nL7QBtGeY2pHM1kqn5l3X9pT8nyLPusfxv2Pt6rcAgg",
  hoodie: "1BeDSPPwH_XDEApa_pj1QU7LCnwrf8NLWyaXL_wuyoSg",
  backpack: "1FtOkMj_ZGyKVTsPI0vDaYKX7euqzNwxD-quDADkCiXk",
  tote: "1n2-2oW1K1pg5niaN8cG0HFzqN8styn_IzoQsXto_9UA",
  cap: "1Yz963bPj7wA7Zj8G6SBpT4_JiTgTVWeaqnKRjlXSmqM",
};

/**
 * Column heading → the field that fills it. Headings are matched loosely:
 * lower-cased, with line breaks and punctuation stripped. A heading missing
 * from this list is left blank rather than guessed at.
 */
var COLUMNS = {
  "дата і час заповнення": "timestamp",
  "дата": "timestamp",
  "товар": "product",
  "варіант футболки": "variant",
  "варіант кофти або худі": "variant",
  "варіант": "variant",
  "колір": "variant",
  "колір рюкзака": "variant",
  "колір кепки": "variant",
  "тип футболки": "bodyType",
  "розмірна категорія": "bodyType",
  "тип кофти": "style",
  "розмір": "size",
  "кількість": "quantity",
  "імʼя та прізвище учасника колективу": "participant",
  "ім'я та прізвище учасника колективу": "participant",
  "імʼя та прізвище": "participant",
  "учасник": "participant",
  "email": "contact",
  "пошта": "contact",
  "контакт": "contact",
  "деталі замовлення": "details",
  "деталі": "details",
  "мова": "locale",
};

function normalise(heading) {
  return String(heading)
    .replace(/\s+/g, " ")
    .replace(/[.:]+$/, "")
    .trim()
    .toLowerCase();
}

function doPost(request) {
  try {
    var order = JSON.parse(request.postData.contents);

    // Without a matching token the request is a stranger who found the URL.
    var expected = PropertiesService.getScriptProperties().getProperty("ORDERS_TOKEN");
    if (!expected) return reply({ ok: false, error: "no token configured" });
    if (order.token !== expected) return reply({ ok: false, error: "forbidden" });

    var id = SHEETS[order.product];
    if (!id) return reply({ ok: false, error: "unknown product" });

    var sheet = SpreadsheetApp.openById(id).getSheets()[0];
    var headings = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];

    var values = {
      timestamp: Utilities.formatDate(new Date(), "Europe/Tallinn", "dd.MM.yyyy HH:mm"),
      product: order.productName || order.product || "",
      variant: order.variant || "",
      bodyType: order.bodyType || "",
      style: order.style || "",
      size: order.size || "",
      quantity: order.quantity || "",
      participant: order.participant || "",
      contact: order.contact || "",
      details: order.details || "",
      locale: order.locale || "",
    };

    var row = headings.map(function (heading) {
      var field = COLUMNS[normalise(heading)];
      return field ? values[field] : "";
    });

    sheet.appendRow(row);
    return reply({ ok: true });
  } catch (error) {
    return reply({ ok: false, error: String(error) });
  }
}

/** A GET is handy for checking the deployment is live. */
function doGet() {
  return reply({ ok: true, service: "volya-merch-orders" });
}

function reply(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
