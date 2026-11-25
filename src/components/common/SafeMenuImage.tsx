import React, { useEffect, useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';

interface SafeMenuImageProps {
  src?: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
  alt?: string;
  className?: string;
  objectFit?: 'contain' | 'cover';
  objectPosition?: string;
  ariaHidden?: boolean;
  lazy?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
}

export function SafeMenuImage({
  src,
  srcSet,
  sizes,
  width,
  height,
  fallbackSrc,
  alt = '',
  className = '',
  objectFit = 'contain',
  objectPosition = 'center',
  ariaHidden = false,
  lazy = true,
  fetchPriority,
}: SafeMenuImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc || '');
  const [failed, setFailed] = useState(!(src || fallbackSrc));

  useEffect(() => {
    const next = src || fallbackSrc || '';
    setCurrentSrc(next);
    setFailed(!next);
  }, [src, fallbackSrc]);

  if (failed || !currentSrc) {
    return (
      <span
        className={`inline-flex items-center justify-center text-[#86673F]/60 dark:text-[#B8A47E]/60 ${className}`}
        aria-hidden="true"
      >
        <UtensilsCrossed className="w-5 h-5" />
      </span>
    );
  }

  const fitClass = objectFit === 'cover' ? 'object-cover' : 'object-contain';

  return (
    <img
      src={currentSrc}
      srcSet={currentSrc === src ? srcSet : undefined}
      sizes={currentSrc === src && srcSet ? sizes : undefined}
      width={width}
      height={height}
      alt={alt}
      aria-hidden={ariaHidden || undefined}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
      fetchPriority={fetchPriority}
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        } else {
          setFailed(true);
        }
      }}
      className={`${fitClass} ${className}`}
      style={{ objectPosition }}
    />
  );
}
