/**
 * seed-venues.js
 * Seeds WCC community garden data into the Venue collection.
 *
 * Usage:
 *   node seed-venues.js --file wcc-gardens.json           # seed from local file
 *   node seed-venues.js --file wcc-gardens.json --dry-run # validate only
 *   node seed-venues.js --file wcc-gardens.json --upsert  # safe to re-run
 *   node seed-venues.js --fetch                           # fetch live + seed
 *   node seed-venues.js --clear                           # remove existing WCC venues first
 *
 * Env:
 *   MONGODB_URI  e.g. mongodb://localhost:27017/growlocal
 */

import mongoose from "mongoose";
import fs from "fs/promises";
import { fetchGeoJSON, transformFeature } from "./fetch-wcc-gardens.js";

// ---------------------------------------------------------------------------
// Schema (matches your Venue model exactly)
// ---------------------------------------------------------------------------
const VenueSchema = new mongoose.Schema({
  description:  { type: String, required: true },
  address:      String,
  lat:          Number,
  lon:          Number,
  coordinator:  String,
  contact: {
    email: String, phone: String, website: String,
    social: { facebook: String, other: String, other2: String },
  },
  facilities:   [String],
  accessibility:[String],
  events:       [{ date: String, details: String }],
  photos:       [String],
  rules:        [String],
  partnerships: [String],
  isTestGarden: { type: Boolean, default: false },
  // Used for idempotent upserts — not in your original schema but harmless
  _sourceId:    { type: String, index: true, sparse: true },
});

const Venue = mongoose.models.Venue ?? mongoose.model("Venue", VenueSchema);

// ---------------------------------------------------------------------------
// Load docs from file or live fetch
// ---------------------------------------------------------------------------
async function loadDocs(args) {
  const fileFlag = args.indexOf("--file");
  if (fileFlag !== -1) {
    const raw = await fs.readFile(args[fileFlag + 1], "utf-8");
    const docs = JSON.parse(raw);
    // Accept either raw GeoJSON or already-transformed array
    if (docs?.features) {
      console.log(`✓  Loaded GeoJSON with ${docs.features.length} features`);
      return docs.features.map(transformFeature).filter(Boolean);
    }
    console.log(`✓  Loaded ${docs.length} transformed records from file`);
    return docs;
  }
  if (args.includes("--fetch")) {
    const geojson = await fetchGeoJSON();
    return geojson.features.map(transformFeature).filter(Boolean);
  }
  throw new Error("Provide --file <path> or --fetch");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");
  const isUpsert = args.includes("--upsert");
  const isClear  = args.includes("--clear");

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri && !isDryRun) {
    console.error("❌  Set MONGODB_URI or use --dry-run");
    console.error("   export MONGODB_URI=mongodb://localhost:27017/growlocal");
    process.exit(1);
  }

  console.log("🌱  GrowLocal — Venue seeder");
  console.log(`   Mode: ${isDryRun ? "DRY RUN" : isUpsert ? "upsert" : "insert"}\n`);

  const rawDocs = await loadDocs(args);

  // Validate required fields
  const valid = [], invalid = [];
  for (const doc of rawDocs) {
    if (!doc.description) {
      invalid.push({ doc, reason: "missing description" });
    } else if (doc.lat != null && (isNaN(doc.lat) || Math.abs(doc.lat) > 90)) {
      invalid.push({ doc, reason: `bad lat: ${doc.lat}` });
    } else {
      valid.push(doc);
    }
  }

  if (invalid.length) {
    console.warn(`⚠  ${invalid.length} invalid records (skipped):`);
    invalid.forEach(({ doc, reason }) =>
      console.warn(`   • "${doc._meta?.name ?? doc.description}" — ${reason}`)
    );
  }

  console.log(`📊  ${valid.length} valid records ready`);

  // Preview
  const sample = valid[0];
  if (sample) {
    const { _meta, ...clean } = sample;
    console.log(`\nSample → "${clean.description}"`);
    console.log(`   address : ${clean.address ?? "(none)"}`);
    console.log(`   lat/lon : ${clean.lat?.toFixed(5)}, ${clean.lon?.toFixed(5)}`);
    console.log(`   contact : ${JSON.stringify(clean.contact ?? {})}`);
  }

  if (isDryRun) {
    console.log(`\n✅  Dry run complete — ${valid.length} records would be seeded.`);
    return;
  }

  // Connect
  console.log("\n🔌  Connecting to MongoDB…");
  await mongoose.connect(mongoUri);
  console.log("✓  Connected\n");

  try {
    if (isClear) {
      const r = await Venue.deleteMany({ _sourceId: { $exists: true } });
      console.log(`🗑  Removed ${r.deletedCount} existing WCC-sourced venues`);
    }

    let inserted = 0, upserted = 0, errors = [];

    for (const rawDoc of valid) {
      const { _meta, ...doc } = rawDoc;
      if (_meta?.sourceId != null) doc._sourceId = String(_meta.sourceId);

      try {
        if (isUpsert && doc._sourceId) {
          await Venue.findOneAndUpdate(
            { _sourceId: doc._sourceId },
            { $set: doc },
            { upsert: true, setDefaultsOnInsert: true }
          );
          upserted++;
        } else {
          await Venue.create(doc);
          inserted++;
        }
      } catch (err) {
        errors.push(`"${doc.description}": ${err.message}`);
      }
    }

    console.log(`\n✅  Done!`);
    if (inserted) console.log(`   Inserted : ${inserted}`);
    if (upserted) console.log(`   Upserted : ${upserted}`);
    if (errors.length) {
      console.error(`\n❌  ${errors.length} errors:`);
      errors.forEach((e) => console.error(`   • ${e}`));
    }

    console.log(`\n🗄  Total venues in DB: ${await Venue.countDocuments()}`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => { console.error("❌ ", err.message); process.exit(1); });
