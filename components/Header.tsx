"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { t, locale } = useLanguage();

  const menuItems = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.work, href: "/works" },
    { name: t.nav.lab, href: "/works" },
    { name: t.nav.about, href: "/about" },
    { name: t.nav.contact, href: "/about/#contact" },
  ];

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sliding panel */}
      <div
        className={`fixed top-0 right-0 h-screen lg:w-[440px] md:w-[400px] sm:w-[380px] w-full max-w-full bg-black text-white p-6 md:p-10 z-50 flex flex-col justify-between overflow-y-auto
        transform transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${isOpen ? "translate-x-0 shadow-2xl" : "translate-x-full"}`}
      >
        <div>
          <div className="flex justify-end mb-6">
            <button
              onClick={onClose}
              aria-label={t.nav.closeMenu}
              className="text-white cursor-pointer hover:text-gray-400 transition-colors p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                width="28"
                height="28"
                viewBox="0 0 50 50"
              >
                <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
              </svg>
            </button>
          </div>

        <div className="flex w-full flex-col items-start justify-start gap-4">
            {menuItems.map((item, index) => (
              <div
                key={item.href + item.name}
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
                <div
                  onClick={() => {
                    router.push(item.href);
                    onClose();
                  }}
                  className="nav-item relative inline-flex w-auto max-w-full flex-col cursor-pointer overflow-hidden"
                >
                  <div
                    className={`nav-main font-bold text-white transition-transform duration-300 whitespace-nowrap ${
                      locale === "ta"
                        ? "text-3xl sm:text-4xl md:text-4xl tracking-normal leading-tight font-sans"
                        : locale === "ja"
                        ? "text-3xl sm:text-4xl md:text-4xl tracking-tight leading-tight font-sans"
                        : "text-5xl md:text-6xl font-helvetica tracking-tight"
                    }`}
                  >
                    {item.name}
                  </div>

                  <div
                    className={`nav-sub absolute left-0 top-0 flex items-center font-bold text-yellow-300 whitespace-nowrap ${
                      locale === "ta"
                        ? "text-3xl sm:text-4xl md:text-4xl tracking-normal leading-tight font-sans"
                        : locale === "ja"
                        ? "text-3xl sm:text-4xl md:text-4xl tracking-tight leading-tight font-sans"
                        : "text-5xl md:text-6xl font-playfair tracking-tight"
                    }`}
                  >
                    <span className="nav-sub-text">{item.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multilingual Switcher inside Sidebar */}
        <div
          className={`transform transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: isOpen ? "650ms" : "0ms" }}
        >
          <LanguageSwitcher variant="sidebar" className="mt-8" />
        </div>
      </div>
    </>,
    document.body
  );
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const tickingRef = useRef(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const isScrolled = currentScrollY > 10;

        setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));

        if (currentScrollY <= 0) {
          setShowHeader(true);
        } else if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
          setShowHeader(false);
        } else if (currentScrollY < lastScrollY.current) {
          setShowHeader(true);
        }

        lastScrollY.current = currentScrollY;
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 px-5 sm:px-8 md:px-10 transition-[transform,background-color,height] duration-300 ease-out flex items-center
      ${scrolled ? "bg-black/50 h-16 backdrop-blur-md shadow-lg" : "bg-transparent h-20 md:h-24"}
      ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="flex h-full justify-between w-full items-center">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/LogoWhite.png"
            height={50}
            width={230}
            alt="Lucid Dream Logo"
            className={`transition-[width] duration-300 h-auto ${
              scrolled ? "md:w-[170px] w-[120px]" : "md:w-[220px] w-[140px]"
            }`}
            priority
          />
        </Link>

        {/* Right side controls: Language Switcher + Menu Button */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
          <LanguageSwitcher variant="header" />

          <button
            onClick={() => setIsOpen(true)}
            aria-label={t.nav.menu}
            className="group flex flex-col items-center justify-center rounded-full w-9 h-9 cursor-pointer bg-white/10 hover:bg-white/20 transition-all border border-white/20"
          >
            <span className="block h-3.5 w-3.5 rounded-full bg-white transition-all duration-300 group-hover:scale-125 self-center" />
          </button>
        </div>
      </div>

      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}

export default Header;
