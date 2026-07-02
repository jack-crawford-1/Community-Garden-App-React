import type { GardenSummary } from "../types/garden";

/** Case-insensitive match across name, suburb, address and description. */
export function filterGardens(gardens: GardenSummary[], query: string): GardenSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return gardens;
  return gardens.filter((g) =>
    [g.name, g.suburb, g.address, g.description]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(q)),
  );
}
