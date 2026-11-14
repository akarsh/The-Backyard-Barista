export interface CraftPreferences {
  flavors: string[];
  brewMethod: string;
  servingTemp: "Hot" | "Iced";
  bodyPreference: "Light & Tea-Like" | "Balanced" | "Syrupy & Bold";
  selectedOrigin: string;
  selectedRoast: string;
  selectedMilk: string;
  customNote: string;
}

export interface CraftedRecipe {
  title: string;
  baristaNote: string;
  bean: {
    name: string;
    origin: string;
    region: string;
    process: string;
    varietal: string;
    elevation: string;
    whyItFits: string;
  };
  roastProfile: {
    level: string;
    developmentNote: string;
    flavorImpact: string;
  };
  milkPairing: {
    name: string;
    textureStyle: string;
    steamTempC: number;
    whyItFits: string;
  };
  brewRecipe: {
    method: string;
    servingTemp: string;
    doseGrams: number;
    waterOrYieldMl: number;
    ratio: string;
    waterTempC: number;
    grindSetting: string;
    brewTime: string;
    steps: string[];
  };
  tastingNotes: string[];
  proTip: string;
}

export interface OriginLot {
  id: string;
  name: string;
  origin: string;
  region: string;
  process: string;
  varietal: string;
  elevation: string;
  recommendedRoast: string;
  recommendedMilk: string;
  defaultMethod: string;
  flavors: string[];
  tastingLine: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  recipeUpdated?: boolean;
}

export interface SavedBrew {
  id: string;
  savedAt: string;
  recipe: CraftedRecipe;
}
