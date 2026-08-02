# The Record Cabinet

A fictional 1998–2003 personal music archive: a handful of records a
collector has actually written up, presented as a page frozen at
3 August 2003 and never touched since. Built for **Crit 1 "Forgotten Web"**
in COMP4020/COMP8020 Agentic Coding Studio.

**Deployed site:**
<https://comp4020-agentic-coding-studio.github.io/comp4020-crit1-Asuka121380/>

## What's here

A homepage catalogue, an update log, and six record-entry pages (Back in
Black, Variety, Long Season, Homework, OK Computer, In the Aeroplane Over the
Sea) --- that's the full scope of the site.

## Implementation

Semantic HTML and CSS on a Vite build harness, with **no JavaScript shipped
to the deployed site**. Typography is a self-hosted VT323 webfont (bundled
under `assets/fonts/vt323/`, no external font requests). Cover art is local
images under `assets/covers/`, not hotlinked.

```sh
pnpm install
pnpm dev                                  # local dev server
pnpm check                                # typecheck, build, lint, tests
pnpm check:evidence                       # verify PROCESS.md/reflection/CLAUDE.md
pnpm build                                # produce dist/
pnpm dlx linkinator ./dist --silent       # local links check
```

## Process evidence

- [`PROCESS.md`](./PROCESS.md) --- the moments that mattered, cited against
  real commits.
- [`CLAUDE.md`](./CLAUDE.md) --- the standing conventions this build holds
  itself to.
- [`reflections/crit-1.md`](./reflections/crit-1.md) --- the written
  reflection for this deliverable.

## A note on the artwork

Cover images are reduced-resolution scans sourced through the [MusicBrainz
Cover Art Archive](https://musicbrainz.org/doc/Cover_Art_Archive). Artwork
remains © the respective rights holders; it's used here in a non-commercial,
educational criticism-and-review context. Each record page links the exact
MusicBrainz release its cover was sourced from.
