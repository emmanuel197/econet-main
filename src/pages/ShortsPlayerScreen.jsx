import React from "react";
import useIsMobile from "../utils/useIsMobile";
import ShortsPlayerPage from "./ShortsPlayerPage";
import MobileShortsPlayer from "./MobileShortsPlayer";

// Full-bleed mobile reel player below md, desktop card player at md+.
const ShortsPlayerScreen = () => (useIsMobile() ? <MobileShortsPlayer /> : <ShortsPlayerPage />);

export default ShortsPlayerScreen;
