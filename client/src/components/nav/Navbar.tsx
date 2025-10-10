import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { routeList } from "../../routes/routes";

const HIDE_AFTER = 50;

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const lastScrollY = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(
        currentScrollY < HIDE_AFTER || currentScrollY < lastScrollY.current
      );
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    setIsLoggedIn(!!token);
    if (email) setUserEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserEmail("");
    navigate("/login");
  };

  const displayName =
    userEmail && userEmail.includes("@")
      ? userEmail.split("@")[0]
      : userEmail || "Unknown";

  return (
    <nav
      className={`w-full sticky top-0 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between p-7 bg-[#55b47e]">
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

        <ul className="flex gap-4 items-center text-white font-bold">
          {routeList.map(({ path, name }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  isActive ? "text-green-900" : "hover:text-green-300"
                }
              >
                {name}
              </NavLink>
            </li>
          ))}

          {isLoggedIn ? (
            <>
              <li className="text-white font-semibold">
                Logged in:{" "}
                {/* <span className="text-green-100">{displayName}: </span> */}
                <span className="text-green-100">{userEmail}</span>
              </li>
              <button
                onClick={handleLogout}
                className="bg-white text-green-700 px-3 py-1 rounded-md hover:bg-green-100"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="bg-white text-green-700 px-3 py-1 rounded-md hover:bg-green-100"
            >
              Login
            </NavLink>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
