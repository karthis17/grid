"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* --------------------------------
         HERO
      -------------------------------- */

      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      heroTimeline
        .from(".hero-tag", {
          y: 30,
          opacity: 0,
          duration: 0.8,
        })
        .from(
          ".hero-title-line",
          {
            yPercent: 120,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
          },
          "-=0.3",
        )
        .from(
          ".hero-description",
          {
            y: 40,
            opacity: 0,
            duration: 1,
          },
          "-=0.5",
        )
        .from(
          ".hero-scroll",
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
          },
          "-=0.5",
        );

      /* --------------------------------
         GENERAL SECTION REVEALS
      -------------------------------- */

      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
        gsap.from(section, {
          y: 80,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });
      });

      /* --------------------------------
         SECTION LABELS
      -------------------------------- */

      gsap.utils.toArray<HTMLElement>(".section-label").forEach((label) => {
        gsap.from(label, {
          x: -40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: label,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      /* --------------------------------
         BIG HEADINGS
      -------------------------------- */

      gsap.utils.toArray<HTMLElement>(".reveal-heading").forEach((heading) => {
        gsap.from(heading, {
          yPercent: 30,
          opacity: 0,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });
      });

      /* --------------------------------
         PARAGRAPHS
      -------------------------------- */

      gsap.utils.toArray<HTMLElement>(".reveal-text").forEach((text) => {
        gsap.from(text, {
          y: 35,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: text,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      /* --------------------------------
         LARGE IMAGE REVEAL
      -------------------------------- */

      gsap.utils.toArray<HTMLElement>(".image-reveal").forEach((container) => {
        const image = container.querySelector(".reveal-image");

        gsap.from(container, {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: 1.4,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        if (image) {
          gsap.from(image, {
            scale: 1.15,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });

      /* --------------------------------
         DISCIPLINES STAGGER
      -------------------------------- */

      const disciplines = gsap.utils.toArray<HTMLElement>(".discipline-item");

      gsap.from(disciplines, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".disciplines-list",
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      /* --------------------------------
         COLLAB SECTION
      -------------------------------- */

      const collabHeading = document.querySelector(".collab-heading");

      if (collabHeading) {
        gsap.from(collabHeading, {
          y: 100,
          opacity: 0,
          duration: 1.3,
          ease: "power4.out",
          scrollTrigger: {
            trigger: collabHeading,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      gsap.from(".collab-copy", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".collab-copy-wrapper",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      /* --------------------------------
         STATS
      -------------------------------- */

      gsap.utils.toArray<HTMLElement>(".stat-number").forEach((stat) => {
        const target = Number(stat.dataset.value);

        if (!target) return;

        const counter = {
          value: 0,
        };

        gsap.to(counter, {
          value: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            stat.textContent = `${Math.round(counter.value)}+`;
          },
          scrollTrigger: {
            trigger: stat,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      /* --------------------------------
         FOUNDER
      -------------------------------- */

      gsap.from(".founder-image", {
        x: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".founder-section",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".founder-content", {
        x: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".founder-section",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      /* --------------------------------
         CTA
      -------------------------------- */

      gsap.from(".cta-box", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".cta-box",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".cta-heading", {
        yPercent: 30,
        opacity: 0,
        duration: 1.2,
        delay: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".cta-box",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      /* --------------------------------
         REFRESH SCROLLTRIGGER
      -------------------------------- */

      ScrollTrigger.refresh();
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={pageRef}
      className="min-h-screen overflow-hidden bg-[#f3f1eb] text-[#111]"
    >
      {/* =====================================
          HERO
      ===================================== */}

      <section className="relative min-h-[90vh] overflow-hidden bg-black text-white">
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
            <span className="h-[1px] w-10 bg-white/60" />

            <span className="text-xs uppercase tracking-[0.3em] text-white/70">
              Creative Studio · Since 2012
            </span>
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

      {/* =====================================
          ABOUT
      ===================================== */}

      <section className="px-5 py-24 md:px-10 lg:px-16 lg:py-36">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="section-label lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.25em] text-black/45">
              01 / About
            </p>
          </div>

          <div className="lg:col-span-9">
            <h2 className="reveal-heading max-w-5xl text-4xl font-medium leading-[1.05] tracking-[-0.045em] md:text-6xl lg:text-7xl">
              A small, talented team crafting extraordinary work across
              disciplines.
            </h2>

            <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-14">
              <p className="reveal-text text-base leading-7 text-black/65 md:text-lg md:leading-8">
                We are a creative company working across video content,
                animation, real-time CG, branding, websites, design, games and
                strategy.
              </p>

              <p className="reveal-text text-base leading-7 text-black/65 md:text-lg md:leading-8">
                Our work spans the built environment, arts and culture, events
                and placemaking — creating experiences with a strong sense of
                atmosphere, identity and occasion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          IMAGE
      ===================================== */}

      <section className="px-5 md:px-10 lg:px-16">
        <div className="image-reveal relative h-[55vh] overflow-hidden md:h-[75vh]">
          <Image
            src="/3.jpg"
            alt="LucidDream studio"
            fill
            className="reveal-image object-cover"
          />

          <div className="absolute bottom-0 left-0 flex w-full justify-between bg-gradient-to-t from-black/70 to-transparent p-6 pt-20 text-xs uppercase tracking-[0.2em] text-white md:p-8">
            <span>LucidDream Studio</span>
            <span>India</span>
          </div>
        </div>
      </section>

      {/* =====================================
          DISCIPLINES
      ===================================== */}

      <section className="px-5 py-24 md:px-10 lg:px-16 lg:py-36">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="section-label lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.25em] text-black/45">
              02 / What we do
            </p>
          </div>

          <div className="disciplines-list lg:col-span-9">
            {[
              "Architecture Visualisation",
              "Films & Animation",
              "Real-time CG",
              "Branding & Identity",
              "Web & Digital",
              "Design",
              "Games & Interactive",
              "Strategy & Positioning",
            ].map((item, index) => (
              <div
                key={item}
                className="discipline-item group flex cursor-default items-center justify-between border-t border-black/20 py-5 md:py-7"
              >
                <div className="flex items-center gap-5 md:gap-10">
                  <span className="text-xs text-black/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="text-2xl tracking-[-0.03em] transition-transform duration-500 ease-out group-hover:translate-x-3 md:text-4xl">
                    {item}
                  </h3>
                </div>

                <span className="text-xl opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:text-3xl">
                  ↗
                </span>
              </div>
            ))}

            <div className="border-t border-black/20" />
          </div>
        </div>
      </section>

      {/* =====================================
          COLLAB
      ===================================== */}

      <section className="bg-[#181818] px-5 py-24 text-white md:px-10 lg:px-16 lg:py-36">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="section-label lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.25em] text-white/40">
              03 / Collaboration
            </p>
          </div>

          <div className="lg:col-span-9">
            <p className="collab-copy mb-8 text-sm uppercase tracking-[0.2em] text-white/45">
              Collab × LucidDream
            </p>

            <h2 className="collab-heading max-w-5xl text-4xl font-medium leading-[1.08] tracking-[-0.045em] md:text-6xl lg:text-7xl">
              We transform ideas into believable spaces and visually compelling
              narratives.
            </h2>

            <div className="collab-copy-wrapper mt-14 grid gap-10 border-t border-white/20 pt-10 md:grid-cols-2">
              <p className="collab-copy text-base leading-7 text-white/60 md:text-lg md:leading-8">
                Since 2012, we have collaborated with architects and agencies to
                create meaningful design illustrations, visual identities and
                immersive experiences.
              </p>

              <p className="collab-copy text-base leading-7 text-white/60 md:text-lg md:leading-8">
                Our work spans strategy and positioning, identity design,
                marketing collateral, architectural stills, animation and films.
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}

        <div className="mt-24 grid border-y border-white/20 md:grid-cols-3">
          <div className="border-b border-white/20 py-10 md:border-b-0 md:border-r md:px-8 md:first:pl-0">
            <p
              className="stat-number text-6xl font-medium tracking-[-0.06em] md:text-8xl"
              data-value="100"
            >
              0+
            </p>

            <p className="mt-4 text-sm text-white/45">Clients</p>
          </div>

          <div className="border-b border-white/20 py-10 md:border-b-0 md:border-r md:px-8">
            <p
              className="stat-number text-6xl font-medium tracking-[-0.06em] md:text-8xl"
              data-value="12"
            >
              0+
            </p>

            <p className="mt-4 text-sm text-white/45">Years collaborating</p>
          </div>

          <div className="py-10 md:px-8">
            <p className="text-6xl font-medium tracking-[-0.06em] md:text-8xl">
              ∞
            </p>

            <p className="mt-4 text-sm text-white/45">Possibilities</p>
          </div>
        </div>
      </section>

      {/* =====================================
          FOUNDER
      ===================================== */}

      <section className="founder-section px-5 py-24 md:px-10 lg:px-16 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="founder-image lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#ddd]">
              <Image
                src="/images/arun-babu.jpg"
                alt="Arun Babu"
                fill
                className="object-cover grayscale transition duration-700 hover:grayscale-0"
              />
            </div>
          </div>

          <div className="founder-content flex flex-col justify-between lg:col-span-6 lg:col-start-7">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-black/40">
                Founder
              </p>

              <h2 className="mt-6 text-5xl font-medium tracking-[-0.05em] md:text-7xl">
                Arun Babu
              </h2>

              <p className="mt-5 text-lg text-black/55">
                Founder and Partner-Architect
              </p>
            </div>

            <div className="mt-16">
              <Link
                href="mailto:arunbabu@luciddream.co.in"
                className="group inline-flex items-center gap-3 border-b border-black pb-2 text-sm md:text-base"
              >
                arunbabu@luciddream.co.in
                <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          CTA
      ===================================== */}

      <section className="px-5 pb-5 md:px-10 md:pb-10 lg:px-16 lg:pb-16">
        <div className="cta-box relative overflow-hidden bg-[#d8ff3e] px-6 py-16 md:px-10 md:py-24 lg:px-14">
          <p className="text-xs uppercase tracking-[0.25em] text-black/50">
            Start a conversation
          </p>

          <div className="mt-10 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="cta-heading max-w-4xl text-5xl font-medium leading-[0.95] tracking-[-0.06em] md:text-7xl lg:text-8xl">
              Have an idea?
              <br />
              Let’s make it real.
            </h2>

            <Link
              href="mailto:info@luciddream.co.in"
              className="group flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-black text-sm text-white transition-transform duration-500 hover:scale-110 md:h-36 md:w-36"
            >
              <span className="flex items-center gap-2">
                Talk to us
                <span className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
