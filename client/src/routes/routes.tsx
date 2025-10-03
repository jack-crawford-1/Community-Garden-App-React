import { createBrowserRouter } from "react-router";
import App from "../app/App";
import GardenPage from "../app/GardenPage";
import EventsPage from "../app/EventsPage";
import Form from "../components/form/Form";
import Example3 from "../app/Combined";

export const routeList = [
  { path: "/", element: <App /> },
  { path: "/map", element: <Example3 />, name: "Map" },

  { path: "/map/:id", element: <GardenPage /> },
  { path: "/form", element: <Form /> },
  { path: "/gardens/:id", element: <GardenPage /> },
  { path: "/gardens/:id/events", element: <EventsPage /> },
];

export const routes = createBrowserRouter(routeList);
