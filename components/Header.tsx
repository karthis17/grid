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

        <div className="flex w-full flex-col items-start justify-start gap-5">
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
                <div onClick={()=>{
                  router.push(item.href);
                  onClose();
                }} className="nav-item relative inline-flex w-auto flex-col">
                  <div className="nav-main text-5xl font-bold uppercase text-white transition-transform duration-300 md:text-7xl ">
                    {item.name}
                  </div>

                  <div className="nav-sub absolute left-0 top-0 flex w-max items-center gap-2 font-serif text-4xl italic text-red-600 md:gap-3 md:text-6xl lg:gap-4 ">
                    <span className="nav-sub-text">{item.name}</span>

                      <svg
                        className="nav-arrow h-[0.65em] w-auto shrink-0"
                        viewBox="0 0 56 41"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M32.1452 39.3993C32.1876 39.4365 33.4872 39.721 35.0329 40.0313C36.5788 40.3415 37.8604 40.548 37.881 40.4903C37.9014 40.4326 38.0614 39.4955 38.2363 38.408C38.5876 36.2241 39.4383 33.6742 40.3473 32.0795C43.1807 27.1095 48.2642 23.8186 54.4299 22.9633L56 22.7454L56 20.5499L56 18.3543L54.5769 18.1457C45.2536 16.7798 39.1753 10.692 38.0382 1.58149C37.964 0.986581 37.8753 0.500001 37.8411 0.500001C37.5267 0.500001 32.3165 1.59654 32.218 1.6834C32.1467 1.74622 32.1997 2.30392 32.3359 2.92253C33.8436 9.7726 38.1605 15.3467 43.7624 17.6773L45.1062 18.2364L17.4733 18.2802L-1.87065e-06 18.308L-1.4961e-06 22.7514L17.5182 22.7792L45.086 22.8231L43.3895 23.5738C38.9884 25.521 35.504 29.3406 33.452 34.4676C32.8673 35.9282 31.985 39.2581 32.1452 39.3993Z"
                          fill="currentColor"
                        />
                      </svg>
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
