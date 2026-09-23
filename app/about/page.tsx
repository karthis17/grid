"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const page = pageRef.current;

    if (!page) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /*
    ============================================================
    DESKTOP / NORMAL MOTION
    ============================================================
    */

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /*
      ------------------------------------------------------------
      HERO
      ------------------------------------------------------------
      */

        const heroTimeline = gsap.timeline({
          defaults: {
            ease: "power4.out",
          },
        });

        heroTimeline
          .from(".hero-tag", {
            y: 30,
            autoAlpha: 0,
            duration: 0.8,
          })
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
        const reveal = (selector: string, options: gsap.TweenVars = {}) => {
          gsap.utils.toArray<HTMLElement>(selector).forEach((element) => {
            gsap.from(element, {
              y: 50,
              autoAlpha: 0,
              duration: 0.9,
              ease: "power3.out",

              ...options,

              scrollTrigger: {
                trigger: element,
                start: "top 85%",
                once: true,

                ...(typeof options.scrollTrigger === "object"
                  ? options.scrollTrigger
                  : {}),
              },
            });
          });
        };

        /*
      ------------------------------------------------------------
      SECTION REVEALS
      ------------------------------------------------------------
      */

        reveal(".reveal-section", {
          y: 70,
          duration: 1,
        });

        /*
      ------------------------------------------------------------
      SECTION LABELS
      ------------------------------------------------------------
      */

        reveal(".section-label", {
          x: -30,
          y: 0,
          duration: 0.7,
        });

        /*
      ------------------------------------------------------------
      BIG HEADINGS
      ------------------------------------------------------------
      */

        reveal(".reveal-heading", {
          y: 45,
          duration: 1,
          ease: "power4.out",
        });

        /*
      ------------------------------------------------------------
      PARAGRAPHS
      ------------------------------------------------------------
      */

        reveal(".reveal-text", {
          y: 25,
          duration: 0.8,
        });

        /*
      ============================================================
      IMAGE REVEALS
      ============================================================
      */

        gsap.utils
          .toArray<HTMLElement>(".image-reveal")
          .forEach((container) => {
            const image = container.querySelector<HTMLElement>(".reveal-image");

            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: container,
                start: "top 82%",
                once: true,
              },
            });

            timeline.from(container, {
              clipPath: "inset(100% 0% 0% 0%)",
              duration: 1.2,
              ease: "power4.inOut",
            });

            if (image) {
              timeline.from(
                image,
                {
                  scale: 1.08,
                  duration: 1.4,
                  ease: "power3.out",
                },
                "<",
              );
            }
          });

        /*
      ============================================================
      DISCIPLINES
      ============================================================
      */

        const disciplines = gsap.utils.toArray<HTMLElement>(".discipline-item");

        if (disciplines.length) {
          gsap.from(disciplines, {
            y: 40,
            autoAlpha: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",

            scrollTrigger: {
              trigger: ".disciplines-list",
              start: "top 82%",
              once: true,
            },
          });
        }

        /*
      ============================================================
      COLLABORATION
      ============================================================
      */

        const collab = document.querySelector(".collab-section");

        if (collab) {
          const collabTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: collab,
              start: "top 80%",
              once: true,
            },
          });

          collabTimeline
            .from(".collab-heading", {
              y: 70,
              autoAlpha: 0,
              duration: 1,
              ease: "power4.out",
            })
            .from(
              ".collab-copy",
              {
                y: 30,
                autoAlpha: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: "power3.out",
              },
              "-=0.5",
            );
        }

        /*
      ============================================================
      STATS
      ============================================================
      */

        gsap.utils.toArray<HTMLElement>(".stat-number").forEach((stat) => {
          const target = Number(stat.dataset.value);

          if (!Number.isFinite(target)) return;

          const counter = {
            value: 0,
          };

          gsap.to(counter, {
            value: target,
            duration: 1.6,
            ease: "power2.out",

            onUpdate: () => {
              stat.textContent = `${Math.round(counter.value)}+`;
            },

            scrollTrigger: {
              trigger: stat,
              start: "top 85%",
              once: true,
            },
          });
        });

        /*
      ============================================================
      FOUNDER
      ============================================================
      */

        const founder = document.querySelector(".founder-section");

        if (founder) {
          const founderTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: founder,
              start: "top 78%",
              once: true,
            },
          });

          founderTimeline
            .from(".founder-image", {
              x: -70,
              autoAlpha: 0,
              duration: 1,
              ease: "power4.out",
            })
            .from(
              ".founder-content",
              {
                x: 70,
                autoAlpha: 0,
                duration: 1,
                ease: "power4.out",
              },
              "<",
            );
        }

        /*
      ============================================================
      CTA
      ============================================================
      */

        const cta = document.querySelector(".cta-box");

        if (cta) {
          const ctaTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: cta,
              start: "top 85%",
              once: true,
            },
          });

          ctaTimeline
            .from(cta, {
              y: 70,
              autoAlpha: 0,
              duration: 1,
              ease: "power4.out",
            })
            .from(
              ".cta-heading",
              {
                y: 35,
                autoAlpha: 0,
                duration: 0.9,
                ease: "power4.out",
              },
              "-=0.55",
            );
        }
      });

      /*
    ============================================================
    REDUCED MOTION
    ============================================================
    */

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            ".hero-tag",
            ".hero-title-line",
            ".hero-description",
            ".hero-scroll",
            ".reveal-section",
            ".section-label",
            ".reveal-heading",
            ".reveal-text",
            ".image-reveal",
            ".discipline-item",
            ".collab-heading",
            ".collab-copy",
            ".stat-number",
            ".founder-image",
            ".founder-content",
            ".cta-box",
            ".cta-heading",
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
    <main
      ref={pageRef}
      className="min-h-screen overflow-hidden bg-[#f3f1eb] text-[#111]"
    >
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
              "Animation",
              "Real-time CG",
              "Websites & Digital Experiences",
              "Design",
              "Games & Interactive",
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
                  <svg
                    className="nav-arrow h-[0.65em] w-auto shrink-0"
                    viewBox="0 0 56 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M32.1452 39.3993C32.1876 39.4365 33.4872 39.721 35.0329 40.0313C36.5788 40.3415 37.8604 40.548 37.881 40.4903C37.9014 40.4326 38.0614 39.4955 38.2363 38.408C38.5876 36.2241 39.4383 33.6742 40.3473 32.0795C43.1807 27.1095 48.2642 23.8186 54.4299 22.9633L56 22.7454L56 20.5499L56 18.3543L54.5769 18.1457C45.2536 16.7798 39.1753 10.692 38.0382 1.58149C37.964 0.986581 37.8753 0.500001 37.8411 0.500001C37.5267 0.500001 32.3165 1.59654 32.218 1.6834C32.1467 1.74622 32.1997 2.30392 32.3359 2.92253C33.8436 9.7726 38.1605 15.3467 43.7624 17.6773L45.1062 18.2364L17.4733 18.2802L-1.87065e-06 18.308L-1.4961e-06 22.7514L17.5182 22.7792L45.086 22.8231L43.3895 23.5738C38.9884 25.521 35.504 29.3406 33.452 34.4676C32.8673 35.9282 31.985 39.2581 32.1452 39.3993Z"
                      fill="currentColor"
                    />
                  </svg>
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
      </section>



      {/* =====================================
          CTA
      ===================================== */}

      <section className="px-5  py-5 md:px-10 md:py-10 lg:px-16 lg:py-16">
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
