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
import IntroAnimation from "@/components/IntroComponent";
import { getMediaType, type GalleryItem } from "@/lib/GalleryItems";

gsap.registerPlugin(ScrollTrigger);

type GalleryGridProps = {
  items: GalleryItem[];
};

export default function GalleryGrid({ items }: GalleryGridProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const mediaRefs = useRef<Array<HTMLDivElement | null>>([]);
  const gridVideoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  // ---------- Full-page viewer state ----------
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const flipWrapRef = useRef<HTMLDivElement>(null);
  const imgStageRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);

  const originRect = useRef<DOMRect | null>(null);
  const isTransitioning = useRef(false);
  const isNavigating = useRef(false);
  const navDirection = useRef<1 | -1>(1);
  const wheelAccum = useRef(0);
  const wheelLockUntil = useRef(0);
  const prevIndexRef = useRef<number | null>(null);

  // ---------- Grid intro animation ----------
  useLayoutEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".gallery-item");
      const images = gsap.utils.toArray<HTMLElement>(".gallery-image");
      const captions = gsap.utils.toArray<HTMLElement>(".gallery-caption");

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(cards, { opacity: 1, y: 0 });
        gsap.set(images, { scale: 1 });
        gsap.set(captions, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(cards, { opacity: 0, y: 70 });
      gsap.set(images, { scale: 1.12 });
      gsap.set(captions, { opacity: 0, y: 15 });

      gsap.to(cards.slice(0, 4), {
        opacity: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.to(images.slice(0, 4), {
        scale: 1,
        duration: 1.4,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.to(captions.slice(0, 4), {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        delay: 0.25,
        ease: "power2.out",
      });

      cards.slice(4).forEach((card, index) => {
        const image = images[index + 4];
        const caption = captions[index + 4];

        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });

        gsap.to(image, {
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });

        gsap.to(caption, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });
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

  // ---------- Open / close (FLIP scale transition) ----------
  const openImage = useCallback((index: number) => {
    if (isTransitioning.current) return;
    const mediaEl = mediaRefs.current[index];
    if (!mediaEl) return;

    originRect.current = mediaEl.getBoundingClientRect();
    prevIndexRef.current = index;
    setActiveIndex(index);
  }, []);

  const closeOverlay = useCallback(() => {
    if (activeIndex === null || isTransitioning.current) return;

    const overlay = overlayRef.current;
    const wrap = flipWrapRef.current;
    const r = originRect.current;

    if (!overlay || !wrap || !r) {
      setActiveIndex(null);
      document.body.style.overflow = "";
      return;
    }

    isTransitioning.current = true;

    gsap.to(overlay, { opacity: 0, duration: 0.4, ease: "power2.inOut" });
    gsap.to(wrap, {
      top: r.top,
      left: r.left,
      width: r.width,
      height: r.height,
      borderRadius: 0,
      duration: 0.6,
      ease: "power3.inOut",
      onComplete: () => {
        isTransitioning.current = false;
        prevIndexRef.current = null;
        document.body.style.overflow = "";
        setActiveIndex(null);
      },
    });
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) return;

    const wrap = flipWrapRef.current;
    const overlay = overlayRef.current;
    const stage = imgStageRef.current;
    const caption = captionRef.current;
    if (!wrap || !overlay || !stage) return;

    const isFirstOpen = originRect.current !== null && !isNavigating.current;

    if (isFirstOpen) {
      const r = originRect.current!;
      document.body.style.overflow = "hidden";
      isTransitioning.current = true;

      gsap.set(overlay, { opacity: 0 });
      gsap.set(wrap, {
        position: "fixed",
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
        borderRadius: 0,
        overflow: "hidden",
      });
      gsap.set(stage, { opacity: 1, y: 0 });
      gsap.set(caption, { opacity: 0, y: 12 });

      gsap.to(overlay, { opacity: 1, duration: 0.4, ease: "power2.out" });
      gsap.to(wrap, {
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        duration: 0.75,
        ease: "power3.out",
        onComplete: () => {
          isTransitioning.current = false;
        },
      });
      gsap.to(caption, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0.35,
        ease: "power2.out",
      });
    } else {
      const dir = navDirection.current;
      gsap.fromTo(
        stage,
        { opacity: 0, yPercent: dir * 6 },
        {
          opacity: 1,
          yPercent: 0,
          duration: 0.55,
          ease: "power3.out",
          onComplete: () => {
            isTransitioning.current = false;
          },
        },
      );
      gsap.fromTo(
        caption,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.1, ease: "power2.out" },
      );
      isNavigating.current = false;
    }
  }, [activeIndex]);

  // ---------- Navigate to next/prev ----------
  const goTo = useCallback(
    (dir: 1 | -1) => {
      if (isTransitioning.current || activeIndex === null) return;

      const stage = imgStageRef.current;
      const caption = captionRef.current;
      if (!stage) return;

      isTransitioning.current = true;
      isNavigating.current = true;
      navDirection.current = dir;

      gsap.to(stage, {
        opacity: 0,
        yPercent: -dir * 6,
        duration: 0.3,
        ease: "power2.in",
      });
      if (caption) {
        gsap.to(caption, { opacity: 0, y: -6, duration: 0.25 });
      }

      gsap.delayedCall(0.28, () => {
        setActiveIndex((prev) => {
          if (prev === null) return prev;
          return (prev + dir + items.length) % items.length;
        });
      });
    },
    [activeIndex, items.length],
  );

  // ---------- Scroll / swipe / keyboard listeners while overlay is open ----------
  useEffect(() => {
    if (activeIndex === null) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now < wheelLockUntil.current) return;

      wheelAccum.current += e.deltaY;
      const threshold = 70;

      if (Math.abs(wheelAccum.current) > threshold) {
        const dir = wheelAccum.current > 0 ? 1 : -1;
        wheelAccum.current = 0;
        wheelLockUntil.current = now + 650;
        goTo(dir);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.tagName === "VIDEO") return;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") goTo(1);
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") goTo(-1);
      if (e.key === "Escape") closeOverlay();
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? 1 : -1);
    };

    const overlay = overlayRef.current;
    overlay?.addEventListener("wheel", handleWheel, { passive: false });
    overlay?.addEventListener("touchstart", handleTouchStart);
    overlay?.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("keydown", handleKey);

    return () => {
      overlay?.removeEventListener("wheel", handleWheel);
      overlay?.removeEventListener("touchstart", handleTouchStart);
      overlay?.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKey);
    };
  }, [activeIndex, goTo, closeOverlay]);

  const active = activeIndex !== null ? items[activeIndex] : null;
  const activeIsVideo = active ? getMediaType(active) === "video" : false;

  const [introDone, setIntroDoneState] = useState(false);

  function setIntroDone(arg0: boolean): void {
    setIntroDoneState(arg0);
  }

  return (
    <>
      <IntroAnimation onComplete={() => setIntroDone(true)} />
      <main className="min-h-screen py-10 bg-[#f7f7f4] text-[#17170F]">
        {/* Gallery */}
        <div
          ref={galleryRef}
          className="gallery-grid px-3 pb-20 sm:px-5 md:px-7 lg:px-10"
        >
          {items.map((item, index) => {
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
                      priority={index < 2}
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
        {activeIndex !== null && active && (
          <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0b09]"
          >
            <div
              ref={flipWrapRef}
              className="fixed overflow-hidden"
              style={{ willChange: "top, left, width, height" }}
            >
              <div
                ref={imgStageRef}
                className="relative h-full w-full"
                style={{ willChange: "opacity, transform" }}
              >
                {activeIsVideo ? (
                  <video
                    key={active.id}
                    ref={activeVideoRef}
                    src={active.src}
                    poster={active.poster}
                    controls
                    autoPlay
                    playsInline
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                ) : (
                  <Image
                    key={active.id}
                    src={active.src}
                    alt={active.title}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                )}
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={closeOverlay}
              aria-label="Close"
              className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/5 text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              ✕
            </button>

            {/* Prev / Next */}
            <button
              onClick={() => goTo(-1)}
              aria-label="Previous"
              className="absolute left-5 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/5 text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              ↑
            </button>
            <button
              onClick={() => goTo(1)}
              aria-label="Next"
              className="absolute left-5 top-[calc(50%+52px)] z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/5 text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              ↓
            </button>

            {/* Caption */}
            <div
              ref={captionRef}
              className="absolute bottom-6 left-1/2 z-10 w-full max-w-xl -translate-x-1/2 px-6 text-center"
            >
              <div className="flex items-baseline justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
                <span>{active.no}</span>
                <span>—</span>
                <span>{active.meta}</span>
              </div>
              <h2 className="mt-1 text-[16px] font-medium tracking-[-0.01em] text-white">
                {active.title}
              </h2>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
