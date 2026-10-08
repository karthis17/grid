"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function HomeIntro() {
  const { t, locale } = useLanguage();

  return (
    <div className="mx-auto bg-[#f7f7f4] text-black px-6 py-16 md:px-10 lg:py-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 text-center">
        <div>
          <h2
            className={`font-normal ${
              locale === "ta"
                ? "text-2xl sm:text-3xl md:text-3.5xl leading-snug"
                : locale === "ja"
                ? "text-2.5xl sm:text-3xl md:text-4xl leading-snug"
                : "text-4xl"
            }`}
          >
            {t.home.brandPrefix}
            <span className="font-bold">{t.home.brandSuffix}</span>
          </h2>
          <p
            className={`mt-6 text-gray-700 max-w-4xl mx-auto ${
              locale === "ta"
                ? "text-base md:text-[17px] leading-relaxed"
                : locale === "ja"
                ? "text-base md:text-[17px] leading-relaxed"
                : "text-lg leading-relaxed"
            }`}
          >
            {t.home.introParagraph}
          </p>
          <p className="mt-8 font-bold text-lg">{t.home.founderName}</p>
          <p className="mt-1 text-[15px] text-gray-700">{t.home.founderRole}</p>
          <a
            href="mailto:arunbabu@luciddream.co.in"
            className="mt-1 block text-[15px] text-gray-700 hover:text-black font-medium transition-colors"
          >
            arunbabu@luciddream.co.in
          </a>
        </div>
      </div>
    </div>
  );
}
