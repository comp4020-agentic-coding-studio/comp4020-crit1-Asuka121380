# Process overview

A reading-guide to how the work came together --- a map to your process, not an
essay about it. Markers read this file and follow its citations; they don't
trawl the repo for evidence you didn't point at, so if a moment mattered, cite
it.

## What I built

THE RECORD CABINET: a fictional 2003-era personal homepage for a music
collector, hand-coded in HTML/CSS with no JavaScript. The first pass split the
collection across six genre pages (rock, electronic, experimental, Japan, plus
a top-level "collection" index); partway through I decided that was the wrong
shape for a shelf that grew over time rather than by genre, and rebuilt it as
one unified catalogue on `index.html` with all 42 records grouped by decade,
each linking out to its own detail page under `records/`.

## The moments that mattered

1. **Genre pages weren't the right axis.** The first build
   ([`cc3b5e0`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-Asuka121380/commit/cc3b5e0))
   split records into rock/electronic/experimental/Japan pages, which read as a
   record-shop taxonomy rather than a personal collector's page, and meant four
   near-identical nav structures to keep in sync. I scrapped it for one
   chronological catalogue, arranged by decade with jump links and a
   back-to-top after each block, because that's how an actual collector's shelf
   grows: one record at a time, in the order it was bought, not sorted by
   genre. That call is why
   [`759846a`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-Asuka121380/commit/759846a)
   deletes the genre pages and
   [`6264818`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-Asuka121380/commit/6264818)
   rebuilds `index.html` around decade blocks instead.

2. **`pnpm check` caught a duplicate top-level heading on every one of the 42
   record pages.** Each detail page reused `<h1>` for both the site banner and
   the album title, so the invariants suite's "has exactly one top-level
   heading" test failed on all 42 pages at once. Rather than drop the
   album-title styling, I gave it its own `.detail-title` class at `h2` and
   pulled the shared rule out to a `.detail-title` selector in the stylesheet,
   so the fix is what's actually in
   [`f8576e1`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-Asuka121380/commit/f8576e1)
   (the pages) and
   [`4fe176d`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-Asuka121380/commit/4fe176d)
   (the stylesheet) --- caught and fixed before either was ever committed, so
   the history doesn't carry the broken version.

3. **A full-page screenshot at 390×844 showed a large blank gap on record
   pages that didn't show up at 1920×1080.** Reading the CSS explained why:
   `.cover-placeholder`'s border, background, and centring were only defined
   under `.rec-card .cover-placeholder` (the catalogue-grid card), so the same
   class on a detail page picked up a 160×160 width/height but none of the
   styling that would make the box visible or its text centred --- an
   invisible box that just ate space, more obviously once the layout stacked
   to one column on mobile. I pulled the shared rules into a base
   `.cover-placeholder` selector and left only per-context sizing under
   `.rec-card .cover-placeholder` and `.detail-cover .cover-placeholder`,
   landed in
   [`4fe176d`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-Asuka121380/commit/4fe176d).
   Re-screenshotting both viewports afterwards, not just re-reading the CSS, is
   what confirmed the box was actually visible and centred.

## Before you ship

`pnpm check:evidence` verifies your citations resolve to real commits, that the
current reflection entry is in `reflections/`, and that your `CLAUDE.md` is
there --- before a marker ever opens the file.
