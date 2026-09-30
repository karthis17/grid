"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
      className={`fixed  items-center top-0 left-0 w-full z-50 px-6 sm:px-10 py-4 transition-all duration-300
      ${scrolled ? "bg-black/20 h-16 backdrop-blur-md shadow-lg py-3" : "backdrop-blur-md  h-24 py-5"}
      ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="flex h-full justify-between w-full items-center">
        <Link href="/">
          <Image
            src="/LogoWhite.png"
            height={50}
            width={`${scrolled ? 180 : 230}`}
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
