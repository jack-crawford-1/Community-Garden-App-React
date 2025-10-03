import { useEffect, useState } from "react";
import type { Garden } from "../../types/GardenInterface";
import { useParams } from "react-router";
import PollenAndWildlife from "./PollenAndWildlife";
import Water from "./Water";
import Fertiliser from "./Fertiliser";
import Soil from "./Soil";

export default function Produce() {
  const { id } = useParams<{ id: string }>();
  const [garden, setGarden] = useState<Garden | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3000/gardens/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((g) => {
        setGarden(g);
      })
      .catch(() => {
        setGarden(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (!garden) return <p>Garden not found.</p>;
  return (
    <div className="space-y-1 text-gray-300 border-l-8 border-[#55b47e]  rounded-2xl pl-5">
      <details className="mb-4 bg-gray-800  rounded-xl pl-8 p-5">
        <summary className="cursor-pointer font-bold text-white pb-3">
          Produce Grown
        </summary>

        <div className="flex gap-2 items-center mb-2 w-14">
          <img
            src={"/svg/gardenpage/apple.svg"}
            className="border-2 border-white-700 p-1 rounded-md"
          />
          <img
            src={"/svg/gardenpage/sprout.svg"}
            className="border-2 border-white-700 p-1 rounded-md"
          />
          <img
            src={"/svg/gardenpage/carrot.svg"}
            className="border-2 border-white-700 p-1 rounded-md"
          />
          <img
            src={"/svg/gardenpage/herb.svg"}
            className="border-2 border-white-700 p-1 rounded-md"
          />
        </div>
        <ul>
          {garden.environment.produceType.map((feature, index) => (
            <li key={index}>{feature.trim()}</li>
          ))}
        </ul>
      </details>

      <details className="mb-4 bg-gray-800  rounded-xl pl-8 p-5">
        <summary className="cursor-pointer font-bold text-white pb-3">
          Pollinators and Wildlife
        </summary>
        <PollenAndWildlife />
      </details>

      <details className="mb-4 bg-gray-800  rounded-xl pl-8 p-5">
        <summary className="cursor-pointer font-bold text-white pb-3">
          Water Management
        </summary>
        <Water />
      </details>

      <details className="mb-4 bg-gray-800  rounded-xl pl-8 p-5">
        <summary className="cursor-pointer font-bold text-white pb-3">
          Fertiliser Use
        </summary>
        <Fertiliser />
      </details>

      <details className="mb-4 bg-gray-800  rounded-xl pl-8 p-5">
        <summary className="cursor-pointer font-bold text-white pb-3">
          Soil Type
        </summary>
        <Soil />
      </details>
    </div>
  );
}
