import { useEffect, useState } from "react";
import type { Garden } from "../../../types/GardenInterface";
import { useParams } from "react-router";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

export default function LocationCard() {
  const { id } = useParams<{ id: string }>();
  const [garden, setGarden] = useState<Garden | null>(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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
    <div className=" bg-gray-800 rounded-xl p-0 text-white mb-5">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col justify-center pl-10">
          <div className=" space-y-1 text-gray-300 text-sm">
            <p>ID: {garden._id?.slice(0, 7)}</p>
            <p>{garden.description}</p>
            <p>{garden.address.split(",")[0]}</p>
            <p>
              {garden.address.split(",")[1]}
              {garden.address.split(",")[2]}
            </p>

            <p>
              Established{" "}
              <span className="font-bold">
                {" "}
                {garden.established
                  ? new Date(garden.established).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })
                  : "Unknown"}
              </span>
            </p>
            <p>
              Memberships required:{" "}
              <span className="font-bold">
                {garden.membershipRequired ? "Yes" : "No"}
              </span>
            </p>
          </div>
        </div>

        <div className="rounded-lg p-2">
          <APIProvider apiKey={API_KEY}>
            <Map
              mapId={"4ede449a95c7241845c0af90"}
              defaultCenter={{ lat: garden.lat, lng: garden.lon }}
              defaultZoom={10}
              gestureHandling={"greedy"}
              disableDefaultUI
              className={"w-[300px] h-[200px]"}
            >
              <Marker position={{ lat: garden.lat, lng: garden.lon }} />
            </Map>
          </APIProvider>
        </div>
      </div>
    </div>
  );
}
