/**
 * generate-regional-gardens.js
 * Generates realistic placeholder community garden records for the Wellington
 * region outside Wellington City (Lower Hutt, Upper Hutt, Porirua, Kāpiti Coast).
 *
 * These are AI-generated placeholders grounded in real suburb names and
 * accurate coordinates. Replace with real council data when available.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... node generate-regional-gardens.js \
 *     --out regional-gardens.json
 *
 *   ANTHROPIC_API_KEY=sk-... node generate-regional-gardens.js \
 *     --area lower-hutt --out lh-gardens.json
 */

import fs from "fs/promises";

const MODEL = "claude-sonnet-4-20250514";
const DELAY_MS = 600;

// ---------------------------------------------------------------------------
// Real suburbs with accurate coordinates (WGS84) and garden counts
// ---------------------------------------------------------------------------
const AREAS = [
  // ── Lower Hutt ──────────────────────────────────────────────────────────
  {
    area: "lower-hutt",
    council: "Hutt City Council",
    suburbs: [
      { name: "Petone",         lat: -41.2165, lon: 174.8793, count: 2 },
      { name: "Naenae",         lat: -41.1896, lon: 174.9621, count: 1 },
      { name: "Taita",          lat: -41.1744, lon: 174.9683, count: 1 },
      { name: "Wainuiomata",    lat: -41.2731, lon: 174.9718, count: 1 },
      { name: "Eastbourne",     lat: -41.3015, lon: 174.9145, count: 1 },
      { name: "Stokes Valley",  lat: -41.1738, lon: 175.0077, count: 1 },
      { name: "Moera",          lat: -41.2073, lon: 174.9440, count: 1 },
    ],
  },
  // ── Upper Hutt ──────────────────────────────────────────────────────────
  {
    area: "upper-hutt",
    council: "Upper Hutt City Council",
    suburbs: [
      { name: "Trentham",       lat: -41.1380, lon: 175.0393, count: 1 },
      { name: "Heretaunga",     lat: -41.1311, lon: 175.0568, count: 1 },
      { name: "Silverstream",   lat: -41.1167, lon: 175.0278, count: 1 },
      { name: "Totara Park",    lat: -41.1479, lon: 175.0636, count: 1 },
      { name: "Pinehaven",      lat: -41.1060, lon: 175.0367, count: 1 },
    ],
  },
  // ── Porirua ─────────────────────────────────────────────────────────────
  {
    area: "porirua",
    council: "Porirua City Council",
    suburbs: [
      { name: "Titahi Bay",     lat: -41.1117, lon: 174.8314, count: 1 },
      { name: "Cannons Creek",  lat: -41.1240, lon: 174.8633, count: 2 },
      { name: "Waitangirua",    lat: -41.1419, lon: 174.8575, count: 1 },
      { name: "Whitby",         lat: -41.0903, lon: 174.8692, count: 1 },
      { name: "Paremata",       lat: -41.1001, lon: 174.8639, count: 1 },
    ],
  },
  // ── Kāpiti Coast ────────────────────────────────────────────────────────
  {
    area: "kapiti",
    council: "Kāpiti Coast District Council",
    suburbs: [
      { name: "Paekākāriki",    lat: -40.9893, lon: 174.9569, count: 1 },
      { name: "Raumati",        lat: -40.9345, lon: 175.0131, count: 1 },
      { name: "Paraparaumu",    lat: -40.9159, lon: 175.0086, count: 2 },
      { name: "Waikanae",       lat: -40.8758, lon: 175.0667, count: 2 },
      { name: "Ōtaki",          lat: -40.7565, lon: 175.1481, count: 1 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Prompt — generates a batch of gardens for a suburb
// ---------------------------------------------------------------------------
function buildPrompt(suburb, council, lat, lon, count) {
  return `Generate ${count} realistic community garden record${count > 1 ? "s" : ""} for ${suburb}, ${council.replace(" Council", "")}, New Zealand.

These should feel like real community gardens — grounded in the specific character of ${suburb}. Use actual NZ conventions (māra kai, working bees, etc). The coordinates below are the suburb centre — offset each garden slightly (within ~0.005 degrees) so they don't stack.

Base coordinates: lat ${lat}, lon ${lon}

Return ONLY a valid JSON array of ${count} object${count > 1 ? "s" : ""}. No markdown, no explanation, no code fences.

Each object must have exactly these fields:
{
  "description": "2-3 sentence description specific to ${suburb} and its community character",
  "address": "Plausible street address in ${suburb} e.g. '12 Example Street, ${suburb}'",
  "lat": <number within 0.005 of ${lat}>,
  "lon": <number within 0.005 of ${lon}>,
  "coordinator": "Plausible NZ full name",
  "contact": {
    "email": "plausible lowercase email",
    "phone": "NZ mobile +64 21 or +64 27 format",
    "website": null,
    "social": {
      "facebook": "https://www.facebook.com/groups/[slugname] or null"
    }
  },
  "facilities": ["3-5 items from: Tool shed, Composting bins, Water tap, Raised beds, Communal beds, Private allotments, BBQ area, Seating area, Fruit trees, Herb spiral, Beehives, Kids garden area"],
  "accessibility": ["1-2 items from: Wheelchair accessible path, Raised beds for mobility, Step-free access, Limited accessibility — sloped terrain, No wheelchair access — steep site"],
  "events": [
    { "date": "2025-09-06", "details": "Monthly working bee description" },
    { "date": "2025-10-04", "details": "Another event" }
  ],
  "rules": ["3-4 community garden rules"],
  "partnerships": ["0-2 plausible local Wellington region organisations or empty array"],
  "isTestGarden": false
}`;
}

// ---------------------------------------------------------------------------
// Call Claude
// ---------------------------------------------------------------------------
async function generateForSuburb(suburb, council, lat, lon, count) {
  const prompt = buildPrompt(suburb, council, lat, lon, count);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: count * 800,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data.content[0].text.trim();
  const clean = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

  const parsed = JSON.parse(clean);
  const gardens = Array.isArray(parsed) ? parsed : [parsed];

  // Attach metadata for seeding
  return gardens.map((g) => ({
    ...g,
    _meta: {
      source: "AI-generated",
      council,
      suburb,
      aiGenerated: true,
    },
  }));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const args = process.argv.slice(2);
  const outFlag  = args.indexOf("--out");
  const areaFlag = args.indexOf("--area");
  const outFile  = outFlag !== -1 ? args[outFlag + 1] : "regional-gardens.json";
  const areaFilter = areaFlag !== -1 ? args[areaFlag + 1] : null;

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌  Set ANTHROPIC_API_KEY");
    process.exit(1);
  }

  const areasToProcess = areaFilter
    ? AREAS.filter((a) => a.area === areaFilter)
    : AREAS;

  if (areasToProcess.length === 0) {
    console.error(`❌  Unknown area "${areaFilter}". Options: ${AREAS.map((a) => a.area).join(", ")}`);
    process.exit(1);
  }

  const totalGardens = areasToProcess.reduce(
    (sum, a) => sum + a.suburbs.reduce((s, sub) => s + sub.count, 0), 0
  );

  console.log(`🌱  Generating ~${totalGardens} gardens across ${areasToProcess.length} council area(s)\n`);

  const allGardens = [];
  let done = 0, failed = 0;

  for (const area of areasToProcess) {
    console.log(`\n📍  ${area.council}`);

    for (const sub of area.suburbs) {
      process.stdout.write(`   ${sub.name} (${sub.count} garden${sub.count > 1 ? "s" : ""})… `);

      try {
        const gardens = await generateForSuburb(sub.name, area.council, sub.lat, sub.lon, sub.count);
        allGardens.push(...gardens);
        console.log(`✓  (${gardens.length} generated)`);
        done += gardens.length;

        // Save incrementally
        await fs.writeFile(outFile, JSON.stringify(allGardens, null, 2));
      } catch (err) {
        console.log(`✗  ${err.message}`);
        failed++;
      }

      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }

  console.log(`\n✅  Done — ${done} gardens generated, ${failed} suburbs failed → ${outFile}`);

  // Summary by area
  for (const area of areasToProcess) {
    const count = allGardens.filter((g) => g._meta?.council === area.council).length;
    console.log(`   ${area.council.padEnd(36)} ${count} gardens`);
  }
}

main().catch((err) => { console.error("❌ ", err.message); process.exit(1); });
