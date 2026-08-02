import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// Cover art & retro pass — placeholders replaced with real covers, credited,
// and the fictional NOW PLAYING widget removed. See
// Crit1 prompt/crit1-cover-art-retro-pass.md for the brief.
const DIST = resolve("dist");

function distFiles(dir: string = DIST): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return distFiles(path);
    return [path];
  });
}

const files = distFiles();
const htmlFiles = files.filter((f) => f.endsWith(".html"));
const pages = htmlFiles.map((path) => ({
  name: relative(DIST, path),
  path,
  doc: new JSDOM(readFileSync(path, "utf8")).window.document,
}));

const detailPages = pages.filter(({ name }) => name.startsWith("records/"));

describe("no leftover placeholders or fake live widgets", () => {
  for (const { name, doc } of pages) {
    it(`${name} has no COVER SCAN PENDING placeholder`, () => {
      expect(doc.body.textContent).not.toMatch(/COVER SCAN\s*PENDING/i);
    });

    it(`${name} has no NOW PLAYING widget`, () => {
      expect(doc.body.textContent).not.toMatch(/NOW PLAYING/i);
      expect(doc.querySelector(".currently-playing")).toBeNull();
    });
  }
});

describe("real cover art", () => {
  for (const { name, doc, path } of pages) {
    const covers = Array.from(doc.querySelectorAll<HTMLImageElement>("img.album-cover"));
    if (covers.length === 0) continue;

    for (const img of covers) {
      const src = img.getAttribute("src") ?? "";

      it(`${name} cover image "${src}" has non-empty alt text`, () => {
        expect(img.getAttribute("alt")?.trim()).toBeTruthy();
      });

      it(`${name} cover image "${src}" resolves to a built .jpg asset`, () => {
        expect(src).toMatch(/\.jpg$/);
        const resolved = resolve(dirname(path), src);
        expect(existsSync(resolved), `${resolved} does not exist`).toBe(true);
      });
    }
  }

  it("the home page has 6 covers", () => {
    const home = pages.find(({ name }) => name === "index.html");
    expect(home).toBeTruthy();
    if (!home) return;
    expect(home.doc.querySelectorAll("img.album-cover")).toHaveLength(6);
  });

  it("every record detail page has exactly one cover", () => {
    expect(detailPages.length).toBeGreaterThan(0);
    for (const { name, doc } of detailPages) {
      expect(doc.querySelectorAll("img.album-cover"), name).toHaveLength(1);
    }
  });
});

describe("cover art credits", () => {
  for (const { name, doc } of detailPages) {
    it(`${name} has a figcaption crediting the cover`, () => {
      const figcaption = doc.querySelector("figure.cover-figure figcaption");
      expect(figcaption, `${name} has no figure/figcaption for its cover`).toBeTruthy();
      expect(figcaption?.textContent).toMatch(/MUSICBRAINZ/i);
    });
  }

  for (const { name, doc } of pages) {
    it(`${name} has the site-wide artwork credit line in the footer`, () => {
      const footer = doc.querySelector("footer.site-footer");
      expect(footer?.textContent).toMatch(/ALBUM ARTWORK.*RESPECTIVE RIGHTS HOLDERS/i);
    });
  }
});

describe("visitor counter reads as frozen, not live", () => {
  for (const { name, doc } of pages) {
    it(`${name} labels the counter as frozen`, () => {
      const wrap = doc.querySelector(".visitor-counter-wrap");
      expect(wrap?.textContent).toMatch(/FROZEN/i);
    });
  }
});
