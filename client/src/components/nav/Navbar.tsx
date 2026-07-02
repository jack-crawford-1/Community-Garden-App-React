import { NavLink } from "react-router";

const links = [
  { to: "/", label: "Map", end: true },
  { to: "/gardens", label: "Directory" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="flex h-16 items-center justify-between bg-leaf-500 px-4 shadow-sm sm:px-7">
        <NavLink to="/" className="flex items-center gap-2.5">
          <img src="/svg/leaf.svg" alt="" className="h-8 w-8" />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-xl font-semibold text-white">GrowLocal</span>
            <span className="text-[11px] font-medium text-green-50/80">
              Community gardens of Aotearoa
            </span>
          </span>
        </NavLink>

        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-green-50/90 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/suggest"
            className="ml-1 rounded-md bg-white px-3.5 py-1.5 text-sm font-semibold text-leaf-700 transition-colors hover:bg-leaf-100"
          >
            <span className="sm:hidden">Suggest</span>
            <span className="hidden sm:inline">Suggest a garden</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
