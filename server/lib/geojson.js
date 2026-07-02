/**
 * Convert garden documents into a GeoJSON FeatureCollection —
 * the shape the map client and any GIS tooling consume directly.
 */
export function gardensToGeoJSON(gardens) {
  return {
    type: "FeatureCollection",
    features: gardens
      .filter((g) => typeof g.lat === "number" && typeof g.lon === "number")
      .map((g) => ({
        type: "Feature",
        id: g._id.toString(),
        geometry: { type: "Point", coordinates: [g.lon, g.lat] },
        properties: {
          name: g.name,
          description: g.description ?? null,
          address: g.address ?? null,
          suburb: g.suburb ?? null,
          region: g.region ?? null,
          contact: g.contact ?? null,
          photos: g.photos ?? [],
        },
      })),
  };
}
