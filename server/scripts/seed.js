/**
 * Seed the gardens collection from data/gardens.json (real WCC GIS data).
 *
 * Upserts by (source, sourceId) so it is safe to re-run after fetching a
 * fresh dataset with fetch-wcc-gardens.js. Pass --replace to first delete
 * every existing document (a full reset).
 *
 * Usage:
 *   npm run seed              # upsert
 *   npm run seed -- --replace # wipe and reseed
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Garden from "../models/Garden.js";
import { connectDB, disconnectDB } from "../db/connect.js";
import { env } from "../config/env.js";
import { toGardenDoc } from "../lib/transform.js";

const dataFile = path.join(path.dirname(fileURLToPath(import.meta.url)), "../data/gardens.json");

async function main() {
  const replace = process.argv.includes("--replace");
  const records = JSON.parse(await fs.readFile(dataFile, "utf-8"));
  const docs = records.map(toGardenDoc).filter(Boolean);

  await connectDB(env.mongoUri, env.dbName);

  if (replace) {
    const { deletedCount } = await Garden.deleteMany({});
    console.log(`Deleted ${deletedCount} existing gardens`);
  }

  let upserted = 0;
  for (const doc of docs) {
    await Garden.updateOne(
      doc.sourceId != null ? { source: doc.source, sourceId: doc.sourceId } : { name: doc.name },
      { $set: doc },
      { upsert: true },
    );
    upserted++;
  }
  console.log(`Seeded ${upserted} gardens (${replace ? "replace" : "upsert"} mode)`);

  await disconnectDB();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
