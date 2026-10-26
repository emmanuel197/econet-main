// Dev-only page (/design) showing every design token, to compare against Figma at a glance.
const COLOR_TOKENS = [
  "brand",
  "brand-light",
  "brand-dark",
  "page",
  "surface",
  "surface-raised",
  "text-soft",
  "text-muted",
  "live",
  "error",
];

const GRADIENT_TOKENS = ["brand", "surface", "scrim"];

export default function DesignPreviewPage() {
  return (
    <div className="space-y-10 py-6">
      <section>
        <h2 className="mb-4 text-lg font-semibold">Colours</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {COLOR_TOKENS.map((name) => (
            <div key={name} className="space-y-2">
              <div
                className="h-16 rounded-2xl border border-white/10"
                style={{ background: `var(--color-${name})` }}
              />
              <p className="text-sm text-text-soft">{name}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Gradients</h2>
        <div className="grid grid-cols-3 gap-4">
          {GRADIENT_TOKENS.map((name) => (
            <div key={name} className="space-y-2">
              <div
                className="h-24 rounded-2xl border border-white/10"
                style={{ backgroundImage: `var(--gradient-${name})` }}
              />
              <p className="text-sm text-text-soft">{name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="mb-4 text-lg font-semibold">Type and buttons</h2>
        <p className="text-2xl font-bold">Because You Watched (24 bold)</p>
        <p className="text-lg font-semibold">Keep Watching (18 semibold)</p>
        <p className="text-sm text-text-soft">65% watched · 35 min left (14 regular, soft)</p>
        <p className="text-xs text-text-muted">2024 · 1h 53m (12 regular, muted)</p>
        <div className="flex gap-3 pt-2">
          <button className="rounded-full bg-brand px-5 py-2 text-sm font-semibold hover:bg-brand-light">
            Watch Now
          </button>
          <button className="rounded-full bg-white/20 px-5 py-2 text-sm font-semibold backdrop-blur">
            + My Stuff
          </button>
          <span className="self-center rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold">NEW</span>
        </div>
      </section>
    </div>
  );
}
