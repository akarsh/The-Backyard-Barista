import { AppTranslations, LanguageCode } from "../i18n/translations";

interface LanguageToggleProps {
  language: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  t: AppTranslations;
  compact?: boolean;
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

export function LanguageToggle({
  language,
  onChangeLanguage,
  t,
  compact = false,
}: LanguageToggleProps) {
  return (
    <div
      role="group"
      aria-label={t.accessibility.languageSelector}
      className="inline-flex items-center gap-0.5 p-0.5 sm:p-1 rounded-lg bg-[#EFE9DC] dark:bg-[#26221E] border border-[#191614]/10 dark:border-white/10 shrink-0"
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
            lang={code}
            className={`${
              compact
                ? "min-h-[30px] px-2 py-0.5 text-[11px]"
                : "min-h-[32px] px-2.5 py-1 text-xs"
            } rounded-md font-semibold inline-flex items-center justify-center transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B] ${
              active
                ? "bg-white dark:bg-[#12100E] text-[#A62C1B] dark:text-[#F59E0B] shadow-xs"
                : "text-[#5C534A] dark:text-[#B8AFA4] hover:text-[#191614] dark:hover:text-[#F5F0E6]"
            }`}
          >
            {shortLabel}
          </button>
        );
      })}
    </div>
  );
}
