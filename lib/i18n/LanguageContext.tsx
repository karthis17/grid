"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { Dictionary, LanguageOption, Locale } from "./types";
import { dictionaries, DEFAULT_LOCALE, SUPPORTED_LANGUAGES } from "./dictionaries";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  languages: LanguageOption[];
  isMounted: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: dictionaries[DEFAULT_LOCALE],
  languages: SUPPORTED_LANGUAGES,
  isMounted: false,
});

const STORAGE_KEY = "luciddream_locale";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedLocale = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (savedLocale && (savedLocale === "en" || savedLocale === "ta" || savedLocale === "ja")) {
        setLocaleState(savedLocale);
        document.documentElement.lang = savedLocale;
        document.documentElement.setAttribute("data-lang", savedLocale);
        return;
      }

      // Auto-detect browser preference if no manual choice was saved
      if (typeof navigator !== "undefined" && navigator.language) {
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith("ta")) {
          setLocaleState("ta");
          document.documentElement.lang = "ta";
          document.documentElement.setAttribute("data-lang", "ta");
          return;
        }
        if (browserLang.startsWith("ja")) {
          setLocaleState("ja");
          document.documentElement.lang = "ja";
          document.documentElement.setAttribute("data-lang", "ja");
          return;
        }
      }
    } catch {
      // Ignore localStorage errors (e.g. private browsing)
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
      document.documentElement.setAttribute("data-lang", newLocale);
    } catch {
      // Ignore localStorage errors
    }
  };

  const t = useMemo(() => dictionaries[locale] || dictionaries[DEFAULT_LOCALE], [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      languages: SUPPORTED_LANGUAGES,
      isMounted,
    }),
    [locale, t, isMounted]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
