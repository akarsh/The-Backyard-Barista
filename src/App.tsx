import { useEffect, useMemo, useRef, useState } from "react";
import { CraftingStudio } from "./components/CraftingStudio";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { OriginShowcase } from "./components/OriginShowcase";
import { RecipeJournalSection } from "./components/RecipeJournalSection";
import { SavedBrewsDrawer } from "./components/SavedBrewsDrawer";
import {
  HERO_IMAGE_URL,
  INITIAL_RECIPE,
  MILK_FEATURE_IMAGE_URL,
} from "./data/pantry";
import {
  ChatMessage,
  CraftPreferences,
  CraftedRecipe,
  JournalEntry,
  JournalUser,
  OriginLot,
} from "./types/coffee";
import {
  buildRepoJournalPayload,
  fetchStaticRepoJournal,
  mergeJournalEntries,
  syncJournalToGitHubRepo,
} from "./utils/githubJournal";
import {
  deriveUserKey,
  maskDisplayHandle,
  safeJsonParse,
  sanitizeRepoJournalFile,
  validateIdentifier,
} from "./utils/security";
import { chatStaticBarista, craftStaticRecipe } from "./utils/staticBarista";

const USER_STORAGE_KEY = "sable_origin_journal_user_v1";
const LOCAL_JOURNAL_STORAGE_KEY = "sable_origin_local_journal_v1";

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

  const [visualData, setVisualData] = useState<{
    imageUrl: string;
    vesselDescription: string;
  } | null>(null);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [visualizeError, setVisualizeError] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Passwordless user management (hashed identifier, zero raw PII persisted in repo JSON)
  const [currentUser, setCurrentUser] = useState<JournalUser | null>(() => {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      if (!raw) return null;
      const parsed = safeJsonParse<JournalUser>(raw);
      return parsed?.userKey && parsed?.displayHandle ? parsed : null;
    } catch {
      return null;
    }
  });

  // Repository JSON database entries + local browser entries
  const [repoEntries, setRepoEntries] = useState<JournalEntry[]>([]);
  const [localEntries, setLocalEntries] = useState<JournalEntry[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_JOURNAL_STORAGE_KEY);
      if (!raw) return [];
      const parsed = safeJsonParse<unknown>(raw);
      return sanitizeRepoJournalFile({ version: 1, entries: parsed }).entries;
    } catch {
      return [];
    }
  });

  // Optional GitHub repo sync (PAT stays strictly in memory, never persisted)
  const [githubRepoSlug, setGithubRepoSlug] = useState("");
  const [githubBranch, setGithubBranch] = useState("main");
  const [githubToken, setGithubToken] = useState("");
  const [isSyncingGitHub, setIsSyncingGitHub] = useState(false);
  const [githubSyncStatus, setGithubSyncStatus] = useState<{
    type: "success" | "error";
    message: string;
    url?: string;
  } | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const chatInputRef = useRef<HTMLInputElement | null>(null);

  // Load static repository JSON database on mount (works on github.io & Express)
  useEffect(() => {
    fetchStaticRepoJournal().then((file) => {
      setRepoEntries(file.entries);
    });
  }, []);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_JOURNAL_STORAGE_KEY,
        JSON.stringify(localEntries)
      );
    } catch {
      // Ignore storage errors
    }
  }, [localEntries]);

  const activeUserKey = currentUser?.userKey ?? "guest-local";

  const allMergedEntries = useMemo(
    () => mergeJournalEntries(repoEntries, localEntries),
    [repoEntries, localEntries]
  );

  const userEntries = useMemo(
    () => allMergedEntries.filter((e) => e.userKey === activeUserKey),
    [allMergedEntries, activeUserKey]
  );

  const isCurrentRecipeSaved = userEntries.some(
    (entry) =>
      entry.recipe.title === recipe.title &&
      entry.recipe.brewRecipe.method === recipe.brewRecipe.method &&
      entry.recipe.milkPairing.name === recipe.milkPairing.name
  );

  const parseApiJson = async (response: Response) => {
    const raw = await response.text();
    try {
      return JSON.parse(raw);
    } catch {
      if (!response.ok) {
        throw new Error(
          `Service returned status ${response.status}. Please try again in a moment.`
        );
      }
      throw new Error("Received an unexpected response format from the server.");
    }
  };

  const runCraftRequest = async (prefs: CraftPreferences) => {
    setIsCrafting(true);
    setCraftError(null);
    setVisualData(null);
    setVisualizeError(null);
    try {
      const response = await fetch("/api/barista/craft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });

      // Static hosting fallback (GitHub Pages / github.io where no Node API exists)
      if (response.status === 404 || response.status === 405) {
        const staticRecipe = craftStaticRecipe(prefs);
        setRecipe(staticRecipe);
        setChatMessages([
          {
            id: `milo-${Date.now()}`,
            role: "model",
            text: `Just dialed in "${staticRecipe.title}" for you. Want me to adjust the milk, switch it over ice, or tweak the grind?`,
          },
        ]);
        return;
      }

      const data = await parseApiJson(response);
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
      // Network failure on pure static hosts falls back cleanly
      if (err instanceof TypeError) {
        const staticRecipe = craftStaticRecipe(prefs);
        setRecipe(staticRecipe);
        return;
      }
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

      if (response.status === 404 || response.status === 405) {
        const staticReply = chatStaticBarista(messageText, recipe);
        if (staticReply.shouldUpdateRecipe && staticReply.updatedRecipe) {
          setRecipe(staticReply.updatedRecipe);
          setVisualData(null);
        }
        setChatMessages((prev) => [
          ...prev,
          {
            id: `model-${Date.now()}`,
            role: "model",
            text: staticReply.reply,
            recipeUpdated: staticReply.shouldUpdateRecipe,
          },
        ]);
        return;
      }

      const data = await parseApiJson(response);
      if (!response.ok) {
        throw new Error(data.error || "Barista could not respond right now.");
      }

      if (data.shouldUpdateRecipe && data.updatedRecipe) {
        setRecipe(data.updatedRecipe);
        setVisualData(null);
      }

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        text: data.reply || "Here is how I would dial that in for your cup.",
        recipeUpdated: Boolean(data.shouldUpdateRecipe && data.updatedRecipe),
      };
      setChatMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      if (err instanceof TypeError) {
        const staticReply = chatStaticBarista(messageText, recipe);
        if (staticReply.shouldUpdateRecipe && staticReply.updatedRecipe) {
          setRecipe(staticReply.updatedRecipe);
        }
        setChatMessages((prev) => [
          ...prev,
          {
            id: `model-${Date.now()}`,
            role: "model",
            text: staticReply.reply,
            recipeUpdated: staticReply.shouldUpdateRecipe,
          },
        ]);
        return;
      }
      setChatError(
        err instanceof Error ? err.message : "Failed to send message to barista."
      );
    } finally {
      setIsChatting(false);
    }
  };

  const handleVisualizeBrew = async () => {
    setIsVisualizing(true);
    setVisualizeError(null);
    try {
      const response = await fetch("/api/barista/visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe }),
      });

      if (response.status === 404 || response.status === 405) {
        const hasMilk =
          !recipe.milkPairing.name.toLowerCase().includes("black") &&
          !recipe.milkPairing.name.toLowerCase().includes("no milk");
        setVisualData({
          imageUrl: hasMilk ? MILK_FEATURE_IMAGE_URL : HERO_IMAGE_URL,
          vesselDescription: hasMilk
            ? "speckled stoneware cup"
            : "glass pour-over server",
        });
        return;
      }

      const data = await parseApiJson(response);
      if (!response.ok) {
        throw new Error(data.error || "Could not visualize this brew.");
      }
      if (data.imageDataUrl) {
        setVisualData({
          imageUrl: data.imageDataUrl,
          vesselDescription: data.vesselDescription || "specialty vessel",
        });
      }
    } catch (err) {
      setVisualizeError(
        err instanceof Error
          ? err.message
          : "Unable to render a visual preview for this brew right now."
      );
    } finally {
      setIsVisualizing(false);
    }
  };

  const handleSignIn = async (
    rawIdentifier: string
  ): Promise<{ ok: boolean; error?: string }> => {
    const check = validateIdentifier(rawIdentifier);
    if (!check.valid) {
      return { ok: false, error: check.error };
    }
    const userKey = await deriveUserKey(check.normalized);
    const displayHandle = maskDisplayHandle(check.normalized);
    setCurrentUser({
      userKey,
      displayHandle,
      signedInAt: new Date().toISOString(),
    });
    // Refresh static repo JSON so newly merged entries appear immediately
    const freshRepo = await fetchStaticRepoJournal();
    setRepoEntries(freshRepo.entries);
    return { ok: true };
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setGithubToken(""); // Wipe PAT from memory immediately
    setGithubSyncStatus(null);
  };

  const syncEntriesToRepoIfConfigured = async (nextLocalEntries: JournalEntry[]) => {
    if (!githubRepoSlug.trim() || !githubToken.trim()) return;
    setIsSyncingGitHub(true);
    setGithubSyncStatus(null);
    try {
      const merged = mergeJournalEntries(repoEntries, nextLocalEntries);
      const payload = buildRepoJournalPayload(merged);
      const result = await syncJournalToGitHubRepo({
        repoSlug: githubRepoSlug,
        branch: githubBranch,
        token: githubToken,
        journalFile: payload,
      });
      setRepoEntries(payload.entries);
      setGithubSyncStatus({
        type: "success",
        message: "Committed updated recipe-journal.json to GitHub.",
        url: result.commitUrl,
      });
    } catch (err) {
      setGithubSyncStatus({
        type: "error",
        message:
          err instanceof Error ? err.message : "Failed to sync with GitHub.",
      });
    } finally {
      setIsSyncingGitHub(false);
    }
  };

  const handleSaveToJournal = () => {
    if (isCurrentRecipeSaved) {
      const matchingIds = new Set(
        userEntries
          .filter(
            (b) =>
              b.recipe.title === recipe.title &&
              b.recipe.brewRecipe.method === recipe.brewRecipe.method &&
              b.recipe.milkPairing.name === recipe.milkPairing.name
          )
          .map((b) => b.id)
      );
      const nextLocal = localEntries.filter((e) => !matchingIds.has(e.id));
      setLocalEntries(nextLocal);
      return;
    }

    const entry: JournalEntry = {
      id: `brew-${Date.now()}`,
      userKey: activeUserKey,
      displayHandle: currentUser?.displayHandle ?? "@guest",
      savedAt: new Date().toISOString(),
      recipe,
    };
    const nextLocal = [entry, ...localEntries];
    setLocalEntries(nextLocal);
    void syncEntriesToRepoIfConfigured(nextLocal);
  };

  const handleDeleteEntry = (id: string) => {
    const nextLocal = localEntries.filter((e) => e.id !== id);
    const nextRepo = repoEntries.filter((e) => e.id !== id);
    setLocalEntries(nextLocal);
    setRepoEntries(nextRepo);
  };

  const handleDownloadRepoJson = () => {
    const payload = buildRepoJournalPayload(allMergedEntries);
    const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recipe-journal.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleManualSyncToGitHub = () => {
    void syncEntriesToRepoIfConfigured(localEntries);
  };

  const scrollToStudio = () => {
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToJournal = () => {
    document.getElementById("journal")?.scrollIntoView({ behavior: "smooth" });
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
        savedCount={userEntries.length}
        currentUser={currentUser}
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
          onSaveRecipe={handleSaveToJournal}
          visualData={visualData}
          isVisualizing={isVisualizing}
          visualizeError={visualizeError}
          onVisualizeBrew={handleVisualizeBrew}
          onClearVisual={() => setVisualData(null)}
          chatMessages={chatMessages}
          isChatting={isChatting}
          chatError={chatError}
          onSendChat={handleSendChat}
          chatInputRef={chatInputRef}
        />

        <RecipeJournalSection
          currentUser={currentUser}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          userEntries={userEntries}
          onLoadEntry={(entry) => {
            setRecipe(entry.recipe);
            setVisualData(null);
            scrollToStudio();
          }}
          onDeleteEntry={handleDeleteEntry}
          onDownloadRepoJson={handleDownloadRepoJson}
          githubRepoSlug={githubRepoSlug}
          onChangeGithubRepoSlug={setGithubRepoSlug}
          githubBranch={githubBranch}
          onChangeGithubBranch={setGithubBranch}
          githubToken={githubToken}
          onChangeGithubToken={setGithubToken}
          isSyncingGitHub={isSyncingGitHub}
          githubSyncStatus={githubSyncStatus}
          onSyncToGitHub={handleManualSyncToGitHub}
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
            <a
              href="#journal"
              className="hover:text-[#161514] transition-colors"
            >
              Recipe Journal
            </a>
            <a
              href="#origins"
              className="hover:text-[#161514] transition-colors"
            >
              Single Origins
            </a>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="hover:text-[#161514] transition-colors cursor-pointer"
            >
              Quick Drawer
            </button>
          </div>
        </div>
      </footer>

      <SavedBrewsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentUser={currentUser}
        entries={userEntries}
        onLoadEntry={(entry) => {
          setRecipe(entry.recipe);
          setVisualData(null);
          scrollToStudio();
        }}
        onDeleteEntry={handleDeleteEntry}
        onGoToSignIn={scrollToJournal}
      />
    </div>
  );
}
