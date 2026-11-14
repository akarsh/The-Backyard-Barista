import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Pause, Play, RotateCcw, SkipForward, X } from "lucide-react";
import { AppTranslations } from "../i18n/translations";
import { CraftedRecipe, TimerPhase } from "../types/coffee";

interface BrewTimerProps {
  recipe: CraftedRecipe;
  isOpen: boolean;
  onClose: () => void;
  sessionKey: string;
  t: AppTranslations;
}

export function deriveTimerPhases(recipe: CraftedRecipe): TimerPhase[] {
  const provided = recipe.brewRecipe.timerPhases;
  if (Array.isArray(provided) && provided.length > 0) {
    return provided.map((phase) => ({
      label: phase.label,
      durationSeconds: Math.max(5, Math.round(phase.durationSeconds || 30)),
      instruction: phase.instruction,
    }));
  }

  const method = recipe.brewRecipe.method.toLowerCase();
  const steps = recipe.brewRecipe.steps || [];

  if (method.includes("pour") || method.includes("v60") || method.includes("chemex")) {
    return [
      {
        label: "Bloom",
        durationSeconds: 30,
        instruction:
          steps[0] ||
          `Saturate ${recipe.brewRecipe.doseGrams}g grounds with ~${Math.round(recipe.brewRecipe.doseGrams * 2)}ml water at ${recipe.brewRecipe.waterTempC}°C and swirl gently.`,
      },
      {
        label: "Spiral Pour",
        durationSeconds: 60,
        instruction:
          steps[1] ||
          `Pour slowly in concentric circles up to 60% of ${recipe.brewRecipe.waterOrYieldMl}ml target water.`,
      },
      {
        label: "Final Pour & Drawdown",
        durationSeconds: 60,
        instruction:
          steps[2] ||
          `Finish pouring to ${recipe.brewRecipe.waterOrYieldMl}ml and allow bed to drain flat.`,
      },
    ];
  }

  if (method.includes("aeropress")) {
    return [
      {
        label: "Wet & Stir",
        durationSeconds: 15,
        instruction:
          steps[0] ||
          `Pour ${recipe.brewRecipe.waterOrYieldMl}ml water at ${recipe.brewRecipe.waterTempC}°C and stir gently 3 times.`,
      },
      {
        label: "Steep",
        durationSeconds: 75,
        instruction:
          steps[1] ||
          "Cap or seal with plunger slightly inserted to create vacuum and steep steadily.",
      },
      {
        label: "Slow Plunge",
        durationSeconds: 30,
        instruction:
          steps[2] ||
          "Press down evenly with gentle palm pressure until you hear a soft hiss.",
      },
    ];
  }

  if (method.includes("cold")) {
    return [
      {
        label: "Saturation Wet",
        durationSeconds: 30,
        instruction:
          steps[0] ||
          `Pour cool filtered water over ${recipe.brewRecipe.doseGrams}g coarse grounds evenly.`,
      },
      {
        label: "Agitate & Seal",
        durationSeconds: 30,
        instruction:
          steps[1] ||
          "Stir gently to break dry pockets, cover, and transfer to steep for 12–16 hours.",
      },
    ];
  }

  const hasMilk =
    recipe.milkPairing.name &&
    !recipe.milkPairing.name.toLowerCase().includes("black") &&
    !recipe.milkPairing.name.toLowerCase().includes("no milk");

  if (hasMilk) {
    return [
      {
        label: "Espresso Extraction",
        durationSeconds: 28,
        instruction:
          steps[0] ||
          `Extract ${recipe.brewRecipe.waterOrYieldMl}ml from ${recipe.brewRecipe.doseGrams}g finely ground coffee at ${recipe.brewRecipe.waterTempC}°C.`,
      },
      {
        label: `Steam ${recipe.milkPairing.name}`,
        durationSeconds: 20,
        instruction:
          steps[1] ||
          `Texture ${recipe.milkPairing.name} to ${recipe.milkPairing.steamTempC || 60}°C for glossy microfoam.`,
      },
      {
        label: "Fold & Pour",
        durationSeconds: 12,
        instruction:
          steps[2] ||
          "Swirl pitcher until smooth and pour steady into the center of your cup.",
      },
    ];
  }

  return [
    {
      label: "Pre-Infusion",
      durationSeconds: 8,
      instruction:
        steps[0] ||
        `Lock portafilter with ${recipe.brewRecipe.doseGrams}g tamped grounds and engage pre-infusion.`,
    },
    {
      label: "Main Extraction",
      durationSeconds: 22,
      instruction:
        steps[1] ||
        `Pull to ${recipe.brewRecipe.waterOrYieldMl}ml (${recipe.brewRecipe.ratio}) aiming for a honey-like stream.`,
    },
  ];
}

function formatClock(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function BrewTimer({
  recipe,
  isOpen,
  onClose,
  sessionKey,
  t,
}: BrewTimerProps) {
  const phases = useMemo(() => deriveTimerPhases(recipe), [recipe]);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(phases[0]?.durationSeconds ?? 30);
  const [isRunning, setIsRunning] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  // Reset and auto-start whenever a new timer session opens or recipe changes
  useEffect(() => {
    if (!isOpen) return;
    setPhaseIndex(0);
    setSecondsLeft(phases[0]?.durationSeconds ?? 30);
    setIsRunning(true);
    setIsComplete(false);
  }, [isOpen, sessionKey, phases]);

  useEffect(() => {
    if (!isOpen || !isRunning || isComplete) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        if (phaseIndex < phases.length - 1) {
          const nextIdx = phaseIndex + 1;
          setPhaseIndex(nextIdx);
          return phases[nextIdx].durationSeconds;
        }

        setIsRunning(false);
        setIsComplete(true);
        return 0;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isOpen, isRunning, isComplete, phaseIndex, phases]);

  if (!isOpen) return null;

  const currentPhase = phases[phaseIndex] ?? phases[0];
  const nextPhase = phases[phaseIndex + 1] ?? null;

  const totalBrewSeconds = phases.reduce((acc, p) => acc + p.durationSeconds, 0);
  const remainingTotalSeconds = isComplete
    ? 0
    : secondsLeft +
      phases
        .slice(phaseIndex + 1)
        .reduce((acc, p) => acc + p.durationSeconds, 0);

  const phaseDuration = currentPhase?.durationSeconds || 1;
  const phaseProgress = isComplete
    ? 1
    : Math.min(1, Math.max(0, (phaseDuration - secondsLeft) / phaseDuration));

  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - phaseProgress);

  const handleRestart = () => {
    setPhaseIndex(0);
    setSecondsLeft(phases[0]?.durationSeconds ?? 30);
    setIsComplete(false);
    setIsRunning(true);
  };

  const handleSkipPhase = () => {
    if (phaseIndex < phases.length - 1) {
      const nextIdx = phaseIndex + 1;
      setPhaseIndex(nextIdx);
      setSecondsLeft(phases[nextIdx].durationSeconds);
      setIsComplete(false);
    } else {
      setSecondsLeft(0);
      setIsRunning(false);
      setIsComplete(true);
    }
  };

  const handleJumpToPhase = (index: number) => {
    setPhaseIndex(index);
    setSecondsLeft(phases[index].durationSeconds);
    setIsComplete(false);
    setIsRunning(true);
  };

  return (
    <div
      className="mt-5 bg-[#F8F5EE] dark:bg-[#26221E] border border-[#191614]/15 dark:border-white/12 rounded-xl p-4 sm:p-5"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#191614]/10 dark:border-white/10">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#A62C1B] dark:text-[#F59E0B] truncate">
            {t.timer.activeTitle} · {recipe.brewRecipe.method}
          </p>
          <p className="text-xs text-[#5C534A] dark:text-[#B8AFA4] mt-0.5 font-mono tabular-nums">
            {t.timer.totalRemaining} {formatClock(remainingTotalSeconds)} /{" "}
            {formatClock(totalBrewSeconds)}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close brew timer"
          className="w-10 h-10 rounded-lg bg-white dark:bg-[#1C1917] border border-[#191614]/10 dark:border-white/10 text-[#5C534A] dark:text-[#B8AFA4] hover:text-[#191614] dark:hover:text-[#F5F0E6] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-5 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
        {/* Circular Countdown Ring */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg
            className="w-28 h-28 -rotate-90"
            viewBox="0 0 112 112"
            aria-hidden="true"
          >
            <circle
              cx="56"
              cy="56"
              r={radius}
              fill="none"
              className="stroke-[#191614]/12 dark:stroke-white/15"
              strokeWidth="6"
            />
            <circle
              cx="56"
              cy="56"
              r={radius}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="stroke-[#A62C1B] dark:stroke-[#F59E0B] transition-[stroke-dashoffset] duration-300 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isComplete ? (
              <CheckCircle2 className="w-8 h-8 text-[#A62C1B] dark:text-[#F59E0B]" />
            ) : (
              <>
                <span className="font-mono text-2xl font-medium tabular-nums text-[#191614] dark:text-[#F5F0E6]">
                  {formatClock(secondsLeft)}
                </span>
                <span className="text-[11px] font-mono tabular-nums text-[#5C534A] dark:text-[#B8AFA4]">
                  {t.timer.step} 0{phaseIndex + 1}/0{phases.length}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Active Step Instruction & Controls */}
        <div className="flex-1 min-w-0 w-full text-center sm:text-left">
          {isComplete ? (
            <div>
              <h4 className="font-serif text-xl font-medium text-[#191614] dark:text-[#F5F0E6]">
                {t.timer.completeTitle}
              </h4>
              <p className="mt-1.5 text-sm text-[#5C534A] dark:text-[#B8AFA4] leading-relaxed">
                {recipe.title} {t.timer.completeSub} ({recipe.brewRecipe.doseGrams}g{" "}
                / {recipe.brewRecipe.waterOrYieldMl}ml).
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold text-[#5C534A] dark:text-[#B8AFA4]">
                {t.timer.currentStep} · {currentPhase.durationSeconds}
                {t.timer.targetSuffix}
              </p>
              <h4 className="mt-0.5 font-serif text-xl font-medium text-[#191614] dark:text-[#F5F0E6]">
                {currentPhase.label}
              </h4>
              <p className="mt-1.5 text-sm text-[#191614] dark:text-[#F5F0E6]/90 leading-relaxed">
                {currentPhase.instruction}
              </p>
              {nextPhase && (
                <p className="mt-2 text-xs text-[#5C534A] dark:text-[#B8AFA4]">
                  {t.timer.upNext}: {nextPhase.label} ({nextPhase.durationSeconds}s)
                </p>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {!isComplete && (
              <button
                type="button"
                onClick={() => setIsRunning((r) => !r)}
                className="min-h-[44px] sm:min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-[#191614] dark:bg-[#DC4A33] rounded-lg hover:bg-[#2F2A26] dark:hover:bg-[#C23B26] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>{t.timer.pause}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>{t.timer.resume}</span>
                  </>
                )}
              </button>
            )}

            {!isComplete && (
              <button
                type="button"
                onClick={handleSkipPhase}
                className="min-h-[44px] sm:min-h-[40px] px-3.5 py-2 text-xs font-semibold text-[#191614] dark:text-[#F5F0E6] bg-white dark:bg-[#1C1917] border border-[#191614]/15 dark:border-white/15 rounded-lg hover:bg-[#EFE9DC] dark:hover:bg-[#12100E] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>{t.timer.nextStep}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleRestart}
              className="min-h-[44px] sm:min-h-[40px] px-3.5 py-2 text-xs font-semibold text-[#191614] dark:text-[#F5F0E6] bg-white dark:bg-[#1C1917] border border-[#191614]/15 dark:border-white/15 rounded-lg hover:bg-[#EFE9DC] dark:hover:bg-[#12100E] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isComplete ? t.timer.brewAgain : t.timer.restart}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Phase Timeline */}
      <div className="pt-4 border-t border-[#191614]/10 dark:border-white/10 space-y-2">
        {phases.map((phase, idx) => {
          const isActive = !isComplete && idx === phaseIndex;
          const isDone = isComplete || idx < phaseIndex;
          return (
            <button
              key={`${phase.label}-${idx}`}
              type="button"
              onClick={() => handleJumpToPhase(idx)}
              className={`w-full min-h-[44px] text-left px-3.5 py-2.5 rounded-lg transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-[#1C1917] border border-[#A62C1B]/45 dark:border-[#F59E0B]/50 text-[#191614] dark:text-[#F5F0E6]"
                  : "bg-transparent hover:bg-white/60 dark:hover:bg-[#1C1917]/60 text-[#5C534A] dark:text-[#B8AFA4]"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`font-mono text-xs font-medium tabular-nums shrink-0 ${
                    isActive
                      ? "text-[#A62C1B] dark:text-[#F59E0B]"
                      : "text-[#5C534A] dark:text-[#B8AFA4]"
                  }`}
                >
                  0{idx + 1}.
                </span>
                <span
                  className={`text-xs font-semibold truncate ${
                    isActive ? "text-[#191614] dark:text-[#F5F0E6]" : ""
                  }`}
                >
                  {phase.label}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-[#5C534A] dark:text-[#B8AFA4]">
                  {isDone ? t.timer.done : isActive ? t.timer.active : t.timer.queued}
                </span>
                <span className="font-mono text-xs tabular-nums text-[#191614] dark:text-[#F5F0E6]">
                  {phase.durationSeconds}s
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
