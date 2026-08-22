import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
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
  { path: "/merch", lang: "uk", title: "Наш мерч — VOLYA", home: "/" },
  { path: "/et/merch", lang: "et", title: "Meie merch — VOLYA", home: "/et" },
  { path: "/en/merch", lang: "en", title: "Our merch — VOLYA", home: "/en" },
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

// The logo is the way back: subpages carry no separate "back" link.
test("subpages link back to their own locale's home", async () => {
  for (const route of routes.filter(entry => /\/(schedule|merch)$/.test(entry.path))) {
    const html = await (await render(route.path)).text();
    assert.match(
      html,
      new RegExp(`<a class="brand" href="${route.home}"`),
      `wrong logo link on ${route.path}`,
    );
  }
});

test("every page carries the same header navigation", async () => {
  for (const route of routes) {
    const html = await (await render(route.path)).text();
    const nav = html.match(/<div class="navlinks">[\s\S]*?<\/div>/);
    assert.ok(nav, `no header navigation on ${route.path}`);
    assert.equal(
      (nav[0].match(/<a /g) ?? []).length,
      5,
      `expected five header entries on ${route.path}`,
    );
    // Section entries must carry the path when the page has no such section.
    if (route.path !== route.home) {
      const gallery = route.home === "/" ? "/#gallery" : `${route.home}#gallery`;
      assert.match(nav[0], new RegExp(`href="${gallery}"`), `bare hash on ${route.path}`);
    }
  }
});

/**
 * The tab bar ships in every document and is revealed by a media query, so one
 * cached page can serve phones and desktops alike. If it ever became
 * conditional on the user agent, these would fail.
 */
test("the tab bar is server-rendered for every locale", async () => {
  for (const route of routes) {
    const html = await (await render(route.path)).text();
    assert.match(html, /<nav class="tabbar"/, `no tab bar on ${route.path}`);
    assert.equal(
      (html.match(/class="tab(?:[ "])/g) ?? []).length,
      5,
      `expected five tabs on ${route.path}`,
    );
  }
});

test("tab bar links stay inside the visitor's locale", async () => {
  // On the home page the section tabs scroll; elsewhere they must carry a path,
  // because the schedule and merch pages have no #gallery to scroll to.
  const home = await (await render("/et")).text();
  assert.match(home, /href="#gallery"/);
  assert.match(home, /href="#contact"/);
  assert.match(home, /href="\/et\/schedule"/);

  const schedule = await (await render("/et/schedule")).text();
  assert.match(schedule, /href="\/et#gallery"/, "gallery tab lost its locale path");
  assert.match(schedule, /href="\/et#contact"/, "contact tab lost its locale path");
});

test("the viewport opts into safe-area insets", async () => {
  const html = await (await render("/")).text();
  // Without viewport-fit=cover, env(safe-area-inset-*) reports 0 on iPhones and
  // the bar would sit under the home indicator.
  assert.match(html, /viewport-fit=cover/);
  assert.match(html, /<meta name="theme-color" content="#203754"/);
});

/**
 * Copy baked into a stylesheet is invisible to the HTML checks above and no
 * translation can reach it, which is exactly how Ukrainian teacher names and
 * headings ended up on the English page. Text belongs in the dictionaries.
 */
test("no stylesheet injects translatable copy via `content`", async () => {
  const appDir = new URL("../app/", import.meta.url);
  const stylesheets = [];

  const collect = async dir => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const child = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, dir);
      if (entry.isDirectory()) await collect(child);
      else if (entry.name.endsWith(".css")) stylesheets.push(child);
    }
  };
  await collect(appDir);
  assert.ok(stylesheets.length > 0, "found no stylesheets to check");

  for (const sheet of stylesheets) {
    // Comments may quote the very declarations this guard removed.
    const css = (await readFile(sheet, "utf8")).replace(/\/\*[\s\S]*?\*\//g, "");
    for (const [, , value] of css.matchAll(/content\s*:\s*(['"])((?:(?!\1).)*)\1/g)) {
      assert.doesNotMatch(
        value,
        cyrillic,
        `${sheet.pathname.split("/app/")[1]} injects "${value}" via content`,
      );
    }
  }
});

test("the language switcher offers every locale", async () => {
  const html = await (await render("/")).text();
  for (const href of ["/", "/et", "/en"]) {
    assert.match(html, new RegExp(`href="${href}" hrefLang=`, "i"), `switcher missing ${href}`);
  }
});

test("the header has no hamburger drawer on the home page", async () => {
  const html = await (await render("/")).text();
  assert.doesNotMatch(html, /class="menu"/);
  assert.doesNotMatch(html, /class="lang-toggle"/);
  assert.match(html, /class="nav-tools"/);
});

test("the header and the tab bar both carry merch", async () => {
  const uk = await (await render("/")).text();
  const nav = uk.match(/<nav class="nav wrap">[\s\S]*?<\/nav>/);
  assert.ok(nav, "missing header nav");
  assert.match(nav[0], /href="\/merch"/, "merch missing from the header");

  const tabbar = uk.match(/<nav class="tabbar"[\s\S]*?<\/nav>/);
  assert.ok(tabbar, "missing tab bar");
  assert.match(tabbar[0], /href="\/merch"/, "merch missing from the tab bar");
  // The tab bar carries destinations only; the join action lives in the header.
  assert.doesNotMatch(tabbar[0], /forms\.gle/, "the join action leaked into the tab bar");

  const et = await (await render("/et")).text();
  assert.match(et, /href="\/et\/merch"/);
  assert.doesNotMatch(visibleText(et), /Мерч/);
});

test("every page's header carries the join action", async () => {
  for (const path of ["/", "/et", "/en", "/schedule", "/merch", "/en/merch"]) {
    const html = await (await render(path)).text();
    assert.match(html, /class="[^"]*join-cta/, `no header join button on ${path}`);
  }
});

test("every page ends with the same footer", async () => {
  for (const route of routes) {
    const html = await (await render(route.path)).text();
    const footer = html.match(/<footer class="footer wrap"[\s\S]*?<\/footer>/);
    assert.ok(footer, `no footer on ${route.path}`);
    assert.match(footer[0], /80163437/, `no registry line on ${route.path}`);
    assert.match(footer[0], new RegExp(`href="${route.home === "/" ? "/" : route.home}"|href="#top"`));
  }
});

test("the merch page prices every piece and offers the size chart", async () => {
  const html = await (await render("/merch")).text();
  for (const price of ["€10", "€25", "€20", "€15"]) {
    assert.ok(visibleText(html).includes(price), `no ${price} on the merch page`);
  }
  assert.match(html, /\/merch\/tshirt-white\.webp/);
  assert.equal((html.match(/class="product-card"/g) ?? []).length, 5, "expected five cards");
});

test("action links replace the old arrow characters", async () => {
  for (const path of ["/", "/et", "/en", "/schedule", "/merch"]) {
    const html = await (await render(path)).text();
    assert.doesNotMatch(visibleText(html), /↗/, `stale ↗ left on ${path}`);
    assert.match(html, /class="action-link/, `no action links on ${path}`);
  }
});

/**
 * The schedule page's 01/02 labels used to be styled as `.schedule-details span`,
 * which also painted the navy CTA's `.action-link-label` #56779b — about 2.6:1
 * on #203754, well under the 4.5:1 WCAG AA floor for text.
 */
test("navy action-link labels stay white on the dark fill", async () => {
  const strip = source => source.replace(/\/\*[\s\S]*?\*\//g, "");
  const actionLink = strip(await readFile(new URL("../app/components/action-link.css", import.meta.url), "utf8"));
  assert.match(
    actionLink,
    /\.action-link--navy\s+\.action-link-label\s*\{[^}]*color:\s*#fff\b/i,
    "navy CTA label must be white so it stays readable on #203754",
  );

  for (const sheet of ["schedule.css", "schedule-overrides.css"]) {
    const css = strip(await readFile(new URL(`../app/components/${sheet}`, import.meta.url), "utf8"));
    assert.doesNotMatch(
      css,
      /\.schedule-details\s+span\s*\{/,
      `${sheet} must not recolour every span inside .schedule-details`,
    );
  }
});
