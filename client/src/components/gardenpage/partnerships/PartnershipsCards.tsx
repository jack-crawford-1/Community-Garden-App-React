import { useEffect, useState } from "react";
import type { Garden } from "../../../types/GardenInterface";
import { useParams } from "react-router";
import { API_BASE_URL } from "../../../api/config";

export default function PartnershipsCard() {
  const { id } = useParams<{ id: string }>();
  const [garden, setGarden] = useState<Garden | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE_URL}/gardens/${id}`)
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
    <div className="bg-gray-800 rounded-xl shadow-lg p-3 text-white">
      <div className="grid grid-cols-2 gap-16 items-center ml-5">
        <div className="space-y-1 text-gray-300 break-words text-sm leading-7">
          <p>
            <strong>Partnerships:</strong> {garden.partnerships}
          </p>
        </div>
        <div className="flex gap-2 items-center mb-2 w-16">
          <img
            src={"/png/wcclogo.png"}
            className="border-2 border-green-700 p-1 rounded-md"
          />
          <img
            src={"/png/lionslogo.png"}
            className="border-2 border-green-700 p-1 rounded-md"
          />
          <img
            src={"/png/stjohnlogo.png"}
            className="border-2 border-green-700 p-1 rounded-md"
          />
          <img
            src={"/png/ac.png"}
            className="border-2 border-green-700 p-1 rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
