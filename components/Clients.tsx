"use client";

import { type ClientList } from "@/lib/ClientList";
import Image from "next/image";

export default function Clients({ clients }: { clients: ClientList[] }) {
  const mid = Math.ceil(clients.length / 2);
  const rowTop = clients.slice(0, mid);
  const rowBottom = clients.slice(mid);

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-14 text-center lg:mb-20">
          <p className="mb-3 font-mono text-xs tracking-[0.25em] text-[#9C6B2E]">
            {"// TRUSTED ACROSS THE INDUSTRY"}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-[#1B2027] md:text-4xl">
            Our Clients
          </h2>
        </div>
      </div>

      <div className="relative flex flex-col gap-6 lg:gap-8">
        <MarqueeRow clients={rowTop} direction="left" />
        <MarqueeRow clients={rowBottom} direction="right" />

        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-white to-transparent lg:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-white to-transparent lg:w-40" />
      </div>

    
      <style jsx global>{`
        @keyframes scroll-left {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @-webkit-keyframes scroll-left {
          from {
            -webkit-transform: translate3d(0, 0, 0);
          }
          to {
            -webkit-transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes scroll-right {
          from {
            transform: translate3d(-50%, 0, 0);
          }
          to {
            transform: translate3d(0, 0, 0);
          }
        }
        @-webkit-keyframes scroll-right {
          from {
            -webkit-transform: translate3d(-50%, 0, 0);
          }
          to {
            -webkit-transform: translate3d(0, 0, 0);
          }
        }

        .marquee-track {
          -webkit-animation: scroll-left 40s linear infinite;
          animation: scroll-left 40s linear infinite;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          will-change: transform;
        }
        .marquee-track.reverse {
          -webkit-animation-name: scroll-right;
          animation-name: scroll-right;
        }
        .marquee-row:hover .marquee-track,
        .marquee-row:focus-within .marquee-track {
          -webkit-animation-play-state: paused;
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            -webkit-animation: none;
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

function MarqueeRow({
  clients,
  direction,
}: {
  clients: ClientList[];
  direction: "left" | "right";
}) {
  const loop = [...clients, ...clients];

  return (
    <div className="marquee-row group relative w-full overflow-hidden">
      <div
        className={`marquee-track flex w-max items-stretch gap-5 lg:gap-6 ${
          direction === "right" ? "reverse" : ""
        }`}
      >
        {loop.map((c, i) => (
          <a
            key={`${c.name}-${i}`}
            href="#"
            aria-hidden={i >= clients.length}
            tabIndex={i >= clients.length ? -1 : 0}
            className="group/tile relative flex h-24 w-48 shrink-0 items-center justify-center  bg-white  transition-colors duration-300 lg:h-28 lg:w-56"
          >
            <Image
              src={c.src}
              alt={c.name}
              width={130}
              height={56}
              loading={i < 6 ? "eager" : "lazy"}
              sizes="(max-width: 1024px) 130px, 160px"
              className="max-h-12 w-auto object-contain opacity-60 grayscale transition-all duration-300 group-hover/tile:opacity-100 group-hover/tile:grayscale-0 lg:max-h-14"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
