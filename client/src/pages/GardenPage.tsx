import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import Footer from "../components/footer/Footer";
import { fetchGarden } from "../api/gardens";
import { usePageMeta } from "../lib/meta";
import type { Garden } from "../types/garden";
import { LeafSvg } from "../components/markers/leafSvg";

export default function GardenPage() {
  const { id } = useParams<{ id: string }>();
  const [garden, setGarden] = useState<Garden | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    if (!id) return;
    setState("loading");
    fetchGarden(id)
      .then((data) => {
        setGarden(data);
        setState("ready");
      })
      .catch(() => setState("missing"));
  }, [id]);

  usePageMeta(
    garden ? garden.name : "Garden",
    garden?.description ??
      (garden ? `${garden.name} — a community garden in ${garden.suburb ?? "Wellington"}.` : undefined),
  );

  if (state === "loading") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-moss-950 text-white/70">
        Loading garden…
      </div>
    );
  }

  if (state === "missing" || !garden) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-moss-950 px-6 text-center text-white">
        <h1 className="font-display text-3xl">Garden not found</h1>
        <p className="max-w-md text-sm text-white/60">
          This garden may have been removed, or the link is out of date.
        </p>
        <Link
          to="/gardens"
          className="rounded-md bg-leaf-500 px-4 py-2 text-sm font-semibold text-white hover:bg-leaf-600"
        >
          Browse all gardens
        </Link>
      </div>
    );
  }

  const contact = garden.contact ?? {};
  const hasContact = !!(contact.email || contact.phone || contact.website || contact.facebook);
  const photos = garden.photos ?? [];
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const mapId = import.meta.env.VITE_MAP_ID as string | undefined;

  return (
    <>
      <div className="min-h-screen bg-moss-950">
        {/* Hero */}
        <header className="relative overflow-hidden border-b border-white/10">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(circle at 20% 30%, #55b47e 0%, transparent 55%), radial-gradient(circle at 80% 70%, #55b47e 0%, transparent 50%)",
            }}
          />
          <div className="relative mx-auto max-w-5xl px-6 pb-12 pt-14 lg:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-leaf-300">
              {[garden.suburb, garden.region ?? "Wellington"].filter(Boolean).join(" · ")}
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-white md:text-6xl">
              {garden.name}
            </h1>
            {garden.description && (
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
                {garden.description}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${garden.lat},${garden.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-leaf-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-leaf-600"
              >
                Get directions
              </a>
              {contact.website && (
                <a
                  href={contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-leaf-500 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10"
                >
                  Visit website ↗
                </a>
              )}
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10"
                >
                  ✉ Email the garden
                </a>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl space-y-14 px-6 py-12 lg:px-10">
          {/* Location */}
          <section aria-labelledby="location-heading">
            <SectionHeading id="location-heading" kicker="Where to find it">
              Location
            </SectionHeading>
            <div className="grid items-start gap-6 lg:grid-cols-5">
              <div className="lg:col-span-2">
                {garden.address ? (
                  <address className="space-y-0.5 not-italic leading-relaxed text-white">
                    {garden.address.split(",").map((line, idx) => (
                      <p key={idx} className={idx === 0 ? "font-semibold" : "text-sm text-white/70"}>
                        {line.trim()}
                      </p>
                    ))}
                  </address>
                ) : (
                  <p className="text-sm text-white/70">
                    No street address on file — use the map or directions link.
                  </p>
                )}
                <p className="mt-4 text-xs text-white/40">
                  {garden.lat.toFixed(5)}, {garden.lon.toFixed(5)}
                </p>
              </div>
              <div className="h-[280px] overflow-hidden rounded-xl border border-white/10 lg:col-span-3">
                {apiKey ? (
                  <APIProvider apiKey={apiKey}>
                    <Map
                      mapId={mapId}
                      defaultCenter={{ lat: garden.lat, lng: garden.lon }}
                      defaultZoom={15}
                      disableDefaultUI
                      gestureHandling="cooperative"
                      className="h-full w-full"
                    >
                      <AdvancedMarker position={{ lat: garden.lat, lng: garden.lon }}>
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-lg"
                          style={{ background: "linear-gradient(145deg, #5cbf86, #3f9466)" }}
                        >
                          <LeafSvg />
                        </div>
                      </AdvancedMarker>
                    </Map>
                  </APIProvider>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-white/40">
                    Map unavailable
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Contact */}
          {hasContact && (
            <section aria-labelledby="contact-heading">
              <SectionHeading id="contact-heading" kicker="Get involved">
                Contact
              </SectionHeading>
              <dl className="max-w-2xl divide-y divide-white/10">
                {contact.email && (
                  <ContactRow label="Email">
                    <a href={`mailto:${contact.email}`} className="text-leaf-300 hover:underline">
                      {contact.email}
                    </a>
                  </ContactRow>
                )}
                {contact.phone && (
                  <ContactRow label="Phone">
                    <a
                      href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                      className="text-white hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </ContactRow>
                )}
                {contact.website && (
                  <ContactRow label="Website">
                    <a
                      href={contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-leaf-300 hover:underline"
                    >
                      {contact.website.replace(/^https?:\/\//, "")}
                    </a>
                  </ContactRow>
                )}
                {contact.facebook && (
                  <ContactRow label="Facebook">
                    <a
                      href={contact.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-leaf-300 hover:underline"
                    >
                      {contact.facebook.replace(/^https?:\/\//, "")}
                    </a>
                  </ContactRow>
                )}
              </dl>
            </section>
          )}

          {/* Photos */}
          {photos.length > 0 && (
            <section aria-labelledby="photos-heading">
              <SectionHeading id="photos-heading" kicker="Gallery">
                Photos
              </SectionHeading>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {photos.map((url, idx) => (
                  <div key={`${url}-${idx}`} className="aspect-square overflow-hidden rounded-xl">
                    <img
                      src={url}
                      alt={`${garden.name} — photo ${idx + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Improve this listing */}
          <section className="rounded-xl border border-leaf-500/30 bg-leaf-500/10 p-6">
            <h2 className="font-display text-xl font-semibold text-white">
              Spotted something out of date?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">
              These listings come from council open data and community contributions. If a
              contact detail has changed or something's missing, let us know and we'll fix it.
            </p>
            <Link
              to={`/suggest?kind=correction&gardenId=${garden._id}&name=${encodeURIComponent(garden.name)}`}
              className="mt-4 inline-block rounded-md bg-leaf-500 px-4 py-2 text-sm font-semibold text-white hover:bg-leaf-600"
            >
              Suggest a correction
            </Link>
          </section>

          <p className="border-t border-white/10 pt-6 text-xs text-white/40">
            {garden.source && <>Listing data: {garden.source}. </>}
            {garden.updatedAt && <>Last updated {new Date(garden.updatedAt).toLocaleDateString("en-NZ")}.</>}
          </p>
        </main>
      </div>
      <Footer />
    </>
  );
}

function SectionHeading({
  id,
  kicker,
  children,
}: {
  id: string;
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-leaf-300">{kicker}</p>
      <h2 id={id} className="font-display text-3xl font-semibold text-white">
        {children}
      </h2>
      <div className="mt-3 h-px w-12 bg-leaf-500" />
    </div>
  );
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-3">
      <dt className="mt-0.5 w-24 shrink-0 text-xs uppercase tracking-[0.2em] text-white/40">
        {label}
      </dt>
      <dd className="min-w-0 text-sm">{children}</dd>
    </div>
  );
}
