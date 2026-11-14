import { CraftedRecipe, OriginLot } from "../types/coffee";

export const FLAVOR_OPTIONS = [
  "Sweet",
  "Bold",
  "Chocolaty",
  "Fruity",
  "Floral",
  "Nutty",
  "Caramel",
  "Spiced",
];

export const BREW_METHODS = [
  "Pour-Over V60",
  "Espresso",
  "Flat White",
  "Cortado",
  "AeroPress",
  "Cold Brew",
];

export const ROAST_PROFILES = [
  {
    id: "Barista Choice",
    label: "Barista Choice",
    summary: "Let Milo match the development curve to your flavor goals",
  },
  {
    id: "Light Nordic",
    label: "Light Nordic",
    summary: "High clarity, vibrant stone-fruit acidity, delicate florals",
  },
  {
    id: "Medium-Light City",
    label: "Medium-Light City",
    summary: "Caramelized sugars balancing bright origin character",
  },
  {
    id: "Medium Balanced",
    label: "Medium Balanced",
    summary: "Toasted hazelnut sweetness, cocoa body, versatile across milk",
  },
  {
    id: "Full Espresso",
    label: "Full Espresso",
    summary: "Deep dark cacao, syrupy crema, built to cut through milk",
  },
  {
    id: "Dark Roast",
    label: "Dark Roast",
    summary: "Bittersweet cocoa, roasted walnut, zero sour or fruity acidity",
  },
];

export const MILK_ALTERNATIVES = [
  {
    id: "Barista Choice",
    label: "Barista Choice",
    note: "Recommended pairing",
  },
  {
    id: "Black / No Milk",
    label: "Black / No Milk",
    note: "Pure origin clarity",
  },
  {
    id: "Barista Oat",
    label: "Barista Oat",
    note: "Silky cereal sweetness, glossy microfoam",
  },
  {
    id: "Whole Dairy",
    label: "Whole Dairy",
    note: "Rich butterfat body, classic caramelization",
  },
  {
    id: "Macadamia",
    label: "Macadamia",
    note: "Buttery, neutral finish that preserves florals",
  },
  {
    id: "Silky Almond",
    label: "Silky Almond",
    note: "Light marzipan lift for nutty roasts",
  },
  {
    id: "Coconut Cream",
    label: "Coconut Cream",
    note: "Tropical velvet texture for bold iced drinks",
  },
];

export const ORIGIN_LOTS: OriginLot[] = [
  {
    id: "ethiopia-worka",
    name: "Worka Sakaro Reserve",
    origin: "Ethiopia",
    region: "Gedeb, Yirgacheffe",
    process: "Washed",
    varietal: "74110 & 74112",
    elevation: "2,150m",
    recommendedRoast: "Light Nordic",
    recommendedMilk: "Black / No Milk",
    defaultMethod: "Pour-Over V60",
    flavors: ["Floral", "Fruity", "Sweet"],
    tastingLine: "Bergamot · White Peach · Jasmine Blossom",
    description:
      "High-altitude washed Ethiopian lot with crystalline tea-like structure and crisp citrus sweetness.",
    imageUrl: "/src/assets/images/bean_ethiopia_floral_1794655637946.jpg",
    imageAlt:
      "Light-roasted Ethiopian coffee beans beside a matte off-white stoneware tasting cup on pale stone",
  },
  {
    id: "colombia-huila",
    name: "Finca El Paraíso Caturra",
    origin: "Colombia",
    region: "San Agustín, Huila",
    process: "Honey",
    varietal: "Pink Bourbon & Caturra",
    elevation: "1,850m",
    recommendedRoast: "Medium Balanced",
    recommendedMilk: "Barista Oat",
    defaultMethod: "Flat White",
    flavors: ["Chocolaty", "Caramel", "Sweet", "Nutty"],
    tastingLine: "Milk Chocolate · Roasted Hazelnut · Demerara",
    description:
      "Velvety honey-processed Huila lot engineered to bloom into praline and cocoa when paired with steamed oat milk.",
    imageUrl: "/src/assets/images/bean_colombia_cocoa_1794655637878.jpg",
    imageAlt:
      "Medium-roasted Colombian coffee beans in a steel dosing tray next to a ceramic demitasse",
  },
  {
    id: "brazil-sul-de-minas",
    name: "Carmo Estate Velvet",
    origin: "Brazil",
    region: "Sul de Minas",
    process: "Natural",
    varietal: "Yellow Bourbon",
    elevation: "1,280m",
    recommendedRoast: "Full Espresso",
    recommendedMilk: "Whole Dairy",
    defaultMethod: "Espresso",
    flavors: ["Bold", "Chocolaty", "Nutty", "Caramel"],
    tastingLine: "70% Dark Cacao · Toasted Almond · Brown Butter",
    description:
      "Sun-dried Yellow Bourbon offering heavy crema, low acidity, and unmistakable dark-chocolate richness under pressure.",
    imageUrl: "/src/assets/images/milk_oat_latte_art_1794655638061.jpg",
    imageAlt:
      "Steamed microfoam poured into a charcoal speckled ceramic flat white cup forming rosetta latte art",
  },
];

export const INITIAL_RECIPE: CraftedRecipe = {
  title: "Velvet Hazelnut Oat Flat White",
  baristaNote:
    "For a cup that leans sweet and chocolaty without losing nuance, a honey-processed Huila lot at a medium development curve hits the sweet spot. Pairing it with textured Barista Oat amplifies the natural brown-sugar notes without masking the cocoa finish.",
  bean: {
    name: "Finca El Paraíso Caturra",
    origin: "Colombia",
    region: "San Agustín, Huila",
    process: "Honey Process",
    varietal: "Pink Bourbon & Caturra",
    elevation: "1,850m",
    whyItFits:
      "Mucilage dried on the parchment concentrates stone-fruit sugars and creates a syrupy chocolate body.",
  },
  roastProfile: {
    level: "Medium Balanced",
    developmentNote: "18.5% development time past first crack, dropped at 208°C",
    flavorImpact:
      "Preserves subtle caramel sweetness while building enough solubility for crisp espresso extraction.",
  },
  milkPairing: {
    name: "Barista Oat",
    textureStyle: "Glossy microfoam (15% stretch)",
    steamTempC: 60,
    whyItFits:
      "Enzymatic oat maltose mirrors the bean's demerara sweetness while keeping the mouthfeel weightless.",
  },
  brewRecipe: {
    method: "Flat White",
    servingTemp: "Hot",
    doseGrams: 18.5,
    waterOrYieldMl: 37,
    ratio: "1:2 espresso + 135ml oat",
    waterTempC: 93,
    grindSetting: "Fine espresso (220 microns)",
    brewTime: "28–31s",
    steps: [
      "Pull a 37g double shot from 18.5g finely ground Huila beans at 93°C over 29 seconds.",
      "Texture 135ml cold Barista Oat milk to 60°C, stopping steam before it exceeds 62°C to keep oat sugars intact.",
      "Swirl the pitcher until wet-paint glossy, then pour steady into the center to fold crema cleanly.",
    ],
  },
  tastingNotes: ["Milk Chocolate", "Toasted Hazelnut", "Brown Sugar", "Sweet Oat"],
  proTip:
    "Keep oat milk under 62°C during steaming—pushing higher breaks down natural enzymes and flattens the praline sweetness.",
};

export const HERO_IMAGE_URL = "/src/assets/images/hero_coffee_bar_1794655634637.jpg";
export const MILK_FEATURE_IMAGE_URL =
  "/src/assets/images/milk_oat_latte_art_1794655638061.jpg";
