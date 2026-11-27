# UK Signal

[![make.fun bounty](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![make.fun rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/duclucky/uk-signal-20261127-071749-r01/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![make.fun reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/duclucky/uk-signal-20261127-071749-r01/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

An independent explorer of six UK national series: population, nominal GDP, real GDP growth, CPI inflation, GDP per person, and modelled ILO unemployment. It covers 2015–2024, a fixed annual window, not a live feed. Explore the charts, filter the table, or download the selected rows as CSV. The site is not an official statistics service.

## Preview and package

Serve `app/` at the root of a static HTTP server, for example:

```sh
python -m http.server 8080 --bind 127.0.0.1 --directory app
```

Open [http://127.0.0.1:8080/](http://127.0.0.1:8080/). The site uses browser-native HTML, JavaScript and CSS. It has no build step or external runtime resources; source citations are outbound links.

Run the artifact packager with Node.js 22.18 or newer from the repository root. Use a fresh destination. PowerShell:

```powershell
$env:MAKEFUN_OUTPUT_DIR = Join-Path (Get-Location) 'out'
node main.ts
```

On POSIX shells: `MAKEFUN_OUTPUT_DIR=./out node main.ts`. Without the override, the destination is `/output`. The packager copies `app/` and `screenshots/` and writes `dossier.json` via the unchanged official make.fun SDK.

## Data and reuse

World Bank: [World Development Indicators](https://datacatalog.worldbank.org/infrastructure-data/search/dataset/0037712/world-development-indicators): UN Population and Statistics Divisions, national statistical offices and Eurostat (population); national statistical organisations and central banks, OECD National Accounts and World Bank estimates (GDP series); IMF International Financial Statistics (CPI); ILO Modelled Estimates / ILOSTAT (unemployment). See **Sources** in the site for definitions, units and individual series codes and links.

The WDI series metadata is marked [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) with the [World Bank dataset terms](https://www.worldbank.org/ext/en/legal/terms-conditions/datasets). Extracted 27 November 2026. UK Signal selects a subset, paraphrases labels, rounds figures in the interface and calculates year-over-year comparisons. CSV observation values are unchanged. No provider sponsors or endorses this project.

Original code and visual assets are distributed under the [MIT License](LICENSE). Data and the unchanged make.fun SDK are separately attributed and are not relicensed by this project.
