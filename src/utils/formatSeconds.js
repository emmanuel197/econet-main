/**
 * Seconds → "m:ss" clock label for the reel players' time readouts.
 *
 * Rounds the TOTAL first, then splits — deriving minutes before rounding the remainder
 * let a 59.88s short (the real duration of `drifted_shorts1`, verified 2026-07-30) render
 * as "0:60" instead of "1:00", because `Math.round(59.88 % 60)` is 60.
 *
 * Durations come from the media itself (`loadedmetadata` → `video.duration`), not the API —
 * no endpoint exposes a vertical-trailer length. See wiki open-questions #25.
 */
const formatSeconds = (total) => {
  const secs = Math.max(0, Math.round(Number(total) || 0));
  const m = Math.floor(secs / 60);
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export default formatSeconds;
