"use client";

import { useRef, useEffect, useMemo } from "react";
import { galleryRows, type GalleryItem } from "@/lib/GalleryItems";
import GalleryRow, { RowEntry, RowVariant } from "./GalleryRow";

type GalleryGridProps = {
  items: GalleryItem[];
};

type Row = { key: string; variant: RowVariant; entries: RowEntry[] };

export default function GalleryGrid({ items }: GalleryGridProps) {
  const galleryRef = useRef<HTMLDivElement>(null);

  const indexById = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((item, i) => map.set(item.id, i));
    return map;
  }, [items]);

  const rows: Row[] = useMemo(
    () =>
      galleryRows.map((row, i) => ({
        key: `row-${i}`,
        variant: row.rowType as RowVariant,
        entries: row.items
          .filter((item): item is GalleryItem => Boolean(item))
          .map((item) => ({ item, index: indexById.get(item.id) ?? -1 })),
      })),
    [indexById],
  );

  const rowsKey = useMemo(
    () => rows.map((r) => r.entries.map((e) => e.item.id).join(",")).join("|"),
    [rows],
  );

  // High-performance IntersectionObserver: triggers ahead of scroll (300px margin)
  // so items are already rendered and visible by the time the user reaches them.
  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const cards = Array.from(
      gallery.querySelectorAll<HTMLElement>(".gallery-item"),
    );
    if (!cards.length) return;

    // Immediately reveal initial visible cards without delay
    const initialBatch = cards.slice(0, 6);
    initialBatch.forEach((card) => {
      card.classList.add("is-visible");
    });

    // Gentle, quick stagger for subsequent cards
    cards.slice(6).forEach((card, i) => {
      card.style.setProperty("--fade-delay", `${(i % 3) * 40}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.01, rootMargin: "300px 0px 300px 0px" },
    );

    cards.slice(6).forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [rowsKey]);

  const prioritySrcs = useMemo(() => {
    const set = new Set<string>();
    for (const row of rows.slice(0, 2)) {
      for (const entry of row.entries) set.add(entry.item.src);
    }
    return set;
  }, [rows]);

  return (
    <section
      id="works"
      className="min-h-screen bg-[#f7f7f4] py-10 text-[#17170F]"
    >
      <div
        ref={galleryRef}
        className="flex flex-col gap-3 px-3 pb-20 sm:gap-4 sm:px-5 md:px-7 lg:px-10"
      >
        {rows.map((row, i) => (
          <div key={row.key} className={i < 2 ? undefined : "gallery-row"}>
            <GalleryRow
              variant={row.variant}
              entries={row.entries}
              prioritySrcs={prioritySrcs}
            />
          </div>
        ))}
      </div>
    </section>
  );
}