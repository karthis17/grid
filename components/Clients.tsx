"use client";

import { type ClientList } from "@/lib/ClientList";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Clients({ clients }: { clients: ClientList[] }) {
  const { t, locale } = useLanguage();

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-14 text-center lg:mb-20">
          <p className="mb-3 font-mono text-xs tracking-[0.25em] text-[#9C6B2E]">
            {t.home.clientsTrusted}
          </p>
          <h2
            className={`font-semibold text-[#1B2027] ${
              locale === "ta"
                ? "text-2xl sm:text-3xl md:text-3.5xl tracking-normal leading-snug"
                : locale === "ja"
                ? "text-2xl sm:text-3xl md:text-3.5xl tracking-normal leading-snug"
                : "text-3xl md:text-4xl tracking-tight"
            }`}
          >
            {t.home.clientsHeading}
          </h2>
        </div>
      </div>

      <div className="relative gap-6 lg:gap-8">
        <div className="group relative w-full">
          <div className="grid grid-cols-6 gap-5 lg:gap-6">
            {clients.map((c, i) => (
              <div
                key={`${c.name}-${i}`}
                className="flex shrink-0 items-center justify-center bg-white transition-colors duration-300 lg:w-56"
              >
                <Image
                  src={c.src}
                  alt={c.name}
                  width={130}
                  height={130}
                  loading={i < 6 ? "eager" : "lazy"}
                  decoding="async"
                  sizes="(max-width: 1024px) 130px, 160px"
                  className="h-auto w-full mx-10 object-contain opacity-60 grayscale transition-all duration-300 group-hover/tile:opacity-100 group-hover/tile:grayscale-0 lg:max-h-48"
                />
              </div>
            ))}
          </div>
        </div>

        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-white to-transparent lg:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-white to-transparent lg:w-40" />
      </div>
    </section>
  );
}
