import { useState, RefObject, FormEvent } from "react";
import {
  Bookmark,
  Camera,
  Check,
  Copy,
  Loader2,
  RotateCcw,
  Send,
  ShoppingBag,
  SlidersHorizontal,
  Timer,
  X,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { BrewTimer } from "./BrewTimer";
import { BrewPreviewGallery } from "./BrewPreviewGallery";
import { ResilientImage } from "./ResilientImage";
import { ShoppingListPanel } from "./ShoppingListPanel";
import { copyTextToClipboard, formatEmojiRecipeSummary } from "../utils/copyRecipe";
import {
  BREW_METHODS,
  FLAVOR_OPTIONS,
  MILK_ALTERNATIVES,
  ORIGIN_LOTS,
  ROAST_PROFILES,
} from "../data/pantry";
import { AppTranslations } from "../i18n/translations";
import {
  ChatMessage,
  CraftPreferences,
  CraftedRecipe,
} from "../types/coffee";

interface CraftingStudioProps {
  preferences: CraftPreferences;
  onChangePreferences: (next: CraftPreferences) => void;
  onResetPreferences: () => void;
  recipe: CraftedRecipe;
  isCrafting: boolean;
  canPreviewLocalBrews: boolean;
  localBrewPreviews: CraftedRecipe[];
  onSelectLocalBrew: (recipe: CraftedRecipe) => void;
  onCraft: () => void;
  isSaved: boolean;
  onSaveRecipe: () => void;
  visualData: { imageUrl: string; vesselDescription: string } | null;
  isVisualizing: boolean;
  onVisualizeBrew: () => void;
  onClearVisual: () => void;
  chatMessages: ChatMessage[];
  isChatting: boolean;
  onSendChat: (messageText: string) => void;
  chatInputRef: RefObject<HTMLInputElement | null>;
  t: AppTranslations;
}

export function CraftingStudio({
  preferences,
  onChangePreferences,
  onResetPreferences,
  recipe,
  isCrafting,
  canPreviewLocalBrews,
  localBrewPreviews,
  onSelectLocalBrew,
  onCraft,
  isSaved,
  onSaveRecipe,
  visualData,
  isVisualizing,
  onVisualizeBrew,
  onClearVisual,
  chatMessages,
  isChatting,
  onSendChat,
  chatInputRef,
  t,
}: CraftingStudioProps) {
  const [chatDraft, setChatDraft] = useState("");
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [isLocalPreviewOpen, setIsLocalPreviewOpen] = useState(false);
  const [timerSessionKey, setTimerSessionKey] = useState("init");
  const [copiedRecipe, setCopiedRecipe] = useState(false);

  const handleCopyRecipe = async () => {
    const formatted = formatEmojiRecipeSummary(recipe);
    await copyTextToClipboard(formatted);
    setCopiedRecipe(true);
    window.setTimeout(() => setCopiedRecipe(false), 2000);
  };

  const handleOpenTimer = () => {
    if (isTimerOpen) {
      setIsTimerOpen(false);
    } else {
      setTimerSessionKey(`${recipe.title}-${Date.now()}`);
      setIsTimerOpen(true);
    }
  };

  const toggleFlavor = (flavor: string) => {
    const exists = preferences.flavors.includes(flavor);
    const nextFlavors = exists
      ? preferences.flavors.filter((f) => f !== flavor)
      : [...preferences.flavors, flavor];
    onChangePreferences({ ...preferences, flavors: nextFlavors });
  };

  const handleChatSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = chatDraft.trim();
    if (!trimmed || isChatting) return;
    setChatDraft("");
    onSendChat(trimmed);
  };

  return (
    <section
      id="studio"
      className="py-10 sm:py-14 border-b border-[#191614]/10 dark:border-white/10 scroll-mt-16 md:scroll-mt-24"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <p className="text-xs font-medium text-[#A62C1B] dark:text-[#F59E0B] mb-2">
              {t.studio.eyebrow}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#191614] dark:text-[#F5F0E6] [text-wrap:balance]">
              {t.studio.title}
            </h2>
          </div>
          <p className="text-sm text-[#5C534A] dark:text-[#B8AFA4] max-w-md">
            {t.studio.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Configurator */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 bg-white dark:bg-[#1C1917] border border-[#191614]/10 dark:border-white/10 rounded-xl p-5 sm:p-6 lg:p-7 min-w-0">
            <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#191614]/10 dark:border-white/10">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#191614] dark:text-[#F5F0E6]">
                <SlidersHorizontal className="w-4 h-4 text-[#A62C1B] dark:text-[#F59E0B]" />
                <span>{t.studio.controlsTitle}</span>
              </div>
              <button
                type="button"
                onClick={onResetPreferences}
                className="inline-flex items-center gap-1.5 min-h-[36px] px-2 -mr-2 text-xs font-medium text-[#5C534A] dark:text-[#B8AFA4] hover:text-[#191614] dark:hover:text-[#F5F0E6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.studio.reset}</span>
              </button>
            </div>

            {/* Step 1: Flavor Preferences */}
            <div className="py-5 border-b border-[#191614]/10 dark:border-white/10">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-sm font-semibold text-[#191614] dark:text-[#F5F0E6]">
                  {t.studio.flavorDirection}
                </span>
                <span className="text-xs text-[#5C534A] dark:text-[#B8AFA4]">
                  {preferences.flavors.length === 0
                    ? t.studio.selectOneOrMore
                    : `${preferences.flavors.length} ${t.studio.selectedCount}`}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
                {FLAVOR_OPTIONS.map((flavor) => {
                  const active = preferences.flavors.includes(flavor);
                  return (
                    <button
                      key={flavor}
                      type="button"
                      onClick={() => toggleFlavor(flavor)}
                      aria-pressed={active}
                      className={`min-h-[44px] sm:min-h-[40px] px-3.5 py-2 rounded-lg text-sm font-medium text-left transition-colors whitespace-nowrap flex items-center justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B] ${
                        active
                          ? "bg-[#191614] dark:bg-[#F59E0B] text-white dark:text-[#12100E]"
                          : "bg-[#F8F5EE] dark:bg-[#26221E] text-[#191614] dark:text-[#F5F0E6] hover:bg-[#EFE9DC] dark:hover:bg-[#312B25]"
                      }`}
                    >
                      <span className="truncate">{flavor}</span>
                      {active && (
                        <Check
                          className="w-3.5 h-3.5 shrink-0 ml-2 text-[#F59E0B] dark:text-[#12100E]"
                          strokeWidth={2.5}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Brew Method, Serving Temp & Body */}
            <div className="py-5 border-b border-[#191614]/10 dark:border-white/10 space-y-5">
              <div>
                <span className="block text-sm font-semibold text-[#191614] dark:text-[#F5F0E6] mb-3">
                  {t.studio.brewMethod}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                  {BREW_METHODS.map((method) => {
                    const active = preferences.brewMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() =>
                          onChangePreferences({
                            ...preferences,
                            brewMethod: method,
                          })
                        }
                        aria-pressed={active}
                        className={`min-h-[44px] sm:min-h-[40px] px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap truncate cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B] ${
                          active
                            ? "bg-[#A62C1B] dark:bg-[#DC4A33] text-white"
                            : "bg-[#F8F5EE] dark:bg-[#26221E] text-[#191614] dark:text-[#F5F0E6] hover:bg-[#EFE9DC] dark:hover:bg-[#312B25]"
                        }`}
                      >
                        {method}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-semibold text-[#191614] dark:text-[#F5F0E6] mb-2">
                    {t.studio.servingTemp}
                  </span>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-[#F8F5EE] dark:bg-[#26221E] rounded-lg">
                    {(["Hot", "Iced"] as const).map((temp) => {
                      const active = preferences.servingTemp === temp;
                      return (
                        <button
                          key={temp}
                          type="button"
                          onClick={() =>
                            onChangePreferences({
                              ...preferences,
                              servingTemp: temp,
                            })
                          }
                          className={`min-h-[38px] sm:min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                            active
                              ? "bg-white dark:bg-[#12100E] text-[#191614] dark:text-[#F5F0E6] shadow-xs"
                              : "text-[#5C534A] dark:text-[#B8AFA4] hover:text-[#191614] dark:hover:text-[#F5F0E6]"
                          }`}
                        >
                          {temp === "Hot" ? t.studio.hot : t.studio.iced}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="body-select"
                    className="block text-xs font-semibold text-[#191614] dark:text-[#F5F0E6] mb-2"
                  >
                    {t.studio.bodyIntensity}
                  </label>
                  <select
                    id="body-select"
                    value={preferences.bodyPreference}
                    onChange={(e) =>
                      onChangePreferences({
                        ...preferences,
                        bodyPreference: e.target
                          .value as CraftPreferences["bodyPreference"],
                      })
                    }
                    className="w-full min-h-[44px] px-3 py-2 text-base sm:text-xs font-medium bg-[#F8F5EE] dark:bg-[#26221E] text-[#191614] dark:text-[#F5F0E6] border border-[#191614]/10 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B]"
                  >
                    <option value="Light & Tea-Like">{t.studio.bodyLight}</option>
                    <option value="Balanced">{t.studio.bodyBalanced}</option>
                    <option value="Syrupy & Bold">{t.studio.bodyBold}</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Step 3: Origin, Roast & Milk */}
            <div className="py-5 space-y-4">
              <div>
                <label
                  htmlFor="origin-select"
                  className="block text-xs font-semibold text-[#191614] dark:text-[#F5F0E6] mb-1.5"
                >
                  {t.studio.originLot}
                </label>
                <select
                  id="origin-select"
                  value={preferences.selectedOrigin}
                  onChange={(e) =>
                    onChangePreferences({
                      ...preferences,
                      selectedOrigin: e.target.value,
                    })
                  }
                  className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm bg-[#F8F5EE] dark:bg-[#26221E] text-[#191614] dark:text-[#F5F0E6] border border-[#191614]/10 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B]"
                >
                  <option value="Barista Choice">
                    {t.studio.baristaChoiceMatch}
                  </option>
                  {ORIGIN_LOTS.map((lot) => (
                    <option key={lot.id} value={`${lot.origin} — ${lot.name}`}>
                      {lot.origin} — {lot.name} ({lot.process})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="roast-select"
                    className="block text-xs font-semibold text-[#191614] dark:text-[#F5F0E6] mb-1.5"
                  >
                    {t.studio.roastProfile}
                  </label>
                  <select
                    id="roast-select"
                    value={preferences.selectedRoast}
                    onChange={(e) =>
                      onChangePreferences({
                        ...preferences,
                        selectedRoast: e.target.value,
                      })
                    }
                    className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm bg-[#F8F5EE] dark:bg-[#26221E] text-[#191614] dark:text-[#F5F0E6] border border-[#191614]/10 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B]"
                  >
                    {ROAST_PROFILES.map((roast) => (
                      <option key={roast.id} value={roast.id}>
                        {roast.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="milk-select"
                    className="block text-xs font-semibold text-[#191614] dark:text-[#F5F0E6] mb-1.5"
                  >
                    {t.studio.milkAlternative}
                  </label>
                  <select
                    id="milk-select"
                    value={preferences.selectedMilk}
                    onChange={(e) =>
                      onChangePreferences({
                        ...preferences,
                        selectedMilk: e.target.value,
                      })
                    }
                    className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm bg-[#F8F5EE] dark:bg-[#26221E] text-[#191614] dark:text-[#F5F0E6] border border-[#191614]/10 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B]"
                  >
                    {MILK_ALTERNATIVES.map((milk) => (
                      <option key={milk.id} value={milk.id}>
                        {milk.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="custom-note"
                  className="block text-xs font-semibold text-[#191614] dark:text-[#F5F0E6] mb-1.5"
                >
                  {t.studio.additionalNotes}
                </label>
                <input
                  id="custom-note"
                  type="text"
                  value={preferences.customNote}
                  onChange={(e) =>
                    onChangePreferences({
                      ...preferences,
                      customNote: e.target.value,
                    })
                  }
                  placeholder={t.studio.notesPlaceholder}
                  className="w-full min-h-[44px] px-3.5 py-2 text-base sm:text-sm bg-[#F8F5EE] dark:bg-[#26221E] text-[#191614] dark:text-[#F5F0E6] placeholder:text-[#78716C] dark:placeholder:text-[#8E857B] border border-[#191614]/10 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A62C1B] dark:focus:ring-[#F59E0B]"
                />
              </div>
            </div>

            {canPreviewLocalBrews && (
              <div
                role="status"
                aria-live="polite"
                className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-[#EFE9DC] dark:bg-[#26221E] border border-[#191614]/10 dark:border-white/10"
              >
                <p className="text-xs leading-relaxed text-[#5C534A] dark:text-[#B8AFA4]">
                  {t.studio.localPreviewNotice}
                </p>
                <button
                  type="button"
                  aria-expanded={isLocalPreviewOpen}
                  aria-controls="local-brew-previews"
                  onClick={() => setIsLocalPreviewOpen((open) => !open)}
                  className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg border border-[#191614]/15 dark:border-white/15 px-3 py-2 text-xs font-semibold text-[#191614] dark:text-[#F5F0E6] hover:bg-white/70 dark:hover:bg-[#3A332B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B] cursor-pointer"
                >
                  {isLocalPreviewOpen
                    ? t.studio.hideLocalPreviews
                    : t.studio.previewLocalBrews}
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onCraft}
              disabled={isCrafting}
              className="w-full min-h-[48px] px-5 py-3 text-sm font-semibold text-white bg-[#191614] dark:bg-[#DC4A33] rounded-lg hover:bg-[#2F2A26] dark:hover:bg-[#C23B26] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#1C1917]"
            >
              {isCrafting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.studio.crafting}</span>
                </>
              ) : (
                <span>{t.studio.craftBtn}</span>
              )}
            </button>
          </div>

          {/* Right Column: Live Brew Sheet + Milo Barista Consultation */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1C1917] border border-[#191614]/10 dark:border-white/10 border-t-[3px] border-t-[#A62C1B] dark:border-t-[#DC4A33] rounded-xl p-5 sm:p-6 lg:p-8 min-w-0">
            {/* Brew Sheet Header — Brand Seal + Top-Right Primary Save CTA + Symmetrical 4-Tool Bar */}
            <div className="flex flex-col gap-5 pb-6 border-b border-[#191614]/10 dark:border-white/10">
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#191614]/8 dark:border-white/8">
                <div className="inline-flex items-center gap-2 min-w-0">
                  <BrandLogo className="w-5 h-5 shrink-0" />
                  <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#5C534A] dark:text-[#B8AFA4] truncate">
                    {t.brandName} · Brew Sheet
                  </span>
                </div>
                <span className="font-mono text-[10px] tabular-nums text-[#8C4508] dark:text-[#F59E0B] whitespace-nowrap shrink-0">
                  {recipe.brewRecipe.doseGrams}g / {recipe.brewRecipe.waterOrYieldMl}ml
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C534A] dark:text-[#B8AFA4] mb-2">
                    <span>{recipe.brewRecipe.method}</span>
                    <span aria-hidden="true">·</span>
                    <span>{recipe.brewRecipe.servingTemp}</span>
                    <span aria-hidden="true">·</span>
                    <span>{recipe.roastProfile.level}</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#191614] dark:text-[#F5F0E6] [text-wrap:balance]">
                    {recipe.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm font-medium text-[#A62C1B] dark:text-[#F59E0B]">
                    {recipe.tastingNotes.join(" · ")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onSaveRecipe}
                  className={`w-full sm:w-auto shrink-0 self-start min-h-[42px] px-4 py-2 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B] ${
                    isSaved
                      ? "bg-[#EFE9DC] dark:bg-[#26221E] text-[#191614] dark:text-[#F5F0E6] border border-[#191614]/15 dark:border-white/12"
                      : "bg-[#A62C1B] dark:bg-[#DC4A33] text-white hover:bg-[#882214] dark:hover:bg-[#C23B26]"
                  }`}
                >
                  {isSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#A62C1B] dark:text-[#F59E0B] shrink-0" />
                      <span>{t.studio.savedToJournal}</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 shrink-0" />
                      <span>{t.studio.saveToJournal}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={onVisualizeBrew}
                  disabled={isVisualizing}
                  className="min-h-[44px] sm:min-h-[40px] px-3 py-2 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer bg-[#F8F5EE] dark:bg-[#26221E] text-[#191614] dark:text-[#F5F0E6] border border-[#191614]/15 dark:border-white/12 hover:bg-[#EFE9DC] dark:hover:bg-[#312B25] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B]"
                >
                  {isVisualizing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#A62C1B] dark:text-[#F59E0B] shrink-0" />
                      <span className="truncate">{t.studio.rendering}</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-3.5 h-3.5 text-[#A62C1B] dark:text-[#F59E0B] shrink-0" />
                      <span className="truncate">{t.studio.visualizeBrew}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCopyRecipe}
                  className="min-h-[44px] sm:min-h-[40px] px-3 py-2 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer bg-[#F8F5EE] dark:bg-[#26221E] text-[#191614] dark:text-[#F5F0E6] border border-[#191614]/15 dark:border-white/12 hover:bg-[#EFE9DC] dark:hover:bg-[#312B25] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B]"
                >
                  {copiedRecipe ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#A62C1B] dark:text-[#F59E0B] shrink-0" />
                      <span className="truncate">{t.studio.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{t.studio.copyRecipe}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsShoppingListOpen((prev) => !prev)}
                  aria-expanded={isShoppingListOpen}
                  className={`min-h-[44px] sm:min-h-[40px] px-3 py-2 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B] ${
                    isShoppingListOpen
                      ? "bg-[#191614] dark:bg-[#F59E0B] text-white dark:text-[#12100E]"
                      : "bg-[#F8F5EE] dark:bg-[#26221E] text-[#191614] dark:text-[#F5F0E6] border border-[#191614]/15 dark:border-white/12 hover:bg-[#EFE9DC] dark:hover:bg-[#312B25]"
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    {isShoppingListOpen ? t.studio.hideList : t.studio.shoppingList}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenTimer}
                  aria-expanded={isTimerOpen}
                  className={`min-h-[44px] sm:min-h-[40px] px-3 py-2 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B] ${
                    isTimerOpen
                      ? "bg-[#191614] dark:bg-[#F59E0B] text-white dark:text-[#12100E]"
                      : "bg-[#F8F5EE] dark:bg-[#26221E] text-[#191614] dark:text-[#F5F0E6] border border-[#191614]/15 dark:border-white/12 hover:bg-[#EFE9DC] dark:hover:bg-[#312B25]"
                  }`}
                >
                  <Timer className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    {isTimerOpen ? t.studio.hideTimer : t.studio.brewTimer}
                  </span>
                </button>
              </div>
            </div>

            {visualData && (
              <div className="mt-5 bg-[#F8F5EE] dark:bg-[#26221E] border border-[#191614]/10 dark:border-white/10 rounded-xl overflow-hidden">
                <div className="relative aspect-[4/3] bg-[#191614]">
                  <ResilientImage
                    src={visualData.imageUrl}
                    alt={`${recipe.title} served in ${visualData.vesselDescription}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={onClearVisual}
                    aria-label={t.accessibility.closeVisualization}
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/65 text-white hover:bg-black/85 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5C534A] dark:text-[#B8AFA4]">
                  <span>
                    <strong className="font-semibold text-[#191614] dark:text-[#F5F0E6]">
                      {recipe.title}
                    </strong>{" "}
                    · {visualData.vesselDescription} · {recipe.milkPairing.name}
                  </span>
                  <button
                    type="button"
                    onClick={onVisualizeBrew}
                    disabled={isVisualizing}
                    className="font-semibold text-[#A62C1B] dark:text-[#F59E0B] hover:text-[#882214] dark:hover:text-[#FBBF24] transition-colors cursor-pointer"
                  >
                    {t.studio.regenerate}
                  </button>
                </div>
              </div>
            )}

            {/* Barista Note */}
            <div className="py-5 border-b border-[#191614]/10 dark:border-white/10">
              <p className="text-xs font-semibold text-[#5C534A] dark:text-[#B8AFA4] mb-1.5">
                {t.studio.baristaNoteTitle}
              </p>
              <p className="text-[15px] leading-[1.65] text-[#191614] dark:text-[#F5F0E6]">
                {recipe.baristaNote}
              </p>
            </div>

            {/* Bean, Roast & Milk Architecture */}
            <div className="py-6 border-b border-[#191614]/10 dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
              <div className="min-w-0">
                <p className="text-xs text-[#5C534A] dark:text-[#B8AFA4] mb-1">
                  {t.studio.selectedBean}
                </p>
                <p className="text-sm font-semibold text-[#191614] dark:text-[#F5F0E6]">
                  {recipe.bean.name}
                </p>
                <p className="mt-1 text-xs text-[#5C534A] dark:text-[#B8AFA4]">
                  {recipe.bean.origin} · {recipe.bean.region}
                </p>
                <p className="mt-0.5 text-xs text-[#5C534A] dark:text-[#B8AFA4]">
                  {recipe.bean.process} · {recipe.bean.elevation}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#5C534A] dark:text-[#B8AFA4]">
                  {recipe.bean.whyItFits}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-xs text-[#5C534A] dark:text-[#B8AFA4] mb-1">
                  {t.studio.roastCurve}
                </p>
                <p className="text-sm font-semibold text-[#191614] dark:text-[#F5F0E6]">
                  {recipe.roastProfile.level}
                </p>
                <p className="mt-1 text-xs text-[#5C534A] dark:text-[#B8AFA4]">
                  {recipe.roastProfile.developmentNote}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#5C534A] dark:text-[#B8AFA4]">
                  {recipe.roastProfile.flavorImpact}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-xs text-[#5C534A] dark:text-[#B8AFA4] mb-1">
                  {t.studio.milkTexture}
                </p>
                <p className="text-sm font-semibold text-[#191614] dark:text-[#F5F0E6]">
                  {recipe.milkPairing.name}
                </p>
                <p className="mt-1 text-xs text-[#5C534A] dark:text-[#B8AFA4]">
                  {recipe.milkPairing.textureStyle}
                  {recipe.milkPairing.steamTempC > 0 &&
                    ` · ${recipe.milkPairing.steamTempC}°C`}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#5C534A] dark:text-[#B8AFA4]">
                  {recipe.milkPairing.whyItFits}
                </p>
              </div>
            </div>

            {/* Precision Brew Parameters */}
            <div className="py-6 border-b border-[#191614]/10 dark:border-white/10">
              <p className="text-xs font-semibold text-[#5C534A] dark:text-[#B8AFA4] mb-4">
                {t.studio.extractionParams}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-[#F8F5EE] dark:bg-[#26221E] rounded-lg p-4">
                <div className="min-w-0">
                  <span className="block text-xs text-[#5C534A] dark:text-[#B8AFA4]">
                    {t.studio.dose}
                  </span>
                  <span className="font-mono text-sm sm:text-base font-medium tabular-nums text-[#191614] dark:text-[#F5F0E6]">
                    {recipe.brewRecipe.doseGrams}g
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="block text-xs text-[#5C534A] dark:text-[#B8AFA4]">
                    {t.studio.yieldWater}
                  </span>
                  <span className="font-mono text-sm sm:text-base font-medium tabular-nums text-[#191614] dark:text-[#F5F0E6]">
                    {recipe.brewRecipe.waterOrYieldMl}ml
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="block text-xs text-[#5C534A] dark:text-[#B8AFA4]">
                    {t.studio.ratio}
                  </span>
                  <span className="font-mono text-sm sm:text-base font-medium tabular-nums text-[#191614] dark:text-[#F5F0E6] break-words">
                    {recipe.brewRecipe.ratio}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="block text-xs text-[#5C534A] dark:text-[#B8AFA4]">
                    {t.studio.waterTemp}
                  </span>
                  <span className="font-mono text-sm sm:text-base font-medium tabular-nums text-[#191614] dark:text-[#F5F0E6]">
                    {recipe.brewRecipe.waterTempC}°C
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="block text-xs text-[#5C534A] dark:text-[#B8AFA4]">
                    {t.studio.grind}
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-medium text-[#191614] dark:text-[#F5F0E6] break-words">
                    {recipe.brewRecipe.grindSetting}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="block text-xs text-[#5C534A] dark:text-[#B8AFA4]">
                    {t.studio.targetTime}
                  </span>
                  <span className="font-mono text-sm sm:text-base font-medium tabular-nums text-[#191614] dark:text-[#F5F0E6]">
                    {recipe.brewRecipe.brewTime}
                  </span>
                </div>
              </div>

              <ShoppingListPanel
                recipe={recipe}
                isOpen={isShoppingListOpen}
                onClose={() => setIsShoppingListOpen(false)}
                t={t}
              />

              <BrewTimer
                recipe={recipe}
                isOpen={isTimerOpen}
                onClose={() => setIsTimerOpen(false)}
                sessionKey={timerSessionKey}
                t={t}
              />

              <div className="mt-5 space-y-2.5">
                {recipe.brewRecipe.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <span className="font-mono text-xs font-medium tabular-nums text-[#A62C1B] dark:text-[#F59E0B] pt-0.5 shrink-0">
                      0{index + 1}.
                    </span>
                    <p className="text-[#191614] dark:text-[#F5F0E6]/90 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-4 pt-4 border-t border-[#191614]/10 dark:border-white/10 text-xs leading-relaxed text-[#5C534A] dark:text-[#B8AFA4]">
                <span className="font-semibold text-[#191614] dark:text-[#F5F0E6]">
                  {t.studio.dialInTip}
                </span>{" "}
                {recipe.proTip}
              </p>
            </div>

            {/* Interactive Barista Chat (Milo) */}
            <div id="barista-chat" className="pt-6 scroll-mt-16 md:scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className="font-serif text-xl font-medium text-[#191614] dark:text-[#F5F0E6]">
                    {t.studio.consultMilo}
                  </h4>
                  <p className="text-xs text-[#5C534A] dark:text-[#B8AFA4]">
                    {t.studio.consultSubtitle}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {t.studio.quickPrompts.map((promptText) => (
                  <button
                    key={promptText}
                    type="button"
                    disabled={isChatting}
                    onClick={() => onSendChat(promptText)}
                    className="min-h-[38px] px-3 py-1.5 text-xs font-medium text-[#191614] dark:text-[#F5F0E6] bg-[#F8F5EE] dark:bg-[#26221E] hover:bg-[#EFE9DC] dark:hover:bg-[#312B25] border border-[#191614]/10 dark:border-white/10 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50 cursor-pointer"
                  >
                    {promptText}
                  </button>
                ))}
              </div>

              {chatMessages.length > 0 && (
                <div className="mb-4 space-y-3 max-h-[260px] overflow-y-auto pr-1">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-lg text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#191614] dark:bg-[#DC4A33] text-white ml-3 sm:ml-8"
                          : "bg-[#F8F5EE] dark:bg-[#26221E] text-[#191614] dark:text-[#F5F0E6] mr-3 sm:mr-8"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`text-xs font-semibold ${
                            msg.role === "user"
                              ? "text-white/80"
                              : "text-[#A62C1B] dark:text-[#F59E0B]"
                          }`}
                        >
                          {msg.role === "user" ? t.studio.you : t.studio.miloRole}
                        </span>
                        {msg.recipeUpdated && (
                          <span className="text-xs font-medium text-[#A62C1B] dark:text-[#F59E0B]">
                            {t.studio.brewSheetUpdated}
                          </span>
                        )}
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  ))}
                  {isChatting && (
                    <div className="p-3.5 rounded-lg bg-[#F8F5EE] dark:bg-[#26221E] text-sm text-[#5C534A] dark:text-[#B8AFA4] mr-3 sm:mr-8 flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#A62C1B] dark:text-[#F59E0B]" />
                      <span>{t.studio.miloThinking}</span>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={chatDraft}
                  onChange={(e) => setChatDraft(e.target.value)}
                  placeholder={t.studio.chatPlaceholder}
                  aria-label={t.accessibility.messageMilo}
                  className="flex-1 min-w-0 min-h-[44px] px-3.5 sm:px-4 py-2 text-base sm:text-sm bg-[#F8F5EE] dark:bg-[#26221E] text-[#191614] dark:text-[#F5F0E6] placeholder:text-[#78716C] dark:placeholder:text-[#8E857B] border border-[#191614]/15 dark:border-white/12 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A62C1B] dark:focus:ring-[#F59E0B]"
                />
                <button
                  type="submit"
                  disabled={isChatting || !chatDraft.trim()}
                  className="min-h-[44px] px-4 py-2 text-sm font-semibold text-white bg-[#A62C1B] dark:bg-[#DC4A33] rounded-lg hover:bg-[#882214] dark:hover:bg-[#C23B26] disabled:opacity-50 transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.studio.send}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {canPreviewLocalBrews && isLocalPreviewOpen && (
          <BrewPreviewGallery
            previews={localBrewPreviews}
            selectedMethod={preferences.brewMethod}
            onSelect={(preview) => {
              onSelectLocalBrew(preview);
              setIsLocalPreviewOpen(false);
            }}
            t={t.studio}
          />
        )}
      </div>
    </section>
  );
}
