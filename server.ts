import "dotenv/config";
import express from "express";
import path from "path";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
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
      timeout: 15000,
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
    msg.includes("high demand") ||
    msg.includes("timed out") ||
    msg.includes("Timeout")
  );
}

function formatGeminiError(error: unknown): { status: number; message: string } {
  const err = error as { status?: number; message?: string };
  const msg = err?.message || "Unexpected error communicating with Gemini.";
  const status = typeof err?.status === "number" ? err.status : 500;

  if (status === 403 || msg.includes("PERMISSION_DENIED")) {
    return {
      status: 403,
      message:
        "API permission denied. Please verify your GEMINI_API_KEY in Settings > Secrets.",
    };
  }
  if (status === 400 && msg.includes("API_KEY_INVALID")) {
    return {
      status: 400,
      message:
        "Invalid Gemini API key. Please check GEMINI_API_KEY in Settings > Secrets.",
    };
  }
  if (status === 429 || msg.includes("RESOURCE_EXHAUSTED")) {
    return {
      status: 429,
      message:
        "Rate limit reached on the Gemini API. Please pause briefly and try again.",
    };
  }
  if (status === 503 || msg.includes("UNAVAILABLE")) {
    return {
      status: 503,
      message:
        "The barista service is experiencing temporary high demand. Please try again in a moment.",
    };
  }
  if (status === 404 || msg.includes("NOT_FOUND")) {
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

If any parameter says "Barista Choice", choose the single best specialty option to achieve their flavor preferences. If they chose "Black / No Milk" or a filter method where milk isn't typical unless requested, set milkPairing.name to "Black (No Milk)" and explain why clean extraction preserves the aromatics (with steamTempC set to 0). Make all brew measurements mathematically accurate and realistic for specialty coffee.`;

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
          14000
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
          14000
        );
      }

      const rawText = (response.text ?? "{}").trim();
      const recipe = JSON.parse(rawText);
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
          14000
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
          14000
        );
      }

      const rawText = (response.text ?? "{}").trim();
      const parsed = JSON.parse(rawText);
      res.json(parsed);
    } catch (error) {
      const formatted = formatGeminiError(error);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

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
