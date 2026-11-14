import { CraftedRecipe } from "../types/coffee";

export function formatEmojiRecipeSummary(recipe: CraftedRecipe): string {
  const notesLine =
    recipe.tastingNotes.length > 0
      ? recipe.tastingNotes.join(" · ")
      : "Balanced & Smooth";

  const hasMilk =
    Boolean(recipe.milkPairing.name) &&
    !recipe.milkPairing.name.toLowerCase().includes("black") &&
    !recipe.milkPairing.name.toLowerCase().includes("no milk");

  const milkLine = hasMilk
    ? `🥛 Milk: ${recipe.milkPairing.name}${
        recipe.milkPairing.steamTempC > 0
          ? ` (${recipe.milkPairing.steamTempC}°C · ${recipe.milkPairing.textureStyle})`
          : ` (${recipe.milkPairing.textureStyle})`
      }`
    : "☕️ Milk: Black (No Milk)";

  const stepsBlock = recipe.brewRecipe.steps
    .map((step, i) => `${i + 1}. ${step}`)
    .join("\n");

  return [
    `☕️ *${recipe.title}*`,
    `✨ Tasting Notes: ${notesLine}`,
    "",
    `🫘 Bean: ${recipe.bean.name} (${recipe.bean.origin}${
      recipe.bean.region ? `, ${recipe.bean.region}` : ""
    }${recipe.bean.process ? ` · ${recipe.bean.process}` : ""})`,
    `🔥 Roast: ${recipe.roastProfile.level}`,
    milkLine,
    "",
    `⚖️ Brew Specs (${recipe.brewRecipe.method} · ${recipe.brewRecipe.servingTemp})`,
    `• Dose: ${recipe.brewRecipe.doseGrams}g`,
    `• Yield / Water: ${recipe.brewRecipe.waterOrYieldMl}ml (${recipe.brewRecipe.ratio})`,
    `• Temp: ${recipe.brewRecipe.waterTempC}°C | Grind: ${recipe.brewRecipe.grindSetting} | Time: ${recipe.brewRecipe.brewTime}`,
    "",
    "📝 Steps:",
    stepsBlock,
    "",
    `💡 Barista Tip: ${recipe.proTip}`,
    "",
    "— Crafted with KaapiWerk · Akarsh Seggemu (ఆకర్ష్ సెగ్గెము · కాఫీ బారిస్టా)",
  ].join("\n");
}

export async function copyTextToClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fallback below
    }
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
