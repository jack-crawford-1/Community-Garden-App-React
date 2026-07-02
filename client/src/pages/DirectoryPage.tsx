import { useMemo, useState } from "react";
import GardenCard from "../components/GardenCard";
import Footer from "../components/footer/Footer";
import { useGardens } from "../context/GardensContext";
import { usePageMeta } from "../lib/meta";
import { filterGardens } from "../lib/search";

export default function DirectoryPage() {
  usePageMeta(
    "Wellington community gardens directory",
    "Browse every community garden in Wellington — search by name or suburb and find contact details for each garden.",
  );

  const { gardens, loading, error, retry } = useGardens();
  const [query, setQuery] = useState("");
  const [suburb, setSuburb] = useState<string | null>(null);

  const suburbs = useMemo(() => {
    const counts = new Map<string, number>();
    for (const g of gardens) {
      if (g.suburb) counts.set(g.suburb, (counts.get(g.suburb) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [gardens]);

  const results = useMemo(() => {
    const bySuburb = suburb ? gardens.filter((g) => g.suburb === suburb) : gardens;
    return filterGardens(bySuburb, query).slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [gardens, query, suburb]);

  return (
    <>
      <div className="min-h-[70vh] bg-leaf-50">
        <header className="border-b border-leaf-500/15 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-leaf-600">
              Directory
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-moss-950 sm:text-4xl">
              Community gardens in Wellington
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Every garden listed here is real, sourced from Wellington City Council open data.
              Find one near you and get in touch — most gardens welcome new members.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <label htmlFor="directory-search" className="sr-only">
                Search gardens
              </label>
              <input
                id="directory-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, suburb or street…"
                className="w-full max-w-md rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-500/30"
              />
              <p className="text-xs text-gray-500" role="status">
                {loading ? "Loading…" : `${results.length} garden${results.length === 1 ? "" : "s"}`}
              </p>
            </div>

            {suburbs.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setSuburb(null)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    suburb === null
                      ? "bg-leaf-600 text-white"
                      : "bg-leaf-100 text-leaf-700 hover:bg-leaf-500/20"
                  }`}
                >
                  All suburbs
                </button>
                {suburbs.map(([name, count]) => (
                  <button
                    key={name}
                    onClick={() => setSuburb(suburb === name ? null : name)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      suburb === name
                        ? "bg-leaf-600 text-white"
                        : "bg-leaf-100 text-leaf-700 hover:bg-leaf-500/20"
                    }`}
                  >
                    {name} · {count}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
              <p>Couldn't load the gardens. Check your connection and try again.</p>
              <button
                onClick={retry}
                className="mt-3 rounded-md bg-leaf-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-leaf-700"
              >
                Try again
              </button>
            </div>
          )}

          {loading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="h-44 animate-pulse rounded-xl bg-white shadow-sm" />
              ))}
            </div>
          )}

          {!loading && !error && (
            <>
              {results.length === 0 ? (
                <div className="rounded-xl bg-white p-8 text-center shadow-sm">
                  <p className="text-sm text-gray-600">
                    No gardens match your search. Know one we're missing?
                  </p>
                  <a
                    href="/suggest"
                    className="mt-3 inline-block rounded-md bg-leaf-500 px-4 py-2 text-sm font-semibold text-white hover:bg-leaf-600"
                  >
                    Suggest a garden
                  </a>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((garden) => (
                    <GardenCard key={garden.id} garden={garden} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
