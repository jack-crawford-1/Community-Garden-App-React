import { useEffect, useState } from "react";
import type { Garden } from "../../types/GardenInterface";
import { useParams } from "react-router";
import Waste from "./Waste";
import Accessibility from "./Accessibility";

export default function Facilities() {
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
    <div className="text-white mb-2 border-l-8 border-[#55b47e]  rounded-2xl pl-5">
      <details className="mb-4 bg-gray-800  rounded-xl pl-8 p-5 ">
        <summary className="cursor-pointer font-bold text-white pb-3">
          Facilities
        </summary>
        <div className="flex gap-2 items-center mt-2 w-14 pb-4">
          <img
            src={"/svg/gardenpage/toilet.svg"}
            className=" border-2 p-1 rounded-md"
          />
          <img
            src={"/svg/gardenpage/bbq.svg"}
            className=" p-1 rounded-md border-2"
          />
          <img
            src={"/svg/gardenpage/playground.svg"}
            className=" p-1 rounded-md border-2"
          />
          <img
            src={"/svg/gardenpage/greenhouse.svg"}
            className=" p-1 rounded-md border-2"
          />
          <img
            src={"/svg/gardenpage/bike.svg"}
            className=" p-1 rounded-md border-2"
          />
          <img
            src={"/svg/gardenpage/kitchen.svg"}
            className=" p-1 rounded-md border-2"
          />
          <img
            src={"/svg/gardenpage/meeting.svg"}
            className=" p-1 rounded-md border-2"
          />
        </div>
        <ul>
          {garden.facilities.map((feature, index) => (
            <li key={index}>{feature.trim()}</li>
          ))}
        </ul>
      </details>

      <details className="mb-4 bg-gray-800  rounded-xl pl-8 p-5 ">
        <summary className="cursor-pointer font-bold text-white pb-3">
          Accssibility
        </summary>
        <Accessibility />
      </details>
      <details className="mb-4 bg-gray-800  rounded-xl pl-8 p-5 ">
        <summary className="cursor-pointer font-bold text-white pb-3">
          Waste
        </summary>
        <Waste />
      </details>
    </div>
  );
}
