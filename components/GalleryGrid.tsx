"use client";

import { useRef, useEffect, useMemo } from "react";
import {
  type GalleryItem,
  type VideoItem,
} from "@/lib/GalleryItems";
import GalleryRow, { RowEntry, RowVariant } from "./GalleryRow";

type GalleryGridProps = {
  rows: { rowType: string; items: (GalleryItem | VideoItem)[] }[];
  priority?: boolean;
};

type Row = { key: string; variant: RowVariant; entries: RowEntry[] };

export default function GalleryGrid({
  rows,
  priority = false,
}: GalleryGridProps) {
  const galleryRef = useRef<HTMLDivElement>(null);


  const rowsKey = useMemo(
    () => rows.map((r) => r.items.map((e) => e.id).join(",")).join("|"),
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
    if (!priority) return set;
    for (const row of rows.slice(0, 1)) {
      for (const entry of row.items) {
        if (entry.src) set.add(entry.src);
      }
    }
    return set;
  }, [rows, priority]);

  return (
    <section
      id="works"
      className="min-h-screen bg-[#f7f7f4] py-2 text-[#17170F]"
    >
      <div
        ref={galleryRef}
        className="flex flex-col gap-2 px-2 pb-10"
      >
        {rows.map((row, i) => (
          <div key={i} className={i < 2 ? undefined : "gallery-row"}>
            <GalleryRow
              variant={row.rowType as RowVariant}
              entries={row.items.map((item) => ({ item }))}
              prioritySrcs={prioritySrcs}
            />
          </div>
        ))}
      </div>
    </section>
  );
}