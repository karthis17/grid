import Link from "next/link";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/luciddream",
    Icon: InstagramIcon,
  },
  {
    name: "Behance",
    href: "https://behance.net/luciddream",
    Icon: BehanceIcon,
  },
  { name: "Vimeo", href: "https://vimeo.com/luciddream", Icon: VimeoIcon },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/luciddream",
    Icon: LinkedInIcon,
  },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-screen-2xl px-6 py-16 md:px-10 lg:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Left column */}
          <div>
            <h2 className="text-4xl font-normal">
              We&rsquo;re Lucid<span className="font-bold">Dream</span>
            </h2>
            <p className="mt-6  text-lg leading-relaxed text-gray-300">
              We are a creative company, a small and talented team crafting
              extraordinary and unique work across many disciplines - from video
              content and animation, to real time CG, branding, websites,
              design, games and strategy. We work across different sectors, from
              the built environment, to arts and culture, events and
              placemaking.
            </p>
            <p className="mt-8 font-bold">Arun Babu</p>
            <p className="mt-1 text-[15px] text-gray-300">
              Founder and Partner-Architect
            </p>
            <a
              href="mailto:arunbabu@luciddream.co.in"
              className="mt-1 block text-[15px] text-gray-300 hover:text-white"
            >
              arunbabu@luciddream.co.in
            </a>
          </div>

          {/* Right column */}
          <div>
            <h2 className="text-3xl font-normal">
              Collab x Lucid<span className="font-bold">Dream</span>
            </h2>
            <p className="mt-6  text-lg leading-relaxed text-gray-300">
              We have built our reputation on our ability to communicate
              visually compelling narratives and construct believable spaces
              with a strong sense of atmosphere and occasion. We have been
              collaborating with Architects and agencies to build meaningful
              design illustrations, since 2012. We offer services across
              strategy and positioning, identity design, marketing collateral,
              stills and films.
            </p>
            <div className="mt-10 flex items-baseline gap-3">
              <span className="text-6xl font-extrabold leading-none">100+</span>
              <span className="text-sm text-gray-300">
                Clients use our service
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20" />

      <div className="mx-auto max-w-screen-xl px-6 py-10 md:px-10 md:py-14">
        <a
          href="mailto:info@luciddream.co.in"
          className="block text-center text-4xl font-extrabold tracking-tight transition-opacity hover:opacity-80 sm:text-5xl md:text-7xl"
        >
          info@luciddream.co.in
        </a>
      </div>

      <div className="border-t border-white/20" />

      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-6 px-6 py-8 md:flex-row md:justify-between md:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <LucidDreamMark className="h-8 w-8" />
          <span className="text-xl">
            Lucid <span className="font-bold">Dream</span>
          </span>
        </Link>

        {/* Social icons */}
        <div className="flex items-center gap-5">
          {socialLinks.map(({ name, href, Icon }, i) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="text-white/70 transition-colors hover:text-white"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-300">
          &copy; Copyright {new Date().getFullYear()} - Luciddream
        </p>
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

function LucidDreamMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 32" fill="none" className={className}>
      <path
        d="M2 2 L20 2 L2 26 Z"
        stroke="white"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M14 12 L38 12 L20 30 Z" fill="white" />
    </svg>
  );
}
