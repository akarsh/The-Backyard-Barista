import { ArrowDownRight } from "lucide-react";
import { HERO_IMAGE_URL } from "../data/pantry";
import { ResilientImage } from "./ResilientImage";

interface HeroSectionProps {
  onStartCrafting: () => void;
  onFocusBarista: () => void;
}

export function HeroSection({
  onStartCrafting,
  onFocusBarista,
}: HeroSectionProps) {
  return (
    <section id="top" className="pt-10 pb-12 border-b border-[#161514]/10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between py-2">
            <div>
              <p className="text-xs font-medium tracking-wide text-[#9A3412] mb-4">
                Third-Wave Coffee Studio · Guided by Milo, Head Barista
              </p>

              <h1 className="font-serif text-[clamp(2.25rem,4.2vw,3.75rem)] leading-[1.06] tracking-tight font-medium text-[#161514] [text-wrap:balance] max-w-xl">
                Craft your signature cup, guided by flavor.
              </h1>

              <p className="mt-5 text-[16px] leading-[1.65] text-[#57534E] max-w-[54ch]">
                Tell our barista whether you crave bright florals, dark cacao
                depth, or velvety caramel sweetness. Dial in single-origin lots,
                roast curves, and milk pairings with exact gram-for-gram brew
                parameters.
              </p>
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onStartCrafting}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#9A3412] rounded-lg hover:bg-[#7C2D12] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3412] focus-visible:ring-offset-2 cursor-pointer"
                >
                  <span>Craft Your Cup</span>
                  <ArrowDownRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onFocusBarista}
                  className="inline-flex items-center px-5 py-3 text-sm font-semibold text-[#161514] bg-white border border-[#161514]/15 rounded-lg hover:bg-[#EFECE6] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3412] focus-visible:ring-offset-2 cursor-pointer"
                >
                  Ask the Barista
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#57534E]">
                <span>Direct-Trade Micro-Lots</span>
                <span aria-hidden="true">·</span>
                <span>Custom Roast Development</span>
                <span aria-hidden="true">·</span>
                <span>Plant &amp; Dairy Microfoam Pairing</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[280px] lg:min-h-[380px] rounded-xl overflow-hidden bg-[#161514]">
              <ResilientImage
                src={HERO_IMAGE_URL}
                alt="Matte black ceramic V60 pour-over blooming on a dark stone specialty coffee bar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4 text-white">
                <div>
                  <p className="text-xs text-white/80">Pour-Over Bar</p>
                  <p className="text-sm font-medium">
                    93°C Precision Bloom · 1:16 Extraction
                  </p>
                </div>
                <span className="font-mono text-xs tabular-nums text-white/90">
                  18.5g / 300ml
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-[#161514]/10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-[#57534E]">Curated Origin Lots</p>
            <p className="mt-1 font-mono text-xl font-medium tabular-nums text-[#161514]">
              1,280–2,150m
            </p>
          </div>
          <div>
            <p className="text-xs text-[#57534E]">Roast Development</p>
            <p className="mt-1 font-mono text-xl font-medium tabular-nums text-[#161514]">
              4 Curves
            </p>
          </div>
          <div>
            <p className="text-xs text-[#57534E]">Milk &amp; Botanical Pairings</p>
            <p className="mt-1 font-mono text-xl font-medium tabular-nums text-[#161514]">
              6 Textures
            </p>
          </div>
          <div>
            <p className="text-xs text-[#57534E]">Target Brew Water</p>
            <p className="mt-1 font-mono text-xl font-medium tabular-nums text-[#161514]">
              90–96°C
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
