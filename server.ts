import "dotenv/config";
import express from "express";
import path from "path";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { createServer as createViteServer } from "vite";

const PORT = Number(process.env.PORT) || 3000;
const PRIMARY_MODEL = "gemini-4-hydrogen";
const FALLBACK_MODEL = "gemini-3.1-flash-lite";

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please set it in Settings > Secrets."
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: 18000,
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const BARISTA_PERSONA = `You are Milo, Head Barista and Green Buyer at Sable & Origin, a modern third-wave specialty coffee studio.
Your vibe is warm, culturally dialed-in, sensory, and genuinely helpful—never pretentious or robotic. You speak like a seasoned specialty barista who knows extraction chemistry, roast development curves, water mineral balance, and plant-milk textural chemistry inside out.
Give concrete, actionable, and sensory guidance tailored to the guest's flavor preferences, roast profile, bean selection, and milk choice. Keep prose concise and vivid.`;

const CRAFT_RECIPE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "Evocative, authentic specialty drink title (2-5 words).",
    },
    baristaNote: {
      type: Type.STRING,
      description:
        "2-3 warm, expert sentences from Milo explaining why this bean, roast, and milk combination fulfills the requested flavor notes.",
    },
    bean: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        origin: { type: Type.STRING },
        region: { type: Type.STRING },
        process: { type: Type.STRING },
        varietal: { type: Type.STRING },
        elevation: { type: Type.STRING },
        whyItFits: { type: Type.STRING },
      },
      required: [
        "name",
        "origin",
        "region",
        "process",
        "varietal",
        "elevation",
        "whyItFits",
      ],
    },
    roastProfile: {
      type: Type.OBJECT,
      properties: {
        level: { type: Type.STRING },
        developmentNote: { type: Type.STRING },
        flavorImpact: { type: Type.STRING },
      },
      required: ["level", "developmentNote", "flavorImpact"],
    },
    milkPairing: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        textureStyle: { type: Type.STRING },
        steamTempC: { type: Type.INTEGER },
        whyItFits: { type: Type.STRING },
      },
      required: ["name", "textureStyle", "steamTempC", "whyItFits"],
    },
    brewRecipe: {
      type: Type.OBJECT,
      properties: {
        method: { type: Type.STRING },
        servingTemp: { type: Type.STRING },
        doseGrams: { type: Type.NUMBER },
        waterOrYieldMl: { type: Type.NUMBER },
        ratio: { type: Type.STRING },
        waterTempC: { type: Type.INTEGER },
        grindSetting: { type: Type.STRING },
        brewTime: { type: Type.STRING },
        steps: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        timerPhases: {
          type: Type.ARRAY,
          description:
            "3 to 4 sequential timed phases tailored to the brew method (e.g. 30s Bloom, 60s First Pour, 45s Drawdown; or 28s Extraction, 20s Steam Milk, 10s Pour). Keep durations practical in seconds (5 to 300s).",
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              durationSeconds: { type: Type.INTEGER },
              instruction: { type: Type.STRING },
            },
            required: ["label", "durationSeconds", "instruction"],
          },
        },
      },
      required: [
        "method",
        "servingTemp",
        "doseGrams",
        "waterOrYieldMl",
        "ratio",
        "waterTempC",
        "grindSetting",
        "brewTime",
        "steps",
        "timerPhases",
      ],
    },
    tastingNotes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 to 4 vivid tasting descriptors.",
    },
    proTip: {
      type: Type.STRING,
      description: "One sharp, practical dial-in tip for home or bar execution.",
    },
  },
  required: [
    "title",
    "baristaNote",
    "bean",
    "roastProfile",
    "milkPairing",
    "brewRecipe",
    "tastingNotes",
    "proTip",
  ],
};

const CHAT_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    reply: {
      type: Type.STRING,
      description:
        "Milo's conversational response answering the user's question or explaining any adjustments made to their coffee craft.",
    },
    shouldUpdateRecipe: {
      type: Type.BOOLEAN,
      description:
        "True if the user asked for a new drink recommendation or asked to modify their current recipe (e.g., switch milk, make it iced, change bean/roast/brew method) and updatedRecipe is populated.",
    },
    updatedRecipe: {
      ...CRAFT_RECIPE_SCHEMA,
      nullable: true,
    },
  },
  required: ["reply", "shouldUpdateRecipe"],
};

function isTransientHighDemand(error: unknown): boolean {
  const err = error as { status?: number; message?: string };
  const msg = err?.message || "";
  return (
    err?.status === 503 ||
    err?.status === 504 ||
    msg.includes("UNAVAILABLE") ||
    msg.includes("DEADLINE_EXCEEDED") ||
    msg.includes("503") ||
    msg.includes("504") ||
    msg.includes("high demand") ||
    msg.includes("timed out") ||
    msg.includes("Timeout")
  );
}

function extractReadableMessage(rawMsg: string): string {
  try {
    const parsed = JSON.parse(rawMsg);
    if (parsed?.error?.message) return String(parsed.error.message);
  } catch {
    // not JSON
  }
  return rawMsg;
}

function formatGeminiError(error: unknown): { status: number; message: string } {
  const err = error as { status?: number; message?: string };
  const rawMsg = err?.message || "Unexpected error communicating with Gemini.";
  const msg = extractReadableMessage(rawMsg);
  const status = typeof err?.status === "number" ? err.status : 500;

  if (status === 403 || rawMsg.includes("PERMISSION_DENIED")) {
    return {
      status: 403,
      message:
        "API permission denied. Please verify your GEMINI_API_KEY in Settings > Secrets.",
    };
  }
  if (status === 400 && rawMsg.includes("API_KEY_INVALID")) {
    return {
      status: 400,
      message:
        "Invalid Gemini API key. Please check GEMINI_API_KEY in Settings > Secrets.",
    };
  }
  if (status === 429 || rawMsg.includes("RESOURCE_EXHAUSTED")) {
    return {
      status: 429,
      message:
        "Rate limit reached on the Gemini API. Please pause briefly and try again.",
    };
  }
  if (
    status === 503 ||
    status === 504 ||
    rawMsg.includes("UNAVAILABLE") ||
    rawMsg.includes("DEADLINE_EXCEEDED")
  ) {
    return {
      status: status === 504 ? 504 : 503,
      message:
        "The barista service is temporarily busy. Please try again in a moment.",
    };
  }
  if (status === 404 || rawMsg.includes("NOT_FOUND")) {
    return {
      status: 404,
      message: `Requested model (${PRIMARY_MODEL}) was not found or is unavailable.`,
    };
  }
  return { status, message: msg };
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), ms)
    ),
  ]);
}

function parseModelJson<T>(rawText: string): T {
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    }
    throw new Error("Barista returned an unreadable response format. Please try again.");
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.post("/api/barista/craft", async (req, res) => {
    try {
      const {
        flavors = [],
        brewMethod = "Pour-Over V60",
        servingTemp = "Hot",
        bodyPreference = "Balanced",
        selectedOrigin = "Barista Choice",
        selectedRoast = "Barista Choice",
        selectedMilk = "Barista Choice",
        customNote = "",
      } = req.body ?? {};

      const ai = getAiClient();
      const prompt = `Design a tailored specialty coffee craft blueprint for a guest with these preferences:
- Flavor preferences: ${flavors.length ? flavors.join(", ") : "Balanced, clean sweetness"}
- Preferred brew method: ${brewMethod}
- Serving temperature: ${servingTemp}
- Desired body & intensity: ${bodyPreference}
- Bean origin selection: ${selectedOrigin}
- Roast profile preference: ${selectedRoast}
- Milk or dairy-free alternative: ${selectedMilk}
${customNote ? `- Guest's extra note: "${customNote}"` : ""}

If any parameter says "Barista Choice", choose the single best specialty option to achieve their flavor preferences. If they chose "Black / No Milk" or a filter method where milk isn't typical unless requested, set milkPairing.name to "Black (No Milk)" and explain why clean extraction preserves the aromatics (with steamTempC set to 0). Make all brew measurements mathematically accurate and realistic for specialty coffee. Always include 3 to 4 practical sequential timerPhases (each 5-240 seconds) tailored to the chosen brew method (e.g., 30s bloom, spiral pours, drawdown for pour-over; or extraction, milk steaming, and pouring for espresso drinks).`;

      let response;
      try {
        response = await withTimeout(
          ai.models.generateContent({
            model: PRIMARY_MODEL,
            contents: prompt,
            config: {
              systemInstruction: BARISTA_PERSONA,
              responseMimeType: "application/json",
              responseSchema: CRAFT_RECIPE_SCHEMA,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          }),
          18000
        );
      } catch (primaryErr) {
        if (!isTransientHighDemand(primaryErr)) {
          throw primaryErr;
        }
        response = await withTimeout(
          ai.models.generateContent({
            model: FALLBACK_MODEL,
            contents: prompt,
            config: {
              systemInstruction: BARISTA_PERSONA,
              responseMimeType: "application/json",
              responseSchema: CRAFT_RECIPE_SCHEMA,
            },
          }),
          18000
        );
      }

      const rawText = (response.text ?? "{}").trim();
      const recipe = parseModelJson(rawText);
      res.json({ recipe });
    } catch (error) {
      const formatted = formatGeminiError(error);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  app.post("/api/barista/chat", async (req, res) => {
    try {
      const { messages = [], currentRecipe = null } = req.body ?? {};
      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: "Please enter a question for the barista." });
        return;
      }

      const ai = getAiClient();
      const latestMessage = messages[messages.length - 1]?.text ?? "";
      const priorMessages = messages
        .slice(0, -1)
        .map((m: { role: string; text: string }) => ({
          role: m.role === "model" ? "model" : "user",
          parts: [{ text: m.text }],
        }));

      const contextInstruction = `${BARISTA_PERSONA}

Current active brew sheet in the guest's studio:
${currentRecipe ? JSON.stringify(currentRecipe, null, 2) : "No recipe crafted yet."}

Instructions:
- Answer the guest's question directly, concisely, and warmly as Milo.
- If the guest asks for a new drink recommendation OR asks to adjust, tweak, swap milk, change temperature (e.g., iced), switch bean origin, change roast profile, or alter brew method, set shouldUpdateRecipe to true and provide the complete updatedRecipe JSON reflecting their request.
- If they are only asking a general question or seeking technique advice without requesting a change to the active drink, set shouldUpdateRecipe to false and omit updatedRecipe.`;

      let response;
      try {
        const chat = ai.chats.create({
          model: PRIMARY_MODEL,
          history: priorMessages,
          config: {
            systemInstruction: contextInstruction,
            responseMimeType: "application/json",
            responseSchema: CHAT_RESPONSE_SCHEMA,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });
        response = await withTimeout(
          chat.sendMessage({ message: latestMessage }),
          18000
        );
      } catch (primaryErr) {
        if (!isTransientHighDemand(primaryErr)) {
          throw primaryErr;
        }
        const fallbackChat = ai.chats.create({
          model: FALLBACK_MODEL,
          history: priorMessages,
          config: {
            systemInstruction: contextInstruction,
            responseMimeType: "application/json",
            responseSchema: CHAT_RESPONSE_SCHEMA,
          },
        });
        response = await withTimeout(
          fallbackChat.sendMessage({ message: latestMessage }),
          18000
        );
      }

      const rawText = (response.text ?? "{}").trim();
      const parsed = parseModelJson(rawText);
      res.json(parsed);
    } catch (error) {
      const formatted = formatGeminiError(error);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (req.path.startsWith("/api/")) {
        res.status(400).json({ error: err.message || "Invalid API request." });
        return;
      }
      next(err);
    }
  );

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sable & Origin studio running on http://localhost:${PORT}`);
  });
}

startServer();
