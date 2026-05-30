import { createBrowserRouter } from "react-router";
import GardenPage from "../app/GardenPage";
import EventsPage from "../app/EventsPage";
import Form from "../components/form/Form";
import MapPage from "../app/Combined";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export const routeList = [
  // The map is the landing experience.
  { path: "/", element: <MapPage /> },
  { path: "/map", element: <MapPage /> },
  { path: "/form", element: <Form /> },

  { path: "/register", element: <RegisterForm /> },
  { path: "/login", element: <LoginForm /> },

  { path: "/venues/:id", element: <GardenPage /> },
  { path: "/venues/:id/events", element: <EventsPage /> },
];

export const routes = createBrowserRouter(routeList);
