import { ArrowDownRight } from "lucide-react";
import { HERO_IMAGE_URL } from "../data/pantry";
import { AppTranslations } from "../i18n/translations";
import { BrandLogo } from "./BrandLogo";
import { PochampallyStrip } from "./PochampallyStrip";
import { ResilientImage } from "./ResilientImage";

interface HeroSectionProps {
  onStartCrafting: () => void;
  onFocusBarista: () => void;
  t: AppTranslations;
}

export function HeroSection({
  onStartCrafting,
  onFocusBarista,
  t,
}: HeroSectionProps) {
  return (
    <section
      id="top"
      className="pt-6 pb-0 sm:pt-10 border-b border-[#191614]/10 dark:border-white/10"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-9 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between py-1 sm:py-2 min-w-0">
            <div>
              <div className="mb-4 min-w-0">
                <p className="text-[13px] sm:text-sm font-semibold text-[#A62C1B] dark:text-[#F59E0B]">
                  {t.hero.eyebrow}
                </p>
                <p className="mt-1 text-xs sm:text-[13px] font-medium text-[#8C4508] dark:text-[#F59E0B]/85">
                  {t.hero.nativeLine}
                </p>
              </div>

              <h1 className="font-serif text-[clamp(1.85rem,4.1vw,3.6rem)] leading-[1.08] tracking-tight font-medium text-[#191614] dark:text-[#F5F0E6] [text-wrap:balance] max-w-xl">
                {t.hero.headline}
              </h1>

              <p className="mt-4 sm:mt-5 text-[15px] sm:text-[16px] leading-[1.65] text-[#5C534A] dark:text-[#B8AFA4] max-w-[54ch]">
                {t.hero.description}
              </p>
            </div>

            <div className="mt-6 sm:mt-8">
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={onStartCrafting}
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 text-sm font-semibold text-white bg-[#A62C1B] dark:bg-[#DC4A33] rounded-lg hover:bg-[#882214] dark:hover:bg-[#C23B26] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#12100E] cursor-pointer"
                >
                  <span>{t.hero.ctaCraft}</span>
                  <ArrowDownRight className="w-4 h-4 shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={onFocusBarista}
                  className="inline-flex items-center justify-center min-h-[48px] px-5 py-3 text-sm font-semibold text-[#191614] dark:text-[#F5F0E6] bg-white dark:bg-[#1C1917] border border-[#191614]/15 dark:border-white/15 rounded-lg hover:bg-[#EFE9DC] dark:hover:bg-[#26221E] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A62C1B] dark:focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#12100E] cursor-pointer"
                >
                  {t.hero.ctaAsk}
                </button>
              </div>

              <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#5C534A] dark:text-[#B8AFA4]">
                <span>{t.hero.pills[0]}</span>
                <span aria-hidden="true">·</span>
                <span>{t.hero.pills[1]}</span>
                <span aria-hidden="true">·</span>
                <span>{t.hero.pills[2]}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 min-w-0">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[380px] rounded-xl overflow-hidden bg-[#191614] border border-[#191614]/10 dark:border-white/10">
              <ResilientImage
                src={HERO_IMAGE_URL}
                alt="Matte black ceramic V60 pour-over blooming on a dark stone specialty coffee bar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/55 to-transparent pointer-events-none" />
              <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#12100E]/80 backdrop-blur-sm border border-white/15 text-white">
                <BrandLogo className="w-4 h-4 shrink-0" />
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#F5F0E6]">
                  {t.brandName}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 sm:left-5 sm:right-5 flex items-end justify-between gap-3 text-white">
                <div className="min-w-0">
                  <p className="text-xs text-[#F59E0B]">{t.hero.cardCaptionTitle}</p>
                  <p className="text-xs sm:text-sm font-medium truncate">
                    {t.hero.cardCaptionSub}
                  </p>
                </div>
                <span className="font-mono text-xs tabular-nums text-white/90 whitespace-nowrap shrink-0">
                  18.5g / 300ml
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[#191614]/10 dark:border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="min-w-0">
            <p className="text-xs text-[#5C534A] dark:text-[#B8AFA4]">
              {t.hero.metrics.lotsLabel}
            </p>
            <p className="mt-1 font-mono text-lg sm:text-xl font-medium tabular-nums text-[#191614] dark:text-[#F5F0E6]">
              1,280–2,150m
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#5C534A] dark:text-[#B8AFA4]">
              {t.hero.metrics.roastLabel}
            </p>
            <p className="mt-1 font-mono text-lg sm:text-xl font-medium tabular-nums text-[#191614] dark:text-[#F5F0E6]">
              {t.hero.metrics.roastValue}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#5C534A] dark:text-[#B8AFA4]">
              {t.hero.metrics.milkLabel}
            </p>
            <p className="mt-1 font-mono text-lg sm:text-xl font-medium tabular-nums text-[#191614] dark:text-[#F5F0E6]">
              {t.hero.metrics.milkValue}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#5C534A] dark:text-[#B8AFA4]">
              {t.hero.metrics.tempLabel}
            </p>
            <p className="mt-1 font-mono text-lg sm:text-xl font-medium tabular-nums text-[#191614] dark:text-[#F5F0E6]">
              90–96°C
            </p>
          </div>
        </div>
      </div>
      <PochampallyStrip />
    </section>
  );
}
