import { useState, RefObject, FormEvent } from "react";
import {
  Bookmark,
  Check,
  Loader2,
  RotateCcw,
  Send,
  SlidersHorizontal,
} from "lucide-react";
import {
  BREW_METHODS,
  FLAVOR_OPTIONS,
  MILK_ALTERNATIVES,
  ORIGIN_LOTS,
  ROAST_PROFILES,
} from "../data/pantry";
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
  craftError: string | null;
  onCraft: () => void;
  isSaved: boolean;
  onSaveRecipe: () => void;
  chatMessages: ChatMessage[];
  isChatting: boolean;
  chatError: string | null;
  onSendChat: (messageText: string) => void;
  chatInputRef: RefObject<HTMLInputElement | null>;
}

const QUICK_PROMPTS = [
  "Make this iced",
  "Swap to macadamia milk",
  "How do I avoid bitterness?",
  "Adjust for a sweeter finish",
];

export function CraftingStudio({
  preferences,
  onChangePreferences,
  onResetPreferences,
  recipe,
  isCrafting,
  craftError,
  onCraft,
  isSaved,
  onSaveRecipe,
  chatMessages,
  isChatting,
  chatError,
  onSendChat,
  chatInputRef,
}: CraftingStudioProps) {
  const [chatDraft, setChatDraft] = useState("");

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
    <section id="studio" className="py-14 border-b border-[#161514]/10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-medium text-[#9A3412] mb-2">
              01. Interactive Workbench
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#161514] [text-wrap:balance]">
              Dial in your flavor profile
            </h2>
          </div>
          <p className="text-sm text-[#57534E] max-w-md">
            Select your flavor notes and brew preferences, or lock in a specific
            roast and milk alternative. Milo will calibrate the exact recipe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Configurator */}
          <div className="lg:col-span-5 bg-white border border-[#161514]/10 rounded-xl p-6 md:p-7">
            <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#161514]/10">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#161514]">
                <SlidersHorizontal className="w-4 h-4 text-[#9A3412]" />
                <span>Taste &amp; Brew Controls</span>
              </div>
              <button
                type="button"
                onClick={onResetPreferences}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#57534E] hover:text-[#161514] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Step 1: Flavor Preferences */}
            <div className="py-5 border-b border-[#161514]/10">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-sm font-semibold text-[#161514]">
                  Flavor Direction
                </span>
                <span className="text-xs text-[#57534E]">
                  {preferences.flavors.length === 0
                    ? "Select 1 or more"
                    : `${preferences.flavors.length} selected`}
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
                      className={`min-h-[40px] px-3.5 py-2 rounded-lg text-sm font-medium text-left transition-colors whitespace-nowrap flex items-center justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3412] ${
                        active
                          ? "bg-[#161514] text-white"
                          : "bg-[#F7F6F3] text-[#161514] hover:bg-[#EFECE6]"
                      }`}
                    >
                      <span className="truncate">{flavor}</span>
                      {active && (
                        <Check
                          className="w-3.5 h-3.5 shrink-0 ml-2 text-[#F59E0B]"
                          strokeWidth={2.5}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Brew Method, Serving Temp & Body */}
            <div className="py-5 border-b border-[#161514]/10 space-y-5">
              <div>
                <span className="block text-sm font-semibold text-[#161514] mb-3">
                  Brew Method
                </span>
                <div className="grid grid-cols-2 gap-2">
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
                        className={`min-h-[40px] px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap truncate cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3412] ${
                          active
                            ? "bg-[#9A3412] text-white"
                            : "bg-[#F7F6F3] text-[#161514] hover:bg-[#EFECE6]"
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
                  <span className="block text-xs font-semibold text-[#161514] mb-2">
                    Serving Temperature
                  </span>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-[#F7F6F3] rounded-lg">
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
                          className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                            active
                              ? "bg-white text-[#161514] shadow-xs"
                              : "text-[#57534E] hover:text-[#161514]"
                          }`}
                        >
                          {temp}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="body-select"
                    className="block text-xs font-semibold text-[#161514] mb-2"
                  >
                    Body &amp; Intensity
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
                    className="w-full min-h-[44px] px-3 py-2 text-xs font-medium bg-[#F7F6F3] text-[#161514] border border-[#161514]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9A3412]"
                  >
                    <option value="Light & Tea-Like">Light &amp; Tea-Like</option>
                    <option value="Balanced">Balanced</option>
                    <option value="Syrupy & Bold">Syrupy &amp; Bold</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Origin, Roast & Milk */}
            <div className="py-5 space-y-4">
              <div>
                <label
                  htmlFor="origin-select"
                  className="block text-xs font-semibold text-[#161514] mb-1.5"
                >
                  Single-Origin Bean Lot
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
                  className="w-full min-h-[44px] px-3 py-2 text-sm bg-[#F7F6F3] text-[#161514] border border-[#161514]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9A3412]"
                >
                  <option value="Barista Choice">
                    Barista Choice (Match to Flavors)
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
                    className="block text-xs font-semibold text-[#161514] mb-1.5"
                  >
                    Roast Profile
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
                    className="w-full min-h-[44px] px-3 py-2 text-sm bg-[#F7F6F3] text-[#161514] border border-[#161514]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9A3412]"
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
                    className="block text-xs font-semibold text-[#161514] mb-1.5"
                  >
                    Milk Alternative
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
                    className="w-full min-h-[44px] px-3 py-2 text-sm bg-[#F7F6F3] text-[#161514] border border-[#161514]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9A3412]"
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
                  className="block text-xs font-semibold text-[#161514] mb-1.5"
                >
                  Additional Notes (Optional)
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
                  placeholder="e.g., Low acidity, silky texture, afternoon drink"
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-[#F7F6F3] text-[#161514] placeholder:text-[#78716C] border border-[#161514]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9A3412]"
                />
              </div>
            </div>

            {craftError && (
              <div
                role="alert"
                className="mb-4 p-3.5 rounded-lg bg-[#FEF2F2] border border-[#DC2626]/20 text-xs text-[#991B1B]"
              >
                <p className="font-semibold">Unable to craft recommendation</p>
                <p className="mt-1">{craftError}</p>
              </div>
            )}

            <button
              type="button"
              onClick={onCraft}
              disabled={isCrafting}
              className="w-full min-h-[48px] px-5 py-3 text-sm font-semibold text-white bg-[#161514] rounded-lg hover:bg-[#2C2A28] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3412] focus-visible:ring-offset-2"
            >
              {isCrafting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Crafting your brew sheet...</span>
                </>
              ) : (
                <span>Craft Recommendation</span>
              )}
            </button>
          </div>

          {/* Right Column: Live Brew Sheet + Milo Barista Consultation */}
          <div className="lg:col-span-7 bg-white border border-[#161514]/10 rounded-xl p-6 md:p-8">
            {/* Brew Sheet Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#161514]/10">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E] mb-2">
                  <span>{recipe.brewRecipe.method}</span>
                  <span aria-hidden="true">·</span>
                  <span>{recipe.brewRecipe.servingTemp}</span>
                  <span aria-hidden="true">·</span>
                  <span>{recipe.roastProfile.level}</span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-[#161514] [text-wrap:balance]">
                  {recipe.title}
                </h3>
                <p className="mt-2 text-xs font-medium text-[#9A3412]">
                  {recipe.tastingNotes.join(" · ")}
                </p>
              </div>

              <button
                type="button"
                onClick={onSaveRecipe}
                className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3412] ${
                  isSaved
                    ? "bg-[#EFECE6] text-[#161514] border border-[#161514]/15"
                    : "bg-[#9A3412] text-white hover:bg-[#7C2D12]"
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#9A3412]" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save Recipe</span>
                  </>
                )}
              </button>
            </div>

            {/* Barista Note */}
            <div className="py-5 border-b border-[#161514]/10">
              <p className="text-xs font-semibold text-[#57534E] mb-1.5">
                Milo&apos;s Barista Note
              </p>
              <p className="text-[15px] leading-[1.65] text-[#161514]">
                {recipe.baristaNote}
              </p>
            </div>

            {/* Bean, Roast & Milk Architecture */}
            <div className="py-6 border-b border-[#161514]/10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-[#57534E] mb-1">Selected Bean</p>
                <p className="text-sm font-semibold text-[#161514]">
                  {recipe.bean.name}
                </p>
                <p className="mt-1 text-xs text-[#57534E]">
                  {recipe.bean.origin} · {recipe.bean.region}
                </p>
                <p className="mt-0.5 text-xs text-[#57534E]">
                  {recipe.bean.process} · {recipe.bean.elevation}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#57534E]">
                  {recipe.bean.whyItFits}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#57534E] mb-1">Roast Curve</p>
                <p className="text-sm font-semibold text-[#161514]">
                  {recipe.roastProfile.level}
                </p>
                <p className="mt-1 text-xs text-[#57534E]">
                  {recipe.roastProfile.developmentNote}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#57534E]">
                  {recipe.roastProfile.flavorImpact}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#57534E] mb-1">Milk &amp; Texture</p>
                <p className="text-sm font-semibold text-[#161514]">
                  {recipe.milkPairing.name}
                </p>
                <p className="mt-1 text-xs text-[#57534E]">
                  {recipe.milkPairing.textureStyle}
                  {recipe.milkPairing.steamTempC > 0 &&
                    ` · ${recipe.milkPairing.steamTempC}°C`}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#57534E]">
                  {recipe.milkPairing.whyItFits}
                </p>
              </div>
            </div>

            {/* Precision Brew Parameters */}
            <div className="py-6 border-b border-[#161514]/10">
              <p className="text-xs font-semibold text-[#57534E] mb-4">
                Extraction Parameters
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-[#F7F6F3] rounded-lg p-4">
                <div>
                  <span className="block text-xs text-[#57534E]">Dose</span>
                  <span className="font-mono text-base font-medium tabular-nums text-[#161514]">
                    {recipe.brewRecipe.doseGrams}g
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-[#57534E]">
                    Yield / Water
                  </span>
                  <span className="font-mono text-base font-medium tabular-nums text-[#161514]">
                    {recipe.brewRecipe.waterOrYieldMl}ml
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-[#57534E]">Ratio</span>
                  <span className="font-mono text-base font-medium tabular-nums text-[#161514]">
                    {recipe.brewRecipe.ratio}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-[#57534E]">
                    Water Temp
                  </span>
                  <span className="font-mono text-base font-medium tabular-nums text-[#161514]">
                    {recipe.brewRecipe.waterTempC}°C
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-[#57534E]">Grind</span>
                  <span className="font-mono text-sm font-medium text-[#161514]">
                    {recipe.brewRecipe.grindSetting}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-[#57534E]">
                    Target Time
                  </span>
                  <span className="font-mono text-base font-medium tabular-nums text-[#161514]">
                    {recipe.brewRecipe.brewTime}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                {recipe.brewRecipe.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <span className="font-mono text-xs font-medium tabular-nums text-[#9A3412] pt-0.5 shrink-0">
                      0{index + 1}.
                    </span>
                    <p className="text-[#161514] leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>

              <p className="mt-4 pt-4 border-t border-[#161514]/10 text-xs leading-relaxed text-[#57534E]">
                <span className="font-semibold text-[#161514]">Dial-In Tip:</span>{" "}
                {recipe.proTip}
              </p>
            </div>

            {/* Interactive Barista Chat (Milo) */}
            <div id="barista-chat" className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className="font-serif text-xl font-medium text-[#161514]">
                    Consult Milo
                  </h4>
                  <p className="text-xs text-[#57534E]">
                    Ask follow-up questions or tell Milo to modify this recipe
                    in real time.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {QUICK_PROMPTS.map((promptText) => (
                  <button
                    key={promptText}
                    type="button"
                    disabled={isChatting}
                    onClick={() => onSendChat(promptText)}
                    className="px-3 py-1.5 text-xs font-medium text-[#161514] bg-[#F7F6F3] hover:bg-[#EFECE6] border border-[#161514]/10 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50 cursor-pointer"
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
                          ? "bg-[#161514] text-white ml-8"
                          : "bg-[#F7F6F3] text-[#161514] mr-8"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`text-xs font-semibold ${
                            msg.role === "user"
                              ? "text-white/75"
                              : "text-[#9A3412]"
                          }`}
                        >
                          {msg.role === "user" ? "You" : "Milo · Head Barista"}
                        </span>
                        {msg.recipeUpdated && (
                          <span className="text-xs font-medium text-[#9A3412]">
                            Brew sheet updated
                          </span>
                        )}
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  ))}
                  {isChatting && (
                    <div className="p-3.5 rounded-lg bg-[#F7F6F3] text-sm text-[#57534E] mr-8 flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#9A3412]" />
                      <span>Milo is dialing in an answer...</span>
                    </div>
                  )}
                </div>
              )}

              {chatError && (
                <div
                  role="alert"
                  className="mb-3 p-3 rounded-lg bg-[#FEF2F2] border border-[#DC2626]/20 text-xs text-[#991B1B]"
                >
                  {chatError}
                </div>
              )}

              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={chatDraft}
                  onChange={(e) => setChatDraft(e.target.value)}
                  placeholder="Ask Milo to swap milk, go iced, or refine grind size..."
                  aria-label="Message Milo the barista"
                  className="flex-1 min-h-[44px] px-4 py-2 text-sm bg-[#F7F6F3] text-[#161514] placeholder:text-[#78716C] border border-[#161514]/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9A3412]"
                />
                <button
                  type="submit"
                  disabled={isChatting || !chatDraft.trim()}
                  className="min-h-[44px] px-4 py-2 text-sm font-semibold text-white bg-[#9A3412] rounded-lg hover:bg-[#7C2D12] disabled:opacity-50 transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3412]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
