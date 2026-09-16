"use client";

import gsap from "gsap";
import Image from "next/image";
import React, { useLayoutEffect, useRef } from "react";

const Banner = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const page = pageRef.current;

    if (!page) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const heroTimeline = gsap.timeline({
          defaults: {
            ease: "power4.out",
            delay: 0.1,
          },
        });

        heroTimeline

          .from(
            ".hero-title-line",
            {
              yPercent: 120,
              autoAlpha: 0,
              duration: 1.1,
              stagger: 0.12,
            },
            "-=0.35",
          )
          .from(
            ".hero-description",
            {
              y: 35,
              autoAlpha: 0,
              duration: 0.9,
            },
            "-=0.5",
          )
          .from(
            ".hero-scroll",
            {
              y: 15,
              autoAlpha: 0,
              duration: 0.6,
            },
            "-=0.45",
          );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            ".hero-tag",
            ".hero-title-line",
            ".hero-description",
            ".hero-scroll",
          ],
          {
            clearProps: "all",
          },
        );
      });
    }, page);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={pageRef}
      className="relative min-h-[90vh] overflow-hidden bg-black text-white"
    >
      <Image
        src="/8.jpg"
        alt="LucidDream creative studio"
        fill
        priority
        className="object-cover opacity-70"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/80" />

      <div className="relative z-10 flex min-h-[90vh] flex-col justify-between px-5 pb-8 pt-32 md:px-10 lg:px-16 lg:pb-14">
        <div className="hero-tag flex items-center gap-3">
          
        </div>

        <div>
          <h1 className="max-w-[1200px] overflow-hidden text-[16vw] font-medium leading-[0.78] tracking-[-0.07em] sm:text-[13vw] lg:text-[10vw]">
            <span className="hero-title-line block">We’re</span>

            <span className="hero-title-line block">LucidDream</span>
          </h1>

          <div className="mt-8 flex flex-col gap-6 border-t border-white/30 pt-6 md:flex-row md:items-end md:justify-between">
            <p className="hero-description max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
              A multidisciplinary creative studio building compelling
              narratives, meaningful spaces and memorable visual experiences.
            </p>

            <span className="hero-scroll text-xs uppercase tracking-[0.25em] text-white/50">
              Scroll to discover ↓
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
