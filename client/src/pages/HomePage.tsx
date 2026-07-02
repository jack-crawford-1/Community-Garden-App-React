import { useMemo, useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import MapView from "../components/map/MapView";
import SlidingDrawer from "../components/drawer/SlidingDrawer";
import GardenDetails from "../components/drawer/GardenDetails";
import { useGardens } from "../context/GardensContext";
import { usePageMeta } from "../lib/meta";
import type { GardenSummary } from "../types/garden";
import { filterGardens } from "../lib/search";

export default function HomePage() {
  usePageMeta(
    "Find a community garden near you",
    "Interactive map of community gardens across Wellington, Aotearoa New Zealand. Find a garden near you and get involved.",
  );

  const { gardens, loading, error, retry } = useGardens();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<GardenSummary | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [focus, setFocus] = useState<{ lat: number; lon: number } | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const results = useMemo(() => filterGardens(gardens, query), [gardens, query]);

  const select = (garden: GardenSummary, pan = false) => {
    setSelected(garden);
    setDrawerOpen(true);
    if (pan) setFocus({ lat: garden.lat, lon: garden.lon });
  };

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden">
      {apiKey ? (
        <APIProvider apiKey={apiKey}>
          <div className="absolute inset-0">
            <MapView gardens={gardens} onSelect={(g) => select(g)} focus={focus} />
          </div>
        </APIProvider>
      ) : (
        <div className="flex h-full items-center justify-center bg-leaf-50 px-6 text-center text-sm text-gray-600">
          The map needs a Google Maps API key (VITE_GOOGLE_MAPS_API_KEY) to load.
        </div>
      )}

      {/* Search / results panel */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center p-4 sm:justify-start">
        <div className="pointer-events-auto flex max-h-[calc(100vh-64px-2rem)] w-full max-w-sm flex-col rounded-xl bg-white/95 shadow-lg ring-1 ring-black/5 backdrop-blur">
          <div className="p-4 pb-3">
            <label htmlFor="garden-search" className="sr-only">
              Search gardens
            </label>
            <input
              id="garden-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, suburb or street…"
              className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-500/30"
            />
            <p className="mt-2 text-xs text-gray-500" role="status">
              {loading
                ? "Loading gardens…"
                : error
                  ? ""
                  : query
                    ? `${results.length} of ${gardens.length} gardens`
                    : `${gardens.length} community gardens in Wellington`}
            </p>
          </div>

          {error && (
            <div className="border-t border-gray-100 p-4 text-sm text-gray-700">
              <p>Couldn't load the gardens. Check your connection and try again.</p>
              <button
                onClick={retry}
                className="mt-2 rounded-md bg-leaf-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-leaf-600"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && query && (
            <ul className="overflow-y-auto border-t border-gray-100">
              {results.length === 0 && (
                <li className="px-4 py-3 text-sm text-gray-500">
                  No gardens match "{query}". Try a suburb name, or suggest a garden we're
                  missing.
                </li>
              )}
              {results.map((garden) => (
                <li key={garden.id}>
                  <button
                    onClick={() => select(garden, true)}
                    className="w-full px-4 py-3 text-left transition-colors hover:bg-leaf-50 focus-visible:bg-leaf-50"
                  >
                    <p className="text-sm font-semibold text-moss-950">{garden.name}</p>
                    {garden.address && (
                      <p className="mt-0.5 truncate text-xs text-gray-500">{garden.address}</p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <SlidingDrawer open={drawerOpen} setOpen={setDrawerOpen}>
        <GardenDetails garden={selected} />
      </SlidingDrawer>
    </div>
  );
}
