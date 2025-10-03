import type { FeatureCollection, GeoJsonProperties, Point } from "geojson";
import Supercluster, { type ClusterProperties } from "supercluster";
import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useMapViewport } from "./useMapViewports";

export function useSupercluster<T extends GeoJsonProperties>(
  geojson: FeatureCollection<Point, T>,
  superclusterOptions: Supercluster.Options<T, ClusterProperties>
) {
  const clusterer = useMemo(() => {
    return new Supercluster(superclusterOptions);
  }, [superclusterOptions]);

  const [version, dataWasUpdated] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    if (geojson.features.length > 0) {
      clusterer.load(geojson.features);
      dataWasUpdated();
    }
  }, [clusterer, geojson]);

  const { bbox, zoom } = useMapViewport({ padding: 0 });

  const clusters = useMemo(() => {
    if (!clusterer || version === 0) return [];
    const generatedClusters = clusterer.getClusters(bbox, zoom);

    return generatedClusters;
  }, [version, clusterer, bbox, zoom]);

  const getChildren = useCallback(
    (clusterId: number) => clusterer.getChildren(clusterId),
    [clusterer]
  );

  const getLeaves = useCallback(
    (clusterId: number) => clusterer.getLeaves(clusterId, Infinity),
    [clusterer]
  );

  const getClusterExpansionZoom = useCallback(
    (clusterId: number) => clusterer.getClusterExpansionZoom(clusterId),
    [clusterer]
  );

  return {
    clusters,
    getChildren,
    getLeaves,
    getClusterExpansionZoom,
  };
}
