/**
 * Signature 6px architectural textile band inspired by Telangana Pochampally Ikat
 * geometry and Berlin Bauhaus grid rhythm.
 */
export function PochampallyStrip({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`w-full h-[6px] overflow-hidden opacity-90 ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, #A62C1B 0 6px, #B45309 6px 12px, #191614 12px 15px, transparent 15px 21px)",
      }}
    />
  );
}
