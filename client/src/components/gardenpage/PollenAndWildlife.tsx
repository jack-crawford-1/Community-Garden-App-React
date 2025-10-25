import { useEffect, useState } from "react";
import type { Garden } from "../../types/GardenInterface";
import { useParams } from "react-router";

export default function PollenAndWildlife() {
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
    <div className="bg-gray-800 rounded-xl shadow-lg p-3 text-white mt-4">
      <div className="grid grid-cols-1 items-center ml-0">
        <div className="flex gap-2 items-center mb-2 w-14">
          <img
            src={"/svg/gardenpage/bee.svg"}
            className="border-2 border-white-700 p-1 rounded-md"
          />
          <img
            src={"/svg/gardenpage/lizard.svg"}
            className="border-2 border-white-700 p-1 rounded-md"
          />
          <img
            src={"/svg/gardenpage/frog.svg"}
            className="border-2 border-white-700 p-1 rounded-md"
          />
          <img
            src={"/svg/gardenpage/birdhouse.svg"}
            className="border-2 border-white-700 p-1 rounded-md"
          />
        </div>
        <ul className="grid grid-cols-1 text-sm text-green-50 pt-4">
          {garden.environment?.pollinatorSupport?.map((item, idx) => (
            <li key={item + idx} className=" ">
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
