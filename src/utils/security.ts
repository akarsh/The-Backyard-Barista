import { CraftedRecipe, JournalEntry, RepoJournalFile } from "../types/coffee";

const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

export function sanitizeText(value: unknown, maxLength = 400): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function validateIdentifier(raw: string): {
  valid: boolean;
  normalized: string;
  error?: string;
} {
  const cleaned = sanitizeText(raw, 100);
  if (!cleaned || cleaned.length < 2) {
    return {
      valid: false,
      normalized: "",
      error: "Please enter a username (2+ characters) or email address.",
    };
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleaned);
  const isUsername = /^[a-zA-Z0-9._-]{2,40}$/.test(cleaned);

  if (!isEmail && !isUsername) {
    return {
      valid: false,
      normalized: "",
      error:
        "Use a valid email or a username with letters, numbers, dots, underscores, or hyphens.",
    };
  }

  return {
    valid: true,
    normalized: cleaned.toLowerCase(),
  };
}

export function maskDisplayHandle(normalizedIdentifier: string): string {
  if (!normalizedIdentifier.includes("@")) {
    return `@${normalizedIdentifier}`;
  }
  const [local, domain] = normalizedIdentifier.split("@");
  if (!local || !domain) return "@member";
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

export async function deriveUserKey(normalizedIdentifier: string): Promise<string> {
  const salted = `sable-origin-journal-v1:${normalizedIdentifier}`;
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const encoded = new TextEncoder().encode(salted);
    const digest = await window.crypto.subtle.digest("SHA-256", encoded);
    const hex = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hex.slice(0, 24);
  }
  // Fallback deterministic FNV-1a hex if subtle crypto is unavailable
  let hash = 2166136261;
  for (let i = 0; i < salted.length; i++) {
    hash ^= salted.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `u${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw, (key, value) => {
      if (DANGEROUS_KEYS.has(key)) return undefined;
      return value;
    }) as T;
  } catch {
    return null;
  }
}

function sanitizeRecipe(raw: unknown): CraftedRecipe | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const bean = (r.bean ?? {}) as Record<string, unknown>;
  const roast = (r.roastProfile ?? {}) as Record<string, unknown>;
  const milk = (r.milkPairing ?? {}) as Record<string, unknown>;
  const brew = (r.brewRecipe ?? {}) as Record<string, unknown>;

  const title = sanitizeText(r.title, 120);
  if (!title) return null;

  const steps = Array.isArray(brew.steps)
    ? brew.steps.map((s) => sanitizeText(s, 300)).filter(Boolean).slice(0, 10)
    : [];

  const timerPhases = Array.isArray(brew.timerPhases)
    ? brew.timerPhases
        .map((p) => {
          if (!p || typeof p !== "object") return null;
          const obj = p as Record<string, unknown>;
          const label = sanitizeText(obj.label, 80);
          const instruction = sanitizeText(obj.instruction, 240);
          const durationSeconds = Number(obj.durationSeconds);
          if (!label || !Number.isFinite(durationSeconds)) return null;
          return {
            label,
            durationSeconds: Math.max(5, Math.min(600, Math.round(durationSeconds))),
            instruction: instruction || label,
          };
        })
        .filter((x): x is NonNullable<typeof x> => Boolean(x))
        .slice(0, 8)
    : undefined;

  const tastingNotes = Array.isArray(r.tastingNotes)
    ? r.tastingNotes.map((t) => sanitizeText(t, 60)).filter(Boolean).slice(0, 6)
    : [];

  return {
    title,
    baristaNote: sanitizeText(r.baristaNote, 600),
    bean: {
      name: sanitizeText(bean.name, 100) || "Single-Origin Lot",
      origin: sanitizeText(bean.origin, 60) || "Single Origin",
      region: sanitizeText(bean.region, 80),
      process: sanitizeText(bean.process, 60),
      varietal: sanitizeText(bean.varietal, 80),
      elevation: sanitizeText(bean.elevation, 40),
      whyItFits: sanitizeText(bean.whyItFits, 300),
    },
    roastProfile: {
      level: sanitizeText(roast.level, 60) || "Medium Balanced",
      developmentNote: sanitizeText(roast.developmentNote, 200),
      flavorImpact: sanitizeText(roast.flavorImpact, 300),
    },
    milkPairing: {
      name: sanitizeText(milk.name, 80) || "Barista Oat",
      textureStyle: sanitizeText(milk.textureStyle, 100),
      steamTempC: Math.max(0, Math.min(85, Number(milk.steamTempC) || 0)),
      whyItFits: sanitizeText(milk.whyItFits, 300),
    },
    brewRecipe: {
      method: sanitizeText(brew.method, 60) || "Pour-Over V60",
      servingTemp: sanitizeText(brew.servingTemp, 30) || "Hot",
      doseGrams: Math.max(1, Math.min(200, Number(brew.doseGrams) || 18)),
      waterOrYieldMl: Math.max(
        10,
        Math.min(2000, Number(brew.waterOrYieldMl) || 250)
      ),
      ratio: sanitizeText(brew.ratio, 40) || "1:15",
      waterTempC: Math.max(4, Math.min(100, Number(brew.waterTempC) || 93)),
      grindSetting: sanitizeText(brew.grindSetting, 80) || "Medium-fine",
      brewTime: sanitizeText(brew.brewTime, 40) || "2:30",
      steps,
      ...(timerPhases && timerPhases.length > 0 ? { timerPhases } : {}),
    },
    tastingNotes,
    proTip: sanitizeText(r.proTip, 300),
  };
}

export function sanitizeRepoJournalFile(raw: unknown): RepoJournalFile {
  if (!raw || typeof raw !== "object") {
    return { version: 1, updatedAt: new Date().toISOString(), entries: [] };
  }
  const obj = raw as Record<string, unknown>;
  const rawEntries = Array.isArray(obj.entries) ? obj.entries : [];

  const entries: JournalEntry[] = [];
  for (const item of rawEntries.slice(0, 250)) {
    if (!item || typeof item !== "object") continue;
    const e = item as Record<string, unknown>;
    const id = sanitizeText(e.id, 80);
    const userKey = sanitizeText(e.userKey, 40);
    const displayHandle = sanitizeText(e.displayHandle, 60) || "@member";
    const savedAt = sanitizeText(e.savedAt, 40) || new Date().toISOString();
    const notes = sanitizeText(e.notes, 240);
    const recipe = sanitizeRecipe(e.recipe);
    if (!id || !userKey || !recipe) continue;
    entries.push({
      id,
      userKey,
      displayHandle,
      savedAt,
      ...(notes ? { notes } : {}),
      recipe,
    });
  }

  return {
    version: typeof obj.version === "number" ? obj.version : 1,
    updatedAt: sanitizeText(obj.updatedAt, 40) || new Date().toISOString(),
    entries,
  };
}

export function isValidRepoSlug(slug: string): boolean {
  return /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(slug.trim());
}

export function isValidBranchName(branch: string): boolean {
  const b = branch.trim();
  return /^[a-zA-Z0-9._/-]{1,80}$/.test(b) && !b.includes("..");
}
