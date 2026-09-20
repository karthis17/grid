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
      className="group relative inline-block font-bold xl:text-6xl 2xl:text-7xl text-5xl py-2 px-4"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="relative z-10">{children}</span>

      {/* Squiggle SVG underline */}
      <svg
        viewBox="0 0 300 40"
        preserveAspectRatio="none"
        className="absolute left-0 -bottom-2 w-full h-6 pointer-events-none"
      >
        <path
          d="M5,20 C 3,30 45,35 70,20 S 110,5 140,22 S 190,35 220,15 S 270,5 295,25"
          fill="none"
          stroke="#e11d1d"
          strokeWidth="12"
          strokeLinecap="round"
          className="scribble-path"
        />
      </svg>

      <style jsx>{`
        .scribble-path {
          stroke-dasharray: 500;
          stroke-dashoffset: 500;
          transition: stroke-dashoffset 0.6s ease;
        }
        .group:hover .scribble-path {
          stroke-dashoffset: 0;
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
        className={`fixed inset-0 bg-black/50  z-40 transition-opacity duration-300 ${
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
      className={`sticky top-0 left-0 w-full z-50 px-6 sm:px-10 py-4 transition-all duration-300
      ${scrolled ? "bg-black/80 backdrop-blur-md shadow-lg py-3" : "bg-black py-5"}
      ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="flex justify-between w-full items-center">
        <Link href="/">
          <Image
            src="/LogoWhite.png"
            height={50}
            width={200}
            alt="Lucid Dream Logo"
            className="transition-transform duration-300"
          />
        </Link>

        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          className="flex flex-col cursor-pointer justify-center items-end gap-1.5 w-8 h-8 group"
        >
          <span className="block h-0.5 w-8 bg-white transition-all duration-300 group-hover:w-6" />
          <span className="block h-0.5 w-6 bg-white transition-all duration-300 group-hover:w-8" />
          <span className="block h-0.5 w-8 bg-white transition-all duration-300 group-hover:w-5" />
        </button>
      </div>

      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}
export default Header;
