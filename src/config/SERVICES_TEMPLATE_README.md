# services.template.json — Configuration Guide

This document explains how to alter `services.template.json` to add, modify, or remove spatial maps, charts, and related configuration in the KRW-NUTrend application.

---

## Overview

`services.template.json` is the **template** for the application's service configuration. It defines:

- **Spatial maps** (Toestand, Trends, Concentratie)
- **Particles** (Stikstof, Fosfor, DIN, etc.)
- **Individual services** (map layers) with their data sources, legends, and charts

The template is processed at build time by `scripts/process-config.js`, which replaces placeholders like `${VUE_APP_API_ENDPOINT}` with values from your `.env` file. The output is written to `services.json`, which the application actually uses.

**Important:** Edit `services.template.json`, not `services.json`. The latter is generated and listed in `.gitignore`.

---


## Environment Variables

Ensure your `.env` file contains:

| Variable | Description | Example |
|----------|-------------|---------|
| `VUE_APP_API_ENDPOINT` | Base URL for the API | `https://krw-nutrend.avi.deltares.nl` |
| `VUE_APP_END_YEAR` | End year for time ranges | `2025` |

These are used throughout the template for URLs and date ranges.

---

## File Structure

The file is a **JSON array** of top-level objects. Each object represents a **map type** (e.g. Toestand, Trends, Concentratie):

```json
[
  {
    "id": "state",
    "name": "Toestand",
    "spatialPlots": [ ... ]
  },
  {
    "id": "trends",
    "name": "Trends",
    "spatialPlots": [ ... ]
  },
  {
    "id": "concentration",
    "name": "Concentratie",
    "spatialPlots": [ ... ]
  }
]
```

### Hierarchy

```
Top-level (map type)
├── id          — Used for routing/filtering (e.g. "state", "trends", "concentration")
├── name        — Display name in the UI
└── spatialPlots[]
    ├── id      — Particle identifier (e.g. "ntot", "ptot", "din")
    ├── name    — Display name (e.g. "Stikstof", "Fosfor")
    └── services[]
        └── Service object (see below)
```

---

## Service Object Properties

Each item in `services[]` is a **service** (map layer). Properties:

### Required

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier for the service. Used to match the selected map layer. |
| `name` | string | Display name shown in the layer selector. |
| `charts` | object | Chart configuration. Use `{}` if no charts. |

### Optional

| Property | Type | Description |
|----------|------|-------------|
| `url` | string | API URL for map data. Use `null` for layers that load data differently (e.g. from WMS). |
| `data` | object | Pre-loaded data. Usually `{}`; populated at runtime. |
| `legendGraphicId` | string | ID of the legend graphic in the WMS/API. Used to fetch the legend image. |
| `legendPrefix` | string | Prefix for the legend title. Combined with selected year: `"${legendPrefix} ${year}"` (e.g. "Toetsjaar 2021"). |
| `legendTitle` | string | Fixed legend title. Overrides `legendPrefix` + year. Use for difference maps (e.g. `"2009/${VUE_APP_END_YEAR}"`). Use `""` to hide the legend title. |
| `downloadUrl` | string | URL for CSV/data download. If absent, download is disabled. |
| `differenceMap` | boolean | If `true`, renders as a split-circle difference map (old vs new). |
| `compareYear` | string | Year used for comparison in difference maps (e.g. `"2009"`). Shown in the location card. |
| `timeOption` | boolean | Whether the year slider is shown for this service. |

---

## Chart Configuration

The `charts` property defines which charts are available for a service. Structure depends on the **map type** and **context** (e.g. national, basin, water manager).

### Toestand (State) Charts

Uses `plotId` to request display groups from the API. Chart keys correspond to context:

| Key | When shown |
|-----|------------|
| `NL_charts` | National view (no basin/water manager selected) |
| `Basins_charts` | All basins |
| `SubBasins_charts` | All sub-basins |
| `SelectedBasin_charts` | Single basin selected |
| `SelectedSubBasin_charts` | Single sub-basin selected |
| `AvailableWaterManagers_charts` | Available water managers |
| `WaterManagers_charts` | All water managers |
| `SelectedWaterManagerCase1_charts` | Water manager selected (case 1) |
| `SelectedWaterManagerCase2_charts` | Water manager selected (case 2) |

Example:

```json
"charts": {
  "NL_charts": [
    {
      "plotId": "NL_aantal_N",
      "startTime": "1991-01-01T00:00:00Z",
      "endTime": "${VUE_APP_END_YEAR}-01-01T00:00:00Z"
    }
  ],
  "Basins_charts": [
    {
      "plotId": "Stroomgebied_aantal_N"
    }
  ]
}
```

- `plotId` — Display group ID in the API.
- `startTime` / `endTime` — Optional; restrict the time range. Use `${VUE_APP_END_YEAR}` for the end year.
- `{name}` — Placeholder in `plotId` for water manager name (e.g. `Stroomgebied_{name}_aantal_N`).

### Trends Charts

Uses a `graphUrl` for external trend images:

```json
"charts": {
  "graphUrl": "https://krw-nutrend.nl/site/data/trend-graph-per-location/Trend"
}
```

### Concentration Charts

Uses `dots`, `lines`, and `scatter` with FEWS PI timeseries parameters:

```json
"charts": {
  "dots": [
    {
      "filterId": "krw-wl-gr-ntot",
      "parameterIds": "Oordeel",
      "moduleInstanceIds": "SamenvoegenToetsing_Ntot",
      "qualifierIds": "BE_SGBPhuidig_toets",
      "startTime": "1980-01-01T00:00:00Z",
      "endTime": "${VUE_APP_END_YEAR}-01-01T00:00:00Z",
      "timeStepId": "jaar"
    }
  ],
  "lines": [
    {
      "filterId": "krw-wl-gr-ntot",
      "parameterIds": "Ntot",
      "moduleInstanceIds": "BerekenNormen_Ntot",
      "qualifierIds": "WN_3",
      "startTime": "1980-01-01T00:00:00Z",
      "endTime": "${VUE_APP_END_YEAR}-01-01T00:00:00Z",
      "timeStepId": "jaar",
      "showStatistics": "true"
    }
  ],
  "scatter": {
    "monitoring": [ { "filterId": "...", ... } ],
    "meetnet": [ { "filterId": "...", ... } ]
  }
}
```

Parameters are passed to the FEWS timeseries API. `seriesDetails` (e.g. `name`, `color`) can be added for line charts and is used for styling only.

---

## Legend Title Logic

The legend title is derived in this order:

1. **`legendTitle`** — If present, used as-is (supports `${VUE_APP_END_YEAR}`).
2. **`legendPrefix`** — If present, combined with selected year: `"${legendPrefix} ${year}"`.
3. **Otherwise** — Only the selected year (e.g. `"2021"`).

---

## Common Modifications

### Add a New Map Layer

1. Add a new object to the appropriate `services` array.
2. Set `id`, `name`, and `charts` (or `charts: {}`).
3. Add `url` if the layer fetches data from an API.
4. Add `legendGraphicId` if a legend image is needed.
5. Add `legendPrefix` or `legendTitle` for the legend title.
6. Add `downloadUrl` if CSV download is required.

### Add a Difference Map

1. Set `differenceMap: true`.
2. Set `compareYear` (e.g. `"2009"`).
3. Set `legendTitle` (e.g. `"2009/${VUE_APP_END_YEAR}"`).
4. Provide a `url` that returns comparison data.
5. Use `charts: {}` if no charts are needed.

### Add Charts to a Service

1. Choose the correct chart keys for the map type (e.g. `NL_charts`, `SelectedBasin_charts` for Toestand).
2. Add objects with the required parameters (`plotId` for Toestand, or `filterId`/`parameterIds`/etc. for Concentration).
3. Use `${VUE_APP_END_YEAR}` in date strings for the end year.

### Change the End Year

Update `VUE_APP_END_YEAR` in `.env`. All `${VUE_APP_END_YEAR}` placeholders in the template will be replaced when you run `npm run dev` or `npm run build`.

### Add a New Particle (e.g. New Substance)

1. Add a new object to `spatialPlots` in the relevant map type(s).
2. Set `id` and `name`.
3. Add a `services` array with at least one service.

### Add a New Map Type

1. Add a new top-level object with `id`, `name`, and `spatialPlots`.
2. Ensure the application’s filters and routing support the new `id` (may require code changes).

---

## Validation

- **JSON syntax** — Ensure valid JSON (no trailing commas, correct quotes).
- **Unique IDs** — Each service `id` should be unique within the application.
- **Placeholders** — Use `${VUE_APP_*}` for values that depend on the environment.
- **Chart keys** — Use the exact keys expected by the app (e.g. `NL_charts`, not `nl_charts`).

---

## Related Files

- `scripts/process-config.js` — Processes the template and writes `services.json`
- `src/config/README.md` — General config and placeholder documentation
- `src/store/modules/layers/index.js` — Uses services for `activeService`, `legendTitle`, `availableCharts`, etc.
- `src/lib/create-chart-requests.js` — Builds chart requests from the `charts` config
- `src/lib/get-chart-data-request.js` — Sends chart data requests for concentration charts
- `src/lib/toestand-graphs-utils/create-toestand-chart-requests.js` — Sends chart requests for Toestand
