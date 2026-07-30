# Crit 1 reflection

**Breakthrough:** I built the whole collection as six genre pages before
realising that was the wrong shape for the brief. A 2003 personal music page
wouldn't sort a hand-built shelf by genre --- it would just list what's there,
in the order it arrived. Rebuilding around one chronological catalogue,
grouped by decade instead of genre, was the change that made the site feel
like an actual person's page rather than a mocked-up record shop, and it's
what let 42 records live on one page without it turning into six shallow ones.

**What this changed about how I want to build:** the two bugs that mattered
most --- the duplicate `<h1>` across all 42 detail pages, and the invisible
cover-placeholder box on mobile --- were both things `pnpm check` and an actual
screenshot caught that reading the HTML/CSS by eye didn't. I'd written the
placeholder styling once and assumed reusing the class elsewhere would reuse
the look; it didn't, because the visible styling was scoped to one context
only. That's a habit I want to keep: treat a green build as "nothing broke
mechanically," not "it looks right," and actually render the page at both
viewports before calling something done, rather than trusting my mental model
of the CSS.
