import { Trash2, X } from "lucide-react";
import { JournalEntry, JournalUser } from "../types/coffee";

interface SavedBrewsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: JournalUser | null;
  entries: JournalEntry[];
  onLoadEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  onGoToSignIn: () => void;
}

export function SavedBrewsDrawer({
  isOpen,
  onClose,
  currentUser,
  entries,
  onLoadEntry,
  onDeleteEntry,
  onGoToSignIn,
}: SavedBrewsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Recipe Journal Drawer"
    >
      <div className="flex-1" onClick={onClose} aria-hidden="true" />
      <aside className="w-full sm:max-w-md bg-[#F7F6F3] h-full shadow-2xl border-l border-[#161514]/10 flex flex-col pb-[env(safe-area-inset-bottom)]">
        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-white border-b border-[#161514]/10 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-serif text-xl font-medium text-[#161514]">
              Recipe Journal
            </h2>
            <p className="text-xs text-[#57534E] truncate">
              {currentUser
                ? `${currentUser.displayHandle} · ${entries.length} ${
                    entries.length === 1 ? "recipe" : "recipes"
                  }`
                : `${entries.length} local ${
                    entries.length === 1 ? "recipe" : "recipes"
                  }`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close recipe journal drawer"
            className="w-11 h-11 rounded-lg bg-[#F7F6F3] hover:bg-[#EFECE6] text-[#161514] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {!currentUser && (
            <div className="bg-white border border-[#161514]/10 rounded-xl p-5">
              <p className="text-sm font-semibold text-[#161514]">
                Sign in with your username or email
              </p>
              <p className="mt-1 text-xs text-[#57534E] leading-relaxed">
                Access your saved creations across sessions and sync with the
                static repository JSON database.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToSignIn();
                }}
                className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-[#9A3412] rounded-lg hover:bg-[#7C2D12] transition-colors cursor-pointer"
              >
                Go to Journal Sign In
              </button>
            </div>
          )}

          {entries.length === 0 ? (
            <div className="bg-white border border-[#161514]/10 rounded-xl p-6 text-center">
              <p className="text-sm font-medium text-[#161514]">
                No saved recipes yet
              </p>
              <p className="mt-1 text-xs text-[#57534E] leading-relaxed">
                Craft a coffee profile in the studio and click Save to Journal
                to store your favorite bean, roast, and milk combinations.
              </p>
            </div>
          ) : (
            entries.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#161514]/10 rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#57534E]">
                      {item.recipe.brewRecipe.method} ·{" "}
                      {item.recipe.brewRecipe.servingTemp} ·{" "}
                      {item.recipe.milkPairing.name}
                    </p>
                    <h3 className="mt-1 font-serif text-lg font-medium text-[#161514]">
                      {item.recipe.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#9A3412]">
                      {item.recipe.tastingNotes.join(" · ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteEntry(item.id)}
                    aria-label={`Delete ${item.recipe.title}`}
                    className="w-9 h-9 rounded-lg text-[#57534E] hover:text-[#991B1B] hover:bg-[#FEF2F2] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-[#161514]/10 flex items-center justify-between gap-4">
                  <span className="font-mono text-xs tabular-nums text-[#57534E]">
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
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#161514] rounded-lg hover:bg-[#2C2A28] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Load Recipe
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
