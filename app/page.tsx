"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type GalleryItem = {
  id: string;
  src: string;
  no: string;
  title: string;
  meta: string;

  // Desktop
  col: number;
  row: number;

  // Mobile
  mobileCol?: number;
  mobileRow?: number;
};

const items: GalleryItem[] = [
  {
    id: "01",
    src: "https://picsum.photos/seed/peri-01/1100/1100",
    no: "01",
    title: "Haditehrani, Office",
    meta: "Pune, 2023",
    col: 4,
    row: 2,
    mobileCol: 2,
    mobileRow: 2,
  },
  {
    id: "02",
    src: "https://picsum.photos/seed/peri-02/700/500",
    no: "02",
    title: "Courtyard House",
    meta: "Pune, 2022",
    col: 2,
    row: 1,
    mobileCol: 1,
    mobileRow: 1,
  },
  {
    id: "03",
    src: "https://picsum.photos/seed/peri-03/700/500",
    no: "03",
    title: "Garden Residence",
    meta: "Pune, 2022",
    col: 2,
    row: 1,
    mobileCol: 1,
    mobileRow: 1,
  },
  {
    id: "04",
    src: "https://picsum.photos/seed/peri-04/1400/700",
    no: "04",
    title: "Coastal Pavilion",
    meta: "Åland, 2021",
    col: 6,
    row: 1,
    mobileCol: 2,
    mobileRow: 1,
  },
  {
    id: "05",
    src: "https://picsum.photos/seed/peri-05/900/1100",
    no: "05",
    title: "Forest Retreat",
    meta: "Sarek, 2023",
    col: 3,
    row: 2,
    mobileCol: 1,
    mobileRow: 2,
  },
  {
    id: "06",
    src: "https://picsum.photos/seed/peri-06/700/500",
    no: "06",
    title: "Stone House",
    meta: "Öland, 2020",
    col: 3,
    row: 1,
    mobileCol: 1,
    mobileRow: 1,
  },
  {
    id: "07",
    src: "https://picsum.photos/seed/peri-07/700/500",
    no: "07",
    title: "Timber Pavilion",
    meta: "Öland, 2020",
    col: 3,
    row: 1,
    mobileCol: 1,
    mobileRow: 1,
  },
  {
    id: "08",
    src: "https://picsum.photos/seed/peri-08/700/900",
    no: "08",
    title: "Pine Facade",
    meta: "Halland, 2019",
    col: 2,
    row: 2,
    mobileCol: 1,
    mobileRow: 2,
  },
  {
    id: "09",
    src: "https://picsum.photos/seed/peri-09/1000/700",
    no: "09",
    title: "Reflection House",
    meta: "Malmö, 2024",
    col: 4,
    row: 2,
    mobileCol: 2,
    mobileRow: 2,
  },
  {
    id: "10",
    src: "https://picsum.photos/seed/peri-10/700/500",
    no: "10",
    title: "Brick Residence",
    meta: "Skåne, 2023",
    col: 3,
    row: 1,
    mobileCol: 1,
    mobileRow: 1,
  },
  {
    id: "11",
    src: "https://picsum.photos/seed/peri-11/1400/900",
    no: "11",
    title: "Lake House",
    meta: "Uppsala, 2022",
    col: 4,
    row: 2,
    mobileCol: 2,
    mobileRow: 2,
  },
  {
    id: "12",
    src: "https://picsum.photos/seed/peri-12/700/500",
    no: "12",
    title: "Boat Jetty",
    meta: "Archipelago, 2021",
    col: 2,
    row: 1,
    mobileCol: 1,
    mobileRow: 1,
  },
  {
    id: "13",
    src: "https://picsum.photos/seed/peri-13/700/500",
    no: "13",
    title: "Reef Pavilion",
    meta: "Coastal Site, 2024",
    col: 3,
    row: 1,
    mobileCol: 1,
    mobileRow: 1,
  },
  {
    id: "14",
    src: "https://picsum.photos/seed/peri-14/900/1200",
    no: "14",
    title: "Pine Residence",
    meta: "Värmland, 2022",
    col: 3,
    row: 2,
    mobileCol: 1,
    mobileRow: 2,
  },
  {
    id: "15",
    src: "https://picsum.photos/seed/peri-15/1400/800",
    no: "15",
    title: "Reflection House",
    meta: "Lake Site, 2020",
    col: 6,
    row: 1,
    mobileCol: 2,
    mobileRow: 1,
  },
  {
    id: "16",
    src: "https://picsum.photos/seed/peri-16/900/900",
    no: "16",
    title: "Covered Porch",
    meta: "Dalarna, 2023",
    col: 3,
    row: 2,
    mobileCol: 1,
    mobileRow: 2,
  },
];

export default function GalleryGrid() {
  const galleryRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const gallery = galleryRef.current;

    if (!gallery) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".gallery-item");
      const images = gsap.utils.toArray<HTMLElement>(".gallery-image");
      const captions = gsap.utils.toArray<HTMLElement>(".gallery-caption");

      // Initial state
      gsap.set(cards, {
        opacity: 0,
        y: 70,
      });

      gsap.set(images, {
        scale: 1.12,
      });

      gsap.set(captions, {
        opacity: 0,
        y: 15,
      });

      // First screen
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

      // Remaining cards
      cards.slice(4).forEach((card, index) => {
        const image = images[index + 4];
        const caption = captions[index + 4];

        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
          },
        });

        gsap.to(image, {
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
          },
        });

        gsap.to(caption, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
          },
        });
      });
    }, galleryRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#17170F]">
      {/* Header */}
      <header className="px-5 pb-16 pt-8 sm:px-7 md:px-10 md:pb-24 md:pt-10">
        <div className="flex items-start justify-between border-b border-black/10 pb-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">
              Selected Works
            </p>

            <h1 className="mt-4 max-w-3xl font-display text-[clamp(3rem,8vw,8rem)] leading-[0.82] tracking-[-0.055em]">
              Architecture
              <br />
              in context.
            </h1>
          </div>

          <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-black/40 sm:block">
            16 Projects
          </span>
        </div>

        <div className="mt-6 flex max-w-xl justify-between gap-10">
          <p className="text-sm leading-6 text-black/55 md:text-base">
            A collection of spaces shaped by material, landscape, light and the
            relationship between interior and exterior.
          </p>

          <span className="hidden shrink-0 self-end font-mono text-[10px] text-black/35 md:block">
            Scroll to explore ↓
          </span>
        </div>
      </header>

      {/* Gallery */}
      <div
        ref={galleryRef}
        className="gallery-grid px-3 pb-20 sm:px-5 md:px-7 lg:px-10"
      >
        {items.map((item) => (
          <a
            key={item.id}
            href="#"
            className="gallery-item group flex min-h-0 flex-col"
            style={
              {
                "--desktop-col": item.col,
                "--desktop-row": item.row,
                "--mobile-col": item.mobileCol ?? 2,
                "--mobile-row": item.mobileRow ?? 1,
              } as React.CSSProperties
            }
          >
            {/* Image */}
            <div className="gallery-media relative overflow-hidden">
              <Image
                src={item.src}
                alt={item.title}
                width={1400}
                height={900}
                sizes="
      (max-width: 640px) 100vw,
      (max-width: 1024px) 50vw,
      66vw
    "
                className="gallery-image h-auto w-full will-change-transform"
              />

              <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/[0.06]" />

              <span className="absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.15em] text-white mix-blend-difference md:left-4 md:top-4">
                {item.no}
              </span>

              <span className="absolute bottom-4 right-4 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full border border-white/50 bg-white/10 text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                ↗
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
        ))}
      </div>

      {/* Footer */}
      <footer className="border-t border-black/10 px-5 py-8 sm:px-7 md:px-10">
        <div className="flex flex-col gap-4 font-mono text-[9px] uppercase tracking-[0.14em] text-black/40 sm:flex-row sm:items-center sm:justify-between">
          <span>Periphery Studio</span>
          <span>Pune — India</span>
          <span>© 2026</span>
        </div>
      </footer>
    </main>
  );
}
