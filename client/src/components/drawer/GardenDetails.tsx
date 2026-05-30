import { Link } from "react-router";
import type { Garden } from "../../types/GardenInterface";
import { PhotoGallery } from "../../app/GardenPage";

export default function GardenDetails({ garden }: { garden: Garden | null }) {
  if (!garden) {
    return (
      <p className="text-sm text-white/60">Select a garden for details.</p>
    );
  }

  const chips: string[] = [];
  if (garden.volunteersWelcome) chips.push("Volunteers welcome");
  if (garden.membershipRequired) chips.push("Membership required");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#7fd1a3]">
          Community garden
        </p>
        <h3 className="mt-1 text-2xl font-bold leading-tight text-white">
          {garden.name || garden.description}
        </h3>
        {garden.address && (
          <p className="mt-2 flex items-start gap-1.5 text-sm text-white/70">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0 text-[#7fd1a3]"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {garden.address}
          </p>
        )}
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90"
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      {garden.photos && garden.photos.length > 0 && (
        <div className="w-full overflow-hidden rounded-lg">
          <PhotoGallery photos={garden.photos} />
        </div>
      )}

      <Link
        to={`/venues/${garden.id}`}
        className="mt-1 inline-flex items-center justify-center rounded-lg bg-[#55b47e] px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-green-700"
      >
        View full details
      </Link>
    </div>
  );
}
