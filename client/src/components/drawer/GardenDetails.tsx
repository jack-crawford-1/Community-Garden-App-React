import { Link } from "react-router";
import type { GardenSummary } from "../../types/garden";

export default function GardenDetails({ garden }: { garden: GardenSummary | null }) {
  if (!garden) {
    return <p className="text-sm text-white/60">Select a garden to see its details.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        {garden.suburb && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf-300">
            {garden.suburb}
          </p>
        )}
        <h3 className="mt-1 font-display text-2xl font-semibold leading-tight text-white">
          {garden.name}
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
              className="mt-0.5 shrink-0 text-leaf-300"
              aria-hidden="true"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {garden.address}
          </p>
        )}
      </div>

      {garden.description && (
        <p className="text-sm leading-relaxed text-white/80">{garden.description}</p>
      )}

      <div className="flex flex-col gap-2 text-sm">
        {garden.contact?.email && (
          <a href={`mailto:${garden.contact.email}`} className="text-leaf-300 hover:underline">
            ✉ {garden.contact.email}
          </a>
        )}
        {garden.contact?.website && (
          <a
            href={garden.contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-leaf-300 hover:underline"
          >
            ↗ {garden.contact.website.replace(/^https?:\/\//, "")}
          </a>
        )}
      </div>

      <Link
        to={`/gardens/${garden.id}`}
        className="mt-1 inline-flex items-center justify-center rounded-lg bg-leaf-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-leaf-600"
      >
        View full details
      </Link>
    </div>
  );
}
