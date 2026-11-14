import { BookOpen, Coffee, Droplets, SlidersHorizontal } from "lucide-react";

const NAV_ITEMS = [
  { href: "#studio", label: "Studio", icon: SlidersHorizontal },
  { href: "#journal", label: "Journal", icon: BookOpen },
  { href: "#origins", label: "Origins", icon: Coffee },
  { href: "#roast-milk", label: "Pairings", icon: Droplets },
] as const;

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Mobile quick navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#F7F6F3] border-t border-[#161514]/12 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-4 h-14">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            className="flex flex-col items-center justify-center gap-1 min-h-[44px] text-[#57534E] hover:text-[#161514] active:text-[#9A3412] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#9A3412]"
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
