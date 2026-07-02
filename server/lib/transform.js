// Wellington suburbs that appear in the WCC dataset. Council addresses are
// inconsistent ("Beside 559 Adelaide Rd, Berhampore", "96 - 112 Kelburn
// Parade"), so matching against known suburbs beats positional parsing.
const WELLINGTON_SUBURBS = [
  "Aro Valley", "Berhampore", "Brooklyn", "Hataitai", "Houghton Bay",
  "Island Bay", "Karori", "Kelburn", "Khandallah", "Kilbirnie", "Linden",
  "Lyall Bay", "Maupuia", "Melrose", "Miramar", "Mount Cook",
  "Mount Victoria", "Newtown", "Ngaio", "Owhiro Bay", "Paparangi",
  "Rongotai", "Roseneath", "Tawa", "Te Aro", "Wilton",
];

export function suburbFromAddress(address) {
  if (!address) return undefined;
  const lower = address.toLowerCase();
  // Prefer the match that appears latest in the address — suburbs come
  // after street names ("1 Endeavour Street, Lyall Bay, Wellington").
  let best;
  let bestIndex = -1;
  for (const suburb of WELLINGTON_SUBURBS) {
    const index = lower.lastIndexOf(suburb.toLowerCase());
    if (index > bestIndex) {
      bestIndex = index;
      best = suburb;
    }
  }
  return best;
}

/** Map a fetched WCC record (see scripts/fetch-wcc-gardens.js) to a Garden doc. */
export function toGardenDoc(record) {
  const meta = record._meta ?? {};
  const name = (meta.name ?? record.description ?? "").trim().replace(/\s+/g, " ");
  if (!name || record.lat == null || record.lon == null) return null;

  const address = record.address
    ? record.address.trim().replace(/\s+/g, " ")
    : undefined;

  const doc = {
    name,
    // The fetcher falls back to the name when WCC has no description —
    // only keep descriptions that are genuinely descriptive.
    description: meta.hasDescription ? record.description : undefined,
    address,
    suburb: suburbFromAddress(address),
    region: "Wellington",
    lat: record.lat,
    lon: record.lon,
    contact: record.contact,
    source: meta.source,
    sourceId: meta.sourceId,
  };
  for (const key of Object.keys(doc)) {
    if (doc[key] === undefined) delete doc[key];
  }
  return doc;
}
