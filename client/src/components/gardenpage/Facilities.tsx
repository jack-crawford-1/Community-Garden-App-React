import type { Garden } from "../../types/GardenInterface";

const ACCENT = "#55b47e";

function SubBlock({
  title,
  items,
}: {
  title: string;
  icons?: string[];
  items?: string[];
}) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p
        className="text-xs uppercase tracking-[0.2em] mb-2"
        style={{ color: ACCENT }}
      >
        {title}
      </p>
      <p className="text-sm leading-relaxed text-green-50/90">
        {items.map((i) => i.trim()).join("   ·   ")}
      </p>
    </div>
  );
}

export default function Facilities({ garden }: { garden: Garden }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
      <SubBlock
        title="On-site facilities"
        icons={[
          "/svg/gardenpage/toilet.svg",
          "/svg/gardenpage/bbq.svg",
          "/svg/gardenpage/greenhouse.svg",
          "/svg/gardenpage/kitchen.svg",
        ]}
        items={garden.facilities}
      />
      <SubBlock
        title="Accessibility"
        icons={[
          "/svg/gardenpage/parking.svg",
          "/svg/gardenpage/disabled.svg",
          "/svg/gardenpage/toilet.svg",
        ]}
        items={garden.accessibility}
      />
      <SubBlock
        title="Waste management"
        icons={[
          "/svg/gardenpage/recycling.svg",
          "/svg/gardenpage/rubbish.svg",
          "/svg/gardenpage/biohazard.svg",
        ]}
        items={garden.wasteManagement}
      />
    </div>
  );
}
