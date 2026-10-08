"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Locale } from "@/lib/i18n/types";

interface LanguageSwitcherProps {
  variant?: "header" | "sidebar";
  className?: string;
}

export default function LanguageSwitcher({
  variant = "header",
  className = "",
}: LanguageSwitcherProps) {
  const { locale, setLocale, languages, t } = useLanguage();

  if (variant === "sidebar") {
    return (
      <div className={`w-full pt-8 border-t border-white/20 ${className}`}>
        <p className="text-xs uppercase tracking-[0.25em] text-white/50 mb-4 font-mono">
          {t.nav.language}
        </p>
        <div className="flex flex-wrap gap-2.5">
          {languages.map((lang) => {
            const isActive = locale === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLocale(lang.code)}
                aria-pressed={isActive}
                className={`group relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-white text-black shadow-md scale-102"
                    : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/15"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    isActive ? "bg-black" : "bg-white/40 group-hover:bg-white"
                  }`}
                />
                <span className="tracking-wide">{lang.nativeLabel}</span>

              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Header variant: sleek, compact luxury capsule
  return (
    <div
      role="group"
      aria-label="Language selector"
      className={`relative inline-flex items-center rounded-full bg-black/40 backdrop-blur-md p-1 border border-white/20 shadow-sm ${className}`}
    >
      {languages.map((lang) => {
        const isActive = locale === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            aria-pressed={isActive}
            title={lang.label}
            className={`relative rounded-full px-2.5 py-1 text-xs md:text-[13px] font-medium transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-white text-black shadow-sm font-semibold"
                : "text-white/75 hover:text-white hover:bg-white/10"
            }`}
          >
            <span className="relative z-10 leading-none">{lang.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
