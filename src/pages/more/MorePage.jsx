import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import classNames from "../../utils/classNames";
import { USE_FIXTURES } from "../../utils/devFlags";
import { showPreviewNotice } from "../../utils/toast";
import { getProfile, logout } from "../../api/account";
import { fetchWatchlist } from "../../api/fetchMoviesApi";
import { selectInboxUnreadCount } from "../../store/slice/inboxSlice";
import { m, PhoneColumn } from "../../components/sections/tvod/TvodUi";
import { IconChevronRight } from "../../components/sections/more/MoreUi";
import { savedPremiereIds } from "../../components/sections/premiere/PremiereUi";
import { moreProfile, myStuffSample, myStuffSamplePremieres, libraryActiveRentals } from "../../data/moreFixtures";
import defaultAvatar from "../../../assets/images/home-navbar-avatar.webp";

/**
 * MorePage (/more) — the bottom nav's "More" tab (WONA comps More1–More5): profile row
 * (avatar, name, plan pill), My Stuff / My Library tiles, ACCOUNT list and Sign Out.
 */

// Tile icons traced from comp More2
const IconBookmark = () => (
  <svg viewBox="17 14 24 26" aria-hidden="true" style={{ width: m(21), height: m(23) }}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M39.5 25.9478V31.773C39.5 35.385 39.5 37.1922 38.6437 37.9808C38.2353 38.3577 37.7197 38.5945 37.1702 38.6575C36.0187 38.7893 34.6735 37.5993 31.9843 35.2205C30.7943 34.1693 30.2005 33.6432 29.5133 33.5055C29.1746 33.4364 28.8254 33.4364 28.4867 33.5055C27.7983 33.6432 27.2045 34.1693 26.0157 35.2205C23.3265 37.5993 21.9813 38.7893 20.8298 38.6563C20.2795 38.593 19.7635 38.3565 19.3563 37.9808C18.5 37.1922 18.5 35.3862 18.5 31.773V25.9467C18.5 20.9452 18.5 18.4438 20.0377 16.8887C21.5753 15.3335 24.051 15.3335 29 15.3335C33.949 15.3335 36.4247 15.3335 37.9623 16.8875C39.5 18.4415 39.5 20.9452 39.5 25.9478ZM24.625 20.0002C24.625 19.7681 24.7172 19.5455 24.8813 19.3814C25.0454 19.2173 25.2679 19.1252 25.5 19.1252H32.5C32.7321 19.1252 32.9546 19.2173 33.1187 19.3814C33.2828 19.5455 33.375 19.7681 33.375 20.0002C33.375 20.2322 33.2828 20.4548 33.1187 20.6189C32.9546 20.783 32.7321 20.8752 32.5 20.8752H25.5C25.2679 20.8752 25.0454 20.783 24.8813 20.6189C24.7172 20.4548 24.625 20.2322 24.625 20.0002Z"
    />
  </svg>
);
const IconLibraryTray = () => (
  <svg viewBox="197 14 24 26" aria-hidden="true" style={{ width: m(24), height: m(26) }}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M205.117 21.7988H212.883C216.819 21.7988 218.788 21.7988 219.894 22.9503C221 24.1018 220.739 25.8798 220.219 29.437L219.726 32.811C219.318 35.6005 219.114 36.9958 218.067 37.8312C217.021 38.6665 215.477 38.6665 212.389 38.6665H205.611C202.524 38.6665 200.979 38.6665 199.933 37.8312C198.886 36.9958 198.682 35.6005 198.274 32.811L197.781 29.437C197.26 25.8798 197 24.1018 198.106 22.9503C199.212 21.7988 201.181 21.7988 205.117 21.7988ZM204.333 33.9998C204.333 33.5168 204.769 33.1248 205.305 33.1248H212.695C213.232 33.1248 213.667 33.5168 213.667 33.9998C213.667 34.4828 213.232 34.8748 212.695 34.8748H205.305C204.769 34.8748 204.333 34.4828 204.333 33.9998Z"
    />
    <path fill="currentColor" opacity="0.4" d="M204.928 15.3335H213.071C213.343 15.3335 213.55 15.3335 213.733 15.351C215.026 15.4782 216.083 16.2552 216.532 17.3017H201.468C201.917 16.2552 202.975 15.4782 204.268 15.351C204.449 15.3335 204.657 15.3335 204.928 15.3335Z" />
    <path fill="currentColor" opacity="0.7" d="M202.361 18.5103C200.74 18.5103 199.41 19.4903 198.966 20.7888L198.938 20.8704C199.409 20.7345 199.89 20.6358 200.376 20.5753C201.636 20.4143 203.229 20.4143 205.08 20.4143H213.12C214.971 20.4143 216.564 20.4143 217.824 20.5753C218.314 20.6383 218.797 20.7304 219.262 20.8704L219.235 20.7888C218.792 19.4891 217.462 18.5103 215.839 18.5103H202.361Z" />
  </svg>
);

// ACCOUNT list icons (lucide: user, bell, download, settings, circle-help)
const Line = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: m(22), height: m(22) }}>
    {children}
  </svg>
);
const ROW_ICONS = {
  profile: (
    <Line>
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </Line>
  ),
  notifications: (
    <Line>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </Line>
  ),
  downloads: (
    <Line>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </Line>
  ),
  settings: (
    <Line>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </Line>
  ),
  help: (
    <Line>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </Line>
  ),
};

const Tile = ({ icon, title, subtitle, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-1 cursor-pointer flex-col items-start rounded-[12px] border border-gray-1/20 bg-[#313953] text-left text-gray-1"
    style={{ height: m(106), padding: m(15) }}
  >
    {icon}
    <span className="mt-auto font-primary font-medium" style={{ fontSize: m(15) }}>{title}</span>
    <span className="flex w-full items-center justify-between font-primary text-gray-1/60" style={{ marginTop: m(4), fontSize: m(13) }}>
      {subtitle}
      <IconChevronRight size={14} />
    </span>
  </button>
);

const Row = ({ icon, title, subtitle, dot, onClick, last }) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames("flex w-full cursor-pointer items-center text-left text-gray-1", !last && "border-b border-gray-1/15")}
    style={{ height: m(subtitle ? 85 : 71), gap: m(10) }}
  >
    {icon}
    <span className="flex min-w-0 flex-1 flex-col" style={{ gap: m(4) }}>
      <span className="font-primary font-medium" style={{ fontSize: m(15) }}>{title}</span>
      {subtitle && <span className="font-primary text-gray-1/60" style={{ fontSize: m(12) }}>{subtitle}</span>}
    </span>
    {dot && <span className="rounded-full bg-brand" style={{ width: m(8), height: m(8) }} aria-label="Unread" />}
    <IconChevronRight size={20} className="text-gray-1/80" />
  </button>
);

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

const MorePage = () => {
  const navigate = useNavigate();
  const unread = useSelector(selectInboxUnreadCount);
  const [name, setName] = useState(USE_FIXTURES ? moreProfile.name : "");
  const [savedCount, setSavedCount] = useState(() =>
    USE_FIXTURES ? myStuffSample.length + new Set([...myStuffSamplePremieres, ...savedPremiereIds()]).size : null
  );
  const activeRentals = USE_FIXTURES ? libraryActiveRentals.length : 0;

  useEffect(() => {
    if (USE_FIXTURES) return undefined;
    let alive = true;
    getProfile()
      .then((p) => alive && setName([p?.first_name, p?.last_name].filter(Boolean).join(" ")))
      .catch(() => {});
    fetchWatchlist().then((cards) => alive && setSavedCount(cards.length + savedPremiereIds().length));
    return () => {
      alive = false;
    };
  }, []);

  const rows = [
    { id: "profile", title: "Profile & Account", subtitle: "Edit details, manage plan", onClick: () => navigate("/profile") },
    { id: "notifications", title: "Notifications", dot: unread > 0, onClick: () => navigate("/notifications") },
    // Downloads and Settings have no screen in the designs or the AfriPlay web app
    { id: "downloads", title: "Downloads", onClick: showPreviewNotice },
    { id: "settings", title: "Settings", onClick: showPreviewNotice },
    { id: "help", title: "Help & Support", onClick: () => navigate("/profile?tab=support") },
  ];

  return (
    <PhoneColumn style={{ paddingTop: m(24) }}>
      <button type="button" onClick={() => navigate("/profile")} className="flex w-full cursor-pointer items-center text-left" style={{ padding: `${m(16)} ${m(21)}`, gap: m(12) }}>
        <img src={USE_FIXTURES ? moreProfile.avatar : defaultAvatar} alt="" className="shrink-0 rounded-full object-cover" style={{ width: m(72), height: m(72) }} />
        <span className="flex min-w-0 flex-1 flex-col items-start" style={{ gap: m(8) }}>
          <span className="truncate font-primary font-semibold text-gray-1" style={{ fontSize: m(14) }}>{name || "My Account"}</span>
          {/* Plan pill: sample data only — the subscriber's plan isn't wired to this screen yet */}
          {USE_FIXTURES && (
            <span className="rounded-full border border-[#22c55e] bg-[#22c55e]/10 font-primary text-[#53cf7b]" style={{ height: m(23), padding: `0 ${m(11)}`, fontSize: m(12), lineHeight: m(21) }}>
              {moreProfile.plan} · {moreProfile.planActive ? "Active" : "Inactive"}
            </span>
          )}
        </span>
        <IconChevronRight size={20} className="text-gray-1/80" />
      </button>

      <div className="flex" style={{ gap: m(12), padding: `${m(8)} ${m(21)} 0` }}>
        <Tile icon={<IconBookmark />} title="My Stuff" subtitle={savedCount == null ? "…" : plural(savedCount, "title saved", "titles saved")} onClick={() => navigate("/my-stuff")} />
        <Tile icon={<IconLibraryTray />} title="My Library" subtitle={activeRentals ? plural(activeRentals, "active rental", "active rentals") : "Rentals & purchases"} onClick={() => navigate("/library")} />
      </div>

      <section style={{ padding: `${m(28)} ${m(21)} 0` }}>
        <h2 className="font-primary text-gray-1/75" style={{ fontSize: m(14) }}>ACCOUNT</h2>
        <div className="flex flex-col" style={{ marginTop: m(8) }}>
          {rows.map((r, i) => (
            <Row key={r.id} icon={ROW_ICONS[r.id]} {...r} last={i === rows.length - 1} />
          ))}
        </div>
      </section>

      <div className="flex justify-center" style={{ padding: `${m(28)} ${m(21)} ${m(24)}` }}>
        <button
          type="button"
          onClick={() => logout()}
          className="cursor-pointer rounded-full border border-gray-1/80 bg-[#d92d20] font-primary font-semibold tracking-[-0.408px] text-gray-1 hover:opacity-90"
          style={{ width: m(112), height: m(42), fontSize: m(14) }}
        >
          Sign Out
        </button>
      </div>
    </PhoneColumn>
  );
};

export default MorePage;
