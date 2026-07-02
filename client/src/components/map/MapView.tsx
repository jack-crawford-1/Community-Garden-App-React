import { AdvancedMarker, Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useMemo, useState } from "react";
import useSupercluster from "use-supercluster";
import type { BBox } from "geojson";
import type { GardenSummary } from "../../types/garden";
import { LeafSvg } from "../markers/leafSvg";

const WELLINGTON = { lat: -41.27, lng: 174.83 };

type MapViewProps = {
  gardens: GardenSummary[];
  onSelect: (garden: GardenSummary) => void;
  /** Pan the map here when the value changes (e.g. a list item was clicked). */
  focus?: { lat: number; lon: number } | null;
};

export default function MapView({ gardens, onSelect, focus }: MapViewProps) {
  const mapId = import.meta.env.VITE_MAP_ID as string | undefined;
  const [authFailed, setAuthFailed] = useState(false);

  // Google calls this global when the API key is rejected (wrong key,
  // referrer not allowed, billing) — without it the map area shows Google's
  // grey error panel and markers crash the page.
  useEffect(() => {
    const g = window as Window & { gm_authFailure?: () => void };
    const previous = g.gm_authFailure;
    g.gm_authFailure = () => setAuthFailed(true);
    return () => {
      g.gm_authFailure = previous;
    };
  }, []);

  if (authFailed) {
    return (
      <div className="flex h-full items-center justify-center bg-leaf-50 px-6 text-center text-sm text-gray-600">
        The map couldn't load. Use the search above or browse the directory instead.
      </div>
    );
  }

  return (
    <Map
      mapId={mapId}
      className="h-full w-full"
      defaultZoom={11}
      defaultCenter={WELLINGTON}
      disableDefaultUI
      zoomControl
      gestureHandling="greedy"
    >
      <MarkerLayer gardens={gardens} onSelect={onSelect} focus={focus} />
    </Map>
  );
}

function MarkerLayer({ gardens, onSelect, focus }: MapViewProps) {
  const map = useMap();
  const [bounds, setBounds] = useState<BBox>();
  const [zoom, setZoom] = useState(11);

  useEffect(() => {
    if (!map) return;
    const updateBounds = () => {
      const b = map.getBounds();
      if (!b) return;
      const sw = b.getSouthWest();
      const ne = b.getNorthEast();
      setBounds([sw.lng(), sw.lat(), ne.lng(), ne.lat()]);
      setZoom(map.getZoom() ?? 11);
    };
    updateBounds();
    const listener = map.addListener("bounds_changed", updateBounds);
    return () => listener.remove();
  }, [map]);

  useEffect(() => {
    if (map && focus) {
      map.panTo({ lat: focus.lat, lng: focus.lon });
      if ((map.getZoom() ?? 0) < 14) map.setZoom(14);
    }
  }, [map, focus]);

  const points = useMemo(
    () =>
      gardens.map((garden) => ({
        type: "Feature" as const,
        properties: { cluster: false as const, gardenId: garden.id },
        geometry: { type: "Point" as const, coordinates: [garden.lon, garden.lat] },
      })),
    [gardens],
  );

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  // `Map` is the Google Maps component in this scope — use the global explicitly.
  const byId = useMemo(
    () => new globalThis.Map(gardens.map((g) => [g.id, g] as const)),
    [gardens],
  );

  return (
    <>
      {clusters.map((cluster) => {
        const [lng, lat] = cluster.geometry.coordinates;

        if (cluster.properties.cluster) {
          const pointCount = cluster.properties.point_count;
          const size = Math.ceil(30 + Math.log(pointCount) * 15);
          const expand = () => {
            const expansionZoom =
              supercluster && typeof cluster.id === "number"
                ? Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20)
                : zoom + 2;
            map?.setZoom(expansionZoom);
            map?.panTo({ lat, lng });
          };

          return (
            <AdvancedMarker key={`cluster-${String(cluster.id)}`} position={{ lat, lng }} onClick={expand}>
              <div
                className="relative flex cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-105"
                style={{ width: size, height: size }}
                role="button"
                aria-label={`${pointCount} gardens — zoom in`}
              >
                <span className="absolute inset-0 rounded-full bg-leaf-500 opacity-25" />
                <span
                  className="flex items-center justify-center rounded-full border-2 border-white/90 bg-leaf-700 font-bold text-white shadow-lg"
                  style={{ width: Math.round(size * 0.74), height: Math.round(size * 0.74) }}
                >
                  {pointCount}
                </span>
              </div>
            </AdvancedMarker>
          );
        }

        const garden = byId.get(cluster.properties.gardenId);
        if (!garden) return null;

        return (
          <AdvancedMarker
            key={`garden-${garden.id}`}
            position={{ lat, lng }}
            onClick={() => onSelect(garden)}
            title={garden.name}
          >
            <div className="flex cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-110">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-lg"
                style={{ background: "linear-gradient(145deg, #5cbf86, #3f9466)" }}
              >
                <LeafSvg />
              </div>
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
}
