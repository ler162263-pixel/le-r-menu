import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { LE_R_ASSETS } from '../../assets';
import { EDITORIAL_EASE, MaskedHeadingReveal } from '../common';

interface HeroSectionProps {
  brandName: string;
  logoSrc?: string;
  kicker: string;
  menuDisplayTitle: string;
  heroIntro: string;
  ctaMenu: string;
  phone: string;
  telHref: string;
}

type HeroBreakpoint = 'mobile' | 'tablet' | 'desktop';

function getHeroBreakpoint(): HeroBreakpoint {
  if (typeof window === 'undefined') return 'desktop';
  if (window.matchMedia('(min-width: 1024px)').matches) return 'desktop';
  if (window.matchMedia('(min-width: 640px)').matches) return 'tablet';
  return 'mobile';
}

/**
 * Signature Le R "The Printed Card, Alive" Hero Section.
 * Choreography sequence:
 *   1. Official Ring Emblem & Main "Le R" Brand Title (text-mask reveal)
 *   2. "MENU" Display Typography (clip-path & upward settle)
 *   3. Red Brush Ornament (center-outward reveal mask matching raster artwork)
 *   4. Responsive Date Palm Botanical Engraving (<picture>: 1 mobile / 2 tablet / 3 desktop + subtle scroll parallax)
 *   5. Intro copy, primary Menu CTA & direct phone call link
 */
export function HeroSection({
  brandName,
  logoSrc,
  kicker,
  menuDisplayTitle,
  heroIntro,
  ctaMenu,
  phone,
  telHref,
}: HeroSectionProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const prefersReduced = useReducedMotion();
  const [breakpoint, setBreakpoint] = useState<HeroBreakpoint>(getHeroBreakpoint);
  const [logoError, setLogoError] = useState(false);

  const effectiveLogo = logoSrc || LE_R_ASSETS.ringLogo;

  useEffect(() => {
    setLogoError(false);
  }, [effectiveLogo]);

  useEffect(() => {
    const mqDesktop = window.matchMedia('(min-width: 1024px)');
    const mqTablet = window.matchMedia('(min-width: 640px)');
    const update = () => setBreakpoint(getHeroBreakpoint());
    mqDesktop.addEventListener('change', update);
    mqTablet.addEventListener('change', update);
    return () => {
      mqDesktop.removeEventListener('change', update);
      mqTablet.removeEventListener('change', update);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Layered GPU-only vertical parallax (zero React re-renders; disabled under reduced motion)
  const archY = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 18]);
  const palmParallaxRange =
    breakpoint === 'desktop' ? 22 : breakpoint === 'tablet' ? 14 : 8;
  const palmY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, prefersReduced ? 0 : palmParallaxRange],
  );

  // Entrance choreography adapted to the visible palm composition at each breakpoint:
  // - Desktop (>=1024px): center-outward clip reveals dominant central palm first, then both side palms
  // - Tablet (640-1023px): right-to-left clip reveals primary taller palm first, then secondary left palm
  // - Mobile (<640px): gentle opacity + vertical settle for the single centered palm
  const palmTargetOpacity =
    breakpoint === 'desktop' ? 0.72 : breakpoint === 'tablet' ? 0.65 : 0.42;

  const palmInitial = prefersReduced
    ? { opacity: palmTargetOpacity }
    : breakpoint === 'desktop'
      ? {
          opacity: 0,
          clipPath: 'inset(0% 34% 0% 34%)',
          y: 16,
          scale: 1.02,
        }
      : breakpoint === 'tablet'
        ? {
            opacity: 0,
            clipPath: 'inset(0% 0% 0% 48%)',
            y: 14,
            scale: 1.02,
          }
        : {
            opacity: 0,
            y: 14,
            scale: 0.97,
          };

  const palmAnimate = {
    opacity: palmTargetOpacity,
    clipPath: 'inset(0% 0% 0% 0%)',
    y: 0,
    scale: 1,
  };

  const palmTransition = prefersReduced
    ? { duration: 0.01 }
    : {
        duration: breakpoint === 'desktop' ? 1.15 : breakpoint === 'tablet' ? 1.0 : 0.85,
        delay: 0.28,
        ease: EDITORIAL_EASE,
      };

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden py-14 sm:py-20 lg:py-24 border-b border-[#8E0F14]/20 min-h-[540px] sm:min-h-[610px] flex items-center"
    >
      {/* Subtle Architectural Watermark on desktop left flank */}
      <motion.img
        src={LE_R_ASSETS.archWatermark}
        alt=""
        aria-hidden="true"
        width={320}
        height={307}
        loading="lazy"
        decoding="async"
        style={{ y: archY }}
        initial={prefersReduced ? false : { opacity: 0 }}
        animate={{ opacity: 0.075 }}
        transition={{ duration: 0.9, delay: 0.25, ease: EDITORIAL_EASE }}
        className="hidden lg:block absolute start-6 top-6 w-52 pointer-events-none select-none object-contain"
      />

      {/* RESPONSIVE BOTANICAL PALM ENGRAVING (<640px: 1 palm | 640-1023px: 2 palms | >=1024px: 3 palms) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden flex items-end justify-center"
      >
        <motion.div
          style={{ y: palmY }}
          initial={palmInitial}
          animate={palmAnimate}
          transition={palmTransition}
          className="relative flex items-end justify-center w-full h-full px-4 sm:px-6 lg:px-10 pb-8 sm:pb-0"
        >
          <picture className="flex items-end justify-center w-full h-full">
            <source
              media="(min-width: 1024px)"
              srcSet={LE_R_ASSETS.palmDesktopThree}
            />
            <source
              media="(min-width: 640px)"
              srcSet={LE_R_ASSETS.palmTabletTwo}
            />
            <img
              src={LE_R_ASSETS.palmMobileOne}
              alt=""
              width={394}
              height={704}
              decoding="async"
              fetchPriority="high"
              className="max-w-full h-[74%] max-h-[390px] sm:h-[86%] sm:max-h-[520px] lg:h-[92%] lg:max-h-[565px] w-auto object-contain object-bottom ler-artwork ler-palm-sepia"
            />
          </picture>
        </motion.div>

        {/* Soft central parchment cushion so typography maintains crisp contrast */}
        <div className="absolute inset-0 ler-hero-scrim" />
      </div>

      {/* FOREGROUND EDITORIAL BRAND ENTRANCE */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5 sm:space-y-6 w-full">
        {/* Step 1A: Location Kicker & Official Ring Logo */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.02, ease: EDITORIAL_EASE }}
          className="space-y-4"
        >
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-[#86673F] dark:text-[#EFCB8C]">
            {kicker}
          </p>

          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.62, delay: 0.06, ease: EDITORIAL_EASE }}
            className="flex justify-center"
          >
            {!logoError ? (
              <img
                src={effectiveLogo}
                alt={brandName}
                width={160}
                height={153}
                decoding="async"
                fetchPriority="high"
                onError={() => setLogoError(true)}
                className="w-28 sm:w-36 md:w-40 h-auto ler-artwork drop-shadow-[0_4px_14px_rgba(90,65,38,0.10)]"
              />
            ) : (
              <span className="w-28 h-28 rounded-full border-2 border-[#8E0F14] bg-[#FBF1DA] flex items-center justify-center font-display text-2xl text-[#8E0F14]">
                {brandName}
              </span>
            )}
          </motion.div>
        </motion.div>

        {/* Step 1B: Main "Le R" Brand Title — Strongest Visual Anchor with Masked Text Reveal */}
        <div className="space-y-2.5 sm:space-y-3">
          <MaskedHeadingReveal immediate delay={0.10} duration={0.68}>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-[0.06em] text-[#8E0F14] dark:text-[#EFCB8C] leading-[1.04]">
              {brandName}
            </h1>
          </MaskedHeadingReveal>

          {/* Step 2: "MENU" Typography Reveal (staggered 110ms after Main Title) */}
          <motion.p
            initial={
              prefersReduced
                ? false
                : { opacity: 0, y: 12, clipPath: 'inset(0 0 100% 0)' }
            }
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
            transition={{ duration: 0.62, delay: 0.21, ease: EDITORIAL_EASE }}
            className="font-display text-2xl sm:text-3xl lg:text-[2.5rem] tracking-[0.18em] text-[#8B4513] dark:text-[#F3E6CB] leading-none pt-0.5"
          >
            {menuDisplayTitle}
          </motion.p>

          {/* Step 3: Red Brush Ornament — Center-Outward Sweep Mask (raster PNG) */}
          <motion.div
            initial={
              prefersReduced
                ? false
                : { opacity: 0, clipPath: 'inset(0 50% 0 50%)', scale: 0.96 }
            }
            animate={{
              opacity: 1,
              clipPath: 'inset(0 0% 0 0%)',
              scale: 1,
            }}
            transition={{ duration: 0.7, delay: 0.30, ease: EDITORIAL_EASE }}
            className="flex justify-center pt-1"
          >
            <img
              src={LE_R_ASSETS.redBrushOrnament}
              alt=""
              aria-hidden="true"
              width={576}
              height={77}
              decoding="async"
              fetchPriority="high"
              className="w-56 sm:w-72 h-auto ler-artwork"
            />
          </motion.div>
        </div>

        {/* Step 4 & 5: Editorial Intro + Tactile Actions */}
        <motion.p
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.56, delay: 0.38, ease: EDITORIAL_EASE }}
          className="text-base sm:text-lg leading-relaxed text-[#5A4126] dark:text-[#DFCCA8] max-w-xl mx-auto font-medium"
        >
          {heroIntro}
        </motion.p>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.54, delay: 0.46, ease: EDITORIAL_EASE }}
          className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 pt-2"
        >
          <motion.div
            whileHover={prefersReduced ? undefined : { y: -2 }}
            whileTap={prefersReduced ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.18, ease: EDITORIAL_EASE }}
          >
            <Link
              to="/menu"
              className="group inline-flex items-center gap-2.5 min-h-[48px] px-7 py-3 bg-[#8E0F14] hover:bg-[#700B0F] text-[#FBF1DA] text-sm font-semibold tracking-wide rounded-sm transition-colors shadow-[0_6px_18px_rgba(142,15,20,0.22)] whitespace-nowrap"
            >
              <span>{ctaMenu}</span>
              <ArrowRight
                className="w-4 h-4 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </motion.div>

          <motion.a
            href={telHref}
            whileHover={prefersReduced ? undefined : { y: -2 }}
            whileTap={prefersReduced ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.18, ease: EDITORIAL_EASE }}
            className="inline-flex items-center gap-2.5 min-h-[48px] px-6 py-3 border-2 border-[#5A4126] dark:border-[#EFCB8C]/60 bg-[#FBF1DA]/92 dark:bg-transparent hover:bg-[#5A4126] hover:text-[#F3E6CB] text-[#5A4126] dark:text-[#F3E6CB] text-sm font-semibold rounded-sm transition-colors whitespace-nowrap"
          >
            <img
              src={LE_R_ASSETS.contactIcons.phone}
              alt=""
              aria-hidden="true"
              width={16}
              height={16}
              decoding="async"
              className="w-4 h-4 ler-artwork"
            />
            <span dir="ltr" className="tabular-nums">
              {phone}
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
