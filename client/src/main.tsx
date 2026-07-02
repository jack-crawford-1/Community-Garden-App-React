import "./styles/index.css";
import { RouterProvider } from "react-router";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { routes } from "./routes/routes";
import ErrorBoundary from "./components/ErrorBoundary";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <RouterProvider router={routes} />
      </ErrorBoundary>
    </StrictMode>,
  );
}
