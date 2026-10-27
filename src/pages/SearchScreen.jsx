import React from "react";
import useIsMobile from "../utils/useIsMobile";
import SearchPage from "./SearchPage";
import MobileSearchPage from "./MobileSearchPage";

// Renders one of the two search screens — the search page is stateful (query,
// localStorage recents), so we pick a single variant rather than mounting both.
const SearchScreen = () => (useIsMobile() ? <MobileSearchPage /> : <SearchPage />);

export default SearchScreen;
