"use client";

import { type ClientList } from "@/lib/ClientList";
import Image from "next/image";

export default function Clients({ clients }: { clients: ClientList[] }) {

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

      <div className="relative  gap-6 lg:gap-8">
        <div className=" group relative w-full">
          <div className={` grid grid-cols-6  gap-5 lg:gap-6 `}>
            {clients.map((c, i) => (
              <div
                key={`${c.name}-${i}`}
                className=" flex shrink-0 items-center justify-center  bg-white  transition-colors duration-300 lg:h-28 lg:w-56"
              >
                <Image
                  src={c.src}
                  alt={c.name}
                  width={130}
                  height={56}
                  loading={i < 6 ? "eager" : "lazy"}
                  sizes="(max-width: 1024px) 130px, 160px"
                  className="h-12 w-auto object-contain opacity-60 grayscale transition-all duration-300 group-hover/tile:opacity-100 group-hover/tile:grayscale-0 lg:max-h-14"
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
