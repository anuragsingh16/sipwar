"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

// Context-aware fallback images — all pointing to our reliable local assets
export const FALLBACKS = {
  product: "/images/coffee-hero.jpg",
  avatar: "/images/avatar-placeholder.svg",
  hero: "/images/coffee-hero.jpg",
  blog: "/images/coffee-hero.jpg",
  logo: "/images/logo-badge.png",
} as const;

// Pexels CDN — reliable coffee image URLs by context
export const PEXELS = {
  hero:        "/images/coffee-hero.jpg",
  beans:       "/images/products/Filter_Coffee_Arabica_AA/pexels-esranurkalay-10101325 (1).jpg",
  farm:        "/images/our_story/direct_trade.jpg",
  farmer:      "/images/our_story/pexels-michael-burrows-7125765.jpg",
  roasting:    "/images/coffee-hero.jpg",
  arabica:     "/images/products/Filter_Coffee_Arabica_AA/pexels-merve-arli-842967267-30404822.jpg",
  adaptogenic: "/images/products/Adaptogenic_Morning_Blend/pexels-cihanyuce-30349811.jpg",
  malabar:     "/images/products/Monsoon_Malabar_Dark_Roast/pexels-melike-2157605065-36765363 (1).jpg",
  filter:      "/images/products/Heritage_South_Indian_Filter/pexels-sureyya-993677887-30909888.jpg",
  chikmagalur: "/images/products/Chikmagalur_Estate_Reserve/pexels-teysa-tugadi-1282097472-29305567.jpg",
  nilgiri:     "/images/products/Nilgiri_Breakfast_Blend/pexels-marek-kupiec-1696944-9892392.jpg",
  journalHero: "/images/journal/meet_the_budangiri.jpg",
  sustainability: "/images/journal/sustainability.jpg",
} as const;

export type FallbackContext = keyof typeof FALLBACKS;

interface FallbackImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  context?: FallbackContext;
}

export function FallbackImage({
  src,
  alt,
  fallbackSrc,
  context = "product",
  ...props
}: FallbackImageProps) {
  const defaultFallback = fallbackSrc ?? FALLBACKS[context];
  const [imgSrc, setImgSrc] = useState<string | typeof src>(src);
  const [errored, setErrored] = useState(false);

  return (
    <Image
      {...props}
      src={errored ? defaultFallback : (imgSrc || defaultFallback)}
      alt={alt}
      onError={() => {
        if (!errored) {
          setImgSrc(defaultFallback);
          setErrored(true);
        }
      }}
    />
  );
}
