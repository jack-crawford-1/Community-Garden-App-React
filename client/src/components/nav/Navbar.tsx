import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import { routeList } from "../../routes/routes";

const HIDE_AFTER = 50;

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(
        currentScrollY < HIDE_AFTER || currentScrollY < lastScrollY.current
      );
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`w-full sticky top-0 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between  p-7 bg-[#55b47e]">
        <NavLink to="/" className="flex items-center gap-2">
          <img
            src="/svg/leaf.svg"
            alt="Community Gardens Logo"
            className="h-8 w-8"
          />

          <span className="text-white font-bold text-xl pangolin-regular">
            GrowLocal
          </span>
        </NavLink>
        <ul className="flex gap-2 justify-center text-white font-bold">
          {routeList.map(({ path, name }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  isActive ? "" : "hover:text-green-400"
                }
              >
                {name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
