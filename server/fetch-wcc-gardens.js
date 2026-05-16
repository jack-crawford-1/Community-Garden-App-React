/**
 * fetch-wcc-gardens.js
 * Fetches Wellington community garden data from the WCC ArcGIS GIS server
 * (Community/Facilities MapServer, layer 3) and transforms it into
 * VenueSchema-compatible documents.
 *
 * Confirmed working endpoint — 28 gardens, WGS84 coords.
 *
 * Usage:
 *   node fetch-wcc-gardens.js                     # fetch + print summary
 *   node fetch-wcc-gardens.js --out gardens.json  # write to file
 *   node fetch-wcc-gardens.js --file raw.json     # transform a local GeoJSON
 */

import fs from "fs/promises";
import path from "path";

// Confirmed endpoint — WCC GIS server, outSR=4326 forces WGS84 coords
export const ENDPOINT =
  "https://gis.wcc.govt.nz/arcgis/rest/services/Community/Facilities/MapServer/3/query" +
  "?where=1%3D1&outFields=*&outSR=4326&f=geojson";

// ---------------------------------------------------------------------------
// Map one GeoJSON feature → VenueSchema document
// Confirmed field names: Name, Address, Email, Website, Description
// ---------------------------------------------------------------------------
export function transformFeature(feature) {
  const p = feature.properties ?? {};
  const [lon, lat] = feature.geometry?.coordinates ?? [null, null];

  // description is required — fall back to Name if Description is blank
  const description =
    (p.Description && p.Description.trim()) ||
    (p.Name && p.Name.trim()) ||
    "Community garden";

  const doc = {
    description,
    address: p.Address?.trim() || undefined,
    lat: lat != null ? lat : undefined,
    lon: lon != null ? lon : undefined,
    isTestGarden: false,
  };

  const email = p.Email?.trim() || undefined;
  const website = p.Website?.trim() || undefined;
  if (email || website) {
    doc.contact = {};
    if (email) doc.contact.email = email;
    if (website) doc.contact.website = website;
  }

  // Internal metadata for idempotent re-seeding (stripped before DB insert)
  doc._meta = {
    source: "WCC GIS — Community/Facilities/MapServer/3",
    sourceId: p.OBJECTID,
    name: p.Name,
    hasDescription: !!(p.Description && p.Description.trim()),
  };

  // Strip undefined values
  for (const k of Object.keys(doc)) {
    if (doc[k] === undefined) delete doc[k];
  }

  return doc;
}

// ---------------------------------------------------------------------------
// Fetch
// ---------------------------------------------------------------------------
export async function fetchGeoJSON() {
  console.log(`⬇  Fetching from WCC GIS…`);
  const res = await fetch(ENDPOINT, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from WCC GIS`);
  const data = await res.json();
  if (!data?.features?.length) throw new Error("Empty features array");
  console.log(`✓  Got ${data.features.length} features`);
  return data;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const args = process.argv.slice(2);
  const outFlag = args.indexOf("--out");
  const outFile = outFlag !== -1 ? args[outFlag + 1] : null;
  const fileFlag = args.indexOf("--file");
  const localFile = fileFlag !== -1 ? args[fileFlag + 1] : null;

  console.log("🌱  GrowLocal — WCC Gardens fetcher\n");

  let geojson;
  if (localFile) {
    const raw = await fs.readFile(localFile, "utf-8");
    geojson = JSON.parse(raw);
    console.log(`✓  Loaded ${geojson.features.length} features from ${localFile}`);
  } else {
    geojson = await fetchGeoJSON();
  }

  const docs = geojson.features
    .map((f) => {
      try { return transformFeature(f); }
      catch (err) {
        console.warn(`  ⚠ Skipped OBJECTID ${f.properties?.OBJECTID}: ${err.message}`);
        return null;
      }
    })
    .filter(Boolean);

  const withCoords  = docs.filter((d) => d.lat != null).length;
  const withContact = docs.filter((d) => d.contact).length;
  const withDesc    = docs.filter((d) => d._meta.hasDescription).length;
  const noDesc      = docs.filter((d) => !d._meta.hasDescription).map((d) => d._meta.name);

  console.log(`\n📊  Summary`);
  console.log(`   Total            : ${docs.length}`);
  console.log(`   With coords      : ${withCoords}`);
  console.log(`   With contact     : ${withContact}`);
  console.log(`   With description : ${withDesc} / ${docs.length}`);

  if (noDesc.length) {
    console.log(`\n⚠  ${noDesc.length} gardens using Name as fallback description:`);
    noDesc.forEach((n) => console.log(`   • ${n}`));
    console.log(`   → Run enrich-descriptions.js to AI-generate proper descriptions.`);
  }

  if (outFile) {
    await fs.writeFile(outFile, JSON.stringify(docs, null, 2));
    console.log(`\n💾  Written to ${path.resolve(outFile)}`);
  } else {
    console.log("\n📄  First record:");
    const { _meta, ...sample } = docs[0];
    console.log(JSON.stringify(sample, null, 2));
    console.log(`\nRun with --out gardens.json to save all records.`);
  }

  return docs;
}

export default main;

if (process.argv[1].endsWith("fetch-wcc-gardens.js")) {
  main().catch((err) => { console.error("❌ ", err.message); process.exit(1); });
}
