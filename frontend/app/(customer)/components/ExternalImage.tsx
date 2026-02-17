"use client";

import { useState } from "react";

interface ExternalImageProps {
  src: string;
  alt: string;
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

/**
 * Component for loading external images without Next.js optimization
 * Avoids 504 Gateway Timeout on /_next/image endpoint
 * Uses native HTML img tag with direct URL
 */
export function ExternalImage({
  src,
  alt,
  className,
  onError,
}: ExternalImageProps) {
  const [imageError, setImageError] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    // Use placeholder as fallback
    const img = e.target as HTMLImageElement;
    img.src = "/placeholder.svg";
    onError?.(e);
  };

  if (imageError) {
    return <img src="/placeholder.svg" alt={alt} className={className} />;
  }

  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
