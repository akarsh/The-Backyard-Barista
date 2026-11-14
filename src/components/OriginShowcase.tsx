import { ArrowUpRight } from "lucide-react";
import {
  MILK_ALTERNATIVES,
  MILK_FEATURE_IMAGE_URL,
  ORIGIN_LOTS,
  ROAST_PROFILES,
} from "../data/pantry";
import { AppTranslations } from "../i18n/translations";
import { OriginLot } from "../types/coffee";
import { ResilientImage } from "./ResilientImage";

interface OriginShowcaseProps {
  onSelectOriginLot: (lot: OriginLot) => void;
  onSelectRoast: (roastId: string) => void;
  onSelectMilk: (milkId: string) => void;
  t: AppTranslations;
}

export function OriginShowcase({
  onSelectOriginLot,
  onSelectRoast,
  onSelectMilk,
  t,
}: OriginShowcaseProps) {
  return (
    <>
      {/* Curated Single-Origin Lots */}
      <section
        id="origins"
        className="py-10 sm:py-14 border-b border-[#191614]/10 dark:border-white/10 scroll-mt-16 md:scroll-mt-24"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <p className="text-xs font-medium text-[#A62C1B] dark:text-[#F59E0B] mb-2">
                {t.origins.eyebrow}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#191614] dark:text-[#F5F0E6] [text-wrap:balance]">
                {t.origins.title}
              </h2>
            </div>
            <p className="text-sm text-[#5C534A] dark:text-[#B8AFA4] max-w-md">
              {t.origins.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ORIGIN_LOTS.map((lot) => (
              <article
                key={lot.id}
                className="group bg-white dark:bg-[#1C1917] border border-[#191614]/10 dark:border-white/10 rounded-xl overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5 min-w-0"
              >
                <div>
                  <div className="aspect-[4/3] bg-[#EFE9DC] dark:bg-[#26221E] overflow-hidden">
                    <ResilientImage
                      src={lot.imageUrl}
                      alt={lot.imageAlt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className="text-xs text-[#5C534A] dark:text-[#B8AFA4]">
                      {lot.origin} · {lot.region} · {lot.process} ·{" "}
                      <span className="font-mono tabular-nums">
                        {lot.elevation}
                      </span>
                    </p>
                    <h3 className="mt-2 font-serif text-xl font-medium text-[#191614] dark:text-[#F5F0E6]">
                      {lot.name}
                    </h3>
                    <p className="mt-1.5 text-xs font-medium text-[#A62C1B] dark:text-[#F59E0B]">
                      {lot.tastingLine}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[#5C534A] dark:text-[#B8AFA4]">
                      {lot.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-[#191614]/8 dark:border-white/10 flex items-center justify-between gap-4">
                  <span className="text-xs text-[#5C534A] dark:text-[#B8AFA4] truncate">
                    {lot.recommendedRoast}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectOriginLot(lot)}
                    className="inline-flex items-center gap-1.5 min-h-[36px] text-xs font-semibold text-[#191614] dark:text-[#F5F0E6] hover:text-[#A62C1B] dark:hover:text-[#F59E0B] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B] rounded-sm"
                  >
                    <span>{t.origins.loadIntoStudio}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Roast Curves & Milk Pairings Guide */}
      <section
        id="roast-milk"
        className="py-10 sm:py-14 border-b border-[#191614]/10 dark:border-white/10 scroll-mt-16 md:scroll-mt-24"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            <div className="lg:col-span-5 min-w-0">
              <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[320px] rounded-xl overflow-hidden bg-[#191614] border border-[#191614]/10 dark:border-white/10 relative">
                <ResilientImage
                  src={MILK_FEATURE_IMAGE_URL}
                  alt="Silky steamed oat milk poured into a speckled ceramic flat white cup"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-xs text-[#F59E0B]">
                    {t.origins.photoTag}
                  </p>
                  <p className="mt-1 font-serif text-xl font-medium [text-wrap:balance]">
                    {t.origins.photoHeading}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-[#1C1917] border border-[#191614]/10 dark:border-white/10 rounded-xl p-5 sm:p-6 lg:p-8 flex flex-col justify-between min-w-0">
              <div>
                <p className="text-xs font-medium text-[#A62C1B] dark:text-[#F59E0B] mb-2">
                  {t.origins.matrixEyebrow}
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#191614] dark:text-[#F5F0E6] [text-wrap:balance]">
                  {t.origins.matrixTitle}
                </h2>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#191614] dark:text-[#F5F0E6] pb-2 border-b border-[#191614]/10 dark:border-white/10">
                      {t.origins.roastProfiles}
                    </h3>
                    <div className="mt-3 space-y-2">
                      {ROAST_PROFILES.filter(
                        (r) => r.id !== "Barista Choice"
                      ).map((roast) => (
                        <button
                          key={roast.id}
                          type="button"
                          onClick={() => onSelectRoast(roast.id)}
                          className="w-full min-h-[44px] text-left p-3 rounded-lg bg-[#F8F5EE] dark:bg-[#26221E] hover:bg-[#EFE9DC] dark:hover:bg-[#312B25] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B]"
                        >
                          <p className="text-xs font-semibold text-[#191614] dark:text-[#F5F0E6]">
                            {roast.label}
                          </p>
                          <p className="mt-0.5 text-xs text-[#5C534A] dark:text-[#B8AFA4] leading-relaxed">
                            {roast.summary}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#191614] dark:text-[#F5F0E6] pb-2 border-b border-[#191614]/10 dark:border-white/10">
                      {t.origins.milkAlternatives}
                    </h3>
                    <div className="mt-3 space-y-2">
                      {MILK_ALTERNATIVES.filter(
                        (m) => m.id !== "Barista Choice"
                      ).map((milk) => (
                        <button
                          key={milk.id}
                          type="button"
                          onClick={() => onSelectMilk(milk.id)}
                          className="w-full min-h-[44px] text-left p-3 rounded-lg bg-[#F8F5EE] dark:bg-[#26221E] hover:bg-[#EFE9DC] dark:hover:bg-[#312B25] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B]"
                        >
                          <p className="text-xs font-semibold text-[#191614] dark:text-[#F5F0E6]">
                            {milk.label}
                          </p>
                          <p className="mt-0.5 text-xs text-[#5C534A] dark:text-[#B8AFA4] leading-relaxed">
                            {milk.note}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
