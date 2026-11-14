import { useEffect, useRef, useState } from "react";
import { CraftingStudio } from "./components/CraftingStudio";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { OriginShowcase } from "./components/OriginShowcase";
import { SavedBrewsDrawer } from "./components/SavedBrewsDrawer";
import { INITIAL_RECIPE } from "./data/pantry";
import {
  ChatMessage,
  CraftPreferences,
  CraftedRecipe,
  OriginLot,
  SavedBrew,
} from "./types/coffee";

const STORAGE_KEY = "sable_origin_saved_brews_v1";

const DEFAULT_PREFERENCES: CraftPreferences = {
  flavors: ["Sweet", "Chocolaty"],
  brewMethod: "Flat White",
  servingTemp: "Hot",
  bodyPreference: "Balanced",
  selectedOrigin: "Barista Choice",
  selectedRoast: "Barista Choice",
  selectedMilk: "Barista Oat",
  customNote: "",
};

export default function App() {
  const [preferences, setPreferences] =
    useState<CraftPreferences>(DEFAULT_PREFERENCES);
  const [recipe, setRecipe] = useState<CraftedRecipe>(INITIAL_RECIPE);
  const [isCrafting, setIsCrafting] = useState(false);
  const [craftError, setCraftError] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const [savedBrews, setSavedBrews] = useState<SavedBrew[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedBrew[]) : [];
    } catch {
      return [];
    }
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const chatInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBrews));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedBrews]);

  const isCurrentRecipeSaved = savedBrews.some(
    (b) =>
      b.recipe.title === recipe.title &&
      b.recipe.brewRecipe.method === recipe.brewRecipe.method &&
      b.recipe.milkPairing.name === recipe.milkPairing.name
  );

  const runCraftRequest = async (prefs: CraftPreferences) => {
    setIsCrafting(true);
    setCraftError(null);
    try {
      const response = await fetch("/api/barista/craft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error || "Could not generate coffee recommendation."
        );
      }
      if (data.recipe) {
        setRecipe(data.recipe);
        setChatMessages([
          {
            id: `milo-${Date.now()}`,
            role: "model",
            text: `Just dialed in "${data.recipe.title}" for you. Want me to adjust the milk, switch it over ice, or tweak the grind for your home setup?`,
          },
        ]);
      }
    } catch (err) {
      setCraftError(
        err instanceof Error
          ? err.message
          : "Something went wrong reaching the barista."
      );
    } finally {
      setIsCrafting(false);
    }
  };

  const handleSendChat = async (messageText: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: messageText,
    };
    const nextHistory = [...chatMessages, userMsg];
    setChatMessages(nextHistory);
    setIsChatting(true);
    setChatError(null);

    try {
      const response = await fetch("/api/barista/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({ role: m.role, text: m.text })),
          currentRecipe: recipe,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Barista could not respond right now.");
      }

      if (data.shouldUpdateRecipe && data.updatedRecipe) {
        setRecipe(data.updatedRecipe);
      }

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        text: data.reply || "Here is how I would dial that in for your cup.",
        recipeUpdated: Boolean(data.shouldUpdateRecipe && data.updatedRecipe),
      };
      setChatMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      setChatError(
        err instanceof Error ? err.message : "Failed to send message to barista."
      );
    } finally {
      setIsChatting(false);
    }
  };

  const handleSaveRecipe = () => {
    if (isCurrentRecipeSaved) {
      setSavedBrews((prev) =>
        prev.filter(
          (b) =>
            !(
              b.recipe.title === recipe.title &&
              b.recipe.brewRecipe.method === recipe.brewRecipe.method &&
              b.recipe.milkPairing.name === recipe.milkPairing.name
            )
        )
      );
      return;
    }

    const entry: SavedBrew = {
      id: `brew-${Date.now()}`,
      savedAt: new Date().toISOString(),
      recipe,
    };
    setSavedBrews((prev) => [entry, ...prev]);
  };

  const scrollToStudio = () => {
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
  };

  const focusBaristaChat = () => {
    document
      .getElementById("barista-chat")
      ?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => chatInputRef.current?.focus(), 350);
  };

  const handleSelectOriginLot = (lot: OriginLot) => {
    const nextPrefs: CraftPreferences = {
      ...preferences,
      flavors: lot.flavors,
      brewMethod: lot.defaultMethod,
      selectedOrigin: `${lot.origin} — ${lot.name}`,
      selectedRoast: lot.recommendedRoast,
      selectedMilk: lot.recommendedMilk,
    };
    setPreferences(nextPrefs);
    scrollToStudio();
    runCraftRequest(nextPrefs);
  };

  const handleSelectRoast = (roastId: string) => {
    const nextPrefs: CraftPreferences = {
      ...preferences,
      selectedRoast: roastId,
    };
    setPreferences(nextPrefs);
    scrollToStudio();
    runCraftRequest(nextPrefs);
  };

  const handleSelectMilk = (milkId: string) => {
    const nextPrefs: CraftPreferences = {
      ...preferences,
      selectedMilk: milkId,
    };
    setPreferences(nextPrefs);
    scrollToStudio();
    runCraftRequest(nextPrefs);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F3] text-[#161514]">
      <Header
        savedCount={savedBrews.length}
        onOpenSaved={() => setIsDrawerOpen(true)}
      />

      <main className="flex-1">
        <HeroSection
          onStartCrafting={scrollToStudio}
          onFocusBarista={focusBaristaChat}
        />

        <CraftingStudio
          preferences={preferences}
          onChangePreferences={setPreferences}
          onResetPreferences={() => setPreferences(DEFAULT_PREFERENCES)}
          recipe={recipe}
          isCrafting={isCrafting}
          craftError={craftError}
          onCraft={() => runCraftRequest(preferences)}
          isSaved={isCurrentRecipeSaved}
          onSaveRecipe={handleSaveRecipe}
          chatMessages={chatMessages}
          isChatting={isChatting}
          chatError={chatError}
          onSendChat={handleSendChat}
          chatInputRef={chatInputRef}
        />

        <OriginShowcase
          onSelectOriginLot={handleSelectOriginLot}
          onSelectRoast={handleSelectRoast}
          onSelectMilk={handleSelectMilk}
        />
      </main>

      <footer className="border-t border-[#161514]/10 py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#57534E]">
          <span>Sable &amp; Origin · Specialty Coffee Crafting Studio</span>
          <div className="flex items-center gap-6">
            <a href="#studio" className="hover:text-[#161514] transition-colors">
              Studio
            </a>
            <a href="#origins" className="hover:text-[#161514] transition-colors">
              Single Origins
            </a>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="hover:text-[#161514] transition-colors cursor-pointer"
            >
              Saved Brews
            </button>
          </div>
        </div>
      </footer>

      <SavedBrewsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        savedBrews={savedBrews}
        onLoadBrew={(brew) => {
          setRecipe(brew.recipe);
          scrollToStudio();
        }}
        onDeleteBrew={(id) =>
          setSavedBrews((prev) => prev.filter((item) => item.id !== id))
        }
      />
    </div>
  );
}
