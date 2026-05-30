import type { Garden } from "../../../types/GardenInterface";

const ACCENT = "#55b47e";

export default function PartnershipsCard({ garden }: { garden: Garden }) {
  const partners = garden.partnerships ?? [];
  if (partners.length === 0) return null;

  return (
    <ul className="max-w-2xl space-y-2.5">
      {partners.map((partner, idx) => (
        <li
          key={partner + idx}
          className="flex items-start gap-3 text-sm text-green-50/90"
        >
          <span className="mt-0.5" style={{ color: ACCENT }}>
            ·
          </span>
          <span>{partner}</span>
        </li>
      ))}
    </ul>
  );
}
