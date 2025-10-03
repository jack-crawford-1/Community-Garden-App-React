import { useEffect, useState } from "react";
import type { Garden } from "../../types/GardenInterface";
import { useParams } from "react-router";

export default function Accessibility() {
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
    <>
      <div className="flex gap-2 items-center mb-2 w-14 pb-4">
        <img
          src={"/svg/gardenpage/parking.svg"}
          className="border-2  p-1 rounded-md"
        />
        <img
          src={"/svg/gardenpage/toilet.svg"}
          className="border-2  p-1 rounded-md"
        />
        <img
          src={"/svg/gardenpage/disabled.svg"}
          className="border-2  p-1 rounded-md"
        />
      </div>
      <ul>
        {garden.accessibility.map((feature, index) => (
          <li key={index}>{feature.trim()}</li>
        ))}
      </ul>
    </>
  );
}
