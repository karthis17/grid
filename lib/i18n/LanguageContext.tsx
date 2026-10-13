"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
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
const emptySubscribe = () => () => {};

function getClientSnapshot(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === "en" || saved === "ta" || saved === "ja") return saved;
    if (navigator.language) {
      const l = navigator.language.toLowerCase();
      if (l.startsWith("ta")) return "ta";
      if (l.startsWith("ja")) return "ja";
    }
  } catch {}
  return DEFAULT_LOCALE;
}

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

let listeners: Array<() => void> = [];
function subscribe(listener: () => void) {
  listeners.push(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    listeners = listeners.filter((l) => l !== listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const locale = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.setAttribute("data-lang", locale);
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {}
    emitChange();
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
