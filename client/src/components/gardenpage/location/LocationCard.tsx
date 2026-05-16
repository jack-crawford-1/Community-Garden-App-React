import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import type { Garden } from "../../../types/GardenInterface";

const ACCENT = "#55b47e";

export default function LocationCard({ garden }: { garden: Garden }) {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const addressLines = (garden.address ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 rounded-2xl overflow-hidden bg-white/5 border border-white/10">
      {/* Left: address & meta */}
      <div className="lg:col-span-2 p-6 flex flex-col justify-between gap-6">
        <div>
          <p
            className="text-xs uppercase tracking-[0.2em] mb-3"
            style={{ color: ACCENT }}
          >
            Address
          </p>
          <address className="not-italic text-white space-y-0.5 leading-relaxed">
            {addressLines.map((line, idx) => (
              <p
                key={line + idx}
                className={idx === 0 ? "font-semibold" : "text-white/70 text-sm"}
              >
                {line}
              </p>
            ))}
          </address>
        </div>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${garden.lat},${garden.lon}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm self-start px-3 py-2 rounded-md border border-white/20 text-white hover:bg-white/10 transition-colors"
        >
          Get directions →
        </a>
      </div>

      {/* Right: map */}
      <div className="lg:col-span-3 h-[260px] lg:h-auto min-h-[200px]">
        {API_KEY ? (
          <APIProvider apiKey={API_KEY}>
            <Map
              mapId={"4ede449a95c7241845c0af90"}
              defaultCenter={{ lat: garden.lat, lng: garden.lon }}
              defaultZoom={14}
              gestureHandling={"greedy"}
              disableDefaultUI
              className="w-full h-full"
            >
              <Marker position={{ lat: garden.lat, lng: garden.lon }} />
            </Map>
          </APIProvider>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/40 text-sm">
            Map unavailable
          </div>
        )}
      </div>
    </div>
  );
}
