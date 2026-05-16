/**
 * enrich-descriptions.js
 * Uses Claude to generate descriptions for the gardens that have a null
 * Description field in the WCC data. Reads gardens.json, writes gardens-enriched.json.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... node enrich-descriptions.js --file gardens.json --out gardens-enriched.json
 *
 * Safe to re-run — skips gardens that already have a real Description.
 */

import fs from "fs/promises";

const MODEL = "claude-sonnet-4-20250514";

async function generateDescription(name, address) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 120,
      messages: [
        {
          role: "user",
          content:
            `Write a 1-2 sentence description for a Wellington community garden called "${name}" ` +
            `located at "${address}". Be warm, inviting, and specific to Wellington. ` +
            `Return only the description text — no quotes, no preamble.`,
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`);
  const data = await res.json();
  return data.content[0].text.trim();
}

async function main() {
  const args = process.argv.slice(2);
  const fileFlag = args.indexOf("--file");
  const outFlag = args.indexOf("--out");

  if (fileFlag === -1) {
    console.error("Usage: node enrich-descriptions.js --file gardens.json --out gardens-enriched.json");
    process.exit(1);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌  Set ANTHROPIC_API_KEY");
    process.exit(1);
  }

  const inputFile = args[fileFlag + 1];
  const outFile = outFlag !== -1 ? args[outFlag + 1] : inputFile.replace(".json", "-enriched.json");

  const docs = JSON.parse(await fs.readFile(inputFile, "utf-8"));
  const toEnrich = docs.filter((d) => !d._meta?.hasDescription);

  console.log(`🌱  Enriching ${toEnrich.length} descriptions (${docs.length - toEnrich.length} already have one)\n`);

  let enriched = 0;
  for (const doc of docs) {
    if (doc._meta?.hasDescription) continue;

    const name = doc._meta?.name ?? doc.description;
    const address = doc.address ?? "";

    try {
      process.stdout.write(`  Generating: "${name}"… `);
      const generated = await generateDescription(name, address);
      doc.description = generated;
      if (doc._meta) doc._meta.hasDescription = true;
      console.log("✓");
      enriched++;

      // Polite rate limiting
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.log(`✗ (${err.message}) — keeping name as fallback`);
    }
  }

  await fs.writeFile(outFile, JSON.stringify(docs, null, 2));
  console.log(`\n✅  Enriched ${enriched} descriptions → ${outFile}`);
}

main().catch((err) => { console.error("❌ ", err.message); process.exit(1); });
