import { useEffect, useMemo, useRef, useState } from "react";
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

const ACCENT = "#55b47e";

function hasItems<T>(value?: T[] | null): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

function hasObject(value?: Record<string, unknown> | null): boolean {
  return !!value && Object.keys(value).length > 0;
}

function suburbFromAddress(address?: string): string | null {
  if (!address) return null;
  const parts = address.split(",").map((s) => s.trim());
  return parts.length >= 2 ? parts[parts.length - 2] : null;
}

function SectionCard({
  id,
  title,
  kicker,
  children,
  sectionRef,
}: {
  id: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
  sectionRef?: (el: HTMLElement | null) => void;
}) {
  return (
    <section
      id={id}
      ref={(el) => sectionRef?.(el)}
      className="scroll-mt-28"
    >
      <div className="mb-5">
        {kicker && (
          <p
            className="text-xs uppercase tracking-[0.3em] mb-2"
            style={{ color: ACCENT }}
          >
            {kicker}
          </p>
        )}
        <h2 className="text-3xl text-white pangolin-regular">{title}</h2>
        <div
          className="h-px w-12 mt-3"
          style={{ backgroundColor: ACCENT }}
        />
      </div>
      <div className="text-green-50">{children}</div>
    </section>
  );
}

function StatPill({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex flex-col px-4 py-3 bg-white/5 border border-white/10 rounded-lg min-w-[140px]">
      <span
        className="text-[10px] uppercase tracking-[0.2em] mb-1"
        style={{ color: ACCENT }}
      >
        {label}
      </span>
      <span className="text-sm text-white font-medium break-words">
        {value}
      </span>
    </div>
  );
}

export function PhotoGallery({ photos }: { photos: string[] }) {
  const [signedUrls, setSignedUrls] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const fetchSignedUrls = async () => {
      const urls = await Promise.all(
        photos.map(async (photoUrl) => {
          const filename = photoUrl.split("/").pop();
          if (!filename) return null;
          const res = await fetch(`${API_BASE_URL}/image/${filename}`);
          if (res.ok) {
            const { url } = await res.json();
            return url as string;
          }
          return null;
        })
      );
      if (!cancelled) setSignedUrls(urls.filter(Boolean) as string[]);
    };
    fetchSignedUrls();
    return () => {
      cancelled = true;
    };
  }, [photos]);

  if (!signedUrls.length) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {signedUrls.map((url, idx) => (
        <div
          key={url + idx}
          className={`relative group overflow-hidden rounded-xl ${
            idx % 5 === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
          }`}
        >
          <img
            src={url}
            alt={`Garden photo ${idx + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );
}

function SeasonalCalendar({
  calendar,
}: {
  calendar?: Record<string, string>;
}) {
  if (!calendar || !hasObject(calendar)) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {Object.entries(calendar).map(([season, crops]) => (
        <div
          key={season}
          className="rounded-xl bg-white/5 border border-white/10 p-4"
        >
          <p
            className="text-xs uppercase tracking-[0.2em] mb-2"
            style={{ color: ACCENT }}
          >
            {season}
          </p>
          <p className="text-sm text-green-50 whitespace-pre-line">
            {String(crops || "—")}
          </p>
        </div>
      ))}
    </div>
  );
}

function OpeningHoursTable({
  hours,
}: {
  hours: Garden["openingHours"];
}) {
  if (!hours || !hasObject(hours as Record<string, unknown>)) return null;
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {Object.entries(hours).map(([day, times]) => {
        const open =
          Array.isArray(times) && times.filter(Boolean).length > 0
            ? (times as string[]).join(" – ")
            : "Closed";
        return (
          <li
            key={day}
            className="flex justify-between items-center px-3 py-2 rounded-lg bg-white/5 border border-white/10"
          >
            <span className="text-sm font-semibold text-white">{day}</span>
            <span className="text-sm text-green-50">{open}</span>
          </li>
        );
      })}
    </ul>
  );
}

type SectionDef = { id: string; label: string; visible: boolean };

export default function GardenPage() {
  const { id } = useParams<{ id: string }>();
  const [garden, setGarden] = useState<Garden | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/gardens/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setGarden)
      .catch(() => setGarden(null))
      .finally(() => setLoading(false));
  }, [id]);

  const sections: SectionDef[] = useMemo(() => {
    if (!garden) return [];
    return [
      { id: "overview", label: "Overview", visible: true },
      {
        id: "contact",
        label: "Contact",
        visible:
          !!garden.coordinator ||
          !!garden.contact?.email ||
          !!garden.contact?.phone ||
          !!garden.contact?.website ||
          !!garden.contact?.social?.facebook,
      },
      {
        id: "hours",
        label: "Opening Hours",
        visible: hasObject(garden.openingHours as Record<string, unknown>),
      },
      {
        id: "photos",
        label: "Photos",
        visible: hasItems(garden.photos),
      },
      {
        id: "facilities",
        label: "Facilities",
        visible:
          hasItems(garden.facilities) ||
          hasItems(garden.accessibility) ||
          hasItems(garden.wasteManagement),
      },
      {
        id: "garden",
        label: "Growing",
        visible:
          hasItems(garden.environment?.produceType) ||
          hasItems(garden.environment?.waterConservation) ||
          hasItems(garden.environment?.soilType) ||
          hasItems(garden.environment?.fertiliserUse) ||
          hasItems(garden.environment?.pollinatorSupport),
      },
      {
        id: "seasonal",
        label: "Seasonal Planting",
        visible: hasObject(garden.environment?.seasonalPlantingCalendar),
      },
      {
        id: "events",
        label: "Events",
        visible: hasItems(garden.events),
      },
      {
        id: "rules",
        label: "Rules",
        visible: hasItems(garden.rules),
      },
      {
        id: "partnerships",
        label: "Partnerships",
        visible: hasItems(garden.partnerships),
      },
    ];
  }, [garden]);

  const visibleSections = sections.filter((s) => s.visible);

  useEffect(() => {
    if (!garden) return;
    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let activeSection: string | null = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            activeSection = entry.target.id;
          }
        });
        if (activeSection && activeSection !== currentSection) {
          setCurrentSection(activeSection);
        }
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [garden, currentSection, visibleSections.length]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white pangolin-regular">
          Loading garden…
        </div>
      </>
    );
  }

  if (!garden) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white pangolin-regular gap-4">
          <p className="text-2xl">Garden not found.</p>
          <Link
            to="/map"
            className="border-2 px-4 py-2 rounded-md hover:bg-white/10"
            style={{ borderColor: ACCENT }}
          >
            ⏎ Back to map
          </Link>
        </div>
      </>
    );
  }

  const suburb = suburbFromAddress(garden.address);

  return (
    <>
      <Navbar />
      <div className="bg-gray-900 min-h-screen pangolin-regular">
        {/* HERO */}
        <header className="relative overflow-hidden border-b border-white/10">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 20% 30%, ${ACCENT} 0%, transparent 55%), radial-gradient(circle at 80% 70%, ${ACCENT} 0%, transparent 50%)`,
            }}
          />
          <div className="relative max-w-6xl mx-auto px-6 lg:px-10 pt-16 pb-12">
            {suburb && (
              <p
                className="text-xs uppercase tracking-[0.4em] mb-4"
                style={{ color: ACCENT }}
              >
                {suburb} · Wellington
              </p>
            )}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] max-w-4xl">
              {garden.description}
            </h1>
            <p className="text-white/70 mt-6 text-base md:text-lg max-w-2xl">
              {garden.address}
            </p>

            {/* Quick action bar */}
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/map"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-white text-sm hover:bg-white/10 transition-colors"
                style={{ borderColor: ACCENT }}
              >
                <span>⏎</span> Back to map
              </Link>
              {garden.contact?.website && (
                <a
                  href={garden.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-gray-900 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: ACCENT }}
                >
                  Visit website ↗
                </a>
              )}
              {garden.contact?.email && (
                <a
                  href={`mailto:${garden.contact.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-white/20 text-white text-sm hover:bg-white/10 transition-colors"
                >
                  ✉ Email coordinator
                </a>
              )}
            </div>

            {/* Stats strip */}
            <div className="flex flex-wrap gap-3 mt-10">
              {garden.coordinator && (
                <StatPill label="Coordinator" value={garden.coordinator} />
              )}
              {garden.established && (
                <StatPill
                  label="Established"
                  value={new Date(garden.established).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                />
              )}
              {typeof garden.membershipRequired === "boolean" && (
                <StatPill
                  label="Membership"
                  value={garden.membershipRequired ? "Required" : "Drop-in welcome"}
                />
              )}
              {typeof garden.volunteersWelcome === "boolean" && (
                <StatPill
                  label="Volunteers"
                  value={garden.volunteersWelcome ? "Welcome" : "Not at this time"}
                />
              )}
              {hasItems(garden.facilities) && (
                <StatPill
                  label="Facilities"
                  value={`${garden.facilities.length} on site`}
                />
              )}
              {hasItems(garden.events) && (
                <StatPill
                  label="Events"
                  value={`${garden.events.length} upcoming`}
                />
              )}
            </div>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar TOC */}
            <aside className="lg:w-56 lg:sticky lg:top-24 lg:self-start">
              <p
                className="text-xs uppercase tracking-[0.3em] mb-4"
                style={{ color: ACCENT }}
              >
                On this page
              </p>
              <ul className="space-y-1 text-sm">
                {visibleSections.map((section) => {
                  const isActive = currentSection === section.id;
                  return (
                    <li key={section.id}>
                      <button
                        onClick={() => {
                          const el = sectionRefs.current[section.id];
                          if (el) {
                            const y =
                              el.getBoundingClientRect().top +
                              window.pageYOffset -
                              100;
                            window.scrollTo({ top: y, behavior: "smooth" });
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span
                          className="inline-block w-1 h-1 rounded-full mr-2 align-middle"
                          style={{
                            backgroundColor: isActive ? ACCENT : "transparent",
                          }}
                        />
                        {section.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            {/* Content */}
            <main className="flex-1 min-w-0 space-y-16">
              {/* Overview / Location */}
              <SectionCard
                id="overview"
                title="Overview"
                kicker="The garden"
                sectionRef={(el) => (sectionRefs.current["overview"] = el)}
              >
                <LocationCard garden={garden} />
              </SectionCard>

              {/* Contact */}
              {sections.find((s) => s.id === "contact")?.visible && (
                <SectionCard
                  id="contact"
                  title="Get in touch"
                  kicker="Contact"
                  sectionRef={(el) => (sectionRefs.current["contact"] = el)}
                >
                  <ContactCard garden={garden} />
                </SectionCard>
              )}

              {/* Opening Hours */}
              {sections.find((s) => s.id === "hours")?.visible && (
                <SectionCard
                  id="hours"
                  title="Opening hours"
                  kicker="When to visit"
                  sectionRef={(el) => (sectionRefs.current["hours"] = el)}
                >
                  <OpeningHoursTable hours={garden.openingHours} />
                </SectionCard>
              )}

              {/* Photos */}
              {sections.find((s) => s.id === "photos")?.visible && (
                <SectionCard
                  id="photos"
                  title="Photos"
                  kicker="Gallery"
                  sectionRef={(el) => (sectionRefs.current["photos"] = el)}
                >
                  <PhotoGallery photos={garden.photos ?? []} />
                </SectionCard>
              )}

              {/* Facilities & Access */}
              {sections.find((s) => s.id === "facilities")?.visible && (
                <SectionCard
                  id="facilities"
                  title="Facilities & access"
                  kicker="On site"
                  sectionRef={(el) => (sectionRefs.current["facilities"] = el)}
                >
                  <Facilities garden={garden} />
                </SectionCard>
              )}

              {/* Garden — Produce */}
              {sections.find((s) => s.id === "garden")?.visible && (
                <SectionCard
                  id="garden"
                  title="What's growing"
                  kicker="Garden"
                  sectionRef={(el) => (sectionRefs.current["garden"] = el)}
                >
                  <Produce garden={garden} />
                </SectionCard>
              )}

              {/* Seasonal */}
              {sections.find((s) => s.id === "seasonal")?.visible && (
                <SectionCard
                  id="seasonal"
                  title="Seasonal planting"
                  kicker="Calendar"
                  sectionRef={(el) => (sectionRefs.current["seasonal"] = el)}
                >
                  <SeasonalCalendar
                    calendar={garden.environment?.seasonalPlantingCalendar}
                  />
                </SectionCard>
              )}

              {/* Events */}
              {sections.find((s) => s.id === "events")?.visible && (
                <SectionCard
                  id="events"
                  title="Events"
                  kicker="What's on"
                  sectionRef={(el) => (sectionRefs.current["events"] = el)}
                >
                  <Events
                    events={
                      Array.isArray(garden.events) &&
                      typeof garden.events[0] === "string"
                        ? (garden.events as unknown as string[]).map((ev) => ({
                            date: "",
                            details: ev,
                          }))
                        : garden.events.map((ev: any) => ({
                            date: ev.date ?? "",
                            details:
                              typeof ev.details === "string"
                                ? ev.details
                                : JSON.stringify(ev.details),
                          }))
                    }
                  />
                  {garden._id && (
                    <Link
                      to={`/venues/${garden._id}/events`}
                      className="inline-block mt-4 text-sm px-4 py-2 rounded-md border text-white hover:bg-white/10 transition-colors"
                      style={{ borderColor: ACCENT }}
                    >
                      View all events →
                    </Link>
                  )}
                </SectionCard>
              )}

              {/* Rules */}
              {sections.find((s) => s.id === "rules")?.visible && (
                <SectionCard
                  id="rules"
                  title="House rules"
                  kicker="Before you visit"
                  sectionRef={(el) => (sectionRefs.current["rules"] = el)}
                >
                  <Rules rules={garden.rules || []} />
                </SectionCard>
              )}

              {/* Partnerships */}
              {sections.find((s) => s.id === "partnerships")?.visible && (
                <SectionCard
                  id="partnerships"
                  title="Partners"
                  kicker="Supported by"
                  sectionRef={(el) => (sectionRefs.current["partnerships"] = el)}
                >
                  <PartnershipsCard garden={garden} />
                </SectionCard>
              )}

              {/* Coordinates footer */}
              <div className="pt-8 border-t border-white/10 text-xs text-white/40 flex flex-wrap gap-x-6 gap-y-1">
                <span>
                  Coordinates: {garden.lat?.toFixed(5)}, {garden.lon?.toFixed(5)}
                </span>
                {garden._id && <span>ID: {garden._id}</span>}
                {garden.lastUpdated && (
                  <span>
                    Updated:{" "}
                    {new Date(garden.lastUpdated).toLocaleDateString()}
                  </span>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
