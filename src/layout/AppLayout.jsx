// The frame shared by every page: header now, navbar and footer once the design is in.
// <Outlet /> is where the current page (chosen by the router) is drawn.
import { Outlet } from "react-router";
import { OPERATOR } from "../config/operator.js";
import wonaLogo from "../assets/brand/wona-logo.svg";

export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <header className="px-6 py-4">
        <img src={wonaLogo} alt={OPERATOR.name} className="h-7 w-auto" />
      </header>
      <main className="px-6">
        <Outlet />
      </main>
    </div>
  );
}
