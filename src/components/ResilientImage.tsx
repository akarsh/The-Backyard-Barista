import { useState } from "react";
import { Coffee } from "lucide-react";

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ResilientImage({ src, alt, className = "" }: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#EAE6DF] to-[#DCD6CC] text-[#5C5750] p-6 text-center ${className}`}
      >
        <Coffee className="w-8 h-8 mb-2 opacity-60" strokeWidth={1.5} />
        <span className="text-xs font-medium max-w-[22ch] leading-relaxed">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
