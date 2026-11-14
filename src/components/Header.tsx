import { Bookmark } from "lucide-react";

interface HeaderProps {
  savedCount: number;
  onOpenSaved: () => void;
}

export function Header({ savedCount, onOpenSaved }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#F7F6F3]/95 backdrop-blur-sm border-b border-[#161514]/10">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        <a
          href="#top"
          className="font-serif text-xl font-semibold tracking-tight text-[#161514] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3412] rounded-sm"
        >
          Sable &amp; Origin
        </a>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57534E]"
        >
          <a
            href="#studio"
            className="hover:text-[#161514] transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
          >
            Craft Studio
          </a>
          <a
            href="#barista-chat"
            className="hover:text-[#161514] transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
          >
            Barista Chat
          </a>
          <a
            href="#origins"
            className="hover:text-[#161514] transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
          >
            Single Origins
          </a>
          <a
            href="#roast-milk"
            className="hover:text-[#161514] transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
          >
            Roast &amp; Milk
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenSaved}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#161514] rounded-lg hover:bg-[#2C2A28] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3412] focus-visible:ring-offset-2 cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Saved Brews</span>
            {savedCount > 0 && (
              <span className="font-mono tabular-nums text-[#F59E0B]">
                ({savedCount})
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
