"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function ScribbleLink({
  href,
  children,
  delay = 0,
}: {
  href: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <a
      href={href}
      style={{ transitionDelay: `${delay}ms` }}
      className="scribble-link group relative inline-block px-4 py-2 uppercase text-5xl xl:text-6xl 2xl:text-8xl"
    >
      <span className="relative z-10 inline-block transition-transform duration-500 ease-out group-hover:-rotate-1">
        {children}
      </span>

      {/* Hand-drawn loop that circles the word and crosses over the letters,
          like it was actually marked up with a pen — not just an underline. */}
      <svg
        viewBox="0 0 300 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="scribble-loop absolute -top-[22%] -bottom-[22%] -left-[10%] -right-[10%] z-20 overflow-visible"
      >
        {/* Main loop */}
        <path
          className="scribble-path scribble-path-main"
          d="M26 55
             C4 28, 30 2, 96 3
             C176 4, 258 -6, 284 24
             C306 48, 290 78, 228 90
             C160 104, 56 100, 22 74
             C8 64, 6 54, 18 48
             C26 44, 34 46, 40 50"
        />

        {/* Offset secondary stroke for hand-drawn texture */}
        <path
          className="scribble-path scribble-path-secondary"
          d="M30 52
             C12 30, 34 8, 94 9
             C168 10, 246 0, 270 26
             C290 48, 276 74, 222 84
             C162 96, 62 92, 30 70
             C18 62, 16 54, 26 50"
        />

        {/* Pen-lift dot where the stroke finishes */}
        <circle className="scribble-dot" cx="40" cy="50" r="3.5" />
      </svg>

      <style jsx>{`
        .scribble-loop {
          pointer-events: none;
          transform: rotate(-1.5deg);
          transform-origin: center;
          transition: transform 650ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .scribble-path {
          fill: none;
          stroke: #e11d2e;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 5;
          vector-effect: non-scaling-stroke;
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          transition: stroke-dashoffset 650ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .scribble-path-secondary {
          stroke: #ff6b4a;
          stroke-width: 2.5;
          opacity: 0.55;
          transition-delay: 60ms;
        }

        .scribble-dot {
          fill: #e11d2e;
          opacity: 0;
          transform: scale(0);
          transform-origin: center;
          transform-box: fill-box;
          transition:
            opacity 200ms ease 560ms,
            transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1) 560ms;
        }

        .group:hover .scribble-loop {
          transform: rotate(0.8deg);
        }

        .group:hover .scribble-path {
          stroke-dashoffset: 0;
        }

        .group:hover .scribble-dot {
          opacity: 1;
          transform: scale(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .scribble-loop,
          .scribble-path,
          .scribble-dot {
            transition: none;
          }

          .group:hover .scribble-path {
            stroke-dashoffset: 0;
          }

          .group:hover .scribble-dot {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </a>
  );
}

function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Work", href: "/works" },
    { name: "Lab", href: "/works" },
  ];

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // useEffect(() => {
  //   document.body.style.overflow = isOpen ? "hidden" : "auto";
  //   return () => {
  //     document.body.style.overflow = "auto";
  //   };
  // }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={` fixed inset-0 bg-black/50  z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sliding panel */}
      <div
        className={`fixed top-0 right-0 h-screen lg:w-1/3 w-screen bg-black text-white p-6 z-50
        transform transition-transform duration-300  ease-[cubic-bezier(0.22,1,0.36,1)]
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-end mb-8">
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-white cursor-pointer  hover:text-gray-400 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              fill="white"
              y="0px"
              width="30"
              height="30"
              viewBox="0 0 50 50"
            >
              <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-start justify-start gap-5">
          {menuItems.map((item, index) => (
            <div
              key={item.name}
              className={`
        transform
        font-helvetica 
        transition-all
        duration-700
        ease-[cubic-bezier(0.22,1,0.36,1)]
        ${isOpen ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"}
      `}
              style={{
                transitionDelay: isOpen
                  ? `${300 + index * 120}ms`
                  : `${index * 50}ms`,
              }}
            >
              <ScribbleLink href={item.href} delay={index * 100}>
                {item.name}
              </ScribbleLink>
            </div>
          ))}
        </div>
      </div>
    </>,
    document.body,
  );
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 10);

      if (currentScrollY <= 0) {
        // Always show header at the very top
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down -> hide
        setShowHeader(false);
      } else {
        // Scrolling up -> show
        setShowHeader(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky  items-center top-0 left-0 w-full z-50 px-6 sm:px-10 py-4 transition-all duration-300
      ${scrolled ? "bg-black/20 h-16 backdrop-blur-md shadow-lg py-3" : "bg-black h-30 py-5"}
      ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="flex h-full justify-between w-full items-center">
        <Link href="/">
          <Image
            src="/LogoWhite.png"
            height={50}
            width={`${scrolled ? 180 : 250}`}
            alt="Lucid Dream Logo"
            className="transition-all duration-500"
          />
        </Link>

        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          className="flex flex-col cursor-pointer justify-center items-end gap-1.5 w-8 h-8 group"
        >
          <span className="block h-5 w-5 border rounded-full bg-white transition-all duration-300 group-hover:w-7 group-hover:h-7 self-center" />
        </button>
      </div>

      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}
export default Header;
