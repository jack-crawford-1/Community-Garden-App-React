/**
 * enrich-full.js
 * Uses Claude to generate realistic, Wellington-specific data for every
 * VenueSchema field that the WCC GIS data didn't provide.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... node enrich-full.js \
 *     --file gardens-enriched.json \
 *     --out gardens-full.json
 *
 * Safe to re-run — already-enriched records are skipped unless you pass --force.
 * Processes one garden at a time with a short delay to avoid rate limits.
 */

import fs from "fs/promises";

const MODEL = "claude-sonnet-4-20250514";
const DELAY_MS = 500;

// ---------------------------------------------------------------------------
// Prompt
// ---------------------------------------------------------------------------
function buildPrompt(name, address, existingEmail, existingWebsite) {
  const suburb = address?.split(",")[1]?.trim() ?? "Wellington";

  return `You are generating realistic seed data for a community garden directory app covering Wellington, New Zealand.

Generate a JSON object for this garden:
  Name: "${name}"
  Address: "${address}"
  Suburb: "${suburb}"
  ${existingEmail ? `Email: ${existingEmail}` : ""}
  ${existingWebsite ? `Website: ${existingWebsite}` : ""}

Return ONLY a valid JSON object with exactly these fields. No markdown, no explanation, no code fences.

{
  "description": "2-3 sentence warm, specific description. Mention the suburb, what makes this garden distinctive, and who it's for. Be grounded and realistic — avoid generic phrases like 'vibrant community hub'.",

  "coordinator": "A plausible NZ full name (not a real person)",

  "contact": {
    "phone": "A plausible NZ mobile number in format +64 21 XXX XXXX or +64 27 XXX XXXX",
    "facebook": "A plausible Facebook group URL like https://www.facebook.com/groups/[gardenname]wellington or null"
  },

  "facilities": [
    "3-6 items from: Tool shed, Composting bins, Water tap, Wheelbarrow, Raised beds, Communal beds, Private allotments, BBQ area, Seating area, Greenhouse, Fruit trees, Herb spiral, Beehives, Chicken coop, Kids garden area, Shed with tools"
  ],

  "accessibility": [
    "1-3 items from: Wheelchair accessible path, Raised beds for mobility, Step-free access, Accessible parking nearby, Limited accessibility — sloped terrain, No wheelchair access — steep site, Some raised beds at accessible height"
  ],

  "events": [
    {
      "date": "A date in 2025 or 2026 in format YYYY-MM-DD",
      "details": "E.g. 'Monthly working bee — all welcome, bring gloves' or 'Seed swap and planting day'"
    },
    {
      "date": "Another date 4-6 weeks later",
      "details": "Another plausible event"
    }
  ],

  "rules": [
    "3-5 plausible community garden rules e.g. 'No pesticides or herbicides', 'Take only what you plant', 'Lock the gate after your visit', 'Respect other gardeners plots', 'Children must be supervised at all times'"
  ],

  "partnerships": [
    "0-2 plausible Wellington organisations e.g. 'Wellington City Council', 'Kaibosh Food Rescue', 'Sustainability Trust', 'local primary school name', 'Kāpiti Community Gardens Network' — or empty array if none makes sense"
  ]
}`;
}

// ---------------------------------------------------------------------------
// Call Claude
// ---------------------------------------------------------------------------
async function enrichGarden(doc) {
  const name = doc._meta?.name ?? doc.description;
  const prompt = buildPrompt(
    name,
    doc.address,
    doc.contact?.email,
    doc.contact?.website
  );

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data.content[0].text.trim();

  // Strip any accidental markdown fences
  const clean = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

  let enriched;
  try {
    enriched = JSON.parse(clean);
  } catch {
    throw new Error(`Bad JSON from Claude: ${clean.slice(0, 300)}`);
  }

  return enriched;
}

// ---------------------------------------------------------------------------
// Merge enriched data into the existing doc
// ---------------------------------------------------------------------------
function mergeEnriched(doc, enriched) {
  // Description — prefer AI-generated over name-fallback
  if (enriched.description) {
    doc.description = enriched.description;
  }

  // Coordinator
  if (enriched.coordinator && !doc.coordinator) {
    doc.coordinator = enriched.coordinator;
  }

  // Contact — merge without clobbering existing email from WCC data
  if (!doc.contact) doc.contact = {};
  if (enriched.contact?.phone) doc.contact.phone = enriched.contact.phone;
  if (enriched.contact?.facebook) {
    if (!doc.contact.social) doc.contact.social = {};
    doc.contact.social.facebook = enriched.contact.facebook;
  }

  // Arrays — only set if not already populated
  if (enriched.facilities?.length)   doc.facilities   = enriched.facilities;
  if (enriched.accessibility?.length) doc.accessibility = enriched.accessibility;
  if (enriched.events?.length)        doc.events        = enriched.events;
  if (enriched.rules?.length)         doc.rules         = enriched.rules;
  if (enriched.partnerships?.length)  doc.partnerships  = enriched.partnerships;

  // Mark as enriched so re-runs can skip
  if (doc._meta) doc._meta.aiEnriched = true;

  return doc;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const args = process.argv.slice(2);
  const fileFlag = args.indexOf("--file");
  const outFlag  = args.indexOf("--out");
  const force    = args.includes("--force");

  if (fileFlag === -1) {
    console.error("Usage: node enrich-full.js --file gardens.json --out gardens-full.json [--force]");
    process.exit(1);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌  Set ANTHROPIC_API_KEY");
    process.exit(1);
  }

  const inputFile = args[fileFlag + 1];
  const outFile   = outFlag !== -1
    ? args[outFlag + 1]
    : inputFile.replace(".json", "-full.json");

  const docs = JSON.parse(await fs.readFile(inputFile, "utf-8"));

  const toEnrich = force
    ? docs
    : docs.filter((d) => !d._meta?.aiEnriched);

  console.log(`🌱  Full enrichment — ${toEnrich.length} gardens to process\n`);

  let done = 0, failed = 0;

  for (const doc of docs) {
    if (!force && doc._meta?.aiEnriched) {
      process.stdout.write(`  ⏭  Skipping (already enriched): ${doc._meta?.name ?? doc.description}\n`);
      continue;
    }

    const name = doc._meta?.name ?? doc.description;
    process.stdout.write(`  [${done + failed + 1}/${toEnrich.length}] ${name}… `);

    try {
      const enriched = await enrichGarden(doc);
      mergeEnriched(doc, enriched);
      console.log("✓");
      done++;
    } catch (err) {
      console.log(`✗ ${err.message}`);
      failed++;
    }

    // Save after every garden so progress isn't lost if the script is interrupted
    await fs.writeFile(outFile, JSON.stringify(docs, null, 2));

    if (done + failed < toEnrich.length) {
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }

  console.log(`\n✅  Done — ${done} enriched, ${failed} failed → ${outFile}`);
  if (failed > 0) {
    console.log(`   Re-run with --force to retry failed gardens.`);
  }
}

main().catch((err) => { console.error("❌ ", err.message); process.exit(1); });
