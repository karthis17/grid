import { Dictionary, LanguageOption, Locale } from "../types";
import { en } from "./en";
import { ta } from "./ta";
import { ja } from "./ja";

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  ta,
  ja,
};

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: "en",
    label: "English",
    nativeLabel: "EN",
    shortLabel: "EN",
  },
  {
    code: "ta",
    label: "Tamil",
    nativeLabel: "தமிழ்",
    shortLabel: "தமிழ்",
  },
  {
    code: "ja",
    label: "Japanese",
    nativeLabel: "日本語",
    shortLabel: "日本語",
  },
];

export const DEFAULT_LOCALE: Locale = "en";
