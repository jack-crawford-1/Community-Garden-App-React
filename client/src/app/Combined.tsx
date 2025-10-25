import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";
import { useGardenData } from "../hooks/useGardenData";
import SlidingDrawer from "../components/drawer/SlidingDrawer";
import GardenDetails from "../components/drawer/GardenDetails";
import { LeafSvg } from "../components/markers/leafSvg";
import { useEffect, useMemo, useState } from "react";
import useSupercluster from "use-supercluster";
import {
  SelectedGardenProvider,
  useSelectedGarden,
} from "../components/drawer/SelectedGardenContext";
import type { Feature, Point } from "geojson";
import type { Garden } from "../types/GardenInterface";
import Modal from "../components/modal/Modal";
import Navbar from "../components/nav/Navbar";

function MarkerLayer() {
  const map = useMap();
  const gardenData = useGardenData();
  const { handleShowGardenDetails } = useSelectedGarden();
  const [bounds, setBounds] = useState<[number, number, number, number]>();
  const [zoom, setZoom] = useState(10);

  const [, setConfirmLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const points = useMemo(() => {
    if (!gardenData) return [];
    return gardenData.features.map((feature) => ({
      type: "Feature" as const,
      properties: {
        cluster: false,
        gardenId: feature.id,
        ...feature.properties,
        description: feature.properties?.description,
        address: feature.properties?.address,
        coordinator: feature.properties?.coordinator,
        contact: feature.properties?.contact,
        photos: feature.properties?.photos,
      },
      geometry: {
        type: "Point" as const,
        coordinates: feature.geometry.coordinates,
      },
    }));
  }, [gardenData]);

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  useEffect(() => {
    if (!map) return;

    const updateBounds = () => {
      const gBounds = map.getBounds();
      if (!gBounds) return;

      const sw = gBounds.getSouthWest();
      const ne = gBounds.getNorthEast();
      setBounds([sw.lng(), sw.lat(), ne.lng(), ne.lat()]);
      setZoom(map.getZoom() ?? 10);
    };

    updateBounds();
    const listener = map.addListener("bounds_changed", updateBounds);
    return () => listener.remove();
  }, [map]);

  return (
    <>
      {clusters.map((cluster) => {
        const [lng, lat] = cluster.geometry.coordinates;
        const properties = cluster.properties;
        const isCluster =
          typeof properties.cluster === "boolean" &&
          properties.cluster === true &&
          typeof (properties as any).point_count === "number";

        if (isCluster) {
          const pointCount = (properties as any).point_count;
          const size = Math.ceil(30 + Math.log(pointCount) * 15);

          return (
            <AdvancedMarker
              key={`cluster-${cluster.id}`}
              position={{ lat, lng }}
              onClick={() => {
                setConfirmLatLng(null);
                const expansionZoom =
                  supercluster && typeof cluster.id === "number"
                    ? Math.min(
                        supercluster.getClusterExpansionZoom(cluster.id),
                        20
                      )
                    : zoom;
                map?.setZoom(expansionZoom);
                map?.panTo({ lat, lng });
              }}
            >
              <div
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: "50%",
                  border: "4px solid #ffffffdd",
                  background: "#276749dd",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  const expansionZoom =
                    supercluster && typeof cluster.id === "number"
                      ? Math.min(
                          supercluster.getClusterExpansionZoom(cluster.id),
                          20
                        )
                      : zoom;
                  map?.setZoom(expansionZoom);
                  map?.panTo({ lat, lng });
                }}
              >
                {pointCount}
              </div>
            </AdvancedMarker>
          );
        }

        return (
          <AdvancedMarker
            key={`garden-${properties.gardenId}`}
            position={{ lat, lng }}
            onClick={() => {
              const originalFeature = gardenData?.features.find(
                (f) => f.id === properties.gardenId
              );

              if (originalFeature) {
                handleShowGardenDetails(originalFeature);
              }
            }}
          >
            <div
              className="bg-[#55b47e]"
              style={{
                padding: "6px",
                borderRadius: "100px",
                border: "2px solid white",
                width: "45px",
                height: "45px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LeafSvg />
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
}

function featureToGarden(feature: Feature<Point> | null): Garden | null {
  if (!feature) return null;
  const props = feature.properties || {};
  const coordinates = feature.geometry?.coordinates;
  if (!coordinates) return null;
  return {
    id: feature.id as string,
    name: props.name || "Unknown",
    coordinator: props.coordinator || "N/A",
    lat: coordinates[1],
    lon: coordinates[0],
    description: props.description || "No description available",
    address: props.address || "No address available",
    phone: props.contact?.phone || "N/A",
    contact: props.contact || {},
    photos: props.photos || [],
    membershipRequired: props.membershipRequired || false,
    email: props.email || "",
  };
}

function InnerMap({ apiKey, mapId }: { apiKey: string; mapId: string }) {
  const { selectedGarden, drawerOpen, setDrawerOpen } = useSelectedGarden();
  const [confirmLatLng, setConfirmLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {}, [selectedGarden, drawerOpen]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <APIProvider apiKey={apiKey}>
        <div className="absolute inset-0 z-0">
          <Map
            mapId={mapId}
            className="h-full w-full"
            defaultZoom={10}
            defaultCenter={{ lat: -41.2, lng: 174.9 }}
            disableDefaultUI
            gestureHandling="greedy"
            onClick={(e) => {
              if (!drawerOpen && e.detail?.latLng) {
                setConfirmLatLng({
                  lat: e.detail.latLng.lat,
                  lng: e.detail.latLng.lng,
                });
              }
            }}
          />

          <MarkerLayer />
        </div>

        <SlidingDrawer open={drawerOpen} setOpen={setDrawerOpen}>
          <GardenDetails garden={featureToGarden(selectedGarden)} />
        </SlidingDrawer>
        {!drawerOpen && confirmLatLng && (
          <Modal
            confirmLatLng={confirmLatLng}
            setConfirmLatLng={setConfirmLatLng}
          />
        )}
      </APIProvider>
    </div>
  );
}

export default function MapPage() {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const MAP_ID = import.meta.env.VITE_MAP_ID;

  return (
    <div>
      <Navbar />
      <SelectedGardenProvider>
        <InnerMap apiKey={API_KEY} mapId={MAP_ID} />
      </SelectedGardenProvider>
    </div>
  );
}
