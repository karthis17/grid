"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function HomeIntro() {
  const { t, locale } = useLanguage();

  return (
    <div className="mx-auto bg-[#f7f7f4] text-black px-4 sm:px-6 md:px-10 py-14 sm:py-18 lg:py-24">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6 text-center">
        <div>
          <h2
            className={`font-normal ${
              locale === "ta"
                ? "text-2xl sm:text-3xl md:text-3.5xl leading-snug"
                : locale === "ja"
                ? "text-2.5xl sm:text-3xl md:text-4xl leading-snug"
                : "text-2.5xl sm:text-3xl md:text-4xl"
            }`}
          >
            {t.home.brandPrefix}
            <span className="font-bold">{t.home.brandSuffix}</span>
          </h2>
          <p
            className={`mt-6 text-gray-700 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed ${
              locale === "ta"
                ? "leading-relaxed"
                : locale === "ja"
                ? "leading-relaxed"
                : ""
            }`}
          >
            {t.home.introParagraph}
          </p>
          <p className="mt-8 font-bold text-base sm:text-lg">{t.home.founderName}</p>
          <p className="mt-1 text-sm sm:text-[15px] text-gray-700">{t.home.founderRole}</p>
          <a
            href="mailto:arunbabu@luciddream.co.in"
            className="mt-1 inline-block text-sm sm:text-[15px] text-gray-700 hover:text-black font-medium transition-colors break-words"
          >
            arunbabu@luciddream.co.in
          </a>
        </div>
      </div>
    </div>
  );
}
