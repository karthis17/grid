"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { type ClientList } from "@/lib/ClientList";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Clients({ clients }: { clients: ClientList[] }) {
  const { t, locale } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Filter clients by category if user clicks a filter
  const categories = useMemo(() => {
    const set = new Set<string>();
    clients.forEach((c) => {
      if (c.type) set.add(c.type);
    });
    return ["all", ...Array.from(set)];
  }, [clients]);

  // Split into 2 balanced rows for the dual-speed infinite marquee
  const half = Math.ceil(clients.length / 2);
  const track1Base = clients.slice(0, half);
  const track2Base = clients.slice(half);

  // Duplicate items 4 times to ensure a seamless infinite loop on any screen width
  const track1 = useMemo(
    () => [...track1Base, ...track1Base, ...track1Base, ...track1Base],
    [track1Base],
  );
  const track2 = useMemo(
    () => [...track2Base, ...track2Base, ...track2Base, ...track2Base],
    [track2Base],
  );

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-32 bg-[#f7f7f4] text-[#17170F]">
      {/* Decorative architectural ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-40">
        <div className="h-[400px] w-[700px] rounded-full bg-gradient-to-tr from-[#e7e5dc] via-transparent to-[#dedbd2] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14 text-center sm:mb-18 lg:mb-20">
          <div className="inline-flex items-center gap-2 mb-3">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#9C6B2E]">
              {t.home.clientsTrusted}
            </p>
          </div>

          <h2
            className={`font-medium tracking-tight text-[#17170F] ${
              locale === "ta"
                ? "text-2.5xl sm:text-3xl md:text-4.5xl leading-snug"
                : locale === "ja"
                ? "text-2.5xl sm:text-3.5xl md:text-4.5xl leading-snug"
                : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
            }`}
          >
            {t.home.clientsHeading}
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-[#17170F]/65 leading-relaxed font-sans">
            Crafting hyper-realistic CGI stills, animations, and visual narratives
            for India&apos;s most celebrated architecture studios and master developers.
          </p>
        </div>
      </div>

      {/* Borderless Infinite Marquee Showcase */}
      <div className="relative w-full overflow-hidden marquee-row space-y-4 sm:space-y-6">
        {/* Track 1: Gliding Left */}
        <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee-left flex items-center">
            {track1.map((c, i) => (
              <div
                key={`t1-${c.name}-${i}`}
                className="group/logo relative flex flex-col items-center justify-center px-8 sm:px-12 md:px-16 py-4 cursor-pointer select-none transition-transform duration-300"
              >
                <div className="relative flex items-center justify-center">
                  <Image
                    src={c.src}
                    alt={c.name}
                    width={180}
                    height={70}
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 640px) 120px, 180px"
                    className="h-10 sm:h-12 md:h-20 w-auto max-w-[160px] sm:max-w-[160px] object-contain mix-blend-multiply opacity-60 grayscale contrast-125 transition-all duration-300 group-hover/logo:opacity-100 group-hover/logo:grayscale-0 group-hover/logo:scale-110"
                  />
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Track 2: Gliding Right (Opposing Direction) */}
        <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee-right flex items-center">
            {track2.map((c, i) => (
              <div
                key={`t2-${c.name}-${i}`}
                className="group/logo relative flex flex-col items-center justify-center px-8 sm:px-12 md:px-16 py-4 cursor-pointer select-none transition-transform duration-300"
              >
                <div className="relative flex items-center justify-center">
                  <Image
                    src={c.src}
                    alt={c.name}
                    width={180}
                    height={70}
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 640px) 120px, 180px"
                    className="h-10 sm:h-12 md:h-20 w-auto max-w-[160px] sm:max-w-[160px] object-contain mix-blend-multiply opacity-60 grayscale contrast-125 transition-all duration-300 group-hover/logo:opacity-100 group-hover/logo:grayscale-0 group-hover/logo:scale-110"
                  />
                </div>

                
              </div>
            ))}
          </div>
        </div>
      </div>


    </section>
  );
}
