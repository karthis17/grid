"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Work", href: "/#works" },
    { name: "Lab", href: "/#works" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "#contact" },
  ];

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

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

        <div className="flex w-full flex-col items-start justify-start gap-3">
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
              <div
                onClick={() => {
                  router.push(item.href);
                  onClose();
                }}
                className="nav-item relative inline-flex w-auto flex-col"
              >
                <div className="nav-main text-5xl font-bold  text-white transition-transform duration-300 md:text-7xl ">
                  {item.name}
                </div>

                <div className="nav-sub absolute left-0 top-0 flex w-max items-center gap-2 font-bold font-playfair text-5xl text-yellow-300 -600 md:gap-3 md:text-7xl lg:gap-4 ">
                  <span className="nav-sub-text">{item.name}</span>

                </div>
              </div>
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
  const tickingRef = useRef(false);

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
      className={`fixed top-0 left-0 w-full z-50 px-6 sm:px-10 transition-[transform,background-color,height] duration-300 ease-out flex items-center
      ${scrolled ? "bg-black/40 h-16 backdrop-blur-md shadow-lg" : "bg-transparent h-20 md:h-24"}
      ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="flex h-full justify-between w-full items-center">
        <Link href="/">
          <Image
            src="/LogoWhite.png"
            height={50}
            width={230}
            alt="Lucid Dream Logo"
            className={`transition-[width] duration-300 h-auto  ${scrolled ? "md:w-[180px] w-[130px]" : "md:w-[230px] w-[150px]"} `}
            priority
          />
        </Link>

        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          className="group flex flex-col items-center justify-center gap-1 rounded-full w-8 h-9"
        >
          <span className="block h-4 w-4 rounded-full bg-white transition-all duration-300 group-hover:w-6 group-hover:h-6 self-center" />
        </button>
      </div>

      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}
export default Header;
