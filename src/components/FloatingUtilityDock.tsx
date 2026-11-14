import { useEffect, useState } from "react";
import { ArrowUp, Monitor, Moon, Sun } from "lucide-react";
import { ResolvedTheme, ThemeMode } from "../hooks/useTheme";
import { AppTranslations, LanguageCode } from "../i18n/translations";

interface FloatingUtilityDockProps {
  language: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  onChangeThemeMode: (mode: ThemeMode) => void;
  t: AppTranslations;
}

const LANGUAGES: Array<{
  code: LanguageCode;
  shortLabel: string;
  fullName: string;
}> = [
  { code: "en", shortLabel: "EN", fullName: "English" },
  { code: "de", shortLabel: "DE", fullName: "Deutsch" },
  { code: "te", shortLabel: "తె", fullName: "తెలుగు (Telugu)" },
];

export function FloatingUtilityDock({
  language,
  onChangeLanguage,
  themeMode,
  resolvedTheme,
  onChangeThemeMode,
  t,
}: FloatingUtilityDockProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 240);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const themeOptions: Array<{
    mode: ThemeMode;
    label: string;
    icon: typeof Monitor;
  }> = [
    { mode: "system", label: t.theme.auto, icon: Monitor },
    { mode: "light", label: t.theme.light, icon: Sun },
    { mode: "dark", label: t.theme.dark, icon: Moon },
  ];

  return (
    <aside
      aria-label="Language, theme, and scroll controls"
      className="fixed right-2.5 sm:right-4 bottom-[70px] md:bottom-6 z-40 flex flex-col items-center gap-1 p-1 rounded-xl bg-white/92 dark:bg-[#1C1917]/92 backdrop-blur-md border border-[#191614]/15 dark:border-white/15 shadow-lg transition-colors"
    >
      {/* Language Switcher: EN / DE / తె */}
      <div
        role="group"
        aria-label="Language selector (English, Deutsch, Telugu)"
        className="flex flex-col items-center gap-0.5"
      >
        {LANGUAGES.map(({ code, shortLabel, fullName }) => {
          const active = language === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => onChangeLanguage(code)}
              aria-pressed={active}
              title={fullName}
              aria-label={fullName}
              lang={code}
              className={`w-9 h-8 rounded-lg text-[11px] font-semibold inline-flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B] ${
                active
                  ? "bg-[#EFE9DC] dark:bg-[#26221E] text-[#A62C1B] dark:text-[#F59E0B]"
                  : "text-[#5C534A] dark:text-[#B8AFA4] hover:text-[#191614] dark:hover:text-[#F5F0E6] hover:bg-[#F8F5EE] dark:hover:bg-[#26221E]/60"
              }`}
            >
              {shortLabel}
            </button>
          );
        })}
      </div>

      <div
        aria-hidden="true"
        className="w-6 h-px bg-[#191614]/12 dark:bg-white/12 my-0.5"
      />

      {/* Theme Switcher: Auto / Light / Dark */}
      <div
        role="group"
        aria-label={`Color theme (${resolvedTheme})`}
        className="flex flex-col items-center gap-0.5"
      >
        {themeOptions.map(({ mode, label, icon: Icon }) => {
          const active = themeMode === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => onChangeThemeMode(mode)}
              aria-pressed={active}
              aria-label={label}
              title={label}
              className={`w-9 h-8 rounded-lg inline-flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B] ${
                active
                  ? "bg-[#EFE9DC] dark:bg-[#26221E] text-[#191614] dark:text-[#F5F0E6]"
                  : "text-[#5C534A] dark:text-[#B8AFA4] hover:text-[#191614] dark:hover:text-[#F5F0E6] hover:bg-[#F8F5EE] dark:hover:bg-[#26221E]/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          );
        })}
      </div>

      {/* Scroll-to-Top Control (appears when scrolled) */}
      {showScrollTop && (
        <>
          <div
            aria-hidden="true"
            className="w-6 h-px bg-[#191614]/12 dark:bg-white/12 my-0.5"
          />
          <button
            type="button"
            onClick={handleScrollTop}
            aria-label={t.scrollToTop}
            title={t.scrollToTop}
            className="w-9 h-9 rounded-lg bg-[#A62C1B] dark:bg-[#DC4A33] text-white hover:bg-[#882214] dark:hover:bg-[#C23B26] inline-flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B]"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </>
      )}
    </aside>
  );
}
