# Screen map

> Every frame on Figma page **All pages (developers)** `4041:1094`, grouped by feature. `✅ VERIFIED` 2026-10-26.
> Open a frame: `https://www.figma.com/design/Oq63PfKhvBDbPc9wBqYa2K/?node-id=<id with : → ->`.
> D = desktop 1728 wide, M = mobile 393 wide.

## Home
| Frame | Id | Notes |
|---|---|---|
| D Home | `4041:21538` | **Use this one.** `4041:21334` "Home Screens / Desktop" has its content hidden (10 of 868 layers visible) and renders as just the background. `4041:21742` is a duplicate. |
| M Homepage | `4041:1130` | |
| M Video playing (hero) | `4041:1547` | |
| M Loading skeleton | `4041:1967` | |

Desktop home sections, top to bottom: nav (Home, Live Tv, Shorts, Tv Channels, Movies, My stuff; search, bell, avatar) → hero (badge, title art, rating · age · year, genre chips, synopsis, Watch Now / + My Stuff, dots) → Wona Shorts (circles, NEW badge) → Keep Watching (progress) → Because You Watched (tall posters, hover Play/+) → Live On Tv Now → promo banner → Top 10 Movies (numbers) → Genres → New Release on Wona → Browse Live Channels (logo tiles) → Only on Wona → footer (logo, socials, link columns).

## Search
| Frame | D id | M id |
|---|---|---|
| Landing / first-time | `4041:21947` | `4041:5305` |
| Has recent searches | `4041:22031` | `4041:5407` |
| Remove recent | `4041:22293` | `4041:5519` |
| Clear all recent | `4041:22420` | `4041:5631`, `4041:5830` |
| Hide trending | — | `4041:5733` |
| Active / typing | — | `4041:7090`, `4041:7142` |
| Autocomplete | `4041:22178` | `4041:7253` |
| Browse by categories | — | `4041:6871` |
| Results: all | `4041:27874` (+ `27974`, `28074`) | `4041:7338`, `4041:6980` |
| Results: movies / TV shows / channels | `4041:28174` / `28224` / `28271` | `4041:7447` / `7558` / `7672` |
| Skeleton (slow internet) | `4041:28317` | `4041:6547` |
| Edge: short query | `4041:28389` | `4041:6640` |
| Edge: in progress | `4041:28541` | `4041:5933` |
| Edge: zero results | `4041:28611`, `28682` | `4041:6044`, `6154` |
| Edge: network error | `4041:28774` | `4041:6287`, `6419` |
| Edge: toast | `4041:28865` | `4041:6754` |

## Live TV / EPG
| Frame | D id | M id |
|---|---|---|
| Live TV & channel list | `4041:22861` | `4041:13023` (also `13773`) |
| Coming up | `4041:23760` | — |
| Earlier today | `4041:24265` | — |
| Filters: Sport / News / Entertainment / Movies / Kids | `4041:25142` / `25443` / `25744` / `25927` / `26090` | `4041:14163` / `14553` / `14943` / `15320` / `15660` |
| Filter chip component set | — | `4041:15994` |

`4041:26313` (in the desktop EP filter section) is named "Search Bar filled-top results (all)" but is 1728×5448 like the EPG list — ❓ probably a mislabelled EPG frame. Hidden "Home Screens" frames (`12670`, `13420`, `22508`, `24788`) are context copies; ignore them.

## Shorts / Reels
| Frame | D id | M id |
|---|---|---|
| Feed / grid | `4041:27213` | `4041:10665` |
| Feed skeleton | — | `4041:10905` |
| Player | `4041:27349`, `27740` | `4041:10530` |
| Liked | `4041:27459` | `4041:11019` (double-tap), `11176` (unlike) |
| Added to My Stuff | `4041:27592` | `4041:11333` |
| Swipe up | — | `4041:11528` |
| Share sheet (not copied / copied) | — | `4041:11691` / `11912` |

Spec annotation frames (behaviour notes): double-tap like `4041:11505`, follow creator `4041:11514`, swipe gesture `4041:11670`, share reel `4041:11681`. Read these before building the player.

## Not on this page `❓`
Sign-in/OTP, landing (signed-out), movie/series details, watch/player page, My Stuff, profile, subscriptions/packages, notifications. Other canvases that may hold them: "web" `2599:2`, "WED DESIGNS" `2837:7000`, "TVOD Flow" `3912:255`, "WonaPremiere moblie deisgns" `3894:687`, "design component" `2001:2124`. Confirm with the designer which are final.

## "More" tab (mobile SVG exports More1–More15, 2026-10-28)
| Screen | Exports | Route |
|---|---|---|
| More (profile row, My Stuff / My Library tiles, ACCOUNT list, Sign Out, bottom nav) | More1–More5 | `/more` |
| My Library (All/Rentals/Purchased, Active Rentals, Owned, Expired, New Release) | More6 + More7 | `/library` |
| My Stuff (All/Movies/Tv Shows/Premieres, Sort by Date Added, three rows) | More8 + More9 (More10/11 duplicates) | `/my-stuff` (mobile) |
| My Stuff empty | More12 + More13 | `/my-stuff` when nothing saved (`?empty` in sample mode) |
| My Library empty | More14 + More15 | `/library` with no rentals/purchases (`?empty` in sample mode) |
