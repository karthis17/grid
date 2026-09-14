"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GalleryViewer from "@/components/GalleryViewer";
import { galleryRows, type GalleryItem } from "@/lib/GalleryItems";
import GalleryRow, { RowEntry, RowVariant } from "./GalleryRow";

gsap.registerPlugin(ScrollTrigger);

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

  // O(1) id -> flat index lookup, built once per `items` change instead of
  // re-scanning the whole array for every cell on every render.
  const indexById = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((item, i) => map.set(item.id, i));
    return map;
  }, [items]);

  // Map your hand-authored `galleryRows` layout into the RowEntry shape
  // GalleryRow expects, using the flat index for ref/nav alignment.
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

  const closeViewer = useCallback(() => {
    setOpenIndex(null);
  }, []);

  // ---------- Grid intro animation ----------
  useLayoutEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".gallery-item");

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(cards, { opacity: 1, y: 0 });
        gsap.set(".gallery-image", { scale: 1, y: 0 });
        return;
      }

      cards.forEach((card) => {
        const image = card.querySelector<HTMLElement>(".gallery-image");

        gsap.set(card, { opacity: 0, y: 35 });
        if (image) gsap.set(image, { scale: 1.04 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
            once: true,
            fastScrollEnd: true,
          },
        });

        tl.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power2.out",
        }).to(
          image,
          {
            scale: 1,
            duration: 0.9,
            ease: "power2.out",
          },
          "<",
        );
      });
    }, galleryRef);

    return () => ctx.revert();
    // Re-run if the row set changes so newly mounted cards animate in too.
  }, [rows]);

  // ---------- Play grid video previews only while on screen (desktop only) ----------
  useEffect(() => {
    const videos = gridVideoRefs.current.filter(
      (v): v is HTMLVideoElement => v !== null,
    );
    if (videos.length === 0) return;

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    if (isMobile) return; // skip autoplay previews on mobile to save data/CPU

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay can be blocked before user interaction; ignore.
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25, rootMargin: "100px 0px" },
    );

    videos.forEach((v) => observer.observe(v));
    return () => observer.disconnect();
  }, [rows]);

  // First 4 items load eagerly (better LCP) instead of every image lazy.
  const prioritySrcs = useMemo(
    () => new Set(items.slice(0, 4).map((item) => item.src)),
    [items],
  );

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
