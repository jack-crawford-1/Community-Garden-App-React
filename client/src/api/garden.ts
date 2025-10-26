import type { FeatureCollection, Point } from "geojson";
import { API_BASE_URL } from "./config";

export async function fetchGardensGeoJSON(): Promise<FeatureCollection<Point>> {
  const res = await fetch(`${API_BASE_URL}/gardens`);
  const geojson = await res.json();

  if (geojson.type === "FeatureCollection" && Array.isArray(geojson.features)) {
    return geojson as FeatureCollection<Point>;
  }
  if (Array.isArray(geojson)) {
    return {
      type: "FeatureCollection",
      features: geojson
        .filter(
          (g: { lat: number | null; lon: number | null }) =>
            g.lat != null && g.lon != null
        )
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
  return {
    type: "FeatureCollection",
    features: [],
  };
}
