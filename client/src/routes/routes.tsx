import { createBrowserRouter, Navigate, Outlet, useParams } from "react-router";
import Navbar from "../components/nav/Navbar";
import { GardensProvider } from "../context/GardensContext";
import HomePage from "../pages/HomePage";
import DirectoryPage from "../pages/DirectoryPage";
import GardenPage from "../pages/GardenPage";
import SuggestPage from "../pages/SuggestPage";
import AboutPage from "../pages/AboutPage";
import NotFoundPage from "../pages/NotFoundPage";

function Layout() {
  return (
    <GardensProvider>
      <Navbar />
      <Outlet />
    </GardensProvider>
  );
}

/** Old links used /venues/:id — keep them working. */
function LegacyVenueRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/gardens/${id ?? ""}`} replace />;
}

function RouteErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-moss-950 px-6 text-center text-white">
      <img src="/svg/leaf.svg" alt="" className="h-10 w-10 opacity-70" />
      <h1 className="font-display text-3xl">Something went wrong</h1>
      <p className="max-w-md text-sm text-white/60">
        The page hit an unexpected error. Reload to try again.
      </p>
      <a
        href="/"
        className="rounded-md bg-leaf-500 px-4 py-2 text-sm font-semibold text-white hover:bg-leaf-600"
      >
        Back to the map
      </a>
    </div>
  );
}

export const routes = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/map", element: <Navigate to="/" replace /> },
      { path: "/gardens", element: <DirectoryPage /> },
      { path: "/gardens/:id", element: <GardenPage /> },
      { path: "/venues/:id", element: <LegacyVenueRedirect /> },
      { path: "/suggest", element: <SuggestPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
