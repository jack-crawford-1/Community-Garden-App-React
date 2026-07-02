import { Link } from "react-router";
import Footer from "../components/footer/Footer";
import { usePageMeta } from "../lib/meta";

export default function AboutPage() {
  usePageMeta(
    "About",
    "GrowLocal is a free, open directory of community gardens in Aotearoa New Zealand, built on council open data and community contributions.",
  );

  return (
    <>
      <div className="min-h-[70vh] bg-leaf-50">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-leaf-600">About</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-moss-950 sm:text-4xl">
            A directory of community gardens in Aotearoa
          </h1>

          <div className="mt-6 space-y-5 text-sm leading-relaxed text-gray-700 sm:text-base">
            <p>
              GrowLocal helps you find a community garden near you — where it is, what it's
              called, and how to get in touch. It starts with Wellington and will grow to
              cover the rest of New Zealand, region by region.
            </p>
            <p>
              Every listing is real. Garden locations and contact details come from{" "}
              <a
                href="https://data-wcc.opendata.arcgis.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-leaf-700 underline decoration-leaf-500/40 underline-offset-2 hover:decoration-leaf-500"
              >
                Wellington City Council open data
              </a>
              , refreshed from the council's GIS service, with corrections contributed by the
              community.
            </p>
            <p>
              Community gardens are shared spaces where locals grow food together. Most
              welcome new members — the best way to get involved is simply to email the
              garden or turn up to a working bee.
            </p>
          </div>

          <div className="mt-10 rounded-xl border border-leaf-500/20 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-semibold text-moss-950">
              Help keep it accurate
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Know a garden that's missing, or a detail that's changed? Suggestions take a
              minute and don't need an account.
            </p>
            <Link
              to="/suggest"
              className="mt-4 inline-block rounded-md bg-leaf-500 px-4 py-2 text-sm font-semibold text-white hover:bg-leaf-600"
            >
              Suggest a garden
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
