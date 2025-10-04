import { useEffect, useState } from "react";
import type { Garden } from "../../types/GardenInterface";
import { useParams } from "react-router";

export default function Water() {
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
    <div className="space-y-1 text-gray-300 ">
      <div className="flex gap-2 items-center mb-2 w-14">
        <img
          src={"/svg/gardenpage/water.svg"}
          className="border-2 border-white-700 p-1 rounded-md"
        />
        <img
          src={"/svg/gardenpage/wastewater.svg"}
          className="border-2 border-white-700 p-1 rounded-md"
        />
        <img
          src={"/svg/gardenpage/mulch.svg"}
          className="border-2 border-white-700 p-1 rounded-md"
        />
        <img
          src={"/svg/gardenpage/drip.svg"}
          className="border-2 border-white-700 p-1 rounded-md"
        />
        <img
          src={"/svg/gardenpage/drought.svg"}
          className="border-2 border-white-700 p-1 rounded-md"
        />
        <img
          src={"/svg/gardenpage/rainwater.svg"}
          className="border-2 border-white-700 p-1 rounded-md"
        />
      </div>
      <ul>
        {garden.environment?.waterConservation?.map((feature, index) => (
          <li key={index}>{feature.trim()}</li>
        ))}
      </ul>
    </div>
  );
}
