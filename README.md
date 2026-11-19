# Leonida Trophy Guide — GTA VI Platinum Tracker

[![GTA 6 Trophy Guide](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/zakkysp/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/zakkysp/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI — built for make.fun's [Build the best GTA 6 trophy guide](https://make.fun/bounty/gta6-trophy-guide-01) bounty. Sign up to make.fun with my referral link: https://make.fun/r/5twwhvj5

## What it does

- **Checklist** of all 55 official trophies with their names, descriptions and grades, saved in the browser (localStorage), with export to a file and import back.
- **Filters** by kind (story, missable, collectibles, activities, online) and by grade, plus search.
- **Spoiler setting** that hides story trophies' names, descriptions and guides until you earn them.
- **Roadmap to the platinum** in five stages — story, character questlines, the 100% checklist, cleanup, platinum — built from the official descriptions.
- **Missables page**: only one trophy is reported as possibly missable (Positive Mental Attitude — the Chapter 1 balcony meditation). Everything else can be finished in free-roam after the story.
- **A guide for every trophy**, written in our own words, with its sources named beside it. Four trophies were still unconfirmed on launch day (In The Beginning…, Bad Luck, I Guess, The Truth Is Out There, Ten Pin) — their guides say so instead of inventing a solution.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network: `app/` is plain static files, and the app fetches nothing at run time except its own `app/data/trophies.json`. The hand-in program is `main.ts` (Node 22):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

- `app/index.html` — the shell (header, tabs, toolbar, views, detail pane)
- `app/app.js` — boot and control wiring
- `app/data.js` — loads `app/data/trophies.json`
- `app/store.js` — localStorage progress, export/import
- `app/filters.js` — kind/grade/search/spoiler rules
- `app/views.js` — checklist, detail pane, roadmap, missables, sources
- `app/shots.js` — deterministic `?shot=` staging for screenshots
- `app/style.css` — the Vice sunset look
- `app/data/trophies.json` — the 55 official trophies with guides and sources

## Sources

- PowerPyx — GTA 6 Trophy Guide & Roadmap: https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/
- Exophase — GTA VI trophy list: https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/
- PSNProfiles — GTA VI trophies: https://psnprofiles.com/trophies/43531-grand-theft-auto-vi
- GTABase — GTA 6 Trophy Guide & Achievements List: https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series

An unofficial fan guide. Grand Theft Auto and GTA are trademarks of Take-Two Interactive; this guide uses no Rockstar logo, artwork or game screenshots. MIT licensed.
