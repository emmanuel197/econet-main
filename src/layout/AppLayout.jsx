// The frame shared by every page: header now, navbar and footer once the design is in.
// <Outlet /> is where the current page (chosen by the router) is drawn.
import { Outlet } from "react-router";
import { OPERATOR } from "../config/operator.js";

export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <header className="px-6 py-4 text-xl font-bold">{OPERATOR.name}</header>
      <main className="px-6">
        <Outlet />
      </main>
    </div>
  );
}
