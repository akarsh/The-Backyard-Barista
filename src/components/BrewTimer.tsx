import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Pause, Play, RotateCcw, SkipForward, X } from "lucide-react";
import { CraftedRecipe, TimerPhase } from "../types/coffee";

interface BrewTimerProps {
  recipe: CraftedRecipe;
  isOpen: boolean;
  onClose: () => void;
  sessionKey: string;
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
      className="mt-5 bg-[#F7F6F3] border border-[#161514]/15 rounded-xl p-5"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#161514]/10">
        <div>
          <p className="text-xs font-medium text-[#9A3412]">
            Active Brew Timer · {recipe.brewRecipe.method}
          </p>
          <p className="text-xs text-[#57534E] mt-0.5 font-mono tabular-nums">
            Total Remaining {formatClock(remainingTotalSeconds)} /{" "}
            {formatClock(totalBrewSeconds)}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close brew timer"
          className="w-8 h-8 rounded-lg bg-white border border-[#161514]/10 text-[#57534E] hover:text-[#161514] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-5 flex flex-col sm:flex-row items-center sm:items-start gap-6">
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
              stroke="rgba(22, 21, 20, 0.1)"
              strokeWidth="6"
            />
            <circle
              cx="56"
              cy="56"
              r={radius}
              fill="none"
              stroke="#9A3412"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-[stroke-dashoffset] duration-300 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isComplete ? (
              <CheckCircle2 className="w-8 h-8 text-[#9A3412]" />
            ) : (
              <>
                <span className="font-mono text-2xl font-medium tabular-nums text-[#161514]">
                  {formatClock(secondsLeft)}
                </span>
                <span className="text-[11px] font-mono tabular-nums text-[#57534E]">
                  Step 0{phaseIndex + 1}/0{phases.length}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Active Step Instruction & Controls */}
        <div className="flex-1 w-full text-center sm:text-left">
          {isComplete ? (
            <div>
              <h4 className="font-serif text-xl font-medium text-[#161514]">
                Brew complete — enjoy your cup
              </h4>
              <p className="mt-1.5 text-sm text-[#57534E] leading-relaxed">
                {recipe.title} is ready to serve ({recipe.brewRecipe.doseGrams}g{" "}
                / {recipe.brewRecipe.waterOrYieldMl}ml).
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold text-[#57534E]">
                Current Step · {currentPhase.durationSeconds}s target
              </p>
              <h4 className="mt-0.5 font-serif text-xl font-medium text-[#161514]">
                {currentPhase.label}
              </h4>
              <p className="mt-1.5 text-sm text-[#161514] leading-relaxed">
                {currentPhase.instruction}
              </p>
              {nextPhase && (
                <p className="mt-2 text-xs text-[#57534E]">
                  Up next: {nextPhase.label} ({nextPhase.durationSeconds}s)
                </p>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {!isComplete && (
              <button
                type="button"
                onClick={() => setIsRunning((r) => !r)}
                className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-[#161514] rounded-lg hover:bg-[#2C2A28] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Resume</span>
                  </>
                )}
              </button>
            )}

            {!isComplete && (
              <button
                type="button"
                onClick={handleSkipPhase}
                className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-[#161514] bg-white border border-[#161514]/15 rounded-lg hover:bg-[#EFECE6] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Next Step</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleRestart}
              className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-[#161514] bg-white border border-[#161514]/15 rounded-lg hover:bg-[#EFECE6] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isComplete ? "Brew Again" : "Restart"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Phase Timeline */}
      <div className="pt-4 border-t border-[#161514]/10 space-y-2">
        {phases.map((phase, idx) => {
          const isActive = !isComplete && idx === phaseIndex;
          const isDone = isComplete || idx < phaseIndex;
          return (
            <button
              key={`${phase.label}-${idx}`}
              type="button"
              onClick={() => handleJumpToPhase(idx)}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-colors flex items-center justify-between gap-4 cursor-pointer ${
                isActive
                  ? "bg-white border border-[#9A3412]/40 text-[#161514]"
                  : "bg-transparent hover:bg-white/60 text-[#57534E]"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`font-mono text-xs font-medium tabular-nums shrink-0 ${
                    isActive ? "text-[#9A3412]" : "text-[#57534E]"
                  }`}
                >
                  0{idx + 1}.
                </span>
                <span
                  className={`text-xs font-semibold truncate ${
                    isActive ? "text-[#161514]" : ""
                  }`}
                >
                  {phase.label}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-[#57534E]">
                  {isDone ? "Done" : isActive ? "Active" : "Queued"}
                </span>
                <span className="font-mono text-xs tabular-nums text-[#161514]">
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
