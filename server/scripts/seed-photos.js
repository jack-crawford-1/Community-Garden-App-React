/**
 * Seeds each Venue (garden) with a handful of realistic garden photos so the
 * map popup and garden detail pages have imagery. Uses curated Unsplash photo
 * URLs (verified to resolve). Photos are assigned deterministically by index so
 * reruns are stable and gardens don't all share the same set.
 *
 * The front-end PhotoGallery passes full http(s) URLs straight through, so these
 * render without the S3 signed-url step.
 *
 * Run from the server directory:  node scripts/seed-photos.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../db/mongodbConnection.js";
import Venue from "../models/Venue.js";

dotenv.config();

// Verified-resolving Unsplash photo IDs (gardens, raised beds, produce, greenhouses).
const PHOTO_IDS = [
  "1416879595882-3373a0480b5b",
  "1466692476868-aef1dfb1e735",
  "1591857177580-dc82b9ac4e1e",
  "1523348837708-15d4a09cfac2",
  "1530836369250-ef72a3f5cda8",
  "1592419044706-39796d40f98c",
  "1488459716781-31db52582fe9",
  "1505471768190-275e2ad7b3f9",
  "1518977676601-b53f82aba655",
  "1560493676-04071c5f467b",
  "1574943320219-553eb213f72d",
  "1581578731548-c64695cc6952",
  "1572715376701-98568319fd0b",
  "1601493700631-2b16ec4b4716",
  "1597362925123-77861d3fbac7",
];

const url = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=70`;

// Pick `count` photos starting at `start`, wrapping the pool, no repeats.
function photosFor(start, count) {
  const out = [];
  for (let k = 0; k < count; k++) {
    out.push(url(PHOTO_IDS[(start + k) % PHOTO_IDS.length]));
  }
  return out;
}

async function run() {
  await connectDB(process.env.URI);

  const venues = await Venue.find();
  console.log(`Seeding photos for ${venues.length} gardens...`);

  let n = 0;
  for (let i = 0; i < venues.length; i++) {
    const v = venues[i];
    const count = 4 + (i % 3); // 4–6 photos per garden
    v.photos = photosFor(i * 2, count);
    await v.save();
    n++;
  }

  console.log(`Done — seeded photos for ${n} gardens.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
