"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getMediaType, type GalleryItem } from "@/lib/GalleryItems";

type GalleryViewerProps = {
  items: GalleryItem[];
  initialIndex: number;
  originRect: DOMRect | null;
  onClose: () => void;
};

export default function GalleryViewer({
  items,
  initialIndex,
  originRect,
  onClose,
}: GalleryViewerProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const overlayRef = useRef<HTMLDivElement>(null);
  const flipWrapRef = useRef<HTMLDivElement>(null);
  const imgStageRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);

  // Captured once on mount — only used for the very first open animation.
  const originRectRef = useRef<DOMRect | null>(originRect);
  const isTransitioning = useRef(false);
  const isNavigating = useRef(false);
  const navDirection = useRef<1 | -1>(1);
  const wheelAccum = useRef(0);
  const wheelLockUntil = useRef(0);

  const active = items[activeIndex];
  const activeIsVideo = getMediaType(active) === "video";

  // ---------- Close (FLIP scale transition back to grid) ----------
  const closeOverlay = useCallback(() => {
    if (isTransitioning.current) return;

    const overlay = overlayRef.current;
    const wrap = flipWrapRef.current;
    const r = originRectRef.current;

    if (!overlay || !wrap || !r) {
      document.body.style.overflow = "";
      onClose();
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
        document.body.style.overflow = "";
        onClose();
      },
    });
  }, [onClose]);

  // ---------- Open animation (mount) / navigate transition ----------
  useEffect(() => {
    const wrap = flipWrapRef.current;
    const overlay = overlayRef.current;
    const stage = imgStageRef.current;
    const caption = captionRef.current;
    if (!wrap || !overlay || !stage) return;

    const isFirstOpen =
      originRectRef.current !== null && !isNavigating.current;

    if (isFirstOpen) {
      const r = originRectRef.current!;
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
      if (isTransitioning.current) return;

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
        setActiveIndex((prev) => (prev + dir + items.length) % items.length);
      });
    },
    [items.length],
  );

  // ---------- Scroll / swipe / keyboard listeners ----------
  useEffect(() => {
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
  }, [goTo, closeOverlay]);

  return (
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
  );
}