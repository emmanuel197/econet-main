import React from "react";
import useIsMobile from "../utils/useIsMobile";
import MyStuffPage from "./MyStuffPage";
import MobileMyStuffPage from "./more/MobileMyStuffPage";

// Desktop keeps the AfriPlay My Stuff grid; mobile uses the WONA "More → My Stuff" design.
const MyStuffScreen = () => (useIsMobile() ? <MobileMyStuffPage /> : <MyStuffPage />);

export default MyStuffScreen;
