import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Hls from "hls.js";
import classNames from "../utils/classNames";
import Button from "../components/ui/Button";
import backArrow from "../../assets/icons/shorts-play-back-arrow-back-arrow.svg";
import store from "../store/store";
import { fetchPurchaseHistory } from "../api/subscriptions";
import {
  fetchPlayoutUrl,
  getLengthWatched,
  updateWatchlist,
  sendPlayLog,
} from "../api/details";

/**
 * WatchPage (/watch/:type/:id) — legacy watch.js workflow, revamp UI. This page
 * owns ALL the subscription edge cases:
 *  - subscribed (premiumSub)          → gated playout URL plays
 *  - unsubscribed + trailer variant   → trailer plays anyway (trailers are free)
 *  - unsubscribed + trailer missing   → "Trailer Was Not Found" + Back
 *  - unsubscribed + watch attempt     → subscribe screen → /subscriptions
 *  - live channels                    → same gate, live copy, no seek controls
 * Progress on real playback feeds the bookmarks API (Keep Watching source) and
 * the CRM play log; playback resumes from the saved bookmark.
 */
const WatchPage = () => {
  const { type, id } = useParams(); // type: movie | series | live (series id = EPISODE id)
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const trailerFromState = location.state?.trailer; // may be undefined (watch intent) or null (fetch failed)
  const variant = location.state?.variant; // "trailer" | "movie"
  const contentId = location.state?.contentId ?? id; // numeric id for bookmarks/trailers
  const title = location.state?.title || "";

  const [src, setSrc] = useState(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);
  // False from src-set until the first frame renders — live playout in
  // particular can take several seconds before frames arrive. The <video> is
  // kept invisible until then: the browser paints its OWN buffering throbber
  // on the video surface (not suppressible), so showing both it and our
  // branded spinner rendered two loaders at once. Mid-playback stalls are
  // left to the native throbber alone for the same reason.
  const [mediaReady, setMediaReady] = useState(false);
  const videoRef = useRef(null);
  const loggedRef = useRef(false);
  const lastSavedRef = useRef(0);

  const isTrailer = variant === "trailer";
  const isLive = type === "live";

  // Entitlement + source resolution — legacy fetchData(): refresh premiumSub
  // first, then pick playout vs trailer.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setChecking(true);
      setError(null);
      setSrc(null);
      try {
        await fetchPurchaseHistory(dispatch, "Active");
        // premiumSub is read AFTER the refresh straight from the store — the
        // selector captured by this closure is stale by design of the flow.
        const entitled = store.getState().subscriptions.premiumSub;

        if (isTrailer) {
          // Trailer plays for everyone; a null/undefined URL is the legacy
          // "Trailer Was Not Found" edge case (handled in render).
          if (!cancelled) setSrc(trailerFromState || null);
        } else if (entitled) {
          const url = await fetchPlayoutUrl(id, type);
          if (!cancelled) {
            if (url) setSrc(url);
            else setError("This title isn't available right now. Please try again later.");
          }
        }
        // unsubscribed + watch intent → src stays null, subscribe screen renders
      } catch {
        if (!cancelled) setError("Something went wrong while loading the video.");
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type, variant]);

  // Attach media: HLS via hls.js (Chrome/Edge), native for Safari / plain mp4.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src) return;
    let hls;
    setMediaReady(false); // spinner (video hidden) until the first frame renders
    const isHlsUrl = /\.m3u8($|\?)/i.test(src);
    if (isHlsUrl && !v.canPlayType("application/vnd.apple.mpegurl") && Hls.isSupported()) {
      // Mango useHls tuning: assume a fast link so ABR doesn't pin the first
      // segments low, then force the first load at the top rendition (ABR can
      // still step down later — currentLevel stays auto).
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        abrEwmaDefaultEstimate: 5_000_000,
      });
      hls.loadSource(src);
      hls.attachMedia(v);
      hls.on(Hls.Events.MANIFEST_PARSED, (_e, data) => {
        if (data.levels?.length) hls.startLevel = data.levels.length - 1;
        v.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (!data.fatal) return;
        // Mango recovery pattern: transient network/media errors restart the
        // load instead of killing playback (live streams hiccup routinely).
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
        else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
        else setError("An error occurred while trying to play the video. Please try again later.");
      });
    } else {
      v.src = src;
      v.play().catch(() => {});
    }
    return () => hls?.destroy();
  }, [src]);

  // Resume from the saved bookmark (real playback only — not trailers/live).
  useEffect(() => {
    if (!src || isTrailer || isLive) return;
    let cancelled = false;
    getLengthWatched(contentId, type).then((ms) => {
      const v = videoRef.current;
      if (!cancelled && v && ms > 1000) v.currentTime = ms / 1000;
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Bookmark progress (Keep Watching) — legacy updated on pause/seek/buffer; we
  // save on pause/end and at most every 15s of playback.
  const saveProgress = () => {
    if (isTrailer || isLive) return;
    const v = videoRef.current;
    if (!v?.currentTime) return;
    console.log(
      "[watch] saveProgress — contentId:", contentId,
      "(route id:", id, "| state contentId:", location.state?.contentId, ") type:", type,
      "at", Math.round(v.currentTime), "s"
    );
    updateWatchlist(contentId, type, Math.round(v.currentTime * 1000));
  };
  const handleTimeUpdate = () => {
    if (isTrailer || isLive) return;
    const v = videoRef.current;
    if (!v) return;
    if (v.currentTime - lastSavedRef.current > 15) {
      lastSavedRef.current = v.currentTime;
      saveProgress();
    }
    if (!loggedRef.current && v.currentTime > 1) {
      loggedRef.current = true;
      sendPlayLog({ uid: id, title }, type, 0);
    }
  };

  const showSubscribeScreen = !checking && !src && !error && !isTrailer;
  const showTrailerMissing = !checking && !src && !error && isTrailer;

  // Black only behind actual video; message states (subscribe / trailer missing /
  // error / loading) sit on the app's purple surface with the usual glow.
  const playing = Boolean(src && !error);

  return (
    <div
      className={classNames(
        "relative flex min-h-screen items-center justify-center overflow-hidden font-primary text-gray-1",
        playing ? "bg-black" : "bg-page"
      )}
    >
      {!playing && (
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 size-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[60px]"
          style={{
            background:
              "radial-gradient(circle, rgba(218,19,117,0.65) 0%, rgba(218,19,117,0.25) 45%, transparent 72%)",
          }}
        />
      )}
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Back"
        className="absolute left-[calc(53/1728*var(--vw))] top-[calc(120/1728*var(--vw))] z-20 flex size-[calc(40/1728*var(--vw))] items-center justify-center rounded-full bg-gray-1/10 cursor-pointer"
      >
        <img src={backArrow} alt="" aria-hidden="true" className="size-[calc(18/1728*var(--vw))]" />
      </button>

      {checking && <p className="text-2xl text-gray-2">Loading…</p>}

      {error && (
        <div className="flex flex-col items-center gap-6 px-6 text-center">
          <p className="max-w-xl text-2xl">{error}</p>
          <Button variant="primary" size="lg" onClick={() => window.location.reload()}>
            <span className="font-medium text-xl text-gray-1">Try Again</span>
          </Button>
        </div>
      )}

      {showTrailerMissing && (
        <div className="flex flex-col items-center gap-6 px-6 text-center">
          <p className="text-2xl">Trailer Was Not Found</p>
          <Button variant="primary" size="lg" onClick={() => navigate(-1)}>
            <span className="font-medium text-xl text-gray-1">Back</span>
          </Button>
        </div>
      )}

      {showSubscribeScreen && (
        <div className="flex max-w-2xl flex-col items-center gap-8 px-6 text-center">
          <p className="text-2xl text-gray-1/90">
            You have no active subscriptions. Choose your desired data bundle from the available
            data bundles list to enjoy amazing WONA content.
          </p>
          <Button variant="primary" size="lg" onClick={() => navigate("/subscriptions")}>
            <span className="font-medium text-xl text-gray-1">Subscribe</span>
          </Button>
        </div>
      )}

      {src && !error && (
        <>
          <video
            ref={videoRef}
            // Live gets native controls too (play/pause/volume/fullscreen) —
            // browsers disable seeking on live HLS themselves, so there's no
            // need to strip the whole control bar like legacy did.
            controls
            autoPlay
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onPause={saveProgress}
            onEnded={saveProgress}
            onPlaying={() => setMediaReady(true)}
            onCanPlay={() => setMediaReady(true)}
            className={classNames(
              "h-screen w-screen object-contain",
              !mediaReady && "invisible" // hides the native throbber during connect
            )}
          />
          {/* Stream-connect spinner (Mango pattern) — sole loader until the
              first frame; the video (and the browser's own throbber with it)
              stays invisible meanwhile. */}
          {!mediaReady && (
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
              <span className="size-12 animate-spin rounded-full border-4 border-gray-1/20 border-t-brand" />
              <span className="text-xl text-gray-2">{isLive ? "Connecting to live stream…" : "Loading video…"}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WatchPage;
