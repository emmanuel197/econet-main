import React, { useEffect, useState } from "react";
import classNames from "../utils/classNames";
import Button from "../components/ui/Button";
import { Pulse } from "../components/shared/PageSkeleton";
import {
  getProfile,
  updateProfile,
  fetchUserDevices,
  deleteUserDevice,
  fetchFaqs,
} from "../api/account";
import avatarImg from "../../assets/images/home-navbar-avatar.webp";

// Legacy profile.js ported (legacy logic, revamp UI): "My Account" left nav +
// tab panels. Legacy's Watchlist tab is dropped — Keep Watching lives on Home
// in the revamp; Settings/Payment were dead placeholders in legacy too.
const TABS = [
  { id: "profile", label: "Profile" },
  { id: "devices", label: "Devices" },
  { id: "support", label: "Support" },
  { id: "faqs", label: "FAQs" },
];

// Support copy ported verbatim from legacy profile.js.
const SUPPORT_ROWS = [
  // AfriPlay listed MTN Ghana's contacts here; WONA's (Econet Zimbabwe) are not known yet
  // — see wiki open questions.
  { label: "Call Us (Toll Free)", value: "To be confirmed" },
  { label: "Whatsapp", value: "To be confirmed" },
  { label: "Email Us", value: "To be confirmed" },
  { label: "Facebook", value: "To be confirmed" },
  { label: "Twitter", value: "To be confirmed" },
];

const inputClass =
  "w-full rounded-xl border border-gray-1/15 bg-gray-1/5 px-[calc(16/1728*var(--vw))] py-[calc(12/1728*var(--vw))] font-primary text-base text-gray-1 placeholder:text-gray-1/40 outline-none focus:border-brand/60 " +
  "max-md:rounded-[calc(12/390*var(--mvw))] max-md:px-[calc(16/390*var(--mvw))] max-md:py-[calc(12/390*var(--mvw))] max-md:text-[calc(14/390*var(--mvw))]";

const ProfileTab = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState(null); // null | "saving" | "saved" | "error"

  useEffect(() => {
    let alive = true;
    getProfile()
      .then((info) => {
        if (!alive) return;
        setFirstName(info?.first_name || "");
        setLastName(info?.last_name || "");
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const save = async () => {
    setSaveState("saving");
    try {
      await updateProfile(firstName, lastName);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
    setTimeout(() => setSaveState(null), 2500);
  };

  if (loading)
    return (
      <div className="flex flex-col gap-[calc(20/1728*var(--vw))]">
        <Pulse className="size-[calc(96/1728*var(--vw))] rounded-full" />
        <Pulse className="h-[calc(48/1728*var(--vw))] w-[calc(560/1728*var(--vw))]" />
        <Pulse className="h-[calc(48/1728*var(--vw))] w-[calc(560/1728*var(--vw))]" />
      </div>
    );

  return (
    <div className="flex max-w-[calc(560/1728*var(--vw))] flex-col gap-[calc(20/1728*var(--vw))] max-md:max-w-full max-md:gap-[calc(16/390*var(--mvw))]">
      <div className="flex items-center gap-[calc(16/1728*var(--vw))] max-md:gap-[calc(12/390*var(--mvw))]">
        <img src={avatarImg} alt="" className="size-[calc(96/1728*var(--vw))] rounded-full object-cover max-md:size-[calc(64/390*var(--mvw))]" />
        <div className="flex flex-col">
          <span className="font-primary font-bold text-h6 text-gray-1 max-md:text-[calc(18/390*var(--mvw))]">My Profile</span>
          <span className="font-primary text-sm text-gray-1/60 max-md:text-[calc(12/390*var(--mvw))]">
            {window.localStorage.getItem("afri_mobile_number") || ""}
          </span>
        </div>
      </div>
      <div className="flex gap-[calc(16/1728*var(--vw))] max-md:flex-col max-md:gap-[calc(12/390*var(--mvw))]">
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          className={inputClass}
        />
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name"
          className={inputClass}
        />
      </div>
      <div className="flex items-center gap-[calc(16/1728*var(--vw))] max-md:gap-[calc(12/390*var(--mvw))]">
        <Button variant="primary" size="lg" onClick={save} disabled={saveState === "saving"} className="max-md:px-[calc(20/390*var(--mvw))] max-md:py-[calc(11/390*var(--mvw))] max-md:text-[calc(14/390*var(--mvw))]">
          {saveState === "saving" ? "Saving…" : "Save"}
        </Button>
        {saveState === "saved" && (
          <span className="font-primary text-sm text-brand max-md:text-[calc(12/390*var(--mvw))]">Profile updated ✓</span>
        )}
        {saveState === "error" && (
          <span className="font-primary text-sm text-error-8 max-md:text-[calc(12/390*var(--mvw))]">Could not save — try again.</span>
        )}
      </div>
    </div>
  );
};

const DevicesTab = () => {
  const [devices, setDevices] = useState(null); // null = loading
  const [removing, setRemoving] = useState(null);

  const load = () => fetchUserDevices().then(setDevices);
  useEffect(() => {
    load();
  }, []);

  const remove = async (device) => {
    setRemoving(device.id);
    try {
      await deleteUserDevice(device.id);
      await load();
    } finally {
      setRemoving(null);
    }
  };

  if (devices === null)
    return (
      <div className="flex flex-col gap-[calc(12/1728*var(--vw))]">
        {Array.from({ length: 3 }, (_, i) => (
          <Pulse key={i} className="h-[calc(72/1728*var(--vw))] w-full" />
        ))}
      </div>
    );

  if (!devices.length)
    return <p className="font-primary text-base text-gray-1/60 max-md:text-[calc(13/390*var(--mvw))]">No devices registered.</p>;

  return (
    <div className="flex flex-col gap-[calc(12/1728*var(--vw))] max-md:gap-[calc(8/390*var(--mvw))]">
      {devices.map((d, i) => (
        <div
          key={d.id ?? i}
          className={classNames(
            "flex items-center justify-between rounded-xl px-[calc(16/1728*var(--vw))] py-[calc(14/1728*var(--vw))] max-md:px-[calc(12/390*var(--mvw))] max-md:py-[calc(10/390*var(--mvw))]",
            i % 2 === 1 && "bg-gray-1/5"
          )}
        >
          <div className="flex min-w-0 flex-col gap-[calc(6/1728*var(--vw))] max-md:gap-[calc(5/390*var(--mvw))]">
            <span className="font-primary font-semibold text-base leading-none text-gray-1 max-md:text-[calc(13/390*var(--mvw))]">
              {d.name || d.device_name || d.model || `Device ${d.id}`}
            </span>
            <span className="font-primary text-sm leading-none text-gray-1/60 max-md:text-[calc(11/390*var(--mvw))]">
              {[d.platform, d.device_class ?? d.type].filter(Boolean).join(" · ")}
            </span>
          </div>
          <Button
            variant="secondary"
            size={null}
            onClick={() => remove(d)}
            disabled={removing === d.id}
            className="px-[calc(18/1728*var(--vw))] py-[calc(8/1728*var(--vw))] text-sm max-md:px-[calc(14/390*var(--mvw))] max-md:py-[calc(7/390*var(--mvw))] max-md:text-[calc(12/390*var(--mvw))]"
          >
            {removing === d.id ? "Removing…" : "Remove"}
          </Button>
        </div>
      ))}
    </div>
  );
};

const SupportTab = () => (
  <div className="flex max-w-[calc(560/1728*var(--vw))] flex-col gap-[calc(4/1728*var(--vw))] max-md:max-w-full">
    {SUPPORT_ROWS.map((row, i) => (
      <div
        key={row.label}
        className={classNames(
          "flex items-center justify-between rounded-xl px-[calc(16/1728*var(--vw))] py-[calc(14/1728*var(--vw))] max-md:px-[calc(12/390*var(--mvw))] max-md:py-[calc(11/390*var(--mvw))]",
          i % 2 === 1 && "bg-gray-1/5"
        )}
      >
        <span className="font-primary text-base text-gray-1/70 max-md:text-[calc(12/390*var(--mvw))]">{row.label}</span>
        {row.value.includes("@") && row.label === "Email Us" ? (
          <a href={`mailto:${row.value}`} className="font-primary font-semibold text-base text-brand max-md:text-[calc(12/390*var(--mvw))]">
            {row.value}
          </a>
        ) : (
          <span className="font-primary font-semibold text-base text-gray-1 max-md:text-[calc(12/390*var(--mvw))]">{row.value}</span>
        )}
      </div>
    ))}
  </div>
);

const FaqsTab = () => {
  const [faqs, setFaqs] = useState(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    fetchFaqs().then(setFaqs);
  }, []);

  if (faqs === null)
    return (
      <div className="flex flex-col gap-[calc(12/1728*var(--vw))]">
        {Array.from({ length: 4 }, (_, i) => (
          <Pulse key={i} className="h-[calc(56/1728*var(--vw))] w-full" />
        ))}
      </div>
    );

  if (!faqs.length)
    return <p className="font-primary text-base text-gray-1/60 max-md:text-[calc(13/390*var(--mvw))]">No FAQs available right now.</p>;

  return (
    <div className="flex flex-col gap-[calc(8/1728*var(--vw))] max-md:gap-[calc(8/390*var(--mvw))]">
      {faqs.map((f, i) => {
        const q = f.question || f.title || "";
        const a = f.answer || f.body || f.description || "";
        const isOpen = open === i;
        return (
          <div key={f.id ?? i} className="rounded-xl border border-gray-1/10">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between px-[calc(16/1728*var(--vw))] py-[calc(14/1728*var(--vw))] text-left cursor-pointer max-md:px-[calc(14/390*var(--mvw))] max-md:py-[calc(12/390*var(--mvw))]"
            >
              <span className="font-primary font-semibold text-base text-gray-1 max-md:text-[calc(13/390*var(--mvw))]">{q}</span>
              <span className="font-primary text-gray-1/60 max-md:text-[calc(16/390*var(--mvw))]">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <p className="px-[calc(16/1728*var(--vw))] pb-[calc(14/1728*var(--vw))] font-primary text-sm leading-relaxed text-gray-1/70 max-md:px-[calc(14/390*var(--mvw))] max-md:pb-[calc(12/390*var(--mvw))] max-md:text-[calc(12/390*var(--mvw))]">
                {a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

function ProfilePage() {
  const [tab, setTab] = useState("profile");

  // Desktop: left "My Account" nav beside the tab content. Mobile (max-md,
  // legacy profile.scss <768 pattern): stack into a column with the nav as a
  // horizontal scrolling tab strip on top, content full-width below.
  return (
    <div className="relative min-h-screen font-primary text-gray-1">
      <div className="flex gap-[calc(64/1728*var(--vw))] px-[calc(53/1728*var(--vw))] pt-[calc(146/1728*var(--vw))] pb-[calc(96/1728*var(--vw))] max-md:flex-col max-md:gap-[calc(20/390*var(--mvw))] max-md:px-[calc(20/390*var(--mvw))] max-md:pt-[calc(90/390*var(--mvw))] max-md:pb-[calc(110/390*var(--mvw))]">
        {/* Left nav — legacy "My Account" list; a scroll strip on mobile. */}
        <nav className="flex w-[calc(280/1728*var(--vw))] shrink-0 flex-col gap-[calc(8/1728*var(--vw))] max-md:w-full max-md:gap-[calc(8/390*var(--mvw))]">
          <h1 className="pb-[calc(16/1728*var(--vw))] font-primary font-bold text-h5 text-gray-1 max-md:pb-[calc(8/390*var(--mvw))] max-md:text-[calc(22/390*var(--mvw))]">
            My Account
          </h1>
          <div className="flex flex-col gap-[calc(8/1728*var(--vw))] max-md:flex-row max-md:gap-[calc(8/390*var(--mvw))] max-md:overflow-x-auto max-md:scrollbar-hide">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={classNames(
                  "rounded-xl px-[calc(16/1728*var(--vw))] py-[calc(12/1728*var(--vw))] text-left font-primary font-medium text-base cursor-pointer transition-colors",
                  "max-md:shrink-0 max-md:rounded-full max-md:px-[calc(16/390*var(--mvw))] max-md:py-[calc(8/390*var(--mvw))] max-md:text-[calc(13/390*var(--mvw))]",
                  tab === t.id
                    ? "bg-brand text-gray-1"
                    : "text-gray-1/80 hover:bg-gray-1/10 max-md:bg-gray-1/10"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="min-w-0 flex-1">
          {tab === "profile" && <ProfileTab />}
          {tab === "devices" && <DevicesTab />}
          {tab === "support" && <SupportTab />}
          {tab === "faqs" && <FaqsTab />}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
