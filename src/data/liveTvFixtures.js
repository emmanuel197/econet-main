// Local pilot fixtures for Live TV / EPG — no EPG endpoint yet (see ../api/liveTv.js).
// Copy mirrors the 2026-07-17 reference screenshots. Only SuperSport has a real channel
// logo asset; every other channel logo reuses Home's channel-card images as placeholders
// until real logo exports ship.

import matchGraphic from "../../assets/images/epg-sport-featured-live-program-match-graphic.webp";
import supersportLogo from "../../assets/logos/epg-sport-featured-live-program-channel-logo-supersport.webp";
import cameroonFlag from "../../assets/icons/epg-sport-featured-live-program-cameroon-flag.svg";
import nigeriaFlag from "../../assets/icons/epg-sport-featured-live-program-nigeria-flag.svg";

import ch01 from "../../assets/images/home-browse-live-channels-channel-card-01.webp";
import ch02 from "../../assets/images/home-browse-live-channels-channel-card-02.webp";
import ch03 from "../../assets/images/home-browse-live-channels-channel-card-03.webp";
import ch04 from "../../assets/images/home-browse-live-channels-channel-card-04.webp";
import ch05 from "../../assets/images/home-browse-live-channels-channel-card-05.webp";

// "All" is an implicit default state, not its own dedicated frame.
export const categories = ["All", "Sports", "News", "Entertainment", "Movies", "Kids"];

export const scheduleDate = "Thursday, 30 April 2026";

export const featuredProgram = {
  id: "featured-1",
  image: matchGraphic,
  status: "LIVE",
  watching: "124.5K watching",
  channelLogo: supersportLogo,
  channelLabel: "SuperSport · Ch 5",
  category: "Sports",
  title: "AFCON 2024 Semifinal",
  subtitle: "Nigeria vs Cameroon",
  teamA: { name: "Nigeria", flag: nigeriaFlag, score: 2 },
  teamB: { name: "Cameroon", flag: cameroonFlag, score: 1 },
  minute: "67'",
  startTime: "8:00 PM",
  endTime: "10:00 PM",
  remaining: "45 min remaining",
  progress: 0.55,
};

// Sidebar + the live segment of the schedule. 9 shown; the count pill claims the
// full catalog size (25) like the reference.
export const liveChannelsTotal = 25;

export const liveChannels = [
  { id: "lc1", logo: supersportLogo, channel: "SuperSport", category: "Sports", title: "AFCON Semi: NGA vs CMR", next: "Post-Match Show · 10:00 PM", progress: 0.55 },
  { id: "lc2", logo: ch03, channel: "Arise News", category: "News", title: "Morning Show", next: "Focus Nigeria · 10 PM", progress: 0.3 },
  { id: "lc3", logo: ch04, channel: "Kids Tv", category: "Kids", title: "Teen Titans Go!", next: "The Stream · 9:30 PM", progress: 0.2 },
  { id: "lc4", logo: ch05, channel: "Disney Ch.", category: "Kids", title: "Bluey Season 4", next: "Kiff · 9:00 PM", progress: 0.4 },
  { id: "lc5", logo: supersportLogo, channel: "SuperSport", category: "Sports", title: "Champions League Semi: Arsenal vs Real Madrid", next: "Kiff · 9:00 PM", progress: 0.5 },
  { id: "lc6", logo: ch01, channel: "BET", category: "Entertainment", title: "AFCON Semi: NGA vs CMR", next: "Post-Match Show · 10:00 PM", progress: 0.35 },
  { id: "lc7", logo: ch02, channel: "Gh One", category: "News", title: "Morning Show", next: "Focus Ghana · 10 PM", progress: 0.25 },
  { id: "lc8", logo: ch03, channel: "Telemundo", category: "Movies", title: "El Señor de los Cielos", next: "Nuevo Horario · 10 PM", progress: 0.45 },
  { id: "lc9", logo: ch04, channel: "KTN News", category: "News", title: "KTN News Prime", next: "National Matters Arising · 11 PM", progress: 0.3 },
];

// "Earlier Today" rows get a Replay action, "Coming Up" rows a Remind action; the
// live-now segment between them reuses `liveChannels` (see OnAirScheduleSection).
export const onAirToday = [
  { id: "sch1", time: "6:00 AM", category: "News", title: "Arise Morning Show", channel: "Arise News", logo: ch03, when: "earlier" },
  { id: "sch2", time: "7:30 AM", category: "News", title: "Ghana Today", channel: "GTV", logo: ch02, when: "earlier" },
  { id: "sch3", time: "9:00 AM", category: "Sports", title: "AFCON Group Stage Highlights", channel: "SuperSport", logo: supersportLogo, when: "earlier" },
  { id: "sch4", time: "11:00 AM", category: "Entertainment", title: "Entertainment Today Africa", channel: "EbonyLife TV", logo: ch01, when: "earlier" },
  { id: "sch5", time: "1:00 PM", category: "Kids", title: "Cartoon Network Afternoon", channel: "Cartoon Network", logo: ch04, when: "earlier" },
  { id: "sch6", time: "3:00 PM", category: "Movies", title: "Nollywood Afternoon Movie", channel: "Africa Magic", logo: ch05, when: "earlier" },
  { id: "sch7", time: "8:00 PM", category: "Entertainment", title: "Africa Magic Prime Time", channel: "Africa Magic", logo: ch05, when: "upcoming" },
  { id: "sch8", time: "9:00 PM", category: "Kids", title: "Bluey Season 4 Marathon", channel: "Breezy Kids", logo: ch04, when: "upcoming" },
  { id: "sch9", time: "10:00 PM", category: "Sports", title: "Post-Match Analysis Show", channel: "SuperSport", logo: supersportLogo, when: "upcoming" },
  { id: "sch10", time: "11:00 PM", category: "News", title: "National Matters Arising", channel: "KTN News", logo: ch04, when: "upcoming" },
  { id: "sch11", time: "1:00 AM", category: "Entertainment", title: "Late Night Nollywood Feature", channel: "EbonyLife TV", logo: ch01, when: "upcoming" },
  { id: "sch12", time: "2:30 AM", category: "Movies", title: "Ghallywood Late Film", channel: "GTV", logo: ch02, when: "upcoming" },
];

export const liveTvFixtures = {
  categories,
  scheduleDate,
  featuredProgram,
  onAirToday,
  liveChannels,
  liveChannelsTotal,
};

// ── TV Guide (/tv-guide) sample data ──
// The guide normally loads channels + a day's EPG from the API; in fixture mode it uses
// the Live TV channels and builds a 2-hourly schedule (6 AM → midnight) for any day.
export const guideChannels = liveChannels.map((ch) => ({ id: ch.id, name: ch.channel, short_name: ch.channel }));

const guideTitles = [...new Set([...onAirToday.map((s) => s.title), ...liveChannels.map((c) => c.title)])];

export const buildGuideShows = (channelId, dayStart) => {
  const offset = Math.max(0, liveChannels.findIndex((c) => c.id === channelId));
  return Array.from({ length: 9 }, (_, i) => {
    const start = new Date(dayStart);
    start.setHours(6 + i * 2, 0, 0, 0);
    const end = new Date(start);
    end.setHours(start.getHours() + 2);
    return {
      id: `${channelId}-${start.getTime()}`,
      title: guideTitles[(offset + i) % guideTitles.length],
      start: start.toISOString(),
      end: end.toISOString(),
      length: 120,
    };
  });
};
