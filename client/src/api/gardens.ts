import type { FeatureCollection, Point } from "geojson";
import type { Garden, GardenProperties, GardenSummary } from "../types/garden";
import { API_BASE_URL } from "./config";

type RequestOptions = {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { Accept: "application/json", ...options.headers },
  });
  if (!res.ok) {
    const body: unknown = await res.json().catch(() => null);
    const message =
      typeof body === "object" && body !== null && "message" in body && typeof body.message === "string"
        ? body.message
        : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function fetchGardens(): Promise<GardenSummary[]> {
  const geojson = await request<FeatureCollection<Point, GardenProperties>>("/gardens");
  return geojson.features
    .filter((f) => f.geometry.coordinates.length === 2)
    .map((f) => ({
      id: String(f.id),
      lat: f.geometry.coordinates[1],
      lon: f.geometry.coordinates[0],
      ...f.properties,
    }));
}

export function fetchGarden(id: string): Promise<Garden> {
  return request<Garden>(`/gardens/${encodeURIComponent(id)}`);
}

export type SuggestionPayload = {
  kind: "new-garden" | "correction";
  gardenId?: string;
  gardenName: string;
  address?: string;
  message: string;
  submitterEmail?: string;
};

export function submitSuggestion(payload: SuggestionPayload): Promise<{ id: string; message: string }> {
  return request("/suggestions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
