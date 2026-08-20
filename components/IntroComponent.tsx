"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";

interface IntroAnimationProps {
  /** Called once the intro has fully finished and unmounted itself */
  onComplete?: () => void;
  /** Path to the logo inside /public, defaults to /LogoWhite.png */
  logoSrc?: string;
  /** Natural width/height of the logo file (233x42 for LogoWhite.png) */
  logoWidth?: number;
  logoHeight?: number;
  /** Skip the intro on repeat visits within the same browser session */
  showOncePerSession?: boolean;
}

const SESSION_KEY = "intro-animation-played";

export default function IntroAnimation({
  onComplete,
  logoSrc = "/LogoWhite.png",
  logoWidth = 233,
  logoHeight = 42,
  showOncePerSession = false,
}: IntroAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainTopRef = useRef<HTMLDivElement>(null);
  const curtainBottomRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);


  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (showOncePerSession && typeof window !== "undefined") {
      if (sessionStorage.getItem(SESSION_KEY)) {
        setMounted(false);
        onComplete?.();
        return;
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          document.body.style.overflow = previousOverflow;
          if (showOncePerSession && typeof window !== "undefined") {
            sessionStorage.setItem(SESSION_KEY, "1");
          }
          setMounted(false);
          onComplete?.();
        },
      });

      // Starting state
      tl.set(logoWrapRef.current, {
        opacity: 0,
        scale: 0.88,
        filter: "blur(6px)",
      });
      tl.set(glowRef.current, { opacity: 0, scale: 0.6 });

      // Ambient glow breathes in behind the logo
      tl.to(
        glowRef.current,
        { opacity: 0.55, scale: 1, duration: 1.1, ease: "sine.out" },
        0,
      );

      // Logo resolves into focus
      tl.to(
        logoWrapRef.current,
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
        },
        0.15,
      );

      // A single light sweep crosses the mark — the signature beat


      // Hold for a breath so the mark registers
      tl.to({}, { duration: 0.35 });

      // Logo settles/fades as the reveal begins
      tl.to(
        logoWrapRef.current,
        {
          opacity: 0,
          scale: 1.04,
          filter: "blur(4px)",
          duration: 0.5,
          ease: "power2.in",
        },
        "-=0.05",
      );
      tl.to(
        glowRef.current,
        { opacity: 0, duration: 0.5, ease: "power2.in" },
        "<",
      );

      // Curtains part to reveal the page beneath
      tl.to(
        curtainTopRef.current,
        { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
        "-=0.15",
      );
      tl.to(
        curtainBottomRef.current,
        { yPercent: 100, duration: 0.9, ease: "power4.inOut" },
        "<",
      );
    }, containerRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-auto"
      aria-hidden="true"
    >
      {/* Curtains — two halves that split apart on reveal */}
      <div
        ref={curtainTopRef}
        className="absolute top-0 left-0 w-full h-1/2 bg-black"
      />
      <div
        ref={curtainBottomRef}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-black"
      />

      {/* Logo, centered, sitting above the curtains while they're closed */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={glowRef}
          className="absolute w-[420px] h-[420px] rounded-full bg-white/10 blur-3xl"
        />

        <div ref={logoWrapRef} className="relative">
          <div
            className="relative"
            style={{ width: logoWidth * 1.6, height: logoHeight * 1.6 }}
          >
            <Image
              src={logoSrc}
              alt="Logo"
              fill
              priority
              className="object-contain select-none"
            />
          </div>


        </div>
      </div>
    </div>
  );
}
