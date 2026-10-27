import React from "react";
import useIsMobile from "../utils/useIsMobile";
import ShortsPage from "./ShortsPage";
import MobileShortsPage from "./MobileShortsPage";

// Mobile Afrishorts feed below md, desktop grid/sidebar feed at md+.
const ShortsScreen = () => (useIsMobile() ? <MobileShortsPage /> : <ShortsPage />);

export default ShortsScreen;
