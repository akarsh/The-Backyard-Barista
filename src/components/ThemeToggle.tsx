import { Monitor, Moon, Sun } from "lucide-react";
import { ResolvedTheme, ThemeMode } from "../hooks/useTheme";
import { AppTranslations } from "../i18n/translations";

interface ThemeToggleProps {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  onChangeMode: (mode: ThemeMode) => void;
  t: AppTranslations;
}

export function ThemeToggle({
  themeMode,
  resolvedTheme,
  onChangeMode,
  t,
}: ThemeToggleProps) {
  const options: Array<{
    mode: ThemeMode;
    label: string;
    icon: typeof Monitor;
  }> = [
    { mode: "system", label: t.theme.auto, icon: Monitor },
    { mode: "light", label: t.theme.light, icon: Sun },
    { mode: "dark", label: t.theme.dark, icon: Moon },
  ];

  return (
    <div
      role="group"
      aria-label={`Color theme (${resolvedTheme})`}
      className="inline-flex items-center gap-0.5 p-1 rounded-lg bg-[#EFE9DC] dark:bg-[#26221E] border border-[#191614]/10 dark:border-white/10 shrink-0"
    >
      {options.map(({ mode, label, icon: Icon }) => {
        const active = themeMode === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onChangeMode(mode)}
            aria-pressed={active}
            className={`min-h-[32px] px-2.5 py-1 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B] ${
              active
                ? "bg-white dark:bg-[#12100E] text-[#191614] dark:text-[#F5F0E6] shadow-xs"
                : "text-[#5C534A] dark:text-[#B8AFA4] hover:text-[#191614] dark:hover:text-[#F5F0E6]"
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
