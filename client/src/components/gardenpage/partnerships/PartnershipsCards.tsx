import type { Garden } from "../../../types/GardenInterface";

const LOGOS = [
  { src: "/png/wcclogo.png", alt: "Wellington City Council" },
  { src: "/png/lionslogo.png", alt: "Lions Club" },
  { src: "/png/stjohnlogo.png", alt: "St John" },
  { src: "/png/ac.png", alt: "Sponsor" },
];

export default function PartnershipsCard({ garden }: { garden: Garden }) {
  const partners = garden.partnerships ?? [];

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <ul className="space-y-2 mb-6">
        {partners.map((partner, idx) => (
          <li
            key={partner + idx}
            className="flex items-start gap-3 text-green-50"
          >
            <span className="text-[#55b47e] mt-1">◆</span>
            <span>{partner}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
        {LOGOS.map(({ src, alt }) => (
          <img
            key={src}
            src={src}
            alt={alt}
            className="w-12 h-12 p-1.5 rounded-md border border-white/15 bg-white/5 object-contain"
          />
        ))}
      </div>
    </div>
  );
}
