# GrowLocal — Community Gardens of Aotearoa

A free, public directory of community gardens in New Zealand, starting with **28 real
gardens in Wellington** sourced from [Wellington City Council open data](https://data-wcc.opendata.arcgis.com/).

- **Map** — clustered, searchable map of every garden
- **Directory** — browse and filter gardens by suburb
- **Garden pages** — location, description and real contact details for each garden
- **Suggestions** — anyone can suggest a new garden or a correction (no account needed)

## Architecture

```
client/   React 19 + Vite + Tailwind 4 + @vis.gl/react-google-maps   → Vercel
server/   Express 5 + Mongoose (MongoDB Atlas)                        → Railway
```

The server exposes a small JSON API:

| Method | Path               | Description                                                       |
| ------ | ------------------ | ----------------------------------------------------------------- |
| GET    | `/health`          | Health check                                                      |
| GET    | `/api/gardens`     | All gardens as a GeoJSON FeatureCollection (`?region=` to filter) |
| GET    | `/api/gardens/:id` | One garden document                                               |
| POST   | `/api/suggestions` | Submit a new-garden suggestion or correction (rate-limited)       |

Hardening: `helmet`, open CORS (public read-only data), global + per-route rate
limits, request-size limits, JSON 404/error handlers, graceful shutdown.

## Data pipeline

Garden listings come from the WCC GIS service (Community/Facilities layer):

```bash
cd server
npm run fetch:wcc           # refresh data/gardens.json from the council API
npm run seed                # upsert into MongoDB (idempotent, keyed by source id)
npm run seed -- --replace   # full reset: delete everything, then reseed
```

Community corrections arrive as documents in the `suggestions` collection —
review them there and apply changes by hand (or re-run the seed after fixing
the source data).

## Testing & CI

```bash
cd server && npm test       # unit tests (node:test)
cd client && npm run lint && npm run build
```

GitHub Actions runs the same checks on every push and pull request.

## Deployment

- **Client** (Vercel): root `client/`, build `npm run build`, output `dist/`.
  Set `VITE_GOOGLE_MAPS_API_KEY`, `VITE_MAP_ID` and `VITE_API_URL`
  (e.g. `https://<railway-app>.up.railway.app/api`).
- **Server** (Railway): root `server/`, start `npm start`.
  Set `URI` and `DB_NAME`. `PORT` is provided by Railway.

## Adding a new region

1. Find the council's open-data endpoint for community gardens.
2. Add a fetch/transform script alongside `scripts/fetch-wcc-gardens.js`
   (set `region` on each document).
3. Seed, and the map, directory and suburb filters pick the new region up
   automatically.
