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
import { AppTranslations } from "../i18n/translations";
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
  t: AppTranslations;
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
  t,
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
    <section
      id="journal"
      className="py-10 sm:py-14 border-b border-[#191614]/10 dark:border-white/10 scroll-mt-16 md:scroll-mt-24"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <p className="text-xs font-medium text-[#A62C1B] dark:text-[#F59E0B] mb-2">
              {t.journal.eyebrow}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#191614] dark:text-[#F5F0E6] [text-wrap:balance]">
              {t.journal.title}
            </h2>
          </div>
          <p className="text-sm text-[#5C534A] dark:text-[#B8AFA4] max-w-md">
            {t.journal.subtitle}
          </p>
        </div>

        {/* User Management + Repository Sync Bar */}
        <div className="bg-white dark:bg-[#1C1917] border border-[#191614]/10 dark:border-white/10 rounded-xl p-5 sm:p-6 lg:p-7">
          {!currentUser ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
              <div className="lg:col-span-6 min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#191614] dark:text-[#F5F0E6]">
                  <ShieldCheck className="w-4 h-4 text-[#A62C1B] dark:text-[#F59E0B] shrink-0" />
                  <span>{t.journal.accessTitle}</span>
                </div>
                <p className="mt-1.5 text-sm text-[#5C534A] dark:text-[#B8AFA4] leading-relaxed">
                  {t.journal.accessDesc}
                </p>
              </div>

              <form
                onSubmit={handleLoginSubmit}
                className="lg:col-span-6 flex flex-col sm:flex-row gap-2.5 min-w-0"
              >
                <input
                  type="text"
                  value={identifierDraft}
                  onChange={(e) => setIdentifierDraft(e.target.value)}
                  placeholder={t.journal.inputPlaceholder}
                  aria-label="Username or email"
                  autoComplete="username"
                  className="flex-1 min-w-0 min-h-[44px] px-3.5 sm:px-4 py-2 text-base sm:text-sm bg-[#F8F5EE] dark:bg-[#26221E] text-[#191614] dark:text-[#F5F0E6] placeholder:text-[#78716C] dark:placeholder:text-[#8E857B] border border-[#191614]/15 dark:border-white/12 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A62C1B] dark:focus:ring-[#F59E0B]"
                />
                <button
                  type="submit"
                  disabled={isSigningIn}
                  className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-[#191614] dark:bg-[#DC4A33] rounded-lg hover:bg-[#2F2A26] dark:hover:bg-[#C23B26] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B]"
                >
                  {isSigningIn ? t.journal.signingIn : t.journal.openJournalBtn}
                </button>
              </form>
              {authError && (
                <p
                  role="alert"
                  className="lg:col-span-12 text-xs font-medium text-[#991B1B] dark:text-[#FCA5A5]"
                >
                  {authError}
                </p>
              )}
            </div>
          ) : (
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#191614]/10 dark:border-white/10">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#F8F5EE] dark:bg-[#26221E] border border-[#191614]/10 dark:border-white/10 flex items-center justify-center text-[#A62C1B] dark:text-[#F59E0B] shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#191614] dark:text-[#F5F0E6] truncate">
                      {t.journal.signedInAs} {currentUser.displayHandle}
                    </p>
                    <p className="text-xs text-[#5C534A] dark:text-[#B8AFA4]">
                      {userEntries.length}{" "}
                      {userEntries.length === 1
                        ? t.journal.recipeSingular
                        : t.journal.recipePlural}{" "}
                      {t.journal.inJournalKey}{" "}
                      <span className="font-mono">
                        {currentUser.userKey.slice(0, 8)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2">
                  <button
                    type="button"
                    onClick={onDownloadRepoJson}
                    className="min-h-[44px] sm:min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold text-[#191614] dark:text-[#F5F0E6] bg-[#F8F5EE] dark:bg-[#26221E] hover:bg-[#EFE9DC] dark:hover:bg-[#312B25] border border-[#191614]/10 dark:border-white/10 transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.journal.exportJson}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowGitHubSync((prev) => !prev)}
                    aria-expanded={showGitHubSync}
                    className="min-h-[44px] sm:min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold text-[#191614] dark:text-[#F5F0E6] bg-[#F8F5EE] dark:bg-[#26221E] hover:bg-[#EFE9DC] dark:hover:bg-[#312B25] border border-[#191614]/10 dark:border-white/10 transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <GitBranch className="w-3.5 h-3.5 text-[#A62C1B] dark:text-[#F59E0B] shrink-0" />
                    <span>{t.journal.githubSyncBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onSignOut}
                    className="col-span-2 sm:col-span-1 min-h-[44px] sm:min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold text-[#5C534A] dark:text-[#B8AFA4] hover:text-[#191614] dark:hover:text-[#F5F0E6] hover:bg-[#F8F5EE] dark:hover:bg-[#26221E] transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.journal.signOut}</span>
                  </button>
                </div>
              </div>

              {showGitHubSync && (
                <div className="mt-5 p-5 rounded-xl bg-[#F8F5EE] dark:bg-[#26221E] border border-[#191614]/10 dark:border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-[#191614] dark:text-[#F5F0E6]">
                        {t.journal.syncTitle}
                      </h3>
                      <p className="text-xs text-[#5C534A] dark:text-[#B8AFA4] mt-0.5">
                        {t.journal.syncDescPrefix}{" "}
                        <span className="font-mono">
                          public/data/recipe-journal.json
                        </span>{" "}
                        {t.journal.syncDescSuffix}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-4">
                    <div className="md:col-span-4">
                      <label
                        htmlFor="gh-repo-slug"
                        className="block text-xs font-semibold text-[#191614] dark:text-[#F5F0E6] mb-1"
                      >
                        {t.journal.repoLabel}
                      </label>
                      <input
                        id="gh-repo-slug"
                        type="text"
                        value={githubRepoSlug}
                        onChange={(e) => onChangeGithubRepoSlug(e.target.value)}
                        placeholder="username/coffee-studio"
                        className="w-full min-h-[44px] sm:min-h-[40px] px-3 py-2 text-base sm:text-xs bg-white dark:bg-[#1C1917] text-[#191614] dark:text-[#F5F0E6] placeholder:text-[#78716C] dark:placeholder:text-[#8E857B] border border-[#191614]/15 dark:border-white/12 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A62C1B] dark:focus:ring-[#F59E0B]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor="gh-branch"
                        className="block text-xs font-semibold text-[#191614] dark:text-[#F5F0E6] mb-1"
                      >
                        {t.journal.branchLabel}
                      </label>
                      <input
                        id="gh-branch"
                        type="text"
                        value={githubBranch}
                        onChange={(e) => onChangeGithubBranch(e.target.value)}
                        placeholder="main"
                        className="w-full min-h-[44px] sm:min-h-[40px] px-3 py-2 text-base sm:text-xs bg-white dark:bg-[#1C1917] text-[#191614] dark:text-[#F5F0E6] border border-[#191614]/15 dark:border-white/12 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A62C1B] dark:focus:ring-[#F59E0B]"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label
                        htmlFor="gh-pat"
                        className="block text-xs font-semibold text-[#191614] dark:text-[#F5F0E6] mb-1"
                      >
                        {t.journal.patLabel}
                      </label>
                      <input
                        id="gh-pat"
                        type="password"
                        value={githubToken}
                        onChange={(e) => onChangeGithubToken(e.target.value)}
                        placeholder="github_pat_..."
                        autoComplete="off"
                        className="w-full min-h-[44px] sm:min-h-[40px] px-3 py-2 text-base sm:text-xs bg-white dark:bg-[#1C1917] text-[#191614] dark:text-[#F5F0E6] placeholder:text-[#78716C] dark:placeholder:text-[#8E857B] border border-[#191614]/15 dark:border-white/12 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A62C1B] dark:focus:ring-[#F59E0B]"
                      />
                    </div>
                    <div className="md:col-span-2 flex items-end">
                      <button
                        type="button"
                        disabled={isSyncingGitHub}
                        onClick={onSyncToGitHub}
                        className="w-full min-h-[44px] sm:min-h-[40px] px-3.5 py-2 text-xs font-semibold text-white bg-[#A62C1B] dark:bg-[#DC4A33] rounded-lg hover:bg-[#882214] dark:hover:bg-[#C23B26] disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                      >
                        {isSyncingGitHub ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>{t.journal.syncing}</span>
                          </>
                        ) : (
                          <span>{t.journal.commitJson}</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {githubSyncStatus && (
                    <div
                      role="status"
                      className={`mt-3 text-xs font-medium ${
                        githubSyncStatus.type === "error"
                          ? "text-[#991B1B] dark:text-[#FCA5A5]"
                          : "text-[#166534] dark:text-[#86EFAC]"
                      }`}
                    >
                      <span>{githubSyncStatus.message}</span>
                      {githubSyncStatus.url &&
                        githubSyncStatus.url.startsWith("https://") && (
                          <>
                            {" "}
                            <a
                              href={githubSyncStatus.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline font-semibold"
                            >
                              {t.journal.viewCommit}
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
                  <div className="py-10 text-center bg-[#F8F5EE] dark:bg-[#26221E] rounded-xl border border-[#191614]/8 dark:border-white/10 px-6">
                    <p className="text-sm font-semibold text-[#191614] dark:text-[#F5F0E6]">
                      {t.journal.emptyTitlePrefix} {currentUser.displayHandle}
                    </p>
                    <p className="mt-1 text-xs text-[#5C534A] dark:text-[#B8AFA4] max-w-md mx-auto leading-relaxed">
                      {t.journal.emptyDesc}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {userEntries.map((entry) => (
                      <article
                        key={entry.id}
                        className="bg-[#F8F5EE] dark:bg-[#26221E] border border-[#191614]/10 dark:border-white/10 rounded-xl p-5 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs text-[#5C534A] dark:text-[#B8AFA4]">
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
                              className="w-8 h-8 rounded-lg text-[#5C534A] dark:text-[#B8AFA4] hover:text-[#991B1B] dark:hover:text-[#FCA5A5] hover:bg-white dark:hover:bg-[#1C1917] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <h3 className="mt-2 font-serif text-lg font-medium text-[#191614] dark:text-[#F5F0E6]">
                            {entry.recipe.title}
                          </h3>
                          <p className="mt-1 text-xs font-medium text-[#A62C1B] dark:text-[#F59E0B]">
                            {entry.recipe.tastingNotes.join(" · ")}
                          </p>
                          <p className="mt-2.5 text-xs text-[#5C534A] dark:text-[#B8AFA4] leading-relaxed">
                            {entry.recipe.bean.name} ({entry.recipe.roastProfile.level}) ·{" "}
                            {entry.recipe.milkPairing.name}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#191614]/10 dark:border-white/10 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyEntry(entry)}
                            className="min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium text-[#191614] dark:text-[#F5F0E6] bg-white dark:bg-[#1C1917] border border-[#191614]/10 dark:border-white/10 hover:bg-[#EFE9DC] dark:hover:bg-[#12100E] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                          >
                            {copiedId === entry.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#A62C1B] dark:text-[#F59E0B]" />
                                <span>{t.journal.copied}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>{t.journal.copy}</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => onLoadEntry(entry)}
                            className="min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#191614] dark:bg-[#DC4A33] hover:bg-[#2F2A26] dark:hover:bg-[#C23B26] transition-colors whitespace-nowrap cursor-pointer"
                          >
                            {t.journal.loadIntoStudio}
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
