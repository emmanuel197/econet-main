// WonaPremiere — premieres that are showing now (live), coming up (countdown + Remind Me)
// or already premiered (past). Sample data from the WONA WonaPremiere designs
// (assets/wonastuff, 2026-10-28). No premiere API is known yet. Countdowns run from
// page load so the timers are always live in preview.
import posterHailMary from "../../assets/images/home-mobile-wona-premiere-card-01.webp";
import posterVisAVis from "../../assets/images/home-mobile-wona-premiere-card-02.webp";
import posterTheRip from "../../assets/images/home-mobile-wona-premiere-card-03.webp";
import posterMission from "../../assets/images/premiere-poster-mission-impossible.webp";
import poster180 from "../../assets/images/premiere-poster-180.webp";
import posterMichael from "../../assets/images/premiere-poster-michael.webp";
import posterConclusion from "../../assets/images/premiere-poster-the-epic-conclusion.webp";
import posterWarMachine from "../../assets/images/premiere-poster-war-machine.webp";
import posterMother2 from "../../assets/images/premiere-poster-the-mother-2.webp";
import posterTheCage from "../../assets/images/premiere-poster-the-cage.webp";
import featuredHero from "../../assets/images/premiere-featured-the-rip-hero.webp";
import featuredTitleArt from "../../assets/images/premiere-featured-the-rip-title-art.webp";
import trailerStill from "../../assets/images/premiere-the-rip-trailer-still.webp";
import castDamon from "../../assets/images/premiere-cast-matt-damon.webp";
import castYeun from "../../assets/images/premiere-cast-steven-yeun.webp";
import castBoyega from "../../assets/images/premiere-cast-john-boyega.webp";
import trailer01 from "../../assets/images/premiere-the-rip-trailer-thumb-01.webp";
import trailer02 from "../../assets/images/premiere-the-rip-trailer-thumb-02.webp";
import ep01 from "../../assets/images/premiere-the-rip-episode-01.webp";
import ep02 from "../../assets/images/premiere-the-rip-episode-02.webp";
import ep03 from "../../assets/images/premiere-the-rip-episode-03.webp";
import ep04 from "../../assets/images/premiere-the-rip-episode-04.webp";
import ep05 from "../../assets/images/premiere-the-rip-episode-05.webp";
import ep06 from "../../assets/images/premiere-the-rip-episode-06.webp";
import headerShowing from "../../assets/images/premiere-header-showing-now.webp";
import headerUpcoming from "../../assets/images/premiere-header-upcoming.webp";
import headerPast from "../../assets/images/premiere-header-past.webp";
import more01 from "../../assets/images/tvod-movie-more-like-this-01-esin-baba.webp";
import more02 from "../../assets/images/tvod-movie-more-like-this-02-citation.webp";
import more03 from "../../assets/images/tvod-movie-more-like-this-03-love-in-every-word.webp";
import more04 from "../../assets/images/tvod-movie-more-like-this-04-project-hail-mary.webp";
import more05 from "../../assets/images/tvod-movie-more-like-this-05-180.webp";
import more06 from "../../assets/images/tvod-movie-more-like-this-06-conclusion.webp";
import more07 from "../../assets/images/tvod-movie-more-like-this-07-mission-impossible.webp";
import more08 from "../../assets/images/tvod-movie-more-like-this-08-sweet-home.webp";
import more09 from "../../assets/images/tvod-movie-more-like-this-09-michael.webp";

const DAY = 24 * 60 * 60 * 1000;
const loadedAt = Date.now();
// The Rip's comp countdown reads 09d 12h 18m 04s
const fromNow = (days, hours = 0, mins = 0, secs = 0) => loadedAt + days * DAY + hours * 3600e3 + mins * 60e3 + secs * 1e3;

// Detail-page content shared by every title (only The Rip is designed in full)
const detail = {
  badges: ["4K", "HDR10+", "DOLBY ATMOS"],
  trailerStill,
  credits: [
    { label: "Director", value: "Joe Carnahan" },
    { label: "Studio", value: "Golden Effects" },
  ],
  cast: [
    { name: "Matt Damon", role: "Lieutenant Dane Dumars", photo: castDamon },
    { name: "Steven Yeun", role: "Detective Mike Ro", photo: castYeun },
    { name: "John Boyega", role: "Detective Sergeant J.D. Byrne", photo: castBoyega },
  ],
  trailers: [trailer01, trailer02],
  moreLikeThis: [more01, more02, more03, more04, more05, more06, more07, more08, more09],
};

const theRipEpisodes = [
  { n: 1, title: "New Blood", length: "55m", image: ep01, description: "A fresh recruit joins the RIP unit on their most dangerous assignment yet. Detective Mensah isn't convinced she's ready — but she might be the only one who can crack the case." },
  { n: 2, title: "The Stash", length: "42m", image: ep02, description: "The unit discovers $4 million in unmarked bills hidden inside a seized vehicle. Before they can report it, someone on the inside tips off the cartel." },
  { n: 3, title: "Off the Books", length: "1h 05m", image: ep03, description: "Mensah goes rogue, running an unauthorised operation in the Accra docklands. When it goes wrong, the entire unit is put under Internal Affairs investigation." },
  { n: 4, title: "Blue Wall", length: "55m", image: ep04, description: "A senior officer is implicated in the cash seizure cover-up. The unit must decide — protect one of their own or burn the whole department down." },
  { n: 5, title: "Marked", length: "56m", image: ep05, description: "The cartel puts a hit out on two members of the unit. With no backup they can trust, Mensah and his partner go completely off-grid." },
  { n: 6, title: "The Rip", length: "51m", image: ep06, description: "Season finale. The unit executes their most high-stakes raid yet — but someone has already told the targets they're coming." },
];
const seasons = [
  { n: 1, episodes: theRipEpisodes },
  { n: 2, episodes: theRipEpisodes },
];

const make = (t) => ({ ...detail, ...t, credits: [...detail.credits, { label: t.status === "upcoming" ? "Release Date" : "Released", value: t.releaseLabel }] });

export const premiereTitles = [
  // Showing now (live)
  make({ id: "project-hail-mary", title: "Project Hail Mary", year: 2025, type: "movie", status: "live", runtime: "1h 45m", genres: ["Sci-Fi", "Adventure", "Comedy"], poster: posterHailMary, releaseLabel: "Oct 20, 2026", synopsis: "A science teacher wakes up alone on a spaceship. As his memory returns, he uncovers a mission to save Earth — and an unlikely friend light-years from home." }),
  make({ id: "vis-a-vis", title: "VIS A VIS", year: 2026, type: "movie", status: "live", runtime: "1h 45m", genres: ["Comedy", "Drama"], poster: posterVisAVis, releaseLabel: "Oct 22, 2026", synopsis: "A director working on a new film invites the main actor to his remote island, where rehearsals turn into a battle of wills." }),
  make({ id: "the-cage", title: "THE CAGE", year: 2026, type: "series", status: "live", seasons, genres: ["Crime", "Drama", "Thriller"], poster: posterTheCage, releaseLabel: "Oct 25, 2026", synopsis: "Two casino workers discover they're both stealing from the same safe, entangling them in a dangerous game of trust and betrayal." }),
  // Upcoming
  make({ id: "the-rip", title: "THE RIP", year: 2026, type: "movie", status: "upcoming", runtime: "1h 53m", genres: ["Cop Drama", "Action", "Mystery"], poster: posterTheRip, dateLabel: "JUNE 20", premiereAt: fromNow(9, 12, 18, 4), releaseLabel: "Jun 20, 2026", synopsis: "A group of Miami cops discovers a stash of millions in cash, leading to distrust as outsiders learn about the huge seizure, making them question who to rely on." }),
  make({ id: "mission-impossible", title: "MISSION: IMPOSSIBLE", year: 2026, type: "movie", status: "upcoming", runtime: "1h 45m", genres: ["Action Epic", "Spy", "Adventure"], poster: posterMission, dateLabel: "JUNE 30", premiereAt: fromNow(19, 6), releaseLabel: "Jun 30, 2026", synopsis: "Ethan Hunt and his IMF team must track down a terrifying new weapon that threatens all of humanity before it falls into the wrong hands." }),
  make({ id: "180", title: "180", year: 2026, type: "movie", status: "upcoming", runtime: "1h 25m", genres: ["Crime", "Drama", "Thriller"], poster: poster180, dateLabel: "JULY 20", premiereAt: fromNow(39, 3), releaseLabel: "Jul 20, 2026", synopsis: "When an unexpected road rage incident puts his son in critical condition, an enraged father sets out to find the man responsible." }),
  make({ id: "michael", title: "Michael", year: 2026, type: "movie", status: "upcoming", runtime: "2h 10m", genres: ["Docudrama", "Biography", "History"], poster: posterMichael, dateLabel: "AUG 30", premiereAt: fromNow(80), releaseLabel: "Aug 30, 2026", synopsis: "The early life of musician Michael Jackson, from the discovery of his talent as the lead of the Jackson Five to the artist whose creative ambition fueled a pursuit to become the biggest entertainer in the world." }),
  // Past
  make({ id: "the-epic-conclusion", title: "THE EPIC CONCLUSION", year: 2026, type: "movie", status: "past", runtime: "2h 10m", genres: ["Docudrama", "Biography", "History"], poster: posterConclusion, dateLabel: "APRIL 24", releaseLabel: "Apr 24, 2026", synopsis: "The final chapter of the saga, as old alliances break and a reluctant hero decides the fate of a desert world." }),
  make({ id: "war-machine", title: "WAR MACHINE", year: 2026, type: "movie", status: "past", runtime: "1h 25m", genres: ["Crime", "Drama", "Thriller"], poster: posterWarMachine, dateLabel: "JAN 6", releaseLabel: "Jan 6, 2026", synopsis: "Follow the final recruits of a grueling special ops boot camp who encounter a threat no training could prepare them for." }),
  make({ id: "the-mother-2", title: "THE MOTHER 2", year: 2026, type: "movie", status: "past", runtime: "1h 45m", genres: ["Action Epic", "Spy", "Adventure"], poster: posterMother2, dateLabel: "NOV 2025", releaseLabel: "Nov 14, 2025", synopsis: "While fleeing from dangerous assailants, an assassin comes out of hiding to protect the daughter she left behind." }),
  make({ id: "the-rip-series", title: "THE RIP", year: 2026, type: "series", status: "past", seasons, genres: ["Cop Drama", "Action", "Mystery"], poster: posterTheRip, dateLabel: "AUG 2025", releaseLabel: "Aug 12, 2025", synopsis: "A group of Miami cops discovers a stash of millions in cash, leading to distrust as outsiders learn about the huge seizure, making them question who to rely on." }),
];

export const premiereFeatured = { id: "the-rip", hero: featuredHero, titleArt: featuredTitleArt };

export const premiereSections = {
  showing: { title: "Showing Now", status: "live", header: headerShowing, subtitle: (n) => `${n} titles premiering live right now`, cta: "watch" },
  upcoming: { title: "Upcoming Premieres", status: "upcoming", header: headerUpcoming, subtitle: (n) => `${n} titles coming soon · Set reminders`, cta: "remind" },
  past: { title: "Past Premieres", status: "past", header: headerPast, subtitle: () => "Catch up on titles you may have missed", cta: "watch" },
};

export const getPremiereTitle = (id) => premiereTitles.find((t) => t.id === id) || null;
export const premieresByStatus = (status) => premiereTitles.filter((t) => t.status === status);
// The home rail (comp: two live + the next upcoming)
export const homePremiereRail = () => [...premieresByStatus("live").slice(0, 2), ...premieresByStatus("upcoming")];
export const titleMeta = (t) => (t.type === "series" ? `${t.seasons.length} Season${t.seasons.length > 1 ? "s" : ""}` : t.runtime);

// Countdown parts for a premiere timestamp
export const countdown = (at, now = Date.now()) => {
  const s = Math.max(0, Math.floor((at - now) / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60, done: s === 0 };
};
