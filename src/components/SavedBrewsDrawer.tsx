import { Trash2, X } from "lucide-react";
import { AppTranslations } from "../i18n/translations";
import { JournalEntry, JournalUser } from "../types/coffee";

interface SavedBrewsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: JournalUser | null;
  entries: JournalEntry[];
  onLoadEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  onGoToSignIn: () => void;
  t: AppTranslations;
}

export function SavedBrewsDrawer({
  isOpen,
  onClose,
  currentUser,
  entries,
  onLoadEntry,
  onDeleteEntry,
  onGoToSignIn,
  t,
}: SavedBrewsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Recipe Journal Drawer"
    >
      <div className="flex-1" onClick={onClose} aria-hidden="true" />
      <aside className="w-full sm:max-w-md bg-[#F8F5EE] dark:bg-[#12100E] h-full shadow-2xl border-l border-[#191614]/10 dark:border-white/10 flex flex-col pb-[env(safe-area-inset-bottom)]">
        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-white dark:bg-[#1C1917] border-b border-[#191614]/10 dark:border-white/10 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-serif text-xl font-medium text-[#191614] dark:text-[#F5F0E6]">
              {t.drawer.title}
            </h2>
            <p className="text-xs text-[#5C534A] dark:text-[#B8AFA4] truncate">
              {currentUser
                ? `${currentUser.displayHandle} · ${entries.length} ${
                    entries.length === 1
                      ? t.journal.recipeSingular
                      : t.journal.recipePlural
                  }`
                : `${entries.length} ${t.drawer.localLabel} ${
                    entries.length === 1
                      ? t.journal.recipeSingular
                      : t.journal.recipePlural
                  }`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close recipe journal drawer"
            className="w-11 h-11 rounded-lg bg-[#F8F5EE] dark:bg-[#26221E] hover:bg-[#EFE9DC] dark:hover:bg-[#312B25] text-[#191614] dark:text-[#F5F0E6] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {!currentUser && (
            <div className="bg-white dark:bg-[#1C1917] border border-[#191614]/10 dark:border-white/10 rounded-xl p-5">
              <p className="text-sm font-semibold text-[#191614] dark:text-[#F5F0E6]">
                {t.drawer.signInPromptTitle}
              </p>
              <p className="mt-1 text-xs text-[#5C534A] dark:text-[#B8AFA4] leading-relaxed">
                {t.drawer.signInPromptDesc}
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToSignIn();
                }}
                className="mt-3 min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-[#A62C1B] dark:bg-[#DC4A33] rounded-lg hover:bg-[#882214] dark:hover:bg-[#C23B26] transition-colors cursor-pointer"
              >
                {t.drawer.goToSignIn}
              </button>
            </div>
          )}

          {entries.length === 0 ? (
            <div className="bg-white dark:bg-[#1C1917] border border-[#191614]/10 dark:border-white/10 rounded-xl p-6 text-center">
              <p className="text-sm font-medium text-[#191614] dark:text-[#F5F0E6]">
                {t.drawer.emptyTitle}
              </p>
              <p className="mt-1 text-xs text-[#5C534A] dark:text-[#B8AFA4] leading-relaxed">
                {t.drawer.emptyDesc}
              </p>
            </div>
          ) : (
            entries.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#1C1917] border border-[#191614]/10 dark:border-white/10 rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-[#5C534A] dark:text-[#B8AFA4]">
                      {item.recipe.brewRecipe.method} ·{" "}
                      {item.recipe.brewRecipe.servingTemp} ·{" "}
                      {item.recipe.milkPairing.name}
                    </p>
                    <h3 className="mt-1 font-serif text-lg font-medium text-[#191614] dark:text-[#F5F0E6]">
                      {item.recipe.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#A62C1B] dark:text-[#F59E0B]">
                      {item.recipe.tastingNotes.join(" · ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteEntry(item.id)}
                    aria-label={`Delete ${item.recipe.title}`}
                    className="w-9 h-9 rounded-lg text-[#5C534A] dark:text-[#B8AFA4] hover:text-[#991B1B] dark:hover:text-[#FCA5A5] hover:bg-[#FEF2F2] dark:hover:bg-[#7F1D1D]/30 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-[#191614]/10 dark:border-white/10 flex items-center justify-between gap-4">
                  <span className="font-mono text-xs tabular-nums text-[#5C534A] dark:text-[#B8AFA4]">
                    {item.recipe.brewRecipe.doseGrams}g /{" "}
                    {item.recipe.brewRecipe.waterOrYieldMl}ml ·{" "}
                    {item.recipe.brewRecipe.waterTempC}°C
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onLoadEntry(item);
                      onClose();
                    }}
                    className="min-h-[38px] px-3.5 py-1.5 text-xs font-semibold text-white bg-[#191614] dark:bg-[#DC4A33] rounded-lg hover:bg-[#2F2A26] dark:hover:bg-[#C23B26] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {t.drawer.loadRecipe}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
