import { FormEvent, useState } from "react";
import {
  Check,
  Copy,
  Download,
  GitBranch,
  Loader2,
  LogOut,
  ShieldCheck,
  Trash2,
  UserCheck,
} from "lucide-react";
import { JournalEntry, JournalUser } from "../types/coffee";
import { copyTextToClipboard, formatEmojiRecipeSummary } from "../utils/copyRecipe";

interface RecipeJournalSectionProps {
  currentUser: JournalUser | null;
  onSignIn: (identifier: string) => Promise<{ ok: boolean; error?: string }>;
  onSignOut: () => void;
  userEntries: JournalEntry[];
  onLoadEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  onDownloadRepoJson: () => void;
  githubRepoSlug: string;
  onChangeGithubRepoSlug: (val: string) => void;
  githubBranch: string;
  onChangeGithubBranch: (val: string) => void;
  githubToken: string;
  onChangeGithubToken: (val: string) => void;
  isSyncingGitHub: boolean;
  githubSyncStatus: { type: "success" | "error"; message: string; url?: string } | null;
  onSyncToGitHub: () => void;
}

export function RecipeJournalSection({
  currentUser,
  onSignIn,
  onSignOut,
  userEntries,
  onLoadEntry,
  onDeleteEntry,
  onDownloadRepoJson,
  githubRepoSlug,
  onChangeGithubRepoSlug,
  githubBranch,
  onChangeGithubBranch,
  githubToken,
  onChangeGithubToken,
  isSyncingGitHub,
  githubSyncStatus,
  onSyncToGitHub,
}: RecipeJournalSectionProps) {
  const [identifierDraft, setIdentifierDraft] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showGitHubSync, setShowGitHubSync] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSigningIn(true);
    const result = await onSignIn(identifierDraft);
    setIsSigningIn(false);
    if (!result.ok) {
      setAuthError(result.error || "Unable to sign in.");
    } else {
      setIdentifierDraft("");
    }
  };

  const handleCopyEntry = async (entry: JournalEntry) => {
    const summary = formatEmojiRecipeSummary(entry.recipe);
    await copyTextToClipboard(summary);
    setCopiedId(entry.id);
    window.setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="journal" className="py-14 border-b border-[#161514]/10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-medium text-[#9A3412] mb-2">
              02. Repository Recipe Journal
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#161514] [text-wrap:balance]">
              Your saved caffeine creations
            </h2>
          </div>
          <p className="text-sm text-[#57534E] max-w-md">
            Passwordless sign-in with just your username or email. Entries sync
            with the static repository JSON database with zero cloud database
            costs.
          </p>
        </div>

        {/* User Management + Repository Sync Bar */}
        <div className="bg-white border border-[#161514]/10 rounded-xl p-6 md:p-7">
          {!currentUser ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#161514]">
                  <ShieldCheck className="w-4 h-4 text-[#9A3412]" />
                  <span>Passwordless Journal Access</span>
                </div>
                <p className="mt-1.5 text-sm text-[#57534E] leading-relaxed">
                  Enter your username or email to unlock your personal recipe
                  journal. Your identifier is hashed locally with SHA-256 so raw
                  email addresses are never exposed in public repository files.
                </p>
              </div>

              <form
                onSubmit={handleLoginSubmit}
                className="lg:col-span-6 flex flex-col sm:flex-row gap-2.5"
              >
                <input
                  type="text"
                  value={identifierDraft}
                  onChange={(e) => setIdentifierDraft(e.target.value)}
                  placeholder="Username or email (e.g. alex@domain.com)"
                  aria-label="Username or email"
                  autoComplete="username"
                  className="flex-1 min-h-[44px] px-4 py-2 text-sm bg-[#F7F6F3] text-[#161514] placeholder:text-[#78716C] border border-[#161514]/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9A3412]"
                />
                <button
                  type="submit"
                  disabled={isSigningIn}
                  className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-[#161514] rounded-lg hover:bg-[#2C2A28] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3412]"
                >
                  {isSigningIn ? "Signing in..." : "Open Journal"}
                </button>
              </form>
              {authError && (
                <p
                  role="alert"
                  className="lg:col-span-12 text-xs font-medium text-[#991B1B]"
                >
                  {authError}
                </p>
              )}
            </div>
          ) : (
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#161514]/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F7F6F3] border border-[#161514]/10 flex items-center justify-center text-[#9A3412] shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#161514]">
                      Signed in as {currentUser.displayHandle}
                    </p>
                    <p className="text-xs text-[#57534E]">
                      {userEntries.length}{" "}
                      {userEntries.length === 1 ? "recipe" : "recipes"} in
                      journal · Static JSON key{" "}
                      <span className="font-mono">{currentUser.userKey.slice(0, 8)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={onDownloadRepoJson}
                    className="min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold text-[#161514] bg-[#F7F6F3] hover:bg-[#EFECE6] border border-[#161514]/10 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Repo JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowGitHubSync((prev) => !prev)}
                    aria-expanded={showGitHubSync}
                    className="min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold text-[#161514] bg-[#F7F6F3] hover:bg-[#EFECE6] border border-[#161514]/10 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <GitBranch className="w-3.5 h-3.5 text-[#9A3412]" />
                    <span>GitHub Repo Sync</span>
                  </button>

                  <button
                    type="button"
                    onClick={onSignOut}
                    className="min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold text-[#57534E] hover:text-[#161514] hover:bg-[#F7F6F3] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              {showGitHubSync && (
                <div className="mt-5 p-5 rounded-xl bg-[#F7F6F3] border border-[#161514]/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-[#161514]">
                        Direct GitHub Repository Database Sync
                      </h3>
                      <p className="text-xs text-[#57534E] mt-0.5">
                        Commits updated{" "}
                        <span className="font-mono">
                          public/data/recipe-journal.json
                        </span>{" "}
                        directly to your repo from GitHub Pages. Your token stays
                        in memory only and is cleared on sign out or refresh.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-4">
                    <div className="md:col-span-4">
                      <label
                        htmlFor="gh-repo-slug"
                        className="block text-xs font-semibold text-[#161514] mb-1"
                      >
                        Repository (owner/name)
                      </label>
                      <input
                        id="gh-repo-slug"
                        type="text"
                        value={githubRepoSlug}
                        onChange={(e) => onChangeGithubRepoSlug(e.target.value)}
                        placeholder="username/coffee-studio"
                        className="w-full min-h-[40px] px-3 py-2 text-xs bg-white text-[#161514] border border-[#161514]/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9A3412]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor="gh-branch"
                        className="block text-xs font-semibold text-[#161514] mb-1"
                      >
                        Branch
                      </label>
                      <input
                        id="gh-branch"
                        type="text"
                        value={githubBranch}
                        onChange={(e) => onChangeGithubBranch(e.target.value)}
                        placeholder="main"
                        className="w-full min-h-[40px] px-3 py-2 text-xs bg-white text-[#161514] border border-[#161514]/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9A3412]"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label
                        htmlFor="gh-pat"
                        className="block text-xs font-semibold text-[#161514] mb-1"
                      >
                        Fine-Grained PAT (Contents: Read &amp; Write)
                      </label>
                      <input
                        id="gh-pat"
                        type="password"
                        value={githubToken}
                        onChange={(e) => onChangeGithubToken(e.target.value)}
                        placeholder="github_pat_..."
                        autoComplete="off"
                        className="w-full min-h-[40px] px-3 py-2 text-xs bg-white text-[#161514] border border-[#161514]/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9A3412]"
                      />
                    </div>
                    <div className="md:col-span-2 flex items-end">
                      <button
                        type="button"
                        disabled={isSyncingGitHub}
                        onClick={onSyncToGitHub}
                        className="w-full min-h-[40px] px-3.5 py-2 text-xs font-semibold text-white bg-[#9A3412] rounded-lg hover:bg-[#7C2D12] disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                      >
                        {isSyncingGitHub ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Syncing...</span>
                          </>
                        ) : (
                          <span>Commit JSON</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {githubSyncStatus && (
                    <div
                      role="status"
                      className={`mt-3 text-xs font-medium ${
                        githubSyncStatus.type === "error"
                          ? "text-[#991B1B]"
                          : "text-[#166534]"
                      }`}
                    >
                      <span>{githubSyncStatus.message}</span>
                      {githubSyncStatus.url && (
                        <>
                          {" "}
                          <a
                            href={githubSyncStatus.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline font-semibold"
                          >
                            View commit
                          </a>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Entries List */}
              <div className="mt-6">
                {userEntries.length === 0 ? (
                  <div className="py-10 text-center bg-[#F7F6F3] rounded-xl border border-[#161514]/8 px-6">
                    <p className="text-sm font-semibold text-[#161514]">
                      No saved creations yet for {currentUser.displayHandle}
                    </p>
                    <p className="mt-1 text-xs text-[#57534E] max-w-md mx-auto leading-relaxed">
                      Craft any custom coffee recipe in the studio above and
                      click Save to Journal. Your creations will be waiting here
                      whenever you log back in.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {userEntries.map((entry) => (
                      <article
                        key={entry.id}
                        className="bg-[#F7F6F3] border border-[#161514]/10 rounded-xl p-5 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs text-[#57534E]">
                              {new Date(entry.savedAt).toLocaleDateString(
                                undefined,
                                { month: "short", day: "numeric", year: "numeric" }
                              )}{" "}
                              · {entry.recipe.brewRecipe.method} ·{" "}
                              {entry.recipe.brewRecipe.servingTemp}
                            </p>
                            <button
                              type="button"
                              onClick={() => onDeleteEntry(entry.id)}
                              aria-label={`Remove ${entry.recipe.title}`}
                              className="w-8 h-8 rounded-lg text-[#57534E] hover:text-[#991B1B] hover:bg-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <h3 className="mt-2 font-serif text-lg font-medium text-[#161514]">
                            {entry.recipe.title}
                          </h3>
                          <p className="mt-1 text-xs font-medium text-[#9A3412]">
                            {entry.recipe.tastingNotes.join(" · ")}
                          </p>
                          <p className="mt-2.5 text-xs text-[#57534E] leading-relaxed">
                            {entry.recipe.bean.name} ({entry.recipe.roastProfile.level}) ·{" "}
                            {entry.recipe.milkPairing.name}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#161514]/10 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyEntry(entry)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#161514] bg-white border border-[#161514]/10 hover:bg-[#EFECE6] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                          >
                            {copiedId === entry.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#9A3412]" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => onLoadEntry(entry)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#161514] hover:bg-[#2C2A28] transition-colors whitespace-nowrap cursor-pointer"
                          >
                            Load into Studio
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
