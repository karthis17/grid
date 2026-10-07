"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.055, // Lower lerp creates fluid momentum and a gentle, slow deceleration when mouse scroll stops
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1, // Calibrated travel per wheel notch for controlled, velvety motion
      touchMultiplier: 1.0,
    });

    // One shared animation loop: Lenis drives ScrollTrigger, GSAP's ticker drives Lenis.
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    // Smooth frame rate dips (500ms max lag, 33ms target) instead of zeroing out lagSmoothing
    gsap.ticker.lagSmoothing(500, 33);

    // Initial layout stabilization
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(refreshTimer);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
