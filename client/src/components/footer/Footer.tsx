import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-moss-950 text-white/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-start sm:justify-between lg:px-10">
        <div className="max-w-sm">
          <p className="font-display text-lg font-semibold text-white">GrowLocal</p>
          <p className="mt-2 text-sm leading-relaxed">
            A free directory of community gardens in Aotearoa New Zealand, starting with
            Wellington.
          </p>
        </div>
        <div className="flex gap-12 text-sm">
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white">Map</Link></li>
            <li><Link to="/gardens" className="hover:text-white">Directory</Link></li>
            <li><Link to="/suggest" className="hover:text-white">Suggest a garden</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
          </ul>
          <ul className="space-y-2">
            <li>
              <a
                href="https://github.com/jack-crawford-1/Community-Garden-App-React"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Source on GitHub
              </a>
            </li>
            <li>
              <a
                href="https://data-wcc.opendata.arcgis.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                WCC open data
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/40">
        Garden listings sourced from Wellington City Council GIS open data.
      </div>
    </footer>
  );
}
