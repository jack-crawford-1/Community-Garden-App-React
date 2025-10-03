// GardenDetails.tsx
import { Link } from "react-router";
import type { Garden } from "../../types/GardenInterface";
import { useEffect, useState } from "react";
import { PhotoGallery } from "../../app/GardenPage";

export default function GardenDetails({ garden }: { garden: Garden | null }) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchFirstSignedUrl = async () => {
      if (!garden?.photos || garden.photos.length === 0) return;

      const firstPhotoUrl = garden.photos[0];
      const filename = firstPhotoUrl.split("/").pop();
      if (!filename) return;

      try {
        const res = await fetch(`http://localhost:3000/image/${filename}`);
        if (res.ok) {
          const { url } = await res.json();
          setSignedUrl(url);
        } else {
          console.error("Failed to get signed URL");
        }
      } catch (err) {
        console.error("Error fetching signed image:", err);
      }
    };

    fetchFirstSignedUrl();
  }, [garden]);

  if (!garden) return <div>Select a garden for details.</div>;

  return (
    <div className="max-w-lg mx-auto flex flex-col justify-center items-start p-3">
      <h3 className="text-4xl font-bold text-[#55b47e] pangolin-regular uppercase">
        {garden.description}
      </h3>
      <h3 className="text-md font-bold text-white pt-5 mb-5">
        {garden.address}
      </h3>

      <div className="mb-10">
        <Link
          to={`/gardens/${garden.id}`}
          className="inline-block bg-[#55b47e] hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
          target="_blank"
        >
          More Information
        </Link>
      </div>
      <div>
        <div className="max-w-[380px]">
          <PhotoGallery photos={garden.photos} />
        </div>
      </div>
    </div>
  );
}
