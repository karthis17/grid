"use client";

import { useEffect } from "react";
import Lenis from "lenis";
// Required. This carries the `.lenis.lenis-smooth { scroll-behavior: auto !important; }`
// rule (among a few others: iframe pointer-events, overscroll containment,
// the `lenis-stopped` overflow lock). Without it, any `scroll-behavior: smooth`
// left in your global CSS fights Lenis's own RAF-driven scroll — Chrome mostly
// tolerates it, Safari/Firefox stutter or effectively ignore Lenis entirely.
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    // Don't let GSAP add its own lag smoothing
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}