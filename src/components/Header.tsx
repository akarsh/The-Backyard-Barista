import { BookOpen } from "lucide-react";
import { AppTranslations } from "../i18n/translations";
import { JournalUser } from "../types/coffee";
import { BrandLogo } from "./BrandLogo";

interface HeaderProps {
  savedCount: number;
  currentUser: JournalUser | null;
  onOpenSaved: () => void;
  showSystemMap: boolean;
  t: AppTranslations;
}

export function Header({
  savedCount,
  currentUser,
  onOpenSaved,
  showSystemMap,
  t,
}: HeaderProps) {
  return (
    <header className="relative md:sticky md:top-0 z-30 bg-[#F8F5EE] dark:bg-[#12100E] border-b border-[#191614]/12 dark:border-white/10 transition-colors">
      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-2 sm:gap-4 md:gap-6">
        <a
          href="#top"
          className="inline-flex items-center gap-2.5 sm:gap-3 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B] rounded-sm group"
        >
          <BrandLogo className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition-transform duration-200 group-hover:scale-[1.03]" />
          <span className="flex flex-col min-w-0 leading-none">
            <span className="font-serif text-[16px] sm:text-lg lg:text-xl font-semibold tracking-tight text-[#191614] dark:text-[#F5F0E6] truncate">
              {t.brandName}
            </span>
            <span className="hidden sm:block mt-0.5 text-[10px] font-medium tracking-wide text-[#5C534A] dark:text-[#B8AFA4] truncate">
              {t.brandSubline}
            </span>
          </span>
        </a>

        <nav
          aria-label={t.accessibility.primaryNavigation}
          className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs xl:text-sm font-medium text-[#5C534A] dark:text-[#B8AFA4]"
        >
          <a
            href="#studio"
            className="hover:text-[#191614] dark:hover:text-[#F5F0E6] transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
          >
            {t.nav.studio}
          </a>
          <a
            href="#journal"
            className="hover:text-[#191614] dark:hover:text-[#F5F0E6] transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
          >
            {t.nav.journal}
          </a>
          <a
            href="#origins"
            className="hover:text-[#191614] dark:hover:text-[#F5F0E6] transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
          >
            {t.nav.origins}
          </a>
          <a
            href="#roast-milk"
            className="hover:text-[#191614] dark:hover:text-[#F5F0E6] transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
          >
            {t.nav.roastMilk}
          </a>
          {showSystemMap && (
            <a
              href="#how-it-works"
              className="hover:text-[#191614] dark:hover:text-[#F5F0E6] transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
            >
              {t.nav.systemMap}
            </a>
          )}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenSaved}
            className="inline-flex items-center gap-1.5 sm:gap-2 min-h-[36px] sm:min-h-[40px] px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-white bg-[#191614] dark:bg-[#DC4A33] rounded-lg hover:bg-[#2F2A26] dark:hover:bg-[#C23B26] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#12100E] cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            <span>
              {currentUser ? t.nav.openJournal : t.nav.signIn}
            </span>
            {savedCount > 0 && (
              <span className="font-mono tabular-nums text-[#F59E0B] dark:text-[#F8F5EE]">
                ({savedCount})
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
