import assert from "node:assert/strict";
import test from "node:test";

/**
 * Smoke tests against the built worker. These guard the things that have
 * actually broken on this site before: a route going missing, a locale
 * serving the wrong `lang`, and untranslated Ukrainian leaking into the
 * Estonian or English pages.
 */

const routes = [
  { path: "/", lang: "uk", title: "VOLYA — український ансамбль в Естонії", home: "/" },
  { path: "/et", lang: "et", title: "VOLYA — ukraina ansambel Eestis", home: "/et" },
  { path: "/en", lang: "en", title: "VOLYA — Ukrainian ensemble in Estonia", home: "/en" },
  { path: "/schedule", lang: "uk", title: "Розклад занять — VOLYA", home: "/" },
  { path: "/et/schedule", lang: "et", title: "Tundide ajakava — VOLYA", home: "/et" },
  { path: "/en/schedule", lang: "en", title: "Class schedule — VOLYA", home: "/en" },
];

const cyrillic = /[Ѐ-ӿ]/;

async function render(path) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

/** Visible text only — scripts carry the RSC payload, which repeats every locale. */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<[^>]+>/g, " ");
}

for (const route of routes) {
  test(`${route.path} renders in ${route.lang}`, async () => {
    const response = await render(route.path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

    const html = await response.text();
    assert.match(html, new RegExp(`<html lang="${route.lang}"`));
    assert.ok(html.includes(`<title>${route.title}</title>`), `wrong <title> on ${route.path}`);

    // Every locale must advertise the other two as translations.
    for (const tag of ["uk", "et", "en", "x-default"]) {
      assert.match(html, new RegExp(`hrefLang="${tag}"`, "i"), `missing hreflang ${tag}`);
    }
  });
}

test("non-Ukrainian locales contain no untranslated copy", async () => {
  for (const route of routes.filter(entry => entry.lang !== "uk")) {
    const html = await (await render(route.path)).text();
    assert.doesNotMatch(visibleText(html), cyrillic, `Cyrillic text left on ${route.path}`);
  }
});

test("schedule pages link back to their own locale's home", async () => {
  for (const route of routes.filter(entry => entry.path.endsWith("/schedule"))) {
    const html = await (await render(route.path)).text();
    assert.match(
      html,
      new RegExp(`<a href="${route.home}" class="back"`),
      `wrong back link on ${route.path}`,
    );
  }
});

test("the language switcher offers every locale", async () => {
  const html = await (await render("/")).text();
  for (const href of ["/", "/et", "/en"]) {
    assert.match(html, new RegExp(`href="${href}" hrefLang=`, "i"), `switcher missing ${href}`);
  }
});
