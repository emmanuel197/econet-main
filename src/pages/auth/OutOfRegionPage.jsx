import React from "react";
import AuthShell from "../../components/sections/auth/AuthShell";

// Destination of the checkUserAllowed geo gate (legacy routed to a generic error page).
const OutOfRegionPage = () => (
  <AuthShell
    title="Not available in your region"
    subtitle="WONA is currently only available in supported regions. Please check back later."
  />
);

export default OutOfRegionPage;
