import { useEffect, useState } from "react";
import { LanguageCode, TRANSLATIONS } from "../i18n/translations";

export const LANGUAGE_STORAGE_KEY = "seggemu_kaapiwerk_lang_v1";

function detectInitialLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === "en" || stored === "de" || stored === "te") {
      return stored;
    }
    const browserLang = (navigator.language || "").toLowerCase();
    if (browserLang.startsWith("de")) return "de";
    if (browserLang.startsWith("te")) return "te";
  } catch {
    // Ignore storage access errors
  }
  return "en";
}

export function useLanguage() {
  const [language, setLanguage] = useState<LanguageCode>(detectInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Ignore storage errors
    }
  }, [language]);

  return {
    language,
    setLanguage,
    t: TRANSLATIONS[language],
  };
}
