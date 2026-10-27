# RAW — AfriPlay API Docs Brief (verbatim)

> **Source:** Email from the principal dev (API docs brief for the AfriPlay revamp).
> **Received / ingested:** 2026-06-08.
> **Status:** `🔗 EXTERNAL` — verify against live API before acting. A clarification session is scheduled **Monday 2026-06-08** (per the email: "We can have a session on Monday for any further clarifications").
> **Immutable.** Do not edit landed content. Append a dated section only if the source itself changes.
> Distilled into [[api-contract]]. Pasted verbatim below (typos preserved); inline `image.png` placeholders mark where screenshots appeared in the original.

---

Please use these details for the afriplay updates. We can have a session on Monday for any further clarifications

Afriplay has two main operators
Afriplay MTN Ghana
Operator_uid: afriplaymtnghana
Operator_id: 237
Username_prefix: amngh
Afriplay Ghana (Other Networks)
Operator_uid: afriplayghana
Operator_id: 235
Username_prefix: afpgh
These should be maintained for the current onboarding flow
Client API URL: https://ott.tvanywhereafrica.com:28182
CRM API URL: https://tvanywhereonline.com/cm

Homepage:
image.png image.png
Banners
Banners will be fetched from the Banner APIs, similar to the implementation in Mango+.
API Documentation:
https://172.20.1.10:11401/docs/api/client/#tag/Banners/paths/~1v1~1%7Bouid%7D~1users~1%7Buser_id%7D~1banners/get
Title art images should be used for banners that link to movies or series where applicable, similar to the implementation in Mango+.
Afrishorts
The "Afriplay Shorts" label shown in the Figma design should be changed to "Afrishorts" in the actual web application.
The Afrishorts section on the homepage will display a rounded horizontal list containing:
Movies with values in either the vertical_trailer or vertical_trailer_url_ott fields.
Series with the has_vertical_trailer field set to true.
APIs:
Movies details:
https://172.20.1.10:11401/docs/api/client/#tag/User-Movies/paths/~1v1~1%7Bouid%7D~1users~1%7Buser_id%7D~1movies/get
Series details:
https://172.20.1.10:11401/docs/api/client/#tag/User-Series/paths/~1v1~1%7Bouid%7D~1users~1%7Buser_id%7D~1series/get
https://172.20.1.10:11401/docs/api/client/#tag/Series/paths/~1v1~1%7Bouid%7D~1series/get
The list of movie IDs, series IDs, and episode IDs will be grouped and sent to the Vertical Trailer API to retrieve all video URLs required for the Afrishorts screen.
Vertical Trailer API:
https://172.20.1.10:11401/docs/api/client/#tag/User-VOD/paths/~1v1~1%7Bouid%7D~1users~1%7Buser_uid%7D~1vertical_trailer/post
Keep Watching (Continue Watching)
The Keep Watching section will function the same way as Continue Watching in Mango+.
API:
https://172.20.1.10:11401/docs/api/client/#tag/User-My-Content/paths/~1v1~1%7Bouid%7D~1users~1%7Buser_id%7D~1my_content/get
VOD Category Listings
VOD category listings will be displayed on the homepage in the same manner as Mango+.
The list of category IDs to display will be retrieved from the dashboard_categories field of the CRM Client Settings API.
CRM Client Settings API:
https://tvanywhereonline.com/cm/api/client/?operator_uid={operator_uid}&mode=web
Category details and content will be fetched from the VOD Categories Content API:
https://172.20.1.10:11401/docs/api/client/#tag/Categories/paths/~1v1~1%7Bouid%7D~1categories~1vod~1content/get
Channel Category Injection
While rendering VOD categories and their content, two channel categories will be injected into the homepage listing.
Channel category details can be retrieved from:
https://172.20.1.10:11401/docs/api/client/#tag/Categories/paths/~1v1~1%7Bouid%7D~1categories~1channels/get
First Channel Category
The first channel category will be displayed immediately after the first VOD category.
The channel category ID to display will be retrieved from the dashboard_category_id field of the CRM Client Settings API.
CRM Client Settings API:
https://tvanywhereonline.com/cm/api/client/?operator_uid={operator_uid}&mode=web
Second Channel Category
The second channel category will be displayed immediately before the last VOD category.
This category will be the channel category with the UID featured from the Channel Categories API.
Promotional Banner
A large promotional banner, similar to the Champions League banner in Mango+, will be displayed immediately after the first channel category.
The banner image will be selected randomly from the preview_image values of the available banners.
Genre Section
A Genre section will be displayed approximately halfway through the VOD category listings.
For example, if there are seven VOD categories, the Genre section should appear after the third category.
This section will function similarly to the Brands section in Mango+.
It will display a horizontal list of VOD categories where the branded field is set to true.

REELS/Shorts Section
image.pngimage.png
Afrishorts Categories
Afrishorts categories such as "For You", "Trending", and "Sports" can be fetched from the Rails Categories API:
https://172.20.1.10:11401/docs/api/client/#tag/Categories-V3/paths/~1v3~1%7Bouid%7D~1categories~1rail/get
Category Content
Content for the selected Afrishorts category should be fetched using the Rail Category Content API:
https://172.20.1.10:11401/docs/api/client/#tag/Categories/paths/~1v1~1%7Bouid%7D~1categories~1rail~1content/get
Top Rounded Content List
The rounded horizontal content list at the top of the page should display the first 10–15 movies and series from the selected rail category.
Grid View
The grid view should display a larger set of content items, for example 20 or more movies and series from the selected rail category.
View and Like Counts
The number of users who have viewed a short can be ignored.
The number of users who have liked a short can also be ignored.
Shorts Playback
When a user selects any item from a rail category, they should be directed to the Shorts page.
The Shorts page should:
Play the vertical trailer of the selected movie or series.
Allow users to continue viewing other related vertical trailers within the same category.
Vertical Trailer URLs
Vertical trailer URLs should be fetched using the Vertical Trailer API:
https://172.20.1.10:11401/docs/api/client/#tag/User-VOD/paths/~1v1~1%7Bouid%7D~1users~1%7Buser_uid%7D~1vertical_trailer/post
Navigation to Content Details
Watch button or the plus "+" sign on the profile should direct users to:
The Movie Details page for movies, or
The Series Details page for series.
Profile Icon
The profile icon displayed on the Shorts page should use the movie or series poster image.
Shorts Controls
The current UI contains both a Like button and a My List button, which provide similar functionality.
Replace either the Like button or the My List button with a Volume/Mute button.


LIVE TV Section
TV channels data can be fetched from the channels api
Channels: https://172.20.1.10:11401/docs/api/client/#tag/Channels-V2
Categories: https://172.20.1.10:11401/docs/api/client/#tag/Categories/paths/~1v1~1%7Bouid%7D~1categories~1channels/get
Playout Links: https://172.20.1.10:11401/docs/api/client/#tag/User-Live/paths/~1v1~1%7Bouid%7D~1users~1%7Buser_id%7D~1live~1channels~1%7Bchannel_uid%7D/get
EPG data can be fetched from the epg grid
https://172.20.1.10:11401/docs/api/client/#tag/Shows-V2/paths/~1v2~1%7Bouid%7D~1shows~1grid/get
Lite: https://172.20.1.10:11401/docs/api/client/#tag/Shows-V2/paths/~1v2~1%7Bouid%7D~1shows~1grid~1lite/get
Show replay: https://172.20.1.10:11401/docs/api/client/#tag/User-Live/paths/~1v1~1%7Bouid%7D~1users~1%7Buser_id%7D~1live~1channels~1%7Bchannel_uid%7D~1shows~1%7Bshow_id%7D~1offset~1%7Boffset%7D/get
Movies

Movies section will display all movies and series and their categories
Categories: https://172.20.1.10:11401/docs/api/client/#tag/Categories-V2/paths/~1v2~1%7Bouid%7D~1categories~1vod/get
Category Content Details: https://172.20.1.10:11401/docs/api/client/#tag/Categories/paths/~1v1~1%7Bouid%7D~1categories~1vod~1content/get
Movie Details: https://172.20.1.10:11401/docs/api/client/#tag/User-Movies/paths/~1v1~1%7Bouid%7D~1users~1%7Buser_id%7D~1movies/get
Series: https://172.20.1.10:11401/docs/api/client/#tag/Series/paths/~1v1~1%7Bouid%7D~1series/get

Inbox
Inbox section will display a list of notifications sent to the user from CRM
Fetch notifications: https://documenter.getpostman.com/view/14902197/VUjSEiNQ#c55b9d23-d4f9-46ca-a954-200e6c32dd4c
Read Notifications: https://documenter.getpostman.com/view/14902197/VUjSEiNQ#0cc31090-c52d-4940-ada1-d404e714e698
Delete notifications: https://documenter.getpostman.com/view/14902197/VUjSEiNQ#2a0ab303-1537-465b-96e1-8db6ccaec0b4
Search
Search api remains same as mango. https://172.20.1.10:11401/docs/api/client/#tag/Search-V3/paths/~1v3~1%7Bouid%7D~1search~1global~1%7Bkeyword%7D/get
Display a random selection of movies or series as recommended content or top 5 content
Users' searches should be cached and displayed for them as Recent Searches

All other screens and functionality not covered by the new designs should remain unchanged and continue to use the existing implementation until updated designs are provided.

---

## 2026-07-17 — Source re-received, unchanged

The same email was provided again on 2026-07-17. A full diff against the landed content above showed **zero differences** — no new or amended details. Nothing re-ingested; this note records the re-receipt only.
