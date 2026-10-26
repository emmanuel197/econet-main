// URL → page map. Every screen in the app is registered here.
import { createBrowserRouter } from "react-router";
import AppLayout from "../layout/AppLayout.jsx";
import HomePage from "../features/home/HomePage.jsx";
import NotFoundPage from "../features/not-found/NotFoundPage.jsx";
import DesignPreviewPage from "../features/design-preview/DesignPreviewPage.jsx";

// Pages that only exist while developing (`npm run dev`), never in the built site.
const devOnlyRoutes = import.meta.env.DEV ? [{ path: "/design", element: <DesignPreviewPage /> }] : [];

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      ...devOnlyRoutes,
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
