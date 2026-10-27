import { useEffect, useState } from "react";

// True below the md breakpoint (768px) — matches the CSS mobile/desktop split so
// stateful pages can render ONE of a mobile/desktop variant instead of mounting both.
export default function useIsMobile(query = "(max-width: 767px)") {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const sync = () => setIsMobile(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    // Fallback: some environments (emulated viewports/devtools) resize without firing
    // the matchMedia change event — re-check on window resize too.
    window.addEventListener("resize", sync);
    return () => {
      mql.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, [query]);

  return isMobile;
}
