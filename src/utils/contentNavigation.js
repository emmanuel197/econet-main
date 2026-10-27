// Shared "open this content's details page" routing — brief: movies → Movie
// Details, series → Series Details (used by homepage posters, search results,
// More Like This rails, and the Afrishorts Watch/+ CTAs).
export const detailsPath = (item) => {
  const type = item?.type || item?.raw?.type || item?.contentType;
  const id = item?.contentId ?? item?.raw?.id ?? item?.id;
  if (id == null) return null;
  return type === "series" ? `/series/${id}` : `/movie/${id}`;
};

export const goToDetails = (navigate, item) => {
  const path = detailsPath(item);
  if (path) navigate(path);
};
