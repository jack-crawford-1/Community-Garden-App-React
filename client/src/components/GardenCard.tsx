import { Link } from "react-router";
import type { GardenSummary } from "../types/garden";

export default function GardenCard({ garden }: { garden: GardenSummary }) {
  return (
    <Link
      to={`/gardens/${garden.id}`}
      className="group flex flex-col rounded-xl border border-leaf-500/15 bg-white p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-leaf-600"
    >
      {garden.suburb && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-leaf-600">
          {garden.suburb}
        </p>
      )}
      <h3 className="mt-1 font-display text-xl font-semibold leading-snug text-moss-950 group-hover:underline decoration-leaf-500/50 underline-offset-4">
        {garden.name}
      </h3>
      {garden.description ? (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
          {garden.description}
        </p>
      ) : (
        garden.address && (
          <p className="mt-2 text-sm text-gray-600">{garden.address}</p>
        )
      )}
      <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-gray-500">
        {garden.contact?.email && <span>✉ Email</span>}
        {garden.contact?.website && <span>↗ Website</span>}
        <span className="ml-auto font-semibold text-leaf-600 group-hover:translate-x-0.5 transition-transform">
          View →
        </span>
      </div>
    </Link>
  );
}
