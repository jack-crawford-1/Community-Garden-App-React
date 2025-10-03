import type { FeatureCollection, Point } from "geojson";

export async function fetchGardensGeoJSON(): Promise<FeatureCollection<Point>> {
  const res = await fetch("http://localhost:3000/gardens");
  const gardens = await res.json();

  return {
    type: "FeatureCollection",
    features: gardens
      .filter((g: { lat: null; lon: null }) => g.lat != null && g.lon != null)
      .map((g: any) => ({
        type: "Feature" as const,
        id: g._id,
        geometry: {
          type: "Point" as const,
          coordinates: [Number(g.lon), Number(g.lat)],
        },
        properties: {
          name: g.name,
          description: g.description,
          coordinator: g.coordinator,
          address: g.address,
          phone: g.phone || "N/A",
          contact: g.contact || {},
          photos: g.photos || [],
          email: g.email || "",
          membershipRequired: g.membershipRequired || false,
        },
      })),
  };
}
