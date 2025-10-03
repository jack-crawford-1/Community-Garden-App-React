import { createContext, useContext, useState } from "react";
import type { Feature, Point } from "geojson";

type ContextType = {
  selectedGarden: Feature<Point> | null;
  setSelectedGarden: (g: Feature<Point> | null) => void;
  drawerOpen: boolean;
  setDrawerOpen: (o: boolean) => void;
  handleShowGardenDetails: (g: Feature<Point>) => void;
};

const SelectedGardenContext = createContext<ContextType | undefined>(undefined);

export const SelectedGardenProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedGarden, setSelectedGarden] = useState<Feature<Point> | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleShowGardenDetails = (g: Feature<Point>) => {
    console.log("📦 handleShowGardenDetails called with:", g);
    setSelectedGarden(g);
    setDrawerOpen(true);
  };

  return (
    <SelectedGardenContext.Provider
      value={{
        selectedGarden,
        setSelectedGarden,
        drawerOpen,
        setDrawerOpen,
        handleShowGardenDetails,
      }}
    >
      {children}
    </SelectedGardenContext.Provider>
  );
};

export const useSelectedGarden = () => {
  const ctx = useContext(SelectedGardenContext);
  if (!ctx) {
    throw new Error(
      "useSelectedGarden must be used within a SelectedGardenProvider"
    );
  }
  return ctx;
};
