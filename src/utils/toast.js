// Minimal toast — replaces the legacy app's wc-toast without adding a dependency.
// Renders a fixed-position stack of auto-dismissing pills.

const CONTAINER_ID = "afri-toast-container";

const ensureContainer = () => {
  let el = document.getElementById(CONTAINER_ID);
  if (!el) {
    el = document.createElement("div");
    el.id = CONTAINER_ID;
    el.style.cssText =
      "position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none;";
    document.body.appendChild(el);
  }
  return el;
};

const show = (message, background) => {
  const container = ensureContainer();
  const pill = document.createElement("div");
  pill.textContent = message;
  pill.style.cssText = `background:${background};color:#fff;padding:10px 20px;border-radius:9999px;font-size:14px;font-family:inherit;box-shadow:0 4px 16px rgba(0,0,0,.35);opacity:0;transition:opacity .2s;max-width:90vw;`;
  container.appendChild(pill);
  requestAnimationFrame(() => (pill.style.opacity = "1"));
  setTimeout(() => {
    pill.style.opacity = "0";
    setTimeout(() => pill.remove(), 250);
  }, 4000);
};

export const TOAST = {
  error: (message) => show(message, "#c0392b"),
  success: (message) => show(message, "#1e8e3e"),
};
