interface BrandLogoProps {
  className?: string;
  monochrome?: boolean;
}

/**
 * KaapiWerk Original Print-Ready Stamp (100% Copyright-Free):
 * - Octagonal Kakatiya / Bauhaus chamfered seal with subtle backing fill
 * - Terracotta V60 pour-over cone & extraction drip stream
 * - Pochampally ikat diamond bean with a crisp negative-space S-curve seam
 * Zero gradients or fine hairlines — sharp from 16px favicons to 1-ink kraft cup stamps.
 */
export function BrandLogo({
  className = "w-8 h-8",
  monochrome = false,
}: BrandLogoProps) {
  const sealBg = monochrome
    ? "fill-transparent"
    : "fill-[#EFE9DC] dark:fill-[#26221E]";
  const frameStroke = monochrome
    ? "stroke-current"
    : "stroke-[#191614] dark:stroke-[#F5F0E6]";
  const primaryFill = monochrome
    ? "fill-current"
    : "fill-[#A62C1B] dark:fill-[#DC4A33]";
  const secondaryStroke = monochrome
    ? "stroke-current"
    : "stroke-[#191614] dark:stroke-[#F5F0E6]";
  const accentFill = monochrome
    ? "fill-current"
    : "fill-[#B45309] dark:fill-[#F59E0B]";

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Octagonal seal backdrop & Kakatiya / Bauhaus perimeter */}
      <polygon
        points="20,4 44,4 60,20 60,44 44,60 20,60 4,44 4,20"
        className={`${sealBg} ${frameStroke}`}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Bauhaus dripper collar arms */}
      <line
        x1="13"
        y1="17"
        x2="51"
        y2="17"
        className={secondaryStroke}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* V60 / Kalita pour-over trapezoid in Pochampally Terracotta */}
      <polygon points="18,17 46,17 37,29 27,29" className={primaryFill} />

      {/* Crisp center extraction drop */}
      <circle cx="32" cy="32" r="1.8" className={secondaryStroke} />

      {/* Pochampally ikat diamond roasted bean */}
      <polygon points="32,35 44,44.5 32,54 20,44.5" className={accentFill} />

      {/* Negative-space roasted coffee bean S-curve seam */}
      <path
        d="M32 37.5 C30 41.5 34 47.5 32 51.5"
        className="stroke-[#EFE9DC] dark:stroke-[#26221E]"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
