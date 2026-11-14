import { JournalEntry, RepoJournalFile } from "../types/coffee";
import {
  isValidBranchName,
  isValidRepoSlug,
  safeJsonParse,
  sanitizeRepoJournalFile,
} from "./security";

const REPO_JOURNAL_FILE_PATH = "public/data/recipe-journal.json";

export async function fetchStaticRepoJournal(): Promise<RepoJournalFile> {
  const base = import.meta.env.BASE_URL || "./";
  const url = `${base.endsWith("/") ? base : `${base}/`}data/recipe-journal.json`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return { version: 1, updatedAt: new Date().toISOString(), entries: [] };
    }
    const text = await res.text();
    const parsed = safeJsonParse<unknown>(text);
    return sanitizeRepoJournalFile(parsed);
  } catch {
    return { version: 1, updatedAt: new Date().toISOString(), entries: [] };
  }
}

export function mergeJournalEntries(
  repoEntries: JournalEntry[],
  localEntries: JournalEntry[]
): JournalEntry[] {
  const map = new Map<string, JournalEntry>();
  for (const entry of repoEntries) {
    map.set(entry.id, entry);
  }
  for (const entry of localEntries) {
    map.set(entry.id, entry);
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );
}

export function buildRepoJournalPayload(
  allEntries: JournalEntry[]
): RepoJournalFile {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    entries: allEntries.slice(0, 250),
  };
}

function toBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function syncJournalToGitHubRepo(params: {
  repoSlug: string;
  branch: string;
  token: string;
  journalFile: RepoJournalFile;
}): Promise<{ commitUrl: string }> {
  const repo = params.repoSlug.trim();
  const branch = params.branch.trim() || "main";
  const token = params.token.trim();

  if (!isValidRepoSlug(repo)) {
    throw new Error("Repository must follow the format owner/repository-name.");
  }
  if (!isValidBranchName(branch)) {
    throw new Error("Invalid branch name.");
  }
  if (!token || token.length < 10) {
    throw new Error("Please enter a valid fine-grained GitHub token.");
  }

  const [owner, name] = repo.split("/");
  const apiUrl = `https://api.github.com/repos/${encodeURIComponent(
    owner
  )}/${encodeURIComponent(name)}/contents/${REPO_JOURNAL_FILE_PATH}`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };

  let existingSha: string | undefined;
  const getRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, {
    headers,
  });

  if (getRes.ok) {
    const existingData = (await getRes.json()) as { sha?: string };
    existingSha = existingData.sha;
  } else if (getRes.status !== 404) {
    const errBody = await getRes.text();
    throw new Error(
      `GitHub lookup failed (${getRes.status}): ${errBody.slice(0, 140)}`
    );
  }

  const contentString = `${JSON.stringify(params.journalFile, null, 2)}\n`;
  const putRes = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Update Seggemu KaapiWerk recipe-journal.json",
      content: toBase64Utf8(contentString),
      branch,
      ...(existingSha ? { sha: existingSha } : {}),
    }),
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    throw new Error(
      `GitHub commit failed (${putRes.status}): ${errText.slice(0, 160)}`
    );
  }

  const result = (await putRes.json()) as {
    commit?: { html_url?: string };
  };

  return {
    commitUrl:
      result.commit?.html_url ||
      `https://github.com/${owner}/${name}/blob/${branch}/${REPO_JOURNAL_FILE_PATH}`,
  };
}
