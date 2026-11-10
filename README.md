# Voidling Bound — Element Matchup & Status Effect Reference

A static reference page for *Voidling Bound* (Hatchery Games, Steam appid 2004680) — built so a
player staring at the enemy-faction screen before a mission, deciding which voidling from their
collection to bring, can see the element type-matchup chart and the status-effect mechanics in one
place instead of tabbing between two separate articles.

Open `index.html` in a browser. No build step, no server, no framework — vanilla HTML/CSS/JS.

## Contents

1. **Type Matchup Table** — 6 elements (Neutral, Organic, Pyro, Cryo, Cyber, Plasma) x
   Effective/Weak against the 4 named enemy factions (Lesion-spawns, Ancients, Crystallines,
   GenBots), plus each element's associated status effect(s).
2. **Status Effect Reference** — 16 named effects total: 5 control/misc effects with no element
   (Sleep, Stun, Marked, Invisibility, Armor Reduction), 6 elemental damage-over-time effects with
   stack caps (Bleed, Poison, Burn, Frostbite, Static, Disintegrate), and 5 movement effects tied
   to an element (Slow, Fear, Frostbite Stun, Lure, Float) — filterable by element.

## Sourcing — re-fetched live this session, not reused from the charter's transcription

- **Type matchup table**: `destructoid.com/all-voidling-bound-elements-affinities-weaknesses-and-more/`,
  curl-fetched live 2026-11-10 (HTTP 200). Confirmed byline (Arka Sarkar, Destructoid), confirmed
  the page is about this game ("Image via Hatchery Games"), and transcribed the full 6-row table
  verbatim, including that **Neutral and Plasma both have no listed weakness** ("N/A"/absent in
  the source — not invented here) and that **Plasma's row lists two associated status effects**
  (Disintegrate and Float), not one.
  - **Disclosed correction**: the live source table has two typos in the Organic and Cryo rows
    ("Wak against Cystallines" and "Lesion Spawns"/"Cystallines" elsewhere). These are corrected
    to "Weak against Crystallines" and "Lesion-spawns"/"Crystallines" on this page, matching the
    faction names used consistently everywhere else on the same source page and in the charter.
    No substantive content (which factions, effective vs. weak) was changed — only the spelling.
- **Status effects**: `allthings.how/voidling-bound-status-effects-explained-for-every-element/`.
  A live re-fetch this session returned a Cloudflare JS challenge page (HTTP 403, "Just a
  moment..." — `cf-chl` challenge tokens in the body, not real content). Per the charter's
  instruction to re-fetch rather than reuse the orchestrator's transcription, this was instead
  read two independent ways: (1) the Wayback Machine's live 2026-07-18 snapshot of the exact same
  URL, fetched directly with curl (HTTP 200, full HTML, byline Shivam Malani, updated Jun 12
  2026), and (2) an independent fetch-and-read of the current live page content. Both reads agree
  verbatim on every stack number and behavior description below — no discrepancy found between
  the archived and live versions, so nothing had "materially changed" per the charter's FAILURE
  PROTOCOL trigger.

**Disclosed note — Frostbite is listed twice, on purpose:** the status-effect source's own table
structure lists Frostbite once as a damage-over-time effect (max 5 stacks, converts to a stun at
5) and again, separately, in its movement-effects table as "Frostbite Stun." Both are shipped here
as distinct entries, each flagged `isDualEffect`, rather than merged into one line.

**Disclosed limit — Lure:** the status-effect source describes Lure only as "a Cyber-associated
movement effect" and gives no further mechanics anywhere on the page. This page shows that gap
honestly as "mechanics not described in the source" rather than guessing at what Lure does.

**Excluded source, named per the charter:** `hkytufydtdtdt.pages.dev` was found again during this
session's own search and is named here only to disclose the exclusion — a disposable-looking
domain whose level-50 cap claim contradicts Steam Deck HQ's review (level 20). It was not cited
as a data source for anything on this page.

## Gate 2 re-verification (FAILURE PROTOCOL)

Re-ran a fresh WebSearch for a Voidling Bound wiki, Fandom page, or element/status-effect
calculator. None found — only the same two guide articles and general review/press coverage
(Destructoid, Steam Deck HQ, Automaton Media) already named in the charter. Build proceeds; not
`FAILED:`.

## Rails respected

- Only `destructoid.com`, `allthings.how`, and `web.archive.org` (Wayback Machine mirror of the
  `allthings.how` URL, used only because the live page returned a bot-challenge, not a substitute
  source) were fetched. No Fandom/wiki.gg domain touched. No calculator built or implied — this is
  a browsable reference.
- No registry writes, no git commit, no deployment — left to the orchestrator per rails.
- No account access, no game files extracted, no cheats — every fact is reproduced from text
  already published on public guide sites.

## Verification run

```
$ node test.js   (run from the product folder)
ALL PASS (59/59: 6 elements all present with non-empty effective/status data, Neutral and Plasma
both carry a disclosed null weakness, Organic's known effective/weak factions match verbatim,
Plasma's two status effects (Disintegrate + Float) both present, 5 control + 6 elemental + 5
movement = 16 total effects, Poison's 15-stack outlier vs. the other five DoTs' 5-stack cap,
Frostbite's dual DoT/stun entries both flagged isDualEffect, Lure's honest non-disclosure note
present, every other effect has real description text, and the DOM surface renders the filter,
excluded-source callout, and matchup table body.)

$ python3 Tools/slop_lint.py Orchard/FACTORY/output/voidling-bound-element-reference/
slop_lint: clean — 0 findings
```

Served locally with `python3 -m http.server` and rendered with headless Chrome
(`--headless=new --dump-dom`), grepped the dumped DOM directly:
- `Lesion-spawns, Ancients, Crystallines, GenBots` — faction list renders correctly.
- `self-test: 7/7 known-answer scenarios passed` — in-page self-test, not just test.js.
- `16 of 16 effects` — full effect count renders at the default (unfiltered) state.
- `mechanics not described in the source, not guessed at.` — Lure's honest disclosure renders,
  twice (once in the status card, once in the sourcing-notes section).
- `max 15 stacks` — Poison's outlier stack cap renders correctly.
- `N/A — The source lists no weakness for Plasma...` — the disclosed-null-weakness text renders.
- Full-page banned-word scan (script/style stripped, tags stripped) against the LIABILITY TIER
  list (best/optimal/strongest/guaranteed/approved/certified/compliant/safe/s-tier/meta): **none
  found.**
