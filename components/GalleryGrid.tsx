"use client";

import Image from "next/image";
import {
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GalleryViewer from "@/components/GalleryViewer";
import { getMediaType, type GalleryItem } from "@/lib/GalleryItems";

gsap.registerPlugin(ScrollTrigger);

type GalleryGridProps = {
  items: GalleryItem[];
};

export default function GalleryGrid({ items }: GalleryGridProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const mediaRefs = useRef<Array<HTMLDivElement | null>>([]);
  const gridVideoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const originRectRef = useRef<DOMRect | null>(null);

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

      /* --------------------------------
       REDUCED MOTION
    -------------------------------- */

      if (prefersReducedMotion) {
        gsap.set(cards, {
          opacity: 1,
          y: 0,
        });

        gsap.set(".gallery-image", {
          scale: 1,
          y: 0,
        });

        gsap.set(".gallery-caption", {
          opacity: 1,
          y: 0,
        });

        return;
      }

      /* --------------------------------
       INITIAL STATE
    -------------------------------- */

      cards.forEach((card) => {
        const image = card.querySelector<HTMLElement>(".gallery-image");
        const caption = card.querySelector<HTMLElement>(".gallery-caption");

        gsap.set(card, {
          opacity: 0,
          y: 35,
        });

        if (image) {
          gsap.set(image, {
            scale: 1.04,
          });
        }

        if (caption) {
          gsap.set(caption, {
            opacity: 0,
            y: 8,
          });
        }

        /* --------------------------------
         ONE SCROLLTRIGGER PER CARD
      -------------------------------- */

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
        })
          .to(
            image,
            {
              scale: 1,
              duration: 0.9,
              ease: "power2.out",
            },
            "<",
          )
          .to(
            caption,
            {
              opacity: 1,
              y: 0,
              duration: 0.45,
              ease: "power2.out",
            },
            "-=0.35",
          );
      });
    }, galleryRef);

    return () => ctx.revert();
  }, []);
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
  }, []);



  const priorityImageSrcs = new Set(items.slice(0, 4).map((item) => item.src));

  return (
    <>
      <main className="min-h-screen py-10 bg-[#f7f7f4] text-[#17170F]">
        {/* Gallery */}


      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center lg:mb-10">
          <p className="mb-3 font-mono text-xs tracking-[0.25em] text-[#9C6B2E]">
           { '// Works'}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-[#1B2027] md:text-4xl">
         
          </h2>
        </div>
      </div>
        <div
          ref={galleryRef}
          className="gallery-grid px-3 pb-20 sm:px-5 md:px-7 lg:px-10"
        >
          {items.map((item, index) => {
            const isPriority = priorityImageSrcs.has(item.src);
            const isVideo = getMediaType(item) === "video";
            return (
              <a
                key={item.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openImage(index);
                }}
                className="gallery-item group flex min-h-0 flex-col cursor-pointer"
                style={
                  {
                    "--desktop-col": item.col,
                    "--desktop-row": item.row,
                  } as React.CSSProperties
                }
              >
                {/* Media */}
                <div
                  ref={(el) => {
                    mediaRefs.current[index] = el;
                  }}
                  className="gallery-media relative overflow-hidden"
                >
                  {isVideo ? (
                    <video
                      ref={(el) => {
                        gridVideoRefs.current[index] = el;
                      }}
                      src={item.src}
                      poster={item.poster}
                      muted
                      loop
                      playsInline
                      preload="none"
                      className="gallery-image object-cover h-auto w-full will-change-transform"
                    />
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.title}
                      width={1400}
                      height={900}
                      priority={isPriority}
                      loading={isPriority ? "eager" : "lazy"}
                      fetchPriority={isPriority ? "high" : "auto"}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
                      className="gallery-image object-cover h-auto w-full will-change-transform"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/6" />

                  <span className="absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.15em] text-white mix-blend-difference md:left-4 md:top-4">
                    {item.no}
                  </span>

                  {isVideo && (
                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-black/40 text-white mix-blend-difference md:right-4 md:top-4">
                      <svg
                        viewBox="0 0 24 24"
                        width="10"
                        height="10"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  )}

                  <span className="absolute bottom-4 right-4 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full border border-white/50 bg-white/10 text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <Image
                      src="/zoom-in.svg"
                      alt="Zoom in"
                      width={16}
                      height={16}
                    />
                  </span>
                </div>

                {/* Caption */}
                <div className="gallery-caption border-t border-black/15 pt-2.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-[13px] font-medium tracking-[-0.01em] text-[#17170F] md:text-[14px]">
                      {item.title}
                    </h2>

                    <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.08em] text-black/40">
                      {item.meta}
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Full-page viewer */}
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
