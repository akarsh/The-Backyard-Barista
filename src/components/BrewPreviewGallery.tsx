import { ArrowRight } from "lucide-react";
import { AppTranslations } from "../i18n/translations";
import { CraftedRecipe } from "../types/coffee";
import { getBrewPreviewImageUrl } from "../utils/brewPreviewImage";

interface BrewPreviewGalleryProps {
  previews: CraftedRecipe[];
  selectedMethod: string;
  onSelect: (recipe: CraftedRecipe) => void;
  t: AppTranslations["studio"];
}

export function BrewPreviewGallery({
  previews,
  selectedMethod,
  onSelect,
  t,
}: BrewPreviewGalleryProps) {
  return (
    <section
      id="local-brew-previews"
      aria-labelledby="local-brew-previews-title"
      className="mt-6 rounded-xl border border-[#191614]/10 dark:border-white/10 bg-white dark:bg-[#1C1917] p-4 sm:p-6"
    >
      <div className="mb-5">
        <h3
          id="local-brew-previews-title"
          className="font-serif text-xl sm:text-2xl font-medium text-[#191614] dark:text-[#F5F0E6]"
        >
          {t.localPreviewsTitle}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#5C534A] dark:text-[#B8AFA4]">
          {t.localPreviewsSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {previews.map((recipe) => {
          const isSelectedMethod = recipe.brewRecipe.method === selectedMethod;

          return (
            <article
              key={recipe.brewRecipe.method}
              className="overflow-hidden rounded-xl border border-[#191614]/10 dark:border-white/10 bg-[#F8F5EE] dark:bg-[#26221E]"
            >
              <img
                src={getBrewPreviewImageUrl(recipe.brewRecipe.method)}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="block aspect-[16/9] w-full object-cover"
              />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm text-[#191614] dark:text-[#F5F0E6]">
                    {recipe.brewRecipe.method}
                  </h4>
                  {isSelectedMethod && (
                    <span className="shrink-0 rounded-full bg-[#EFE9DC] dark:bg-[#3A332B] px-2 py-1 text-[10px] font-semibold text-[#5C534A] dark:text-[#F5F0E6]">
                      {t.localPreviewCurrent}
                    </span>
                  )}
                </div>
                <p className="mt-2 font-serif text-lg leading-snug text-[#191614] dark:text-[#F5F0E6]">
                  {recipe.title}
                </p>
                <p className="mt-2 min-h-9 text-xs leading-relaxed text-[#5C534A] dark:text-[#B8AFA4]">
                  {recipe.tastingNotes.join(" · ")}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-[#5C534A] dark:text-[#B8AFA4]">
                  {recipe.brewRecipe.servingTemp} · {recipe.roastProfile.level}
                  {" · "}
                  {recipe.milkPairing.name}
                </p>
                <p className="mt-1 font-mono text-[11px] tabular-nums text-[#191614] dark:text-[#F5F0E6]">
                  {recipe.brewRecipe.doseGrams}g ·{" "}
                  {recipe.brewRecipe.waterOrYieldMl}ml · {recipe.brewRecipe.ratio}
                </p>
                <button
                  type="button"
                  onClick={() => onSelect(recipe)}
                  className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#191614] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#2F2A26] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] focus-visible:ring-offset-2 dark:bg-[#DC4A33] dark:hover:bg-[#C23B26] dark:focus-visible:ring-[#F59E0B] dark:focus-visible:ring-offset-[#26221E]"
                >
                  {t.localPreviewUse}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
