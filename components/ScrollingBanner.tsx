"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FrameState {
  frame: number;
}

interface ScrollVideoProps {
  frameCount?: number;
  framePath?: (i: number) => string;
  scrollDistance?: number;
}

export default function ScrollVideo({
  frameCount = 78,
  framePath = (i) => `/frames/frame_${String(i).padStart(4, "0")}.jpg`,
  scrollDistance = 3500,
}: ScrollVideoProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameStateRef = useRef<FrameState>({ frame: 0 });

  const lastGoodIndexRef = useRef<number>(-1);

  const framePathRef = useRef(framePath);

  // Scroll idle detection
  const scrollIdleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [hintVisible, setHintVisible] = useState(true);
  const [hintMounted, setHintMounted] = useState(true);

  const hintHideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [loadedCount, setLoadedCount] = useState(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // --------------------------------------------------
  // Keep latest framePath
  // --------------------------------------------------

  useEffect(() => {
    framePathRef.current = framePath;
  }, [framePath]);

  // --------------------------------------------------
  // Show / hide scroll hint
  // --------------------------------------------------

  const setHint = useCallback((show: boolean) => {
    if (hintHideTimeout.current) {
      clearTimeout(hintHideTimeout.current);
      hintHideTimeout.current = null;
    }

    if (show) {
      setHintMounted(true);

      requestAnimationFrame(() => {
        setHintVisible(true);
      });
    } else {
      setHintVisible(false);

      hintHideTimeout.current = setTimeout(() => {
        setHintMounted(false);
      }, 350);
    }
  }, []);

  // --------------------------------------------------
  // Draw image fitted inside canvas
  // --------------------------------------------------

  const drawImageFit = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      canvas: HTMLCanvasElement,
    ) => {
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;

      let drawWidth: number;
      let drawHeight: number;
      let offsetX: number;
      let offsetY: number;

      if (imgRatio > canvasRatio) {
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgRatio;

        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgRatio;

        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    },
    [],
  );

  // --------------------------------------------------
  // Draw interpolated frame
  // --------------------------------------------------

  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const lower = Math.floor(index);

      const upper = Math.min(lower + 1, frameCount - 1);

      const alpha = index - lower;

      let img1 = imagesRef.current[lower];

      const isDrawable = (img?: HTMLImageElement) =>
        !!img && img.complete && img.naturalWidth > 0;

      // Current frame is available
      if (isDrawable(img1)) {
        lastGoodIndexRef.current = lower;
      }

      // Fallback to last successfully loaded frame
      else if (lastGoodIndexRef.current >= 0) {
        img1 = imagesRef.current[lastGoodIndexRef.current];
      }

      // Nothing available yet
      else {
        return;
      }

      const img2 = imagesRef.current[upper];

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw current frame
      drawImageFit(ctx, img1, canvas);

      // Crossfade next frame
      if (img2 && img2.complete && img2.naturalWidth > 0 && alpha > 0) {
        ctx.globalAlpha = alpha;

        drawImageFit(ctx, img2, canvas);

        ctx.globalAlpha = 1;
      }
    },
    [frameCount, drawImageFit],
  );

  // --------------------------------------------------
  // Canvas resize
  // --------------------------------------------------

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;

    if (!canvas || !section) return;

    canvas.width = section.clientWidth;
    canvas.height = section.clientHeight;

    drawFrame(frameStateRef.current.frame);
  }, [drawFrame]);

  // --------------------------------------------------
  // Load images + GSAP ScrollTrigger
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const images = new Array<HTMLImageElement>(frameCount);

    imagesRef.current = images;

    lastGoodIndexRef.current = -1;

    let scrollTween: gsap.core.Tween | null = null;

    let trigger: ScrollTrigger | null = null;

    // ------------------------------------------------
    // Load individual frame
    // ------------------------------------------------

    function loadImage(i: number): Promise<void> {
      return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => {
          if (!cancelled) {
            setLoadedCount((count) => count + 1);
          }

          resolve();
        };

        img.onerror = () => {
          console.error(
            `ScrollVideo: failed to load frame ${i + 1} at "${img.src}"`,
          );

          if (!cancelled) {
            setLoadedCount((count) => count + 1);
          }

          resolve();
        };

        img.src = framePathRef.current(i + 1);

        images[i] = img;
      });
    }

    // ------------------------------------------------
    // Scroll activity
    //
    // Hide hint while scrolling.
    // Show hint again when scrolling becomes idle.
    // ------------------------------------------------

    const handleScrollActivity = () => {
      // Hide immediately
      setHint(false);

      // Reset previous idle timer
      if (scrollIdleTimeoutRef.current) {
        clearTimeout(scrollIdleTimeoutRef.current);
      }

      // Show again after user stops scrolling
      scrollIdleTimeoutRef.current = setTimeout(() => {
        setHint(true);
      }, 600);
    };

    // ------------------------------------------------
    // Initialize
    // ------------------------------------------------

    async function init() {
      resizeCanvas();

      // Load first frame first
      await loadImage(0);

      if (cancelled) return;

      drawFrame(0);

      setFirstFrameReady(true);

      // Load remaining frames
      const rest: Promise<void>[] = [];

      for (let i = 1; i < frameCount; i++) {
        rest.push(loadImage(i));
      }

      await Promise.all(rest);

      if (cancelled) return;

      if (lastGoodIndexRef.current === -1) {
        setLoadError(
          `No frame images loaded. Checked paths like "${framePathRef.current(
            1,
          )}" — confirm the frames exist there (public/ folder, filename padding, extension).`,
        );

        return;
      }

      // ------------------------------------------------
      // GSAP frame animation
      // ------------------------------------------------

      scrollTween = gsap.to(frameStateRef.current, {
        frame: frameCount - 1,

        ease: "none",

        scrollTrigger: {
          trigger: sectionRef.current,

          start: "top top+=1",

          end: `+=${scrollDistance}`,

          scrub: 1.5,

          pin: true,

          anticipatePin: 1,

          fastScrollEnd: 0.3,

          onUpdate: () => {
            // Draw frame
            drawFrame(frameStateRef.current.frame);

            // Don't change hint visibility here.
            // Native scroll listener handles it.
          },

          onEnter: () => {
            // Section entered.
            // Hint remains visible until actual scrolling.
          },

          onLeave: () => {
            setHint(false);
          },

          onLeaveBack: () => {
            // When user comes back to the section,
            // show hint if they're currently idle.
            setHint(true);
          },
        },
      });

      trigger = scrollTween.scrollTrigger ?? null;
    }

    init();

    // ------------------------------------------------
    // Events
    // ------------------------------------------------

    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("scroll", handleScrollActivity, {
      passive: true,
    });

    // ------------------------------------------------
    // Cleanup
    // ------------------------------------------------

    return () => {
      cancelled = true;

      window.removeEventListener("resize", resizeCanvas);

      window.removeEventListener("scroll", handleScrollActivity);

      if (scrollIdleTimeoutRef.current) {
        clearTimeout(scrollIdleTimeoutRef.current);
      }

      trigger?.kill();

      scrollTween?.kill();

      if (hintHideTimeout.current) {
        clearTimeout(hintHideTimeout.current);
      }
    };
  }, [frameCount, scrollDistance, drawFrame, resizeCanvas, setHint]);

  // --------------------------------------------------
  // Loading percentage
  // --------------------------------------------------

  const loadPct = Math.round((loadedCount / frameCount) * 100);

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <section
      ref={sectionRef}
      className="
        relative
        h-screen
        w-full
        overflow-hidden
        bg-black
      "
    >
      {loadError && (
        <div
          className="
            absolute
            inset-0
            z-[11]
            flex
            flex-col
            items-center
            justify-center
            gap-2
            bg-black
            px-6
            text-center
            text-[0.85rem]
            text-[#ff5a36]
          "
        >
          <div>⚠ ScrollVideo couldn&apos;t load any frames</div>

          <div
            className="
              max-w-[480px]
              text-[#8a8f98]
            "
          >
            {loadError}
          </div>
        </div>
      )}

      {/* -------------------------------------------- */}
      {/* Loading Screen */}
      {/* -------------------------------------------- */}

      {!firstFrameReady && !loadError && (
        <div
          className="
            absolute
            inset-0
            z-10
            flex
            flex-col
            items-center
            justify-center
            gap-3.5
            bg-black
            text-[0.9rem]
            text-[#8a8f98]
          "
        >
          <div>Loading frames…</div>

          <div
            className="
              h-[3px]
              w-[180px]
              overflow-hidden
              rounded-[2px]
              bg-[#222]
            "
          >
            <div
              className="
                h-full
                bg-[#ff5a36]
                transition-[width]
                duration-150
                ease-out
              "
              style={{
                width: `${loadPct}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* -------------------------------------------- */}
      {/* Canvas */}
      {/* -------------------------------------------- */}

      <canvas
        ref={canvasRef}
        className="
          absolute
          inset-0
          block
          h-full
          w-full
          translate-z-0
        "
      />

      {/* -------------------------------------------- */}
      {/* Scroll Hint */}
      {/* -------------------------------------------- */}

      {hintMounted && (
        <div
          aria-hidden={!hintVisible}
          style={{
            position: "absolute",

            bottom: "8%",

            left: "50%",

            zIndex: 10,

            display: "flex",

            flexDirection: "column",

            alignItems: "center",

            gap: 10,

            opacity: hintVisible ? 1 : 0,

            transform: `translate(-50%, ${hintVisible ? "0px" : "10px"})`,

            transition: "opacity 0.35s ease, transform 0.35s ease",

            pointerEvents: "none",
          }}
        >
          {" "}
          <div
            style={{
              width: 26,

              height: 42,

              borderRadius: 14,

              border: "1.5px solid rgba(255,255,255,0.55)",

              background: "rgba(255,255,255,0.06)",

              backdropFilter: "blur(6px)",

              display: "flex",

              justifyContent: "center",

              paddingTop: 8,

              boxSizing: "border-box",
            }}
          >
            {" "}
            <div
              style={{
                width: 4,

                height: 8,

                borderRadius: 2,

                background: "#fff",

                animation: "scrollHintWheel 1.6s ease-in-out infinite",
              }}
            />{" "}
          </div>{" "}
          <span
            style={{
              fontSize: 11,

              letterSpacing: "0.14em",

              textTransform: "uppercase",

              color: "rgba(255,255,255,0.75)",

              fontWeight: 500,
            }}
          >
            Scroll{" "}
          </span>{" "}
          <style>{`

      @keyframes scrollHintWheel {

       0% { transform: translateY(0); opacity: 1; }

       60% { transform: translateY(14px); opacity: 0; }

       61% { transform: translateY(0); opacity: 0; }

       100% { transform: translateY(0); opacity: 1; }

      }

      @media (prefers-reduced-motion: reduce) {

       [style*="scrollHintWheel"] { animation: none !important; }

      }

     `}</style>{" "}
        </div>
      )}
    </section>
  );
}
