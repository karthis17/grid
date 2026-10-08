export type Locale = "en" | "ta" | "ja";

export interface LanguageOption {
  code: Locale;
  label: string;
  nativeLabel: string;
  shortLabel: string;
}

export interface Dictionary {
  locale: Locale;
  nav: {
    home: string;
    work: string;
    lab: string;
    about: string;
    contact: string;
    menu: string;
    closeMenu: string;
    language: string;
  };
  banner: {
    scroll: string;
    loadingFrames: string;
    loadError: string;
  };
  home: {
    brandPrefix: string;
    brandSuffix: string;
    introParagraph: string;
    founderName: string;
    founderRole: string;
    clientsTrusted: string;
    clientsHeading: string;
  };
  about: {
    heroTag: string;
    heroTitleLine1: string;
    heroTitleLine2: string;
    heroDescription: string;
    scrollPrompt: string;
    sec1Label: string;
    sec1Heading: string;
    sec1P1: string;
    sec1P2: string;
    studioName: string;
    studioCountry: string;
    sec2Label: string;
    disciplines: string[];
    sec3Label: string;
    collabTag: string;
    collabHeading: string;
    collabP1: string;
    collabP2: string;
    ctaEyebrow: string;
    ctaHeading1: string;
    ctaHeading2: string;
    ctaButton: string;
  };
  footer: {
    copyright: string;
    allRightsReserved: string;
  };
}
