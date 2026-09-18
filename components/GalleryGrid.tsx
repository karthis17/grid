"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import GalleryViewer from "@/components/GalleryViewer";
import { galleryRows, type GalleryItem } from "@/lib/GalleryItems";
import GalleryRow, { RowEntry, RowVariant } from "./GalleryRow";

type GalleryGridProps = {
  items: GalleryItem[];
};

type Row = { key: string; variant: RowVariant; entries: RowEntry[] };

export default function GalleryGrid({ items }: GalleryGridProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const mediaRefs = useRef<Array<HTMLDivElement | null>>([]);
  const gridVideoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const originRectRef = useRef<DOMRect | null>(null);

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

  const registerMediaRef = useCallback(
    (index: number, el: HTMLDivElement | null) => {
      mediaRefs.current[index] = el;
    },
    [],
  );
  const registerVideoRef = useCallback(
    (index: number, el: HTMLVideoElement | null) => {
      gridVideoRefs.current[index] = el;
    },
    [],
  );

  const openImage = useCallback((index: number) => {
    const mediaEl = mediaRefs.current[index];
    if (!mediaEl) return;
    originRectRef.current = mediaEl.getBoundingClientRect();
    setOpenIndex(index);
  }, []);

  const closeViewer = useCallback(() => setOpenIndex(null), []);

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

  // ---------- Play grid video previews only while on screen (desktop only) ----------
  useEffect(() => {
    const videos = gridVideoRefs.current.filter(
      (v): v is HTMLVideoElement => v !== null,
    );
    if (videos.length === 0) return;
    if (window.matchMedia("(max-width: 640px)").matches) return;

    const MAX_CONCURRENT = 3;
    const playing = new Set<HTMLVideoElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            if (playing.size < MAX_CONCURRENT) {
              video.play().catch(() => {});
              playing.add(video);
            }
          } else {
            video.pause();
            playing.delete(video);
          }
        });
      },
      { threshold: 0.25, rootMargin: "100px 0px" },
    );

    videos.forEach((v) => observer.observe(v));
    return () => observer.disconnect();
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
      <main className="min-h-screen py-10 bg-[#f7f7f4] text-[#17170F]">
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
              onOpen={openImage}
              registerMediaRef={registerMediaRef}
              registerVideoRef={registerVideoRef}
            />
          ))}
        </div>

        {openIndex !== null && (
          <GalleryViewer
            items={items}
            initialIndex={openIndex}
            originRect={originRectRef.current}
            onClose={closeViewer}
          />
        )}
      </main>
    </>
  );
}