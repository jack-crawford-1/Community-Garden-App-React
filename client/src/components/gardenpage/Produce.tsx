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

export default function Produce({ garden }: { garden: Garden }) {
  const env = garden.environment;
  if (!env) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
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
