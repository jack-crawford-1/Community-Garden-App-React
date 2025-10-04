import { useEffect, useState } from "react";
import type { Garden } from "../../types/GardenInterface";
import { useParams } from "react-router";

export default function Waste() {
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
    <div>
      <div className="flex gap-2 items-center mb-2 w-14 pb-4">
        <img
          src={"/svg/gardenpage/recycling.svg"}
          className="border-2  p-1 rounded-md"
        />
        <img
          src={"/svg/gardenpage/water.svg"}
          className="border-2  p-1 rounded-md"
        />
        <img
          src={"/svg/gardenpage/rubbish.svg"}
          className="border-2  p-1 rounded-md"
        />
        <img
          src={"/svg/gardenpage/biohazard.svg"}
          className="border-2  p-1 rounded-md"
        />
      </div>
      <ul>
        {garden.wasteManagement?.map((feature, index) => (
          <li key={index}>{feature.trim()}</li>
        ))}
      </ul>
    </div>
  );
}
