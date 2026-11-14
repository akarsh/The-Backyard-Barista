import { useMemo, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { AppTranslations } from "../i18n/translations";
import { CraftedRecipe } from "../types/coffee";

interface ShoppingListPanelProps {
  recipe: CraftedRecipe;
  isOpen: boolean;
  onClose: () => void;
  t: AppTranslations;
}

interface ShoppingListData {
  ingredients: string[];
  equipment: string[];
  formattedText: string;
}

export function buildShoppingList(recipe: CraftedRecipe): ShoppingListData {
  const method = recipe.brewRecipe.method.toLowerCase();
  const milkName = recipe.milkPairing.name;
  const hasMilk =
    Boolean(milkName) &&
    !milkName.toLowerCase().includes("black") &&
    !milkName.toLowerCase().includes("no milk");
  const isIced = recipe.brewRecipe.servingTemp.toLowerCase().includes("iced");

  const ingredients: string[] = [
    `Whole Coffee Beans: ${recipe.bean.name} (${recipe.bean.origin}, ${recipe.bean.region} · ${recipe.bean.process} · ${recipe.roastProfile.level}) — 250g bag (uses ${recipe.brewRecipe.doseGrams}g per cup)`,
  ];

  if (hasMilk) {
    ingredients.push(
      `Milk / Alternative: ${milkName} (barista blend recommended for ${recipe.milkPairing.textureStyle.toLowerCase()})`
    );
  }

  ingredients.push(
    `Filtered Brewing Water: ${recipe.brewRecipe.waterOrYieldMl}ml per cup (heat to ${recipe.brewRecipe.waterTempC}°C)`
  );

  if (isIced) {
    ingredients.push("Ice: Clear filtered ice cubes for serving");
  }

  const equipment: string[] = [];

  if (method.includes("v60") || method.includes("pour")) {
    equipment.push(
      "Pour-over dripper (Hario V60 or equivalent) + matching paper filters",
      "Gooseneck kettle for controlled spiral pours",
      "Glass server or ceramic mug"
    );
  } else if (method.includes("chemex")) {
    equipment.push(
      "Chemex glass brewer + bonded square paper filters",
      "Gooseneck kettle"
    );
  } else if (method.includes("aeropress")) {
    equipment.push(
      "AeroPress brewer + paper micro-filters + stirring paddle",
      "Sturdy heat-safe mug"
    );
  } else if (method.includes("cold")) {
    equipment.push(
      "Cold brew carafe or wide-mouth glass jar",
      "Fine-mesh strainer or paper filter"
    );
  } else {
    equipment.push(
      "Espresso machine (or stovetop Moka pot) with tamper",
      hasMilk
        ? "Preheated 4–6oz ceramic cup or cortado glass"
        : "Preheated espresso demitasse"
    );
  }

  equipment.push(
    `Burr coffee grinder (dialed to ${recipe.brewRecipe.grindSetting})`,
    "Digital coffee scale (0.1g precision) & brew timer"
  );

  if (hasMilk && !isIced) {
    equipment.push(
      `Stainless milk pitcher + steam wand or handheld frother (target ${recipe.milkPairing.steamTempC || 60}°C)`
    );
  }

  const lines: string[] = [
    `${recipe.title} — Shopping & Prep List`,
    `${recipe.brewRecipe.method} (${recipe.brewRecipe.servingTemp}) · ${recipe.brewRecipe.doseGrams}g : ${recipe.brewRecipe.waterOrYieldMl}ml`,
    "",
    "INGREDIENTS",
    ...ingredients.map((item) => `- [ ] ${item}`),
    "",
    "EQUIPMENT",
    ...equipment.map((item) => `- [ ] ${item}`),
  ];

  return {
    ingredients,
    equipment,
    formattedText: lines.join("\n"),
  };
}

export function ShoppingListPanel({
  recipe,
  isOpen,
  onClose,
  t,
}: ShoppingListPanelProps) {
  const [copied, setCopied] = useState(false);

  const list = useMemo(() => buildShoppingList(recipe), [recipe]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(list.formattedText);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = list.formattedText;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-5 bg-[#F8F5EE] dark:bg-[#26221E] border border-[#191614]/15 dark:border-white/12 rounded-xl p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#191614]/10 dark:border-white/10">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#A62C1B] dark:text-[#F59E0B]">
            {t.shopping.title}
          </p>
          <p className="text-xs text-[#5C534A] dark:text-[#B8AFA4] mt-0.5">
            {t.shopping.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#191614] dark:bg-[#DC4A33] hover:bg-[#2F2A26] dark:hover:bg-[#C23B26] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#F59E0B] dark:text-white" />
                <span>{t.shopping.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.shopping.copyList}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.accessibility.closeShoppingList}
            className="w-10 h-10 rounded-lg bg-white dark:bg-[#1C1917] border border-[#191614]/10 dark:border-white/10 text-[#5C534A] dark:text-[#B8AFA4] hover:text-[#191614] dark:hover:text-[#F5F0E6] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-xs font-semibold text-[#191614] dark:text-[#F5F0E6] mb-2.5">
            {t.shopping.ingredients}
          </h4>
          <ul className="space-y-2 text-xs leading-relaxed text-[#191614] dark:text-[#F5F0E6]/90">
            {list.ingredients.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-mono text-[#A62C1B] dark:text-[#F59E0B] shrink-0">
                  - [ ]
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-[#191614] dark:text-[#F5F0E6] mb-2.5">
            {t.shopping.equipment}
          </h4>
          <ul className="space-y-2 text-xs leading-relaxed text-[#191614] dark:text-[#F5F0E6]/90">
            {list.equipment.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-mono text-[#A62C1B] dark:text-[#F59E0B] shrink-0">
                  - [ ]
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[#191614]/10 dark:border-white/10">
        <label
          htmlFor="shopping-list-plain"
          className="block text-xs font-medium text-[#5C534A] dark:text-[#B8AFA4] mb-2"
        >
          {t.shopping.plainTextPreview}
        </label>
        <textarea
          id="shopping-list-plain"
          readOnly
          value={list.formattedText}
          rows={7}
          onFocus={(e) => e.currentTarget.select()}
          className="w-full p-3 rounded-lg bg-white dark:bg-[#1C1917] border border-[#191614]/10 dark:border-white/10 font-mono text-xs leading-relaxed text-[#191614] dark:text-[#F5F0E6] focus:outline-none focus:ring-2 focus:ring-[#A62C1B] dark:focus:ring-[#F59E0B] resize-none"
        />
      </div>
    </div>
  );
}
