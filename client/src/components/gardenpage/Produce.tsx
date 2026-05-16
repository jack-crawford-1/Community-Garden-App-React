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

export default function Produce({ garden }: { garden: Garden }) {
  const env = garden.environment;
  if (!env) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SubBlock
        title="Produce grown"
        icons={[
          "/svg/gardenpage/apple.svg",
          "/svg/gardenpage/sprout.svg",
          "/svg/gardenpage/carrot.svg",
          "/svg/gardenpage/herb.svg",
        ]}
        items={env.produceType}
      />
      <SubBlock
        title="Pollinators & wildlife"
        icons={[
          "/svg/gardenpage/bee.svg",
          "/svg/gardenpage/lizard.svg",
          "/svg/gardenpage/frog.svg",
          "/svg/gardenpage/birdhouse.svg",
        ]}
        items={env.pollinatorSupport}
      />
      <SubBlock
        title="Water management"
        icons={[
          "/svg/gardenpage/water.svg",
          "/svg/gardenpage/rainwater.svg",
          "/svg/gardenpage/drip.svg",
          "/svg/gardenpage/mulch.svg",
        ]}
        items={env.waterConservation}
      />
      <SubBlock
        title="Fertiliser use"
        icons={["/svg/gardenpage/organic.svg", "/svg/gardenpage/seaweed.svg"]}
        items={env.fertiliserUse}
      />
      <SubBlock
        title="Soil type"
        icons={[
          "/svg/gardenpage/sandy.svg",
          "/svg/gardenpage/sandy1.svg",
          "/svg/gardenpage/hand.svg",
        ]}
        items={env.soilType}
      />
      <SubBlock
        title="Composting"
        icons={["/svg/gardenpage/recycling.svg"]}
        items={env.compostingFacilities}
      />
    </div>
  );
}
