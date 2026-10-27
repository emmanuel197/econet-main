import React from "react";
import useIsMobile from "../utils/useIsMobile";
import LiveTvPage from "./LiveTvPage";
import MobileLiveTvPage from "./MobileLiveTvPage";

// Mobile Live TV landing below md, desktop EPG page at md+.
const LiveTvScreen = () => (useIsMobile() ? <MobileLiveTvPage /> : <LiveTvPage />);

export default LiveTvScreen;
