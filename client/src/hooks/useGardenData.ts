// useGardens.ts
import { useEffect, useState } from "react";
import type { FeatureCollection, Point } from "geojson";
import { fetchGardensGeoJSON } from "../api/garden";

export function useGardenData(): FeatureCollection<Point> | null {
  const [geojson, setGeojson] = useState<FeatureCollection<Point> | null>(null);

  useEffect(() => {
    fetchGardensGeoJSON().then(setGeojson).catch(console.error);
  }, []);

  return geojson;
}
