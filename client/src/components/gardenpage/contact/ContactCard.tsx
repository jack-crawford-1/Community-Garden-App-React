import { useEffect, useState } from "react";
import type { Garden } from "./GardenInterface";
import { useParams } from "react-router";

export default function ContactCard({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="mt-4 bg-gray-800 rounded-xl shadow-lg p-6 text-white border-l-8 border-green-600 ">
      {/* Profile Image and Info */}
      <div className="flex flex-row space-x-6 ">
        <img
          alt="Coordinator"
          src="https://www.citypng.com/public/uploads/preview/white-user-member-guest-icon-png-image-701751695037005zdurfaim0y.png"
          className="w-20 h-20 rounded-md border-4 border-[#55b47e]"
        />
        <div className="flex flex-col justify-center">
          <h5 className="text-xl font-semibold">{garden.coordinator}</h5>
          <span className="text-sm text-gray-400 mb-10">
            Garden Coordinator
            {garden.contact.phone && <p>{garden.contact.phone}</p>}
          </span>
        </div>
      </div>

      <div className=" space-y-1 text-gray-300 break-words">
        {garden.contact.email && (
          <p>
            <strong>Email:</strong> {garden.contact.email}
          </p>
        )}

        {garden.contact.phone && (
          <p>
            <strong>Phone:</strong> {garden.contact.phone}
          </p>
        )}

        {garden.contact.website && (
          <p>
            <strong>Website:</strong>{" "}
            <a
              href={garden.contact.website}
              target="_blank"
              rel="noreferrer"
              className="underline text-[#55b47e]"
            >
              {garden.contact.website}
            </a>
          </p>
        )}
        {garden.contact.social?.facebook && (
          <p>
            <strong>Facebook:</strong>{" "}
            <a
              href={garden.contact.social.facebook}
              target="_blank"
              rel="noreferrer"
              className="underline text-[#55b47e]"
            >
              {garden.contact.social.facebook}
            </a>
          </p>
        )}
      </div>
      <div className=" mt-10">
        <h5 className="text-lg font-semibold mb-4 text-[#55b47e]">
          Opening Hours
        </h5>
        <ul className="grid grid-cols-2 gap-2 text-sm text-blue-50">
          {Object.entries(garden.openingHours ?? {}).map(([day, times]) => (
            <li
              key={day}
              className="flex items-center gap-2 bg-blue-300/20 rounded px-2 py-1 shadow-inner"
            >
              <span className="font-semibold text-white w-20">{day}:</span>
              <span>
                {Array.isArray(times) && times.filter(Boolean).length > 0
                  ? (times as string[]).join(" - ")
                  : "Closed"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
