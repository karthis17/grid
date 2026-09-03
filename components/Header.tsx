"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface MenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}

export interface SocialItem {
  label: string;
  link: string;
}

interface StaggeredMenuProps {
  position?: "left" | "right";
  items?: MenuItem[];
  socialItems?: SocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  logoSrc?: string;
  logoAlt?: string;
  accentColor?: string;
  prelayerColors?: string[];
  menuButtonColor?: string;
  openMenuButtonColor?: string;
}

const DEFAULT_ITEMS: MenuItem[] = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  { label: "About", ariaLabel: "Learn about us", link: "/about" },
  { label: "Work", ariaLabel: "View our work", link: "/work" },
  { label: "Contact", ariaLabel: "Get in touch", link: "/contact" },
];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function StaggeredMenu({
  position = "right",
  items = DEFAULT_ITEMS,
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  logoSrc = "/LogoWhite.png",
  logoAlt = "Logo",
  accentColor = "#5227FF",
  prelayerColors = ["#B497CF", "#5227FF"],
  menuButtonColor = "#ffffff",
  openMenuButtonColor = "#111111",
}: StaggeredMenuProps) {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const busyRef = useRef(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const textMenuRef = useRef<HTMLSpanElement | null>(null);
  const textCloseRef = useRef<HTMLSpanElement | null>(null);
  const itemLabelRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const numberRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const socialTitleRef = useRef<HTMLHeadingElement | null>(null);
  const socialLinkRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);

  const offscreen = position === "left" ? -100 : 100;

  // Reset ref arrays each render in case `items`/`socialItems` length changes.
  itemLabelRefs.current = [];
  numberRefs.current = [];
  socialLinkRefs.current = [];

  const prelayers = useMemo(
    () => (prelayerColors.length ? prelayerColors.slice(0, 3) : ["#1e1e22", "#35353c"]),
    [prelayerColors],
  );

  // Initial state — panel and layers parked offscreen, icon/text at rest.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const layers = preLayerRefs.current.filter(Boolean) as HTMLElement[];
      if (!panel) return;

      gsap.set([panel, ...layers], { xPercent: offscreen });
      gsap.set(plusVRef.current, { rotate: 90 });
      gsap.set(textCloseRef.current, { autoAlpha: 0 });
      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [offscreen, menuButtonColor]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerRefs.current.filter(Boolean) as HTMLElement[];
    if (!panel) return null;

    openTlRef.current?.kill();
    closeTweenRef.current?.kill();

    const itemEls = itemLabelRefs.current.filter(Boolean) as HTMLElement[];
    const numberEls = numberRefs.current.filter(Boolean) as HTMLElement[];
    const socialLinks = socialLinkRefs.current.filter(Boolean) as HTMLElement[];

    gsap.set(itemEls, { yPercent: 140, rotate: 8 });
    gsap.set(numberEls, { autoAlpha: 0 });
    gsap.set(socialTitleRef.current, { autoAlpha: 0 });
    gsap.set(socialLinks, { y: 20, autoAlpha: 0 });

    const reduced = prefersReducedMotion();
    const d = (val: number) => (reduced ? 0.01 : val);

    const tl = gsap.timeline({ paused: true });

    layers.forEach((el, i) => {
      tl.fromTo(el, { xPercent: offscreen }, { xPercent: 0, duration: d(0.5), ease: "power4.out" }, i * (reduced ? 0 : 0.07));
    });

    const panelStart = layers.length ? layers.length * 0.07 : 0;
    tl.fromTo(panel, { xPercent: offscreen }, { xPercent: 0, duration: d(0.6), ease: "power4.out" }, d(panelStart));

    const itemsStart = panelStart + 0.12;
    if (itemEls.length) {
      tl.to(
        itemEls,
        { yPercent: 0, rotate: 0, duration: d(0.9), ease: "power4.out", stagger: reduced ? 0 : 0.08 },
        d(itemsStart),
      );
    }
    if (numberEls.length) {
      tl.to(
        numberEls,
        { autoAlpha: 1, duration: d(0.5), stagger: reduced ? 0 : 0.08 },
        d(itemsStart + 0.05),
      );
    }

    const socialsStart = panelStart + 0.3;
    if (socialTitleRef.current) {
      tl.to(socialTitleRef.current, { autoAlpha: 1, duration: d(0.4) }, d(socialsStart));
    }
    if (socialLinks.length) {
      tl.to(
        socialLinks,
        { y: 0, autoAlpha: 1, duration: d(0.5), stagger: reduced ? 0 : 0.07 },
        d(socialsStart + 0.05),
      );
    }

    openTlRef.current = tl;
    return tl;
  }, [offscreen]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (!tl) {
      busyRef.current = false;
      return;
    }
    tl.eventCallback("onComplete", () => {
      busyRef.current = false;
    });
    tl.play(0);
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerRefs.current.filter(Boolean) as HTMLElement[];
    if (!panel) return;

    closeTweenRef.current?.kill();
    const reduced = prefersReducedMotion();

    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: offscreen,
      duration: reduced ? 0.01 : 0.35,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        gsap.set(itemLabelRefs.current.filter(Boolean) as HTMLElement[], { yPercent: 140, rotate: 8 });
        gsap.set(numberRefs.current.filter(Boolean) as HTMLElement[], { autoAlpha: 0 });
        gsap.set(socialTitleRef.current, { autoAlpha: 0 });
        gsap.set(socialLinkRefs.current.filter(Boolean) as HTMLElement[], { y: 20, autoAlpha: 0 });
        busyRef.current = false;
      },
    });
  }, [offscreen]);

  const animateIcon = useCallback((opening: boolean) => {
    if (!iconRef.current) return;
    gsap.to(iconRef.current, {
      rotate: opening ? 225 : 0,
      duration: prefersReducedMotion() ? 0.01 : opening ? 0.6 : 0.3,
      ease: opening ? "power4.out" : "power3.inOut",
      overwrite: "auto",
    });
  }, []);

  const animateButtonColor = useCallback(
    (opening: boolean) => {
      if (!toggleBtnRef.current) return;
      gsap.to(toggleBtnRef.current, {
        color: opening ? openMenuButtonColor : menuButtonColor,
        delay: prefersReducedMotion() ? 0 : 0.15,
        duration: prefersReducedMotion() ? 0.01 : 0.25,
      });
    },
    [openMenuButtonColor, menuButtonColor],
  );

  const animateText = useCallback((opening: boolean) => {
    const dur = prefersReducedMotion() ? 0.01 : 0.35;
    gsap.to(opening ? textMenuRef.current : textCloseRef.current, { autoAlpha: 0, duration: dur });
    gsap.to(opening ? textCloseRef.current : textMenuRef.current, { autoAlpha: 1, duration: dur });
  }, []);

  const toggleMenu = useCallback(() => {
    const next = !openRef.current;
    openRef.current = next;
    setOpen(next);
    next ? playOpen() : playClose();
    animateIcon(next);
    animateButtonColor(next);
    animateText(next);
  }, [playOpen, playClose, animateIcon, animateButtonColor, animateText]);

  const closeMenu = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    playClose();
    animateIcon(false);
    animateButtonColor(false);
    animateText(false);
  }, [playClose, animateIcon, animateButtonColor, animateText]);

  // Scroll lock + Escape while open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeMenu]);

  // Close on route change.
  useEffect(() => {
    closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Click-away close (desktop, where the panel doesn't cover full width).
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(target)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, closeMenu]);

  const side = position === "left" ? "left-0" : "right-0";

  return (
    <div
      className="sticky bg-black inset-0 z-50 pointer-events-none"
      style={{ ["--sm-accent" as string]: accentColor }}
    >
      {/* Decorative color layers behind the panel */}
      <div aria-hidden className={`pointer-events-none fixed inset-y-0 z-[45] w-full lg:w-[clamp(320px,38vw,420px)] ${side}`}>
        {prelayers.map((color, i) => (
          <div
            key={i}
            ref={(el) => {
              preLayerRefs.current[i] = el;
            }}
            className="absolute inset-0 will-change-transform"
            style={{ background: color }}
          />
        ))}
      </div>

      {/* Header bar: logo + toggle, sits above the panel */}
      <header className="pointer-events-none sticky bg-black inset-x-0 top-0 z-[60] flex items-center justify-between px-6 py-6 sm:px-8">
        <Link href="/" className="pointer-events-auto shrink-0">
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={140}
            height={32}
            priority
            className={`transition-[filter] duration-300 ${open ? "invert lg:invert-0" : ""}`}
          />
        </Link>

        <button
          ref={toggleBtnRef}
          type="button"
          onClick={toggleMenu}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          className="pointer-events-auto relative inline-flex items-center gap-2 bg-transparent font-medium leading-none"
        >
          <span className="relative inline-block h-[1em] w-14 overflow-hidden text-left">
            <span ref={textMenuRef} className="absolute inset-0">Menu</span>
            <span ref={textCloseRef} className="absolute inset-0">Close</span>
          </span>

          <span ref={iconRef} className="relative inline-flex h-3.5 w-3.5 items-center justify-center will-change-transform">
            <span
              ref={plusHRef}
              className="absolute left-1/2 top-1/2 h-[2px] w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-current will-change-transform"
            />
            <span
              ref={plusVRef}
              className="absolute left-1/2 top-1/2 h-[2px] w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-current will-change-transform"
            />
          </span>
        </button>
      </header>

      {/* Backdrop — only visually relevant on desktop where the panel doesn't cover the full width */}
      <div
        onClick={closeMenu}
        aria-hidden
        className={`fixed inset-0 z-[50] bg-black/40 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar panel */}
      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        aria-hidden={!open}
        className={`fixed inset-y-0 z-[55] flex w-full flex-col overflow-y-auto bg-white px-6 pb-8 pt-28 will-change-transform sm:px-10 lg:w-[clamp(320px,38vw,420px)] lg:px-12 lg:pt-32 ${side}`}
      >
        <nav aria-label="Main">
          <ul className="flex flex-col gap-1">
            {items.map((item, idx) => (
              <li key={item.link + idx} className="relative overflow-hidden leading-none">
                <Link
                  href={item.link}
                  aria-label={item.ariaLabel}
                  className="group relative inline-block py-2 pr-14 text-4xl font-semibold uppercase leading-none tracking-tight text-black transition-colors duration-200 hover:text-[color:var(--sm-accent)] sm:text-5xl lg:text-[3.5rem]"
                >
                  <span
                    ref={(el) => {
                      itemLabelRefs.current[idx] = el;
                    }}
                    className="inline-block will-change-transform"
                    style={{ transformOrigin: "50% 100%" }}
                  >
                    {item.label}
                  </span>
                </Link>

                {displayItemNumbering && (
                  <span
                    ref={(el) => {
                      numberRefs.current[idx] = el;
                    }}
                    aria-hidden
                    className="pointer-events-none absolute right-0 top-3 select-none text-sm font-normal text-[color:var(--sm-accent)]"
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {displaySocials && socialItems.length > 0 && (
          <div className="mt-auto flex flex-col gap-3 pt-8">
            <h3 ref={socialTitleRef} className="m-0 text-base font-medium text-[color:var(--sm-accent)]">
              Socials
            </h3>
            <ul className="m-0 flex flex-row flex-wrap items-center gap-4 p-0">
              {socialItems.map((s, i) => (
                <li key={s.link + i}>
                  <a
                    ref={(el) => {
                      socialLinkRefs.current[i] = el;
                    }}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block py-0.5 text-lg font-medium text-black transition-colors duration-300 hover:text-[color:var(--sm-accent)]"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}