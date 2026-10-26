// URL → page map. Every screen in the app is registered here.
import { createBrowserRouter } from "react-router";
import AppLayout from "../layout/AppLayout.jsx";
import HomePage from "../features/home/HomePage.jsx";
import NotFoundPage from "../features/not-found/NotFoundPage.jsx";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
