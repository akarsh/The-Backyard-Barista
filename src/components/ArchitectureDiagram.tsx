import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Coffee,
  Cpu,
  Database,
  Globe,
  Lock,
  Server,
  SlidersHorizontal,
} from "lucide-react";
import { AppTranslations } from "../i18n/translations";

type FlowMode = "server" | "static";

interface ArchitectureDiagramProps {
  t: AppTranslations;
}

export function ArchitectureDiagram({ t }: ArchitectureDiagramProps) {
  const [flowMode, setFlowMode] = useState<FlowMode>("server");

  return (
    <section
      id="how-it-works"
      className="py-10 sm:py-14 border-b border-[#191614]/10 dark:border-white/10 scroll-mt-16 md:scroll-mt-24"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <p className="text-xs font-medium text-[#A62C1B] dark:text-[#F59E0B] mb-2">
              {t.diagram.eyebrow}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#191614] dark:text-[#F5F0E6] [text-wrap:balance]">
              {t.diagram.title}
            </h2>
          </div>

          <div
            role="group"
            aria-label={t.accessibility.architectureMode}
            className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#EFE9DC] dark:bg-[#26221E] border border-[#191614]/10 dark:border-white/10 self-start md:self-auto"
          >
            <button
              type="button"
              onClick={() => setFlowMode("server")}
              aria-pressed={flowMode === "server"}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                flowMode === "server"
                  ? "bg-white dark:bg-[#12100E] text-[#191614] dark:text-[#F5F0E6] shadow-xs"
                  : "text-[#5C534A] dark:text-[#B8AFA4] hover:text-[#191614] dark:hover:text-[#F5F0E6]"
              }`}
            >
              {t.diagram.serverModeBtn}
            </button>
            <button
              type="button"
              onClick={() => setFlowMode("static")}
              aria-pressed={flowMode === "static"}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                flowMode === "static"
                  ? "bg-white dark:bg-[#12100E] text-[#191614] dark:text-[#F5F0E6] shadow-xs"
                  : "text-[#5C534A] dark:text-[#B8AFA4] hover:text-[#191614] dark:hover:text-[#F5F0E6]"
              }`}
            >
              {t.diagram.staticModeBtn}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1917] border border-[#191614]/10 dark:border-white/10 rounded-xl p-5 sm:p-6 lg:p-8">
          {/* 4-Stage Pipeline — 12-col exact sum: 2 + 1 + 3 + 1 + 2 + 1 + 2 = 12 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-2.5 items-stretch">
            {/* Stage 1 */}
            <div className="lg:col-span-2 bg-[#F8F5EE] dark:bg-[#26221E] border border-[#191614]/10 dark:border-white/10 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-medium text-[#A62C1B] dark:text-[#F59E0B]">
                    {t.diagram.stage1Tag}
                  </span>
                  <SlidersHorizontal className="w-4 h-4 text-[#A62C1B] dark:text-[#F59E0B] shrink-0" />
                </div>
                <h3 className="text-sm font-semibold text-[#191614] dark:text-[#F5F0E6]">
                  {t.diagram.stage1Title}
                </h3>
                <p className="mt-1.5 text-xs text-[#5C534A] dark:text-[#B8AFA4] leading-relaxed">
                  {t.diagram.stage1Desc}
                </p>
              </div>
              <p className="mt-3 pt-2.5 border-t border-[#191614]/10 dark:border-white/10 font-mono text-[11px] text-[#5C534A] dark:text-[#B8AFA4]">
                {t.diagram.stage1Foot}
              </p>
            </div>

            {/* Connector 1->2 */}
            <div className="lg:col-span-1 flex items-center justify-center py-1 lg:py-0 text-[#A62C1B] dark:text-[#F59E0B]">
              <ArrowDown className="w-4 h-4 lg:hidden" />
              <ArrowRight className="w-4 h-4 hidden lg:block" />
            </div>

            {/* Stage 2: Dual Engine */}
            <div className="lg:col-span-3 space-y-2.5">
              <div
                className={`rounded-xl p-4 border transition-colors ${
                  flowMode === "server"
                    ? "bg-[#F8F5EE] dark:bg-[#26221E] border-[#A62C1B] dark:border-[#F59E0B]"
                    : "bg-[#F8F5EE]/50 dark:bg-[#26221E]/40 border-[#191614]/10 dark:border-white/10 opacity-65"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-xs font-medium text-[#A62C1B] dark:text-[#F59E0B]">
                    {t.diagram.stage2aTag}
                  </span>
                  <Server className="w-4 h-4 text-[#A62C1B] dark:text-[#F59E0B] shrink-0" />
                </div>
                <p className="text-xs font-semibold text-[#191614] dark:text-[#F5F0E6]">
                  {t.diagram.stage2aTitle}
                </p>
                <p className="mt-1 text-xs text-[#5C534A] dark:text-[#B8AFA4] leading-relaxed">
                  {t.diagram.stage2aDesc}
                </p>
              </div>

              <div
                className={`rounded-xl p-4 border transition-colors ${
                  flowMode === "static"
                    ? "bg-[#F8F5EE] dark:bg-[#26221E] border-[#A62C1B] dark:border-[#F59E0B]"
                    : "bg-[#F8F5EE]/50 dark:bg-[#26221E]/40 border-[#191614]/10 dark:border-white/10 opacity-65"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-xs font-medium text-[#B45309] dark:text-[#F59E0B]">
                    {t.diagram.stage2bTag}
                  </span>
                  <Globe className="w-4 h-4 text-[#B45309] dark:text-[#F59E0B] shrink-0" />
                </div>
                <p className="text-xs font-semibold text-[#191614] dark:text-[#F5F0E6]">
                  {t.diagram.stage2bTitle}
                </p>
                <p className="mt-1 text-xs text-[#5C534A] dark:text-[#B8AFA4] leading-relaxed">
                  {t.diagram.stage2bDesc}
                </p>
              </div>
            </div>

            {/* Connector 2->3 */}
            <div className="lg:col-span-1 flex items-center justify-center py-1 lg:py-0 text-[#A62C1B] dark:text-[#F59E0B]">
              <ArrowDown className="w-4 h-4 lg:hidden" />
              <ArrowRight className="w-4 h-4 hidden lg:block" />
            </div>

            {/* Stage 3: Live Workbench */}
            <div className="lg:col-span-2 bg-[#F8F5EE] dark:bg-[#26221E] border border-[#191614]/10 dark:border-white/10 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-medium text-[#A62C1B] dark:text-[#F59E0B]">
                    {t.diagram.stage3Tag}
                  </span>
                  <Cpu className="w-4 h-4 text-[#A62C1B] dark:text-[#F59E0B] shrink-0" />
                </div>
                <h3 className="text-sm font-semibold text-[#191614] dark:text-[#F5F0E6]">
                  {t.diagram.stage3Title}
                </h3>
                <p className="mt-1.5 text-xs text-[#5C534A] dark:text-[#B8AFA4] leading-relaxed">
                  {t.diagram.stage3Desc}
                </p>
              </div>
              <p className="mt-3 pt-2.5 border-t border-[#191614]/10 dark:border-white/10 font-mono text-[11px] text-[#5C534A] dark:text-[#B8AFA4]">
                {t.diagram.stage3Foot}
              </p>
            </div>

            {/* Connector 3->4 */}
            <div className="lg:col-span-1 flex items-center justify-center py-1 lg:py-0 text-[#A62C1B] dark:text-[#F59E0B]">
              <ArrowDown className="w-4 h-4 lg:hidden" />
              <ArrowRight className="w-4 h-4 hidden lg:block" />
            </div>

            {/* Stage 4: Journal Storage */}
            <div className="lg:col-span-2 bg-[#F8F5EE] dark:bg-[#26221E] border border-[#191614]/10 dark:border-white/10 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-medium text-[#A62C1B] dark:text-[#F59E0B]">
                    {t.diagram.stage4Tag}
                  </span>
                  <Database className="w-4 h-4 text-[#A62C1B] dark:text-[#F59E0B] shrink-0" />
                </div>
                <h3 className="text-sm font-semibold text-[#191614] dark:text-[#F5F0E6]">
                  {t.diagram.stage4Title}
                </h3>
                <p className="mt-1.5 text-xs text-[#5C534A] dark:text-[#B8AFA4] leading-relaxed">
                  {t.diagram.stage4Desc}
                </p>
              </div>
              <p className="mt-3 pt-2.5 border-t border-[#191614]/10 dark:border-white/10 font-mono text-[11px] text-[#5C534A] dark:text-[#B8AFA4]">
                {t.diagram.stage4Foot}
              </p>
            </div>
          </div>

          {/* Human-Readable Trust & Security Summary Row */}
          <div className="mt-6 pt-5 border-t border-[#191614]/10 dark:border-white/10 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-[#A62C1B] dark:text-[#F59E0B] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#191614] dark:text-[#F5F0E6]">
                  {t.diagram.trust1Title}
                </p>
                <p className="mt-0.5 text-[#5C534A] dark:text-[#B8AFA4] leading-relaxed">
                  {t.diagram.trust1Desc}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Coffee className="w-4 h-4 text-[#A62C1B] dark:text-[#F59E0B] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#191614] dark:text-[#F5F0E6]">
                  {t.diagram.trust2Title}
                </p>
                <p className="mt-0.5 text-[#5C534A] dark:text-[#B8AFA4] leading-relaxed">
                  {t.diagram.trust2Desc}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Server className="w-4 h-4 text-[#A62C1B] dark:text-[#F59E0B] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#191614] dark:text-[#F5F0E6]">
                  {t.diagram.trust3Title}
                </p>
                <p className="mt-0.5 text-[#5C534A] dark:text-[#B8AFA4] leading-relaxed">
                  {t.diagram.trust3Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
