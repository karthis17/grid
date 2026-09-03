"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { GalleryItem } from "@/lib/GalleryItems";
import GalleryViewer from "@/components/GalleryViewer";
import IntroAnimation from "./IntroComponent";

// Guard against SSR — "use client" still gets server-rendered once by Next.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const OFFSET_CYCLE_L = [0, 160, 40, 220];
const OFFSET_CYCLE_R = [64, 0, 200, 32];

// Small, fixed sampling size — big perf win over full-resolution canvas reads.
const SAMPLE_SIZE = 48;

function getOffset(index: number, cycle: number[]) {
  return cycle[index % cycle.length];
}

type GalleryMediaProps = {
  item: GalleryItem;
  onClick: () => void;
  mediaRef: (el: HTMLDivElement | null) => void;
};

function GalleryMedia({ item, onClick, mediaRef }: GalleryMediaProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [overlayColor, setOverlayColor] = useState("rgb(40, 40, 40)");

  /*
   * Create a DOWNSCALED canvas copy of the image, used only for
   * reading average pixel color. We never need full resolution
   * for an average — sampling a ~48x48 version is visually
   * identical and dramatically cheaper (memory + getImageData cost).
   */
  const prepareCanvas = useCallback((image: HTMLImageElement) => {
    if (!image.naturalWidth || !image.naturalHeight) return;

    const canvas = document.createElement("canvas");
    canvas.width = SAMPLE_SIZE;
    canvas.height = SAMPLE_SIZE;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    try {
      ctx.drawImage(image, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
      canvasRef.current = canvas;
    } catch (error) {
      console.error("Could not prepare image for color sampling:", error);
    }
  }, []);

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(true);

      const image = imageRef.current;
      const canvas = canvasRef.current;
      if (!image || !canvas) return;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const rect = image.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      // Mouse position as a 0..1 ratio of the displayed image.
      const ratioX = (event.clientX - rect.left) / rect.width;
      const ratioY = (event.clientY - rect.top) / rect.height;

      // Map into the small sampling canvas's coordinate space.
      const pixelX = Math.floor(ratioX * SAMPLE_SIZE);
      const pixelY = Math.floor(ratioY * SAMPLE_SIZE);

      const size = 12; // sample box within the small canvas
      const half = Math.floor(size / 2);

      const startX = Math.max(0, Math.min(SAMPLE_SIZE - size, pixelX - half));
      const startY = Math.max(0, Math.min(SAMPLE_SIZE - size, pixelY - half));

      try {
        const pixels = ctx.getImageData(
          startX,
          startY,
          Math.min(size, SAMPLE_SIZE - startX),
          Math.min(size, SAMPLE_SIZE - startY),
        ).data;

        let totalR = 0;
        let totalG = 0;
        let totalB = 0;
        let totalWeight = 0;

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          if (a < 30) continue;

          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
          if (brightness > 245) continue; // ignore near-white highlights

          const weight = brightness < 120 ? 1.3 : 1;

          totalR += r * weight;
          totalG += g * weight;
          totalB += b * weight;
          totalWeight += weight;
        }

        if (totalWeight === 0) return;

        let r = Math.round(totalR / totalWeight);
        let g = Math.round(totalG / totalWeight);
        let b = Math.round(totalB / totalWeight);

        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        let darkness = 0.65;
        if (brightness > 190) darkness = 0.42;
        else if (brightness > 140) darkness = 0.52;
        else if (brightness < 70) darkness = 0.8;

        r = Math.round(r * darkness);
        g = Math.round(g * darkness);
        b = Math.round(b * darkness);

        setOverlayColor(`rgb(${r}, ${g}, ${b})`);
      } catch (error) {
        console.error("Unable to read image pixels:", error);
      }
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Cross-browser autoplay: some browsers ignore the `autoPlay` attribute
  // once the element mounts after initial paint (e.g. inside scroll-loaded
  // grids). Explicitly calling play() with a caught promise fixes that.
  const handleVideoRef = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el) {
      const playPromise = el.play();
      if (playPromise) playPromise.catch(() => {});
    }
  }, []);

  return (
    <div
      ref={mediaRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="gallery-item group relative cursor-pointer overflow-hidden"
      style={{ willChange: "transform, opacity" }}
    >
      {item.type === "video" ? (
        <video
          ref={handleVideoRef}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          preload="metadata"
          className="gallery-image block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        >
          <source src={item.src} type="video/mp4" />
        </video>
      ) : (
        <Image
          ref={imageRef}
          width={1440}
          height={920}
          sizes="(max-width: 768px) 100vw, 50vw"
          src={item.src}
          alt={item.title ?? item.meta ?? ""}
          onLoad={(event) => {
            prepareCanvas(event.currentTarget);
            // Layout may have shifted (image finished loading) — make sure
            // ScrollTrigger positions stay accurate across browsers.
            ScrollTrigger.refresh();
          }}
          className="gallery-image block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      )}

      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 ease-out"
        style={{
          backgroundColor: overlayColor,
          opacity: isHovered ? 0.99 : 0,
        }}
      />

      {(item.title || item.meta) && (
        <div
          className="gallery-caption pointer-events-none absolute inset-0 z-20 flex items-end p-8 text-white transition-all duration-500 ease-out"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <div>
            {item.title && (
              <h3 className="text-2xl font-medium">{item.title}</h3>
            )}
            {item.meta && (
              <p className="mt-2 text-base text-white/80">{item.meta}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function GalleryGrid1({
  itemsR,
  itemsL,
}: {
  itemsR: GalleryItem[];
  itemsL: GalleryItem[];
}) {
  const items = [...itemsL, ...itemsR];

  const galleryRef = useRef<HTMLDivElement | null>(null);
  const mediaRefs = useRef<Array<HTMLDivElement | null>>([]);
  const originRectRef = useRef<DOMRect | null>(null);

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [introDone, setIntroDoneState] = useState(false);
  function setIntroDone(arg0: boolean): void {
    setIntroDoneState(arg0);
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // gsap.matchMedia handles reduced-motion + cleanup for us —
      // no manual window.matchMedia listener needed.
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          full: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduced } = context.conditions as { reduced: boolean };
          const cards = gsap.utils.toArray<HTMLElement>(".gallery-item");
          const images = gsap.utils.toArray<HTMLElement>(".gallery-image");

          if (reduced) {
            gsap.set(cards, { opacity: 1, y: 0 });
            gsap.set(images, { scale: 1 });
            return;
          }

          gsap.set(cards, { opacity: 0, y: 70 });
          gsap.set(images, { scale: 1.12 });

          // Single batched ScrollTrigger for the whole grid instead of
          // one instance per card — far fewer scroll listeners, and
          // more reliable trigger-position handling across browsers.
          ScrollTrigger.batch(cards, {
            start: "top 88%",
            once: true,
            onEnter: (batch) => {
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                force3D: true,
                stagger: 0.08,
              });

              batch.forEach((card) => {
                const index = cards.indexOf(card as HTMLElement);
                const image = images[index];
                if (image) {
                  gsap.to(image, {
                    scale: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    force3D: true,
                  });
                }
              });
            },
          });
        },
      );
    }, galleryRef);

    // Re-measure after everything (fonts, images) has actually settled —
    // this is the fix for animations silently failing in Safari/Firefox
    // due to layout shifting after ScrollTrigger's initial measurement.
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
      ctx.revert();
    };
  }, []);

  const openImage = useCallback((index: number) => {
    const mediaEl = mediaRefs.current[index];
    if (!mediaEl) return;

    originRectRef.current = mediaEl.getBoundingClientRect();
    setOpenIndex(index);
  }, []);

  const closeViewer = useCallback(() => {
    setOpenIndex(null);
    originRectRef.current = null;
  }, []);

  return (
    <>
      <IntroAnimation onComplete={() => setIntroDone(true)} />
      <div
        ref={galleryRef}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-x-10"
      >
        <div className="flex flex-col gap-24">
          {itemsL.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="relative"
              style={{ marginTop: getOffset(index, OFFSET_CYCLE_L) }}
            >
              <GalleryMedia
                item={item}
                onClick={() => openImage(index)}
                mediaRef={(el) => {
                  mediaRefs.current[index] = el;
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-24">
          {itemsR.map((item, index) => {
            const globalIndex = itemsL.length + index;

            return (
              <div
                key={`${item.id}-${index}`}
                className="relative"
                style={{ marginTop: getOffset(index, OFFSET_CYCLE_R) }}
              >
                <GalleryMedia
                  item={item}
                  onClick={() => openImage(globalIndex)}
                  mediaRef={(el) => {
                    mediaRefs.current[globalIndex] = el;
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {openIndex !== null && (
        <GalleryViewer
          items={items}
          initialIndex={openIndex}
          originRect={originRectRef.current}
          onClose={closeViewer}
        />
      )}
    </>
  );
}
