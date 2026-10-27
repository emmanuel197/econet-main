/**
 * Feature runtime in MINUTES → "H:MM" (159 → "2:39", 90 → "1:30", 38 → "0:38").
 *
 * This is what the shorts tiles' duration pill shows, matching the production AfriPlay
 * mobile app: `✅ VERIFIED` 2026-07-30 against a screenshot of it — every visible pill is
 * the movie's `duration` field rendered this way (The love I promised her 159 → "2:39",
 * TANWA SAVAGE 90 → "1:30", Panther 124 → "2:04", Pains of Aliyah 2 63 → "1:03").
 *
 * NOTE it is deliberately NOT the vertical trailer's length — no endpoint exposes that
 * (see wiki open-questions #25); the operator shows the full feature runtime. Do not
 * confuse this with `utils/formatSeconds.js`, which takes SECONDS and is used by the
 * players for real playback position/duration read from the media.
 */
const formatRuntime = (minutes) => {
  const mins = Math.max(0, Math.round(Number(minutes) || 0));
  if (!mins) return "";
  const h = Math.floor(mins / 60);
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

export default formatRuntime;
