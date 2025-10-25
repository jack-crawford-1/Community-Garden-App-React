import { useCallback, useState } from "react";
import type { Feature, Point } from "geojson";
import type { Garden } from "../types/GardenInterface";

export function useSelectedGarden() {
  const [selectedGarden, setSelectedGarden] = useState<Garden | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleShowGardenDetails = useCallback((feature: Feature<Point>) => {
    const props = feature.properties || {};
    const coordinates = feature.geometry?.coordinates;
    if (!coordinates) return;

    setSelectedGarden({
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
      lastUpdated: new Date().toISOString(),
      volunteersWelcome: props.volunteersWelcome ?? false,
      facilities: props.facilities || [],
      events: props.events || [],
      accessibility: props.accessibility || [],
      environment: props.environment || {
        gardenSizeSqm: 0,
        numberOfBeds: 0,
        produceType: [],
        waterSource: [],
        soilType: [],
        irrigationSystem: "",
        compostingFacilities: [],
        mulchingPractices: [],
        organicCertification: "",
        pollinatorSupport: [],
        waterConservation: [],
        fertiliserUse: [],
        seasonalPlantingCalendar: {
          Summer: "",
          Autumn: "",
          Winter: "",
          Spring: "",
        },
      },
      openingHours: props.openingHours || {
        Monday: ["", ""],
        Tuesday: ["", ""],
        Wednesday: ["", ""],
        Thursday: ["", ""],
        Friday: ["", ""],
        Saturday: ["", ""],
        Sunday: ["", ""],
        Holidays: ["", ""],
      },
      partnerships: props.partnerships || [],
      wasteManagement: props.wasteManagement || [],
      rules: props.rules || [],
      insurance: props.insurance || "",
    });

    setDrawerOpen(true);
  }, []);

  return { selectedGarden, drawerOpen, setDrawerOpen, handleShowGardenDetails };
}
