import React from "react";
import classNames from "../../utils/classNames";

/*
  AmbientBackground — decorative blurred blob field behind page content.

  Ported from glotv-main's AmbientBackground.jsx (GTV-022), which measured the
  blob layer off the GloTV Home frame (Figma node 100:10606, "Group 41227" —
  ten ellipses, 940px and 283px, positioned off-canvas and clipped). Positions,
  sizes, blurs and per-blob opacities are that file's Figma-measured values,
  kept verbatim; the paint is AfriPlay's — GloTV fills every blob with the same
  brand-green conic gradient its footer glow uses, and AfriPlay used its purple ramp.
  WONA paints them with the Figma blob gradient: angular #3d4971 → #b0186a at 30%
  (wiki/pages/design-system.md), over the navy page base.

  Placement rules are GloTV's and are worth keeping in mind when editing:
  - Everything (x, y, size, blur) is comp-WIDTH-relative: calc(P/1728*var(--vw)),
    like every other measurement in this codebase, so the whole field scales with
    the page as the viewport widens.
  - y is NOT stretched to a page's real content height. Blobs sit at their literal
    reference-frame coordinates and the ten-blob pattern simply repeats every
    REFERENCE_HEIGHT px; `overflow-hidden` on this container (which is scoped to
    <main>, see MainLayout.jsx) clips whatever a shorter page doesn't need, and a
    taller page keeps getting coverage. Nothing is measured at runtime.
  - Scoping to <main> is what keeps these off the Footer's own glow.
  - `BLOBS` order is the Figma back-to-front child order. Several blobs overlap
    and "over" compositing is order-dependent, so don't reorder for tidiness.
*/

const GRADIENT =
  "conic-gradient(from 90deg, rgba(61,73,113,1) 0deg, rgba(176,24,106,0.3) 180deg, rgba(61,73,113,1) 360deg)";

// x, y: top-left, reference-frame px. size: diameter. blur: Gaussian px. opacity: per-blob.
const BLOBS = [
  { node: "1:9446", x: 209, y: 584, size: 283, blur: 50, opacity: 1 },
  { node: "1:9447", x: 1081, y: 4113, size: 940, blur: 100, opacity: 0.6 },
  { node: "1:9448", x: -370, y: 1160, size: 940, blur: 100, opacity: 0.6 },
  { node: "1:9449", x: -370, y: -246, size: 940, blur: 100, opacity: 0.4 },
  { node: "1:9450", x: 1147, y: 759, size: 940, blur: 100, opacity: 0.6 },
  { node: "1:9451", x: 1298, y: 2056, size: 940, blur: 100, opacity: 0.4 },
  { node: "1:9452", x: -359, y: 2870, size: 940, blur: 100, opacity: 0.6 },
  { node: "1:9453", x: 1188, y: 4134, size: 940, blur: 100, opacity: 0.4 },
  { node: "1:9454", x: -316, y: 5995, size: 940, blur: 100, opacity: 0.6 },
  { node: "1:9455", x: -710, y: 7185, size: 940, blur: 100, opacity: 0.4 },
];

// Reference frame height the ten-blob pattern repeats on.
const REFERENCE_HEIGHT = 7059;
// Over-provisioned on purpose; excess is clipped for free.
const REPEAT_COUNT = 5;

const AmbientBackground = ({ className = "" }) => (
  <div
    aria-hidden="true"
    className={classNames("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
  >
    {Array.from({ length: REPEAT_COUNT }, (_, cycle) =>
      BLOBS.map((blob) => (
        <div
          key={`${cycle}-${blob.node}`}
          className="absolute rounded-full"
          style={{
            left: `calc(${blob.x}/1728*var(--vw))`,
            top: `calc(${blob.y + cycle * REFERENCE_HEIGHT}/1728*var(--vw))`,
            width: `calc(${blob.size}/1728*var(--vw))`,
            height: `calc(${blob.size}/1728*var(--vw))`,
            opacity: blob.opacity,
            filter: `blur(calc(${blob.blur}/1728*var(--vw)))`,
            background: GRADIENT,
          }}
        />
      ))
    )}
  </div>
);

export default AmbientBackground;
