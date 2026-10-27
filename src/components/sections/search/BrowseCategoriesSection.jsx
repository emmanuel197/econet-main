import React from "react";
import classNames from "../../../utils/classNames";
import SectionHeader from "../../ui/SectionHeader";
import GenreCard from "../../cards/GenreCard";

// Reuses homeFixtures.genres (same GenreCard as Home's Genres rail) instead of a search-only fixture.
const BrowseCategoriesSection = ({ items = [], onSelect, className = "" }) => (
  <section className={classNames("flex flex-col gap-[calc(20/1728*var(--vw))]", className)}>
    <SectionHeader title="Browse By Categories" className="[&_h2]:text-2xl [&_h2]:font-semibold" />
    <div className="flex overflow-x-auto scrollbar-hide gap-[calc(24/1728*var(--vw))]">
      {items.map((cat) => (
        <GenreCard key={cat.id} image={cat.image} label={cat.label} onClick={() => onSelect?.(cat)} large />
      ))}
    </div>
  </section>
);

export default BrowseCategoriesSection;
