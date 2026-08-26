// components/smooth-scroll-provider.tsx
"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(!mq.matches);
    const handler = (e: MediaQueryListEvent) => setEnabled(!e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!enabled) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,        // lower = smoother/slower, higher = snappier
        duration: 1.2,
        smoothWheel: true,
        syncTouch: false, // keep native touch feel on mobile, better perf + no jank
      }}
    >
      {children}
    </ReactLenis>
  );
}