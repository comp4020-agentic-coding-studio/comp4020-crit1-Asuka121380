import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// Crit 1 "Forgotten web" — mechanically checkable lines from the published
// spec. The look-and-feel and process-narration lines are judged at the
// crit, not here — see spec/README.md.
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
  doc: new JSDOM(readFileSync(path, "utf8")).window.document,
}));

describe("no JavaScript", () => {
  it("ships no .js files", () => {
    const jsFiles = files.filter((f) => f.endsWith(".js"));
    expect(jsFiles, `found JS in the build: ${jsFiles.join(", ")}`).toHaveLength(0);
  });

  for (const { name, doc } of pages) {
    it(`${name} has no <script> tags`, () => {
      expect(doc.querySelectorAll("script")).toHaveLength(0);
    });
  }
});

describe("a real site, not a single page", () => {
  it("has more than one page", () => {
    expect(pages.length).toBeGreaterThan(1);
  });

  it("every page is reachable from the home page", () => {
    const home = pages.find(({ name }) => name === "index.html");
    expect(home, "no index.html in dist").toBeTruthy();
    if (!home) return;

    const hrefs = new Set(
      Array.from(home.doc.querySelectorAll("a[href]")).map((a) =>
        a.getAttribute("href")?.replace(/^\.\//, ""),
      ),
    );

    for (const { name } of pages) {
      if (name === "index.html") continue;
      expect(
        hrefs.has(name),
        `${name} isn't linked from the home page's nav/content`,
      ).toBe(true);
    }
  });
});
