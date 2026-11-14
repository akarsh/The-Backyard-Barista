import { BookOpen, Coffee, GitBranch, SlidersHorizontal } from "lucide-react";
import { AppTranslations } from "../i18n/translations";

interface MobileBottomNavProps {
  showSystemMap: boolean;
  t: AppTranslations;
}

export function MobileBottomNav({
  showSystemMap,
  t,
}: MobileBottomNavProps) {
  const navItems = [
    { href: "#studio", label: t.nav.mobileStudio, icon: SlidersHorizontal },
    { href: "#journal", label: t.nav.mobileJournal, icon: BookOpen },
    { href: "#origins", label: t.nav.mobileOrigins, icon: Coffee },
    ...(showSystemMap
      ? [{ href: "#how-it-works", label: t.nav.mobileSystem, icon: GitBranch }]
      : []),
  ];

  return (
    <nav
      aria-label={t.accessibility.mobileNavigation}
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#F8F5EE] dark:bg-[#12100E] border-t border-[#191614]/12 dark:border-white/10 pb-[env(safe-area-inset-bottom)] transition-colors"
    >
      <div
        className={`grid ${showSystemMap ? "grid-cols-4" : "grid-cols-3"} h-14`}
      >
        {navItems.map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            className="flex flex-col items-center justify-center gap-1 min-h-[44px] text-[#5C534A] dark:text-[#B8AFA4] hover:text-[#191614] dark:hover:text-[#F5F0E6] active:text-[#A62C1B] dark:active:text-[#F59E0B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B]"
          >
            <Icon className="w-4 h-4" strokeWidth={1.9} />
            <span className="text-[11px] font-medium leading-none whitespace-nowrap">
              {label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}
