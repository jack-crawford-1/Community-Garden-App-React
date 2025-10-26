import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import type { Garden } from "../types/GardenInterface";
import ContactCard from "../components/gardenpage/contact/ContactCard";
import LocationCard from "../components/gardenpage/location/LocationCard";
import PartnershipsCard from "../components/gardenpage/partnerships/PartnershipsCards";
import Facilities from "../components/gardenpage/Facilities";
import Produce from "../components/gardenpage/Produce";
import Rules from "../components/gardenpage/Rules";
import Events from "../components/gardenpage/events/Events";
import Navbar from "../components/nav/Navbar";
import { API_BASE_URL } from "../api/config";

export function Info({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  if (!value) return null;
  return (
    <div className="mb-2 flex items-center gap-2 bg-green-200/20 p-2 rounded-md ">
      <span className="font-bold text-white tracking-wide uppercase text-xs">
        {label}
      </span>
      <span className="text-green-50 text-sm">{value}</span>
    </div>
  );
}

function SectionList({
  label,
  list,
  children,
}: {
  label: string;
  list?: string[];
  children?: React.ReactNode;
}) {
  if ((!list || list.length === 0) && !children) return null;
  return (
    <div className=" rounded-xl">
      <div className="flex items-center">
        <p className="text-base font-bold text-white tracking-wide uppercase p-2">
          {label}
        </p>
      </div>
      {list && list.length > 0 ? (
        <ul className="grid grid-cols-2 gap-2 text-sm text-green-50">
          {list.map((item, idx) => (
            <li
              key={item + idx}
              className="flex items-center gap-2 bg-green-200/20 rounded px-2 py-1 shadow-inner "
            >
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        children
      )}
    </div>
  );
}

function SeasonalCalendar({
  calendar,
  onUpdate,
}: {
  calendar?: Record<string, string>;
  onUpdate?: (season: string, crops: string) => void;
}) {
  if (!calendar) return null;

  return (
    <div className="mb-5 rounded-xl shadow-lg p-4 border-l-8 border-[#55b47e]  pl-5">
      <ul className="space-y-4">
        {Object.entries(calendar).map(([season, crops]) => (
          <details
            key={season}
            className="bg-gray-800 rounded px-2 py-1 shadow-inner"
          >
            <summary className="font-semibold text-white capitalize cursor-pointer">
              {season}
            </summary>
            <div className="mt-2">
              <textarea
                value={String(crops ?? "")}
                onChange={(e) => onUpdate && onUpdate(season, e.target.value)}
                placeholder={`Enter crops for ${season}`}
                rows={2}
                className="p-2 rounded bg-gray-800 text-green-50 w-full"
              />
            </div>
          </details>
        ))}
      </ul>
    </div>
  );
}

export function PhotoGallery({ photos }: { photos: string[] }) {
  const [signedUrls, setSignedUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchSignedUrls = async () => {
      const urls = await Promise.all(
        photos.map(async (photoUrl) => {
          const filename = photoUrl.split("/").pop();
          if (!filename) return null;

          const res = await fetch(`${API_BASE_URL}/image/${filename}`);
          if (res.ok) {
            const { url } = await res.json();
            return url;
          }
          console.error(`Failed to fetch signed URL for ${filename}`);
          return null;
        })
      );
      setSignedUrls(urls.filter(Boolean) as string[]);
    };

    fetchSignedUrls();
  }, [photos]);

  if (!signedUrls || signedUrls.length === 0) return null;

  return (
    <div className="  grid grid-cols-2 gap-4 mb-8   rounded-2xl">
      {signedUrls.map((url, idx) => (
        <div
          key={url + idx}
          className={`relative group overflow-hidden rounded-lg shadow-md ${
            idx % 5 === 0 ? "row-span-2 col-span-2" : "row-span-1 col-span-1"
          }`}
          style={{
            gridRow: idx % 7 === 0 ? "span 2" : undefined,
            gridColumn: idx % 7 === 0 ? "span 2" : undefined,
          }}
        >
          <img
            src={url}
            alt={`Garden photo ${idx + 1}`}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0  text-xs text-green-100 px-2 py-1">
            Photo {idx + 1}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GardenPage() {
  const { id } = useParams<{ id: string }>();
  const [garden, setGarden] = useState<Garden | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

  const sections = [
    "Contact",
    "Overview",
    "Events",
    "Seasonal Planting",
    "Access",
    "Garden",
    "Rules",
  ];

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE_URL}/gardens/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })

      .then((g) => {
        console.log("Fetched garden:", g);
        setGarden(g);
      })
      .catch(() => {
        setGarden(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let activeSection = null;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            activeSection = slugify(entry.target.id);
          }
        });

        if (activeSection !== currentSection) {
          setCurrentSection(activeSection);
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      Object.values(sectionRefs.current).forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [currentSection, garden]);

  if (loading) return <p>Loading…</p>;
  if (!garden) return <p>Garden not found.</p>;

  return (
    <>
      <Navbar />
      <div className="flex bg-gray-800">
        {/* Sidebar */}
        <div className="w-1/7  h-screen sticky top-20 overflow-y-auto text-white p-4 pl-13 pt-10 pangolin-regular">
          <ul className="space-y-2">
            {sections.map((section) => {
              const slug = slugify(section);
              return (
                <li
                  key={slug}
                  className={`cursor-pointer ${
                    currentSection === slug ? "text-[#55b47e]" : "text-white"
                  } hover:text-[#479d6c] transition-colors duration-200`}
                  onClick={() => {
                    const el = sectionRefs.current[slug];
                    if (el) {
                      const yOffset = -200;
                      const y =
                        el.getBoundingClientRect().top +
                        window.pageYOffset +
                        yOffset;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }}
                >
                  {section}
                </li>
              );
            })}
          </ul>
          <Link
            to={"/map"}
            className=" ubuntu-bold inline-block  border-2 border-[#55b47e] hover:bg-green-900 text-white font-bold py-1 px-5 rounded-md transition-colors duration-200 mt-10  hover:scale-98"
          >
            <span className="pr-2">⏎ </span> map
          </Link>
        </div>
        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6 max-w-3xl mx-auto pangolin-regular">
          <div className="p-6 space-y-6 max-w-3xl mx-auto">
            <h1 className="text-8xl font-bold text-[#55b47e] pangolin-regular uppercase">
              {garden.description}
            </h1>
            <h2 className="text-xl font-bold text-white mb-20 pangolin-regular">
              {garden.address}
            </h2>

            {sections.map((section) => {
              const slug = slugify(section);

              console.log("Link to events for garden id:", garden?.id);

              return (
                <div
                  key={slug}
                  id={slug}
                  ref={(el) => {
                    sectionRefs.current[slug] = el;
                  }}
                  className="mb-10"
                >
                  <h2 className="text-lg font-bold text-[#55b47e] mb-4 border-b-2 border-[#55b47e] pb-2">
                    {" "}
                    {section}
                  </h2>

                  {section === "Overview" && (
                    <>
                      <SectionList label="Location and Membership">
                        <LocationCard />
                      </SectionList>
                      <SectionList label="Partnerships">
                        <PartnershipsCard />
                      </SectionList>
                      <SectionList label="Photo Gallery">
                        <PhotoGallery photos={garden.photos ?? []} />
                      </SectionList>
                    </>
                  )}

                  {section === "Contact" && (
                    <ContactCard>
                      <Info label="Coordinator" value={garden.coordinator} />
                      <Info label="Email" value={garden?.contact?.email} />
                      <Info label="Phone" value={garden?.contact?.phone} />

                      <Info
                        label="Website"
                        value={
                          <a
                            href={garden.contact?.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-300 hover:underline"
                          >
                            {garden.contact?.website}
                          </a>
                        }
                      />
                      <Info
                        label="Facebook"
                        value={
                          <a
                            href={garden.contact?.social?.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-300 hover:underline"
                          >
                            {garden.contact?.social?.facebook}
                          </a>
                        }
                      />
                    </ContactCard>
                  )}

                  {section === "Events" && (
                    <div className="">
                      <Events
                        events={
                          Array.isArray(garden?.events) &&
                          typeof garden.events[0] === "string"
                            ? garden.events.map((ev) => ({
                                date: "",
                                details: ev,
                              }))
                            : Array.isArray(garden?.events)
                            ? garden.events.map((ev: any) => ({
                                date: ev.date,
                                details:
                                  typeof ev.details === "string"
                                    ? ev.details
                                    : JSON.stringify(ev.details),
                              }))
                            : []
                        }
                      />

                      {garden._id && (
                        <Link to={`/venues/${garden._id}/events`}>
                          <button className="bg-green-600/40 hover:bg-green-600/80 font-bold px-3 py-2 rounded-md">
                            View All Events
                          </button>
                        </Link>
                      )}
                    </div>
                  )}

                  {section === "Seasonal Planting" && (
                    <SeasonalCalendar
                      calendar={garden?.environment?.seasonalPlantingCalendar}
                    />
                  )}
                  {section === "Photo Gallery" && (
                    <PhotoGallery photos={garden?.photos ?? []} />
                  )}
                  {section === "Access" && <Facilities />}

                  {section === "Rules" && <Rules rules={garden?.rules || []} />}

                  {section === "Garden" && <Produce />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
