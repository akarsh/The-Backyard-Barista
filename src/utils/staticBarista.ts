import { LanguageCode } from "../i18n/translations";
import { CraftPreferences, CraftedRecipe } from "../types/coffee";
import { ORIGIN_LOTS } from "../data/pantry";

/**
 * Local barista craft engine used solely as a fallback when the app is hosted
 * on a static host (such as GitHub Pages / github.io) without an API server.
 */
export function craftStaticRecipe(
  prefs: CraftPreferences,
  language: LanguageCode = "en"
): CraftedRecipe {
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
  const isCold = method.toLowerCase().includes("cold");
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

  const defaultLotId = wantsDarkCozy
    ? "brazil-sul-de-minas"
    : wantsBright
      ? "ethiopia-worka"
      : "colombia-huila";
  const beanLot =
    ORIGIN_LOTS.find(
      (lot) => prefs.selectedOrigin === `${lot.origin} — ${lot.name}`
    ) ?? ORIGIN_LOTS.find((lot) => lot.id === defaultLotId);
  if (!beanLot) {
    throw new Error(`No origin lot matches the brew preferences.`);
  }
  const bean = {
    name: beanLot.name,
    origin: beanLot.origin,
    region: beanLot.region,
    process: beanLot.process,
    varietal: beanLot.varietal,
    elevation: beanLot.elevation,
    whyItFits: beanLot.description,
  };

  const isPourOver = method.toLowerCase().includes("pour");
  const isAero = method.toLowerCase().includes("aero");

  const doseGrams = isPourOver ? 16 : isAero ? 17 : isCold ? 45 : 19;
  const isLightBody = prefs.bodyPreference === "Light & Tea-Like";
  const isBoldBody = prefs.bodyPreference === "Syrupy & Bold";
  const filterRatio = isLightBody ? 17 : isBoldBody ? 14 : 16;
  const aeroRatio = isLightBody ? 14 : isBoldBody ? 12 : 13;
  const coldBrewRatio = isLightBody ? 9 : isBoldBody ? 7 : 8;
  const espressoRatio = isLightBody ? 2 : isBoldBody ? 1.6 : 1.8;
  const waterOrYieldMl = isPourOver
    ? Math.round(doseGrams * filterRatio)
    : isAero
    ? Math.round(doseGrams * aeroRatio)
    : isCold
      ? Math.round(doseGrams * coldBrewRatio)
      : Math.round(doseGrams * espressoRatio);
  const waterTempC = isCold ? 20 : wantsDarkCozy ? 90 : wantsBright ? 95 : 93;

  return {
    title: `${isIced ? "Iced " : ""}${
      wantsDarkCozy ? "Velvet Cacao" : wantsBright ? "Bergamot Blossom" : "Hazelnut Caramel"
    } ${hasMilk ? milkChoice.replace("Barista ", "") + " " : ""}${method}`.trim(),
    baristaNote:
      language === "de"
        ? `Abgestimmt auf ${prefs.flavors.join(", ") || "ausgewogene"} Aromen bei ${waterTempC}°C Brühtemperatur mit ${roastLevel} und ${milkChoice}.`
        : language === "te"
        ? `${prefs.flavors.join(", ") || "సమతుల్య"} రుచుల కోసం ${waterTempC}°C నీటి ఉష్ణోగ్రతతో ${roastLevel} మరియు ${milkChoice} తో ప్రత్యేకంగా సిద్ధం చేసిన రెసిపీ.`
        : isCold
        ? `Steep ${doseGrams}g coarse coffee in ${waterOrYieldMl}ml cool water for 14 hours, then filter and serve ${isIced ? "over ice" : "diluted with hot water"}.`
        : wantsDarkCozy
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
      ratio: isPourOver
        ? `1:${filterRatio}`
        : isAero
          ? `1:${aeroRatio}`
          : isCold
            ? `1:${coldBrewRatio} concentrate`
            : `1:${espressoRatio}`,
      waterTempC: isCold ? 20 : waterTempC,
      grindSetting: isPourOver
        ? "Medium-fine (650 microns)"
        : isAero
        ? "Medium-fine (550 microns)"
        : isCold
        ? "Coarse (1,000 microns)"
        : "Fine espresso (230 microns)",
      brewTime: isPourOver ? "2:45" : isAero ? "2:00" : isCold ? "14h steep" : "28s",
      steps: isCold
        ? [
            `Combine ${doseGrams}g coarse coffee with ${waterOrYieldMl}ml cool filtered water and steep covered in the refrigerator for 14 hours.`,
            isIced
              ? "Filter the concentrate and pour over ice."
              : "Filter the concentrate and dilute with hot water to taste.",
            hasMilk
              ? isIced
                ? `Add chilled ${milkChoice} to taste.`
                : `Add steamed ${milkChoice} to taste.`
              : "Adjust dilution to taste.",
          ]
        : isPourOver
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
      timerPhases: isCold
        ? [
            {
              label: "Saturate Grounds",
              durationSeconds: 30,
              instruction: `Stir ${doseGrams}g coarse grounds into ${waterOrYieldMl}ml cool filtered water.`,
            },
            {
              label: "Cover & Refrigerate",
              durationSeconds: 30,
              instruction: "Cover and refrigerate for 14 hours, then filter and serve over ice.",
            },
          ]
        : isPourOver
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
    proTip: isCold
      ? `Steep covered in the refrigerator for 14 hours, then filter and serve ${isIced ? "over fresh ice" : "diluted with hot water"}.`
      : wantsDarkCozy
      ? "Keep brew water at 90°C and stop the shot slightly early—this gives maximum body and zero harsh bitterness."
      : "Use filtered water with gentle mineral balance so sweetness stays crisp and clean.",
  };
}

export function createStaticBrewPreviews(
  prefs: CraftPreferences,
  methods: readonly string[],
  language: LanguageCode = "en"
): CraftedRecipe[] {
  const orderedMethods = [
    prefs.brewMethod,
    ...methods.filter((method) => method !== prefs.brewMethod),
  ];

  return orderedMethods.map((brewMethod) =>
    craftStaticRecipe({ ...prefs, brewMethod }, language)
  );
}

export function chatStaticBarista(
  userMessage: string,
  currentRecipe: CraftedRecipe,
  language: LanguageCode = "en"
): { reply: string; shouldUpdateRecipe: boolean; updatedRecipe?: CraftedRecipe } {
  const lower = userMessage.toLowerCase();
  const next: CraftedRecipe = JSON.parse(JSON.stringify(currentRecipe));
  let updated = false;

  if (lower.includes("iced") || lower.includes("cold") || lower.includes("eis") || lower.includes("ఐస్")) {
    next.brewRecipe.servingTemp = "Iced";
    if (!next.title.toLowerCase().includes("iced")) {
      next.title = `Iced ${next.title}`;
    }
    next.milkPairing.steamTempC = 0;
    next.milkPairing.textureStyle = "Chilled pour over clear ice";
    updated = true;
  }
  if (lower.includes("macadamia") || lower.includes("మకడమియా")) {
    next.milkPairing.name = "Macadamia";
    next.milkPairing.whyItFits =
      "Macadamia milk adds a clean, buttery finish without overshadowing origin sweetness.";
    updated = true;
  } else if (lower.includes("oat") || lower.includes("hafer") || lower.includes("ఓట్")) {
    next.milkPairing.name = "Barista Oat";
    updated = true;
  } else if (lower.includes("almond") || lower.includes("mandel") || lower.includes("బాదం")) {
    next.milkPairing.name = "Silky Almond";
    updated = true;
  } else if (lower.includes("coconut") || lower.includes("kokos") || lower.includes("కొబ్బరి")) {
    next.milkPairing.name = "Coconut Cream";
    updated = true;
  }

  if (lower.includes("bitter") || lower.includes("చేదు")) {
    next.brewRecipe.waterTempC = Math.min(next.brewRecipe.waterTempC, 90);
    updated = true;
    return {
      reply:
        language === "de"
          ? "Um Bitterkeit bei dunklen Röstungen zu vermeiden, senke die Wassertemperatur auf 90°C und wähle ein etwas kürzeres Brühverhältnis. Dein Brühblatt ist aktualisiert."
          : language === "te"
          ? "చేదు తగ్గించడానికి నీటి ఉష్ణోగ్రతను 90°C కి తగ్గించి, కొద్దిగా తక్కువ నిష్పత్తిలో బ్రూ చేయండి. మీ రెసిపీ అప్‌డేట్ చేయబడింది."
          : "To keep dark roasts smooth without bitterness, drop your brew water to 90°C and pull a slightly shorter ratio (around 1:1.6 to 1:1.8). I've updated your brew sheet temperature accordingly.",
      shouldUpdateRecipe: updated,
      updatedRecipe: next,
    };
  }

  if (updated) {
    return {
      reply:
        language === "de"
          ? "Dein aktives Brühblatt wurde mit den gewünschten Anpassungen aktualisiert."
          : language === "te"
          ? "మీ సూచనల ప్రకారం ప్రస్తుత కాఫీ రెసిపీ అప్‌డేట్ చేయబడింది."
          : "Updated your active brew sheet with those adjustments—check the new temperature and milk texture notes above.",
      shouldUpdateRecipe: true,
      updatedRecipe: next,
    };
  }

  return {
    reply:
      language === "de"
        ? "Gute Idee! Halte den Mahlgrad konstant, wiege Dosis und Ertrag auf 0,1 g genau und schäume Milch nur bis ca. 59–60°C auf."
        : language === "te"
        ? "మంచి ఆలోచన! గ్రైండ్ సైజును స్థిరంగా ఉంచి, 0.1g స్కేల్‌పై కొలవండి మరియు పాలను 59–60°C వద్ద ఆపండి."
        : "Great call. Keep your grind consistent, weigh both dose and yield on a 0.1g scale, and stop steaming milk around 59–60°C so natural sweetness stays intact.",
    shouldUpdateRecipe: false,
  };
}
