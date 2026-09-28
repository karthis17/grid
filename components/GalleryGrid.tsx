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
  const gridVideoRefs = useRef<Array<HTMLVideoElement | null>>([]);

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
          .map((item) => ({
            item,
            index: indexById.get(item.id) ?? -1,
          })),
      })),
    [indexById],
  );

  const rowsKey = useMemo(
    () => rows.map((r) => r.entries.map((e) => e.item.id).join(",")).join("|"),
    [rows],
  );

  // ---------- Grid intro animation — plain CSS, driven by IntersectionObserver ----------
  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const cards = Array.from(
      gallery.querySelectorAll<HTMLElement>(".gallery-item"),
    );
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // one-shot, like the old `once: true`
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [rowsKey]);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const cards = Array.from(
      gallery.querySelectorAll<HTMLElement>(".gallery-item"),
    );

    if (cards.length === 0) return;

    // Set stagger delay based on card position
    cards.forEach((card, index) => {
      card.style.setProperty("--fade-delay", `${(index % 4) * 80}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const card = entry.target as HTMLElement;

          card.classList.add("is-visible");

          // One-shot animation
          observer.unobserve(card);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    cards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
    };
  }, [rowsKey]);

  // Priority = whatever actually renders in the first two rows, not the
  // first 4 items of the flat array (those can disagree with layout order).
  const prioritySrcs = useMemo(() => {
    const set = new Set<string>();
    for (const row of rows.slice(0, 2)) {
      for (const entry of row.entries) set.add(entry.item.src);
    }
    return set;
  }, [rows]);

  return (
    <>
      <section
        id="works"
        className="min-h-screen py-10 bg-[#f7f7f4] text-[#17170F]"
      >
        <div
          ref={galleryRef}
          className="flex flex-col gap-3 px-3 pb-20 sm:gap-4 sm:px-5 md:px-7 lg:px-10"
        >
          {rows.map((row) => (
            <GalleryRow
              key={row.key}
              variant={row.variant}
              entries={row.entries}
              prioritySrcs={prioritySrcs}
            />
          ))}
        </div>
      </section>
    </>
  );
}
