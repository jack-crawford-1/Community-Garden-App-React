import type { Garden } from "../../types/GardenInterface";

const ACCENT = "#55b47e";

function ChipList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item, idx) => (
        <li
          key={item + idx}
          className="px-3 py-1.5 rounded-full text-sm bg-white/5 border border-white/10 text-green-50"
        >
          {item.trim()}
        </li>
      ))}
    </ul>
  );
}

function SubBlock({
  title,
  icons,
  items,
}: {
  title: string;
  icons: string[];
  items?: string[];
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h4
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: ACCENT }}
        >
          {title}
        </h4>
        <div className="flex gap-1.5">
          {icons.slice(0, 4).map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              className="w-7 h-7 p-1 rounded-md border border-white/15"
            />
          ))}
        </div>
      </div>
      <ChipList items={items} />
    </div>
  );
}

export default function Facilities({ garden }: { garden: Garden }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
