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
each linking out to its own detail page under `records/`. A later redesign pass
cut that 42-record catalogue down to six properly-written-up entries, moved
the top nav into a left sidebar, and rebuilt the homepage around a "MY RECORD
COLLECTION" grid feeding straight into the footer's NOW PLAYING/visitor-counter
widgets. A later pass replaced the placeholder cover art with the real scans
and MusicBrainz credits, self-hosted a VT323 webfont for a more handmade
typographic feel, and dropped NOW PLAYING so the footer no longer implies a
live feed.

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

4. **The harness didn't grow while the build did.** I directed the initial
   build and the genre-to-catalogue redesign through detailed one-off prompts
   kept outside this repo, and `CLAUDE.md` stayed the starter boilerplate the
   whole time --- untouched while the two bugs above were being found and
   fixed. Reviewing the history afterwards is what surfaced four things worth
   keeping as standing rules rather than one-off fixes: the single-`<h1>`
   convention, base-selector styling for shared classes like
   `.cover-placeholder`, the no-JavaScript constraint the brief requires, and
   the site's 2003 fiction. Those went into `CLAUDE.md` in
   [`b38fb87`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-Asuka121380/commit/b38fb87)
   --- after the fact, not before: that commit records lessons from the
   commits above, it didn't guide them.

5. **Six records, verified at both viewports before the numbers were treated as
   final.** The redesign brief gave starting-point dimensions and font sizes for
   a sidebar layout, but I treated those as a first guess rather than a target:
   after building the `.page-body` grid and `.site-nav` sidebar, I rendered
   `index.html` and a record page at both 1920×1080 and 390×844 with
   `agent-browser` before settling on final values, the same screenshot
   discipline from moment 3 above. That's why `--sidebar-width` stayed narrow
   enough to leave `.site-main` room on desktop while the
   `@media (width <= 639px)` rule collapses the sidebar to a wrapped horizontal
   list instead of a hamburger menu --- a real layout decision, not a guess from
   reading CSS numbers, landed in
   [`575d2c7`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-Asuka121380/commit/575d2c7).

6. **Cutting 36 records without breaking rename history took two commits, not
   one.** Renumbering the five kept records into the new 01-06 sequence used
   `git mv`, but once I rewrote their content to match the new template, staging
   that rewritten content directly over the moved paths dropped git's
   similarity score below its rename-detection threshold --- `git status` showed
   plain delete+add pairs instead of the clean renames the "preserve history"
   instruction called for. I split the work instead:
   [`c189fd7`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-Asuka121380/commit/c189fd7)
   is the pure rename plus the unused-page deletions, with the old file content
   untouched at its new path; the content rewrite landed only in
   [`575d2c7`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-Asuka121380/commit/575d2c7)
   on top of that. `git log --follow` on any renamed record still traces cleanly
   back through both commits.

7. **The six-record redesign still read as too polished for a 2003 personal
   page --- Verdana body text, placeholder cover boxes, and a NOW PLAYING line
   that quietly implied the page was live.** I self-hosted VT323 (OFL-licensed,
   bundled under `assets/fonts/vt323/`, never hotlinked) and repointed every
   `font-family` at it through one `--font-pixel` custom property, rather than
   patching sizes on individual selectors. VT323 renders visibly smaller than
   the sans it replaced at the same pixel size, so I treated my first pass at
   new sizes as a guess: screenshotting `index.html` and a record page at both
   1920×1080 and 390×844 showed the site title wrapping to two lines on
   mobile, which the source CSS alone didn't make obvious, so I added a
   `@media (width <= 639px)` override to bring it back to one line --- the same
   screenshot-before-final discipline as moments 3 and 5, applied to type
   rather than layout.

   The 12 `COVER SCAN PENDING` boxes became real `<img class="album-cover">`
   covers copied into `assets/covers/`, following the base-selector convention
   from moment 3: `.album-cover` owns its border and sizing-independent look,
   with `.rec-card`/`.detail-cover` context rules only overriding width and
   height. Each detail page cites its actual MusicBrainz release in a
   `figure`/`figcaption`, checked against the MusicBrainz API rather than typed
   from memory, since the release pages themselves sit behind a bot-check that
   blocks a straight fetch.

   NOW PLAYING implied a live feed on a page that's frozen fiction, so it's
   gone --- markup and CSS both --- while the visitor counter (genuinely just a
   static number) stays, relabelled "FROZEN AT" so it no longer reads as a
   companion live widget by association. All of this landed in one commit,
   [`9ef09e4`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-Asuka121380/commit/9ef09e4),
   alongside `spec/cover-art.test.ts` locking in the new invariants (no
   placeholder text, no NOW PLAYING, every cover has alt text and a credited
   figcaption) so a future pass can't quietly regress any of them.

## Before you ship

`pnpm check:evidence` verifies your citations resolve to real commits, that the
current reflection entry is in `reflections/`, and that your `CLAUDE.md` is
there --- before a marker ever opens the file.
