import { CraftPreferences, CraftedRecipe } from "../types/coffee";

/**
 * Local barista craft engine used solely as a fallback when the app is hosted
 * on a static host (such as GitHub Pages / github.io) without an API server.
 */
export function craftStaticRecipe(prefs: CraftPreferences): CraftedRecipe {
  const flavors = prefs.flavors.map((f) => f.toLowerCase());
  const note = prefs.customNote.toLowerCase();
  const wantsBright =
    (flavors.includes("fruity") || flavors.includes("floral")) &&
    !note.includes("hate sour") &&
    !note.includes("no sour") &&
    !note.includes("hate fruity");
  const wantsDarkCozy =
    prefs.selectedRoast === "Dark Roast" ||
    prefs.selectedRoast === "Full Espresso" ||
    flavors.includes("bold") ||
    flavors.includes("chocolaty") ||
    note.includes("dark roast") ||
    note.includes("not too bitter");

  const isIced = prefs.servingTemp === "Iced";
  const method = prefs.brewMethod || "Flat White";
  const milkChoice =
    prefs.selectedMilk !== "Barista Choice"
      ? prefs.selectedMilk
      : wantsBright &&
        (method.includes("Pour") || method === "AeroPress" || method === "Cold Brew")
      ? "Black (No Milk)"
      : "Barista Oat";

  const hasMilk =
    !milkChoice.toLowerCase().includes("black") &&
    !milkChoice.toLowerCase().includes("no milk");

  const roastLevel =
    prefs.selectedRoast !== "Barista Choice"
      ? prefs.selectedRoast
      : wantsDarkCozy
      ? "Dark Roast"
      : wantsBright
      ? "Light Nordic"
      : "Medium Balanced";

  const bean = wantsDarkCozy
    ? {
        name:
          prefs.selectedOrigin !== "Barista Choice"
            ? prefs.selectedOrigin
            : "Carmo Estate Velvet",
        origin: "Brazil & Sumatra",
        region: "Sul de Minas / Lintong",
        process: "Natural & Wet-Hulled",
        varietal: "Yellow Bourbon",
        elevation: "1,350m",
        whyItFits:
          "Low-acid natural and wet-hulled lots unlock heavy baker's chocolate and toasted nut sweetness with zero sourness.",
      }
    : wantsBright
    ? {
        name:
          prefs.selectedOrigin !== "Barista Choice"
            ? prefs.selectedOrigin
            : "Worka Sakaro Reserve",
        origin: "Ethiopia",
        region: "Gedeb, Yirgacheffe",
        process: "Washed",
        varietal: "74110 & 74112",
        elevation: "2,150m",
        whyItFits:
          "High-elevation washed beans deliver jasmine aromatics, stone-fruit clarity, and clean tea-like sweetness.",
      }
    : {
        name:
          prefs.selectedOrigin !== "Barista Choice"
            ? prefs.selectedOrigin
            : "Finca El Paraíso Caturra",
        origin: "Colombia",
        region: "San Agustín, Huila",
        process: "Honey Process",
        varietal: "Pink Bourbon & Caturra",
        elevation: "1,850m",
        whyItFits:
          "Honey processing concentrates natural sugars for balanced caramel, milk chocolate, and roasted hazelnut depth.",
      };

  const isPourOver = method.toLowerCase().includes("pour");
  const isAero = method.toLowerCase().includes("aero");
  const isCold = method.toLowerCase().includes("cold");

  const doseGrams = isPourOver ? 16 : isAero ? 17 : isCold ? 45 : 19;
  const waterOrYieldMl = isPourOver
    ? 256
    : isAero
    ? 220
    : isCold
    ? 360
    : wantsDarkCozy
    ? 32
    : 38;
  const waterTempC = wantsDarkCozy ? 90 : wantsBright ? 95 : 93;

  return {
    title: `${isIced ? "Iced " : ""}${
      wantsDarkCozy ? "Velvet Cacao" : wantsBright ? "Bergamot Blossom" : "Hazelnut Caramel"
    } ${hasMilk ? milkChoice.replace("Barista ", "") + " " : ""}${method}`.trim(),
    baristaNote: wantsDarkCozy
      ? `Dialed for rich chocolaty and nutty warmth without harsh bitterness—lowering brew temperature to ${waterTempC}°C and keeping a tight extraction suppresses bitter compounds while highlighting cocoa and toasted nuts.`
      : `Calibrated around your ${
          prefs.flavors.join(", ") || "balanced"
        } notes with ${roastLevel.toLowerCase()} development and ${milkChoice.toLowerCase()} harmony.`,
    bean,
    roastProfile: {
      level: roastLevel,
      developmentNote: wantsDarkCozy
        ? "Extended Maillard browning past first crack for smooth sweetness"
        : "Controlled development to preserve origin clarity and caramel sweetness",
      flavorImpact: wantsDarkCozy
        ? "Eliminates sour/fruity edges in favor of dark chocolate and toasted nuts."
        : "Balances natural sweetness with clean aromatic lift.",
    },
    milkPairing: {
      name: hasMilk ? milkChoice : "Black (No Milk)",
      textureStyle: !hasMilk
        ? "None"
        : isIced
        ? "Chilled pour with light cold foam"
        : "Glossy wet-paint microfoam",
      steamTempC: !hasMilk || isIced ? 0 : 59,
      whyItFits: hasMilk
        ? `${milkChoice} rounds out roast intensity while letting the core tasting notes linger cleanly.`
        : "Serving black keeps delicate aromatics crisp and transparent.",
    },
    brewRecipe: {
      method,
      servingTemp: prefs.servingTemp,
      doseGrams,
      waterOrYieldMl,
      ratio: isPourOver ? "1:16" : isAero ? "1:13" : isCold ? "1:8 concentrate" : "1:1.8",
      waterTempC: isCold ? 20 : waterTempC,
      grindSetting: isPourOver
        ? "Medium-fine (650 microns)"
        : isAero
        ? "Medium-fine (550 microns)"
        : isCold
        ? "Coarse (1,000 microns)"
        : "Fine espresso (230 microns)",
      brewTime: isPourOver ? "2:45" : isAero ? "2:00" : isCold ? "14h steep" : "28s",
      steps: isPourOver
        ? [
            `Bloom ${doseGrams}g grounds with ${doseGrams * 2}ml water at ${waterTempC}°C for 35 seconds.`,
            `Pour steadily in slow concentric spirals to reach ${waterOrYieldMl}ml total water.`,
            "Give one gentle swirl and let the bed drain flat.",
          ]
        : [
            `Extract ${waterOrYieldMl}ml from ${doseGrams}g finely ground coffee at ${waterTempC}°C.`,
            hasMilk && !isIced
              ? `Steam ${milkChoice} to 59°C until silky and glossy.`
              : isIced
              ? "Pour directly over clear ice cubes in a chilled glass."
              : "Swirl gently to integrate crema and aromatics.",
            "Serve immediately and enjoy warm.",
          ],
      timerPhases: isPourOver
        ? [
            {
              label: "Bloom",
              durationSeconds: 35,
              instruction: `Saturate ${doseGrams}g grounds with ${doseGrams * 2}ml water at ${waterTempC}°C.`,
            },
            {
              label: "First Spiral Pour",
              durationSeconds: 60,
              instruction: `Pour gently in circles up to ${Math.round(waterOrYieldMl * 0.65)}ml.`,
            },
            {
              label: "Final Pour & Drawdown",
              durationSeconds: 70,
              instruction: `Top up to ${waterOrYieldMl}ml and allow clean drawdown.`,
            },
          ]
        : [
            {
              label: "Extraction",
              durationSeconds: 28,
              instruction: `Pull ${waterOrYieldMl}ml from ${doseGrams}g coffee at ${waterTempC}°C.`,
            },
            ...(hasMilk
              ? [
                  {
                    label: isIced ? "Chill & Pour Milk" : `Steam ${milkChoice}`,
                    durationSeconds: 20,
                    instruction: isIced
                      ? `Pour chilled ${milkChoice} over ice and layer espresso.`
                      : `Texture ${milkChoice} to 59°C for velvety microfoam.`,
                  },
                ]
              : []),
            {
              label: "Finish & Serve",
              durationSeconds: 10,
              instruction: "Swirl gently to integrate and serve.",
            },
          ],
    },
    tastingNotes: wantsDarkCozy
      ? ["Dark Cocoa", "Toasted Walnut", "Brown Sugar", "Velvet Oat"]
      : wantsBright
      ? ["Bergamot", "White Peach", "Jasmine", "Honey"]
      : ["Milk Chocolate", "Roasted Hazelnut", "Caramel", "Sweet Almond"],
    proTip: wantsDarkCozy
      ? "Keep brew water at 90°C and stop the shot slightly early—this gives maximum body and zero harsh bitterness."
      : "Use filtered water with gentle mineral balance so sweetness stays crisp and clean.",
  };
}

export function chatStaticBarista(
  userMessage: string,
  currentRecipe: CraftedRecipe
): { reply: string; shouldUpdateRecipe: boolean; updatedRecipe?: CraftedRecipe } {
  const lower = userMessage.toLowerCase();
  const next: CraftedRecipe = JSON.parse(JSON.stringify(currentRecipe));
  let updated = false;

  if (lower.includes("iced") || lower.includes("cold")) {
    next.brewRecipe.servingTemp = "Iced";
    if (!next.title.toLowerCase().includes("iced")) {
      next.title = `Iced ${next.title}`;
    }
    next.milkPairing.steamTempC = 0;
    next.milkPairing.textureStyle = "Chilled pour over clear ice";
    updated = true;
  }
  if (lower.includes("macadamia")) {
    next.milkPairing.name = "Macadamia";
    next.milkPairing.whyItFits =
      "Macadamia milk adds a clean, buttery finish without overshadowing origin sweetness.";
    updated = true;
  } else if (lower.includes("oat")) {
    next.milkPairing.name = "Barista Oat";
    updated = true;
  } else if (lower.includes("almond")) {
    next.milkPairing.name = "Silky Almond";
    updated = true;
  } else if (lower.includes("coconut")) {
    next.milkPairing.name = "Coconut Cream";
    updated = true;
  }

  if (lower.includes("bitter")) {
    next.brewRecipe.waterTempC = Math.min(next.brewRecipe.waterTempC, 90);
    updated = true;
    return {
      reply:
        "To keep dark roasts smooth without bitterness, drop your brew water to 90°C and pull a slightly shorter ratio (around 1:1.6 to 1:1.8). I've updated your brew sheet temperature accordingly.",
      shouldUpdateRecipe: updated,
      updatedRecipe: next,
    };
  }

  if (updated) {
    return {
      reply:
        "Updated your active brew sheet with those adjustments—check the new temperature and milk texture notes above.",
      shouldUpdateRecipe: true,
      updatedRecipe: next,
    };
  }

  return {
    reply:
      "Great call. Keep your grind consistent, weigh both dose and yield on a 0.1g scale, and stop steaming milk around 59–60°C so natural sweetness stays intact.",
    shouldUpdateRecipe: false,
  };
}
