"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/luciddream_studio",
    Icon: InstagramIcon,
  },
  {
    name: "Behance",
    href: "https://www.behance.net/Luciddream_ar",
    Icon: BehanceIcon,
  },
  { name: "Vimeo", href: "https://vimeo.com/user5118274", Icon: VimeoIcon },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/luciddream",
    Icon: LinkedInIcon,
  },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full" id="contact">
      <div className="border-t border-white/20" />
      <div className="bg-black text-white px-4 sm:px-6 md:px-10">
        <div className="mx-auto max-w-7xl py-10 sm:py-12 md:py-16">
          <a
            href="mailto:info@luciddream.co.in"
            className="block text-center text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight transition-opacity hover:opacity-80 break-words sm:break-normal"
          >
            info@luciddream.co.in
          </a>
        </div>

        <div className="border-t border-white/20" />

        <div className="mx-auto max-w-7xl flex flex-col items-center gap-6 py-8 md:flex-row md:justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              width={160}
              height={40}
              alt="Lucid Dream"
              src="/LogoWhite.png"
              loading="lazy"
              decoding="async"
              className="h-auto w-[130px] sm:w-[150px] md:w-[170px]"
            />
          </Link>

          {/* Social icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {socialLinks.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs sm:text-sm text-gray-400 text-center">
            &copy; {t.footer.copyright} {new Date().getFullYear()} {t.footer.allRightsReserved}
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Icons (inline, currentColor so hover states work) ---------- */

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4.98 3.5C4.98 4.88 3.9 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.25h4.5V23H.24V8.25zM8.5 8.25h4.31v2.01h.06c.6-1.14 2.07-2.34 4.26-2.34 4.55 0 5.39 3 5.39 6.9V23h-4.5v-6.28c0-1.5-.03-3.42-2.08-3.42-2.09 0-2.41 1.63-2.41 3.31V23H8.5V8.25z" />
    </svg>
  );
}

function VimeoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22.4 6.9c-.1 2.2-1.6 5.2-4.6 9-3.1 3.9-5.7 5.9-7.8 5.9-1.3 0-2.4-1.2-3.3-3.6L5 12.1C4.3 9.7 3.5 8.5 2.7 8.5c-.2 0-.8.4-1.7 1.1L0 8.4c1.1-1 2.2-1.9 3.2-2.9 1.4-1.2 2.5-1.9 3.2-1.9 1.7-.2 2.7.9 3 3.4.3 2.7.6 4.4.8 5.1.5 2.1 1 3.1 1.6 3.1.5 0 1.2-.7 2.1-2.2.9-1.5 1.4-2.6 1.5-3.4.1-1.3-.4-1.9-1.5-1.9-.5 0-1.1.1-1.6.3 1.1-3.4 3.1-5.1 6.1-5 2.2.1 3.2 1.5 3 4.2z" />
    </svg>
  );
}

function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M0 7.7h6.7c1.5 0 2.6.3 3.4 1 .8.7 1.2 1.6 1.2 2.7 0 .7-.2 1.3-.5 1.8-.3.5-.8.9-1.5 1.2.9.3 1.6.7 2 1.4.4.6.6 1.4.6 2.3 0 .7-.1 1.4-.4 1.9-.3.6-.6 1-1.1 1.4-.5.4-1 .6-1.7.8-.6.1-1.4.2-2.2.2H0V7.7zm3.6 5.4h2.6c.5 0 1-.1 1.3-.4.3-.2.5-.6.5-1.1s-.2-.9-.5-1.1c-.3-.2-.7-.3-1.3-.3H3.6v2.9zm0 5.7h2.9c.6 0 1.1-.1 1.5-.4.3-.3.5-.7.5-1.2 0-.6-.2-1-.5-1.2-.4-.3-.9-.4-1.5-.4H3.6v3.2zM14.6 9.4h6.2v1.5h-6.2V9.4zM24 16.5c0 .2 0 .4-.1.6h-7.3c.1.9.4 1.6.9 2 .5.4 1.1.7 1.9.7.6 0 1.1-.1 1.5-.4.4-.3.7-.6.9-1.1h2.8c-.3 1.1-.9 2-1.9 2.7-.9.7-2 1-3.3 1-.9 0-1.7-.1-2.4-.4-.7-.3-1.3-.7-1.8-1.2-.5-.5-.9-1.1-1.1-1.9-.3-.7-.4-1.5-.4-2.4 0-.9.1-1.6.4-2.3.3-.7.7-1.3 1.2-1.9.5-.5 1.1-.9 1.8-1.2.7-.3 1.5-.4 2.3-.4 1 0 1.8.2 2.6.6.7.4 1.3.9 1.8 1.6.4.6.7 1.3.9 2.1.2.7.3 1.5.2 2.3zm-2.9-1.7c0-.4-.1-.8-.2-1.1-.1-.3-.3-.6-.5-.8-.2-.2-.5-.4-.8-.5-.3-.1-.6-.2-1-.2-.7 0-1.3.2-1.8.7-.5.4-.7 1.1-.8 1.9h5.1z" />
    </svg>
  );
}

