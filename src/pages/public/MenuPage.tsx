import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp, QrCode, Search, X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { LE_R_ASSETS } from '../../assets';
import {
  resolveCategoryEngraving,
  resolveResponsiveWebpSrcSet,
} from '../../assets/resolveAsset';
import {
  EDITORIAL_EASE,
  EDITORIAL_VIEWPORT,
  EditorialReveal,
  EditorialStaggerGroup,
  EditorialStaggerItem,
  MaskedHeadingReveal,
  MenuSkeletonGrid,
  OrnamentalCategoryRule,
} from '../../components/common';
import { ProductDetailModal } from '../../components/public';
import { useRestaurantData, useTranslation } from '../../hooks';
import type { MenuCategory, MenuItem } from '../../types';
import {
  doesSubSectionMatchQuery,
  formatPrice,
  getLocalizedValue,
  getPublicCategories,
  getPublicMenuItems,
} from '../../utils/restaurantLogic';
import {
  computeHorizontalRailDelta,
  computeStickyBarTop,
  computeStickyScrollClearance,
} from '../../utils/stickyOffset';

export function MenuPage() {
  const { lang, t } = useTranslation();
  const prefersReduced = useReducedMotion();
  const { isLoading, hasDataError, categories, menuItems } = useRestaurantData();
  const location = useLocation();
  const baseUrl =
    typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
      ? import.meta.env.BASE_URL
      : './';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCatId, setActiveCatId] = useState<string>('');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [stickyTop, setStickyTop] = useState<number>(69);
  const [stickyBarHeight, setStickyBarHeight] = useState<number>(107);

  const stickyAnchorRef = useRef<HTMLDivElement | null>(null);
  const stickyBarRef = useRef<HTMLDivElement | null>(null);
  const railNavRef = useRef<HTMLElement | null>(null);
  const railButtonsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const lastHandledHashRef = useRef<string>('');
  const isProgrammaticScrollRef = useRef(false);
  const programmaticScrollTimerRef = useRef<number | null>(null);

  const scrollClearance = useMemo(
    () => computeStickyScrollClearance(stickyTop, stickyBarHeight),
    [stickyTop, stickyBarHeight]
  );

  const visibleCategories = useMemo(
    () => getPublicCategories(categories, menuItems),
    [categories, menuItems]
  );

  const filteredDishes = useMemo(
    () =>
      getPublicMenuItems(
        menuItems,
        categories,
        'all',
        searchQuery,
        lang
      ),
    [menuItems, categories, searchQuery, lang]
  );

  const isFiltered = searchQuery.trim().length > 0;

  const sections = useMemo(
    () =>
      visibleCategories
        .map((category) => {
          const dishes = filteredDishes.filter(
            (d) => d.categoryId === category.id
          );
          const matchingSubSections =
            category.subSections?.filter((sub) =>
              !isFiltered
                ? true
                : doesSubSectionMatchQuery(sub, category, searchQuery, lang)
            ) ?? [];
          return {
            category,
            dishes,
            matchingSubSections,
          };
        })
        .filter(
          (section) =>
            section.dishes.length > 0 || section.matchingSubSections.length > 0
        ),
    [visibleCategories, filteredDishes, isFiltered, searchQuery, lang]
  );

  const totalMatchesCount = useMemo(
    () =>
      sections.reduce(
        (acc, section) =>
          acc +
          section.dishes.length +
          section.matchingSubSections.reduce(
            (subAcc, sub) => subAcc + sub.items.length,
            0
          ),
        0
      ),
    [sections]
  );

  // Set default active category & handle initial/changed hash navigation (/menu#cat-la-marina)
  // without re-scrolling whenever searchQuery updates `sections`.
  useEffect(() => {
    if (sections.length === 0) return;
    const rawHash = location.hash;
    const hashId = rawHash.replace(/^#cat-/, '');

    if (
      rawHash &&
      rawHash !== lastHandledHashRef.current &&
      hashId &&
      sections.some((s) => s.category.id === hashId)
    ) {
      lastHandledHashRef.current = rawHash;
      setActiveCatId(hashId);
      isProgrammaticScrollRef.current = true;
      if (programmaticScrollTimerRef.current) {
        window.clearTimeout(programmaticScrollTimerRef.current);
      }
      const target = document.getElementById(`cat-${hashId}`);
      if (target) {
        window.setTimeout(() => {
          target.scrollIntoView({
            behavior: prefersReduced ? 'auto' : 'smooth',
          });
          programmaticScrollTimerRef.current = window.setTimeout(() => {
            isProgrammaticScrollRef.current = false;
          }, 650);
        }, 80);
      } else {
        isProgrammaticScrollRef.current = false;
      }
      return;
    }

    if (!rawHash) {
      lastHandledHashRef.current = '';
    }

    setActiveCatId((prev) =>
      sections.some((s) => s.category.id === prev)
        ? prev
        : sections[0].category.id
    );
  }, [sections, location.hash, prefersReduced]);

  // Measure live site header position/height and sticky bar height before paint & on resize
  useLayoutEffect(() => {
    const updateStickyMetrics = () => {
      const header = document.querySelector('header');
      if (header) {
        const rect = header.getBoundingClientRect();
        const cs = window.getComputedStyle(header);
        const nextTop = computeStickyBarTop({
          position: cs.position,
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
        });
        setStickyTop((prev) => (Math.abs(prev - nextTop) > 0.25 ? nextTop : prev));
      } else {
        setStickyTop(0);
      }

      if (stickyBarRef.current) {
        const barHeight = Math.round(stickyBarRef.current.getBoundingClientRect().height);
        setStickyBarHeight((prev) => (prev !== barHeight ? barHeight : prev));
      }
    };

    updateStickyMetrics();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateStickyMetrics, { passive: true });
      return () => window.removeEventListener('resize', updateStickyMetrics);
    }

    const observer = new ResizeObserver(updateStickyMetrics);
    const header = document.querySelector('header');
    if (header) observer.observe(header);
    if (stickyBarRef.current) observer.observe(stickyBarRef.current);
    window.addEventListener('resize', updateStickyMetrics, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateStickyMetrics);
    };
  }, [isFiltered, lang]);

  // If filtering shrinks page height while the user is scrolled deep down,
  // re-align scroll to the start of results so the sticky search bar stays flush
  // beneath the header instead of getting pushed off-screen above the footer.
  useLayoutEffect(() => {
    if (!isFiltered) return;

    const realignIfPushedUp = () => {
      if (!stickyBarRef.current || !stickyAnchorRef.current) return;
      const barRect = stickyBarRef.current.getBoundingClientRect();
      if (barRect.top < stickyTop - 1) {
        const anchorDocTop =
          window.scrollY + stickyAnchorRef.current.getBoundingClientRect().top;
        window.scrollTo({
          top: Math.max(0, Math.round(anchorDocTop - stickyTop)),
          behavior: 'instant' as ScrollBehavior,
        });
      }
    };

    realignIfPushedUp();
    const rafId = window.requestAnimationFrame(realignIfPushedUp);
    return () => window.cancelAnimationFrame(rafId);
  }, [isFiltered, searchQuery, totalMatchesCount, stickyTop]);

  // Scroll-spy using IntersectionObserver across rendered category sections + bottom-of-page fallback
  useEffect(() => {
    if (sections.length === 0 || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScrollRef.current) return;
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visibleEntries.length > 0) {
          const catId = visibleEntries[0].target.id.replace(/^cat-/, '');
          setActiveCatId(catId);
        }
      },
      {
        rootMargin: `-${scrollClearance}px 0px -55% 0px`,
        threshold: 0.01,
      }
    );

    sections.forEach(({ category }) => {
      const el = document.getElementById(`cat-${category.id}`);
      if (el) observer.observe(el);
    });

    const handleScrollState = () => {
      setShowBackToTop(window.scrollY > 450);
      if (isProgrammaticScrollRef.current) return;
      const reachedBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 36;
      if (reachedBottom && sections.length > 0) {
        setActiveCatId(sections[sections.length - 1].category.id);
      }
    };

    window.addEventListener('scroll', handleScrollState, { passive: true });
    handleScrollState();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollState);
    };
  }, [sections, scrollClearance]);

  useEffect(() => {
    return () => {
      if (programmaticScrollTimerRef.current) {
        window.clearTimeout(programmaticScrollTimerRef.current);
      }
    };
  }, []);

  // Center the active category button horizontally inside the rail only (never scroll window vertically)
  useEffect(() => {
    if (!activeCatId) return;
    const nav = railNavRef.current;
    const btn = railButtonsRef.current[activeCatId];
    if (nav && btn && typeof nav.scrollBy === 'function') {
      const navRect = nav.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const delta = computeHorizontalRailDelta(
        navRect.left,
        navRect.width,
        btnRect.left,
        btnRect.width
      );
      if (Math.abs(delta) > 2) {
        nav.scrollBy({
          left: delta,
          behavior: prefersReduced ? 'auto' : 'smooth',
        });
      }
    }
  }, [activeCatId, prefersReduced]);

  const jumpToCategory = (categoryId: string) => {
    const behavior: ScrollBehavior = prefersReduced ? 'auto' : 'smooth';
    const needsFilterReset =
      searchQuery.trim().length > 0 &&
      !sections.some((s) => s.category.id === categoryId);

    isProgrammaticScrollRef.current = true;
    if (programmaticScrollTimerRef.current) {
      window.clearTimeout(programmaticScrollTimerRef.current);
    }

    const scrollTarget = () => {
      document
        .getElementById(`cat-${categoryId}`)
        ?.scrollIntoView({ behavior });
      programmaticScrollTimerRef.current = window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 650);
    };

    if (needsFilterReset) {
      setSearchQuery('');
      window.setTimeout(scrollTarget, 60);
    } else {
      scrollTarget();
    }
    setActiveCatId(categoryId);
  };

  const resetFilters = () => {
    setSearchQuery('');
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  };

  const selectedDishCategory: MenuCategory | undefined = selectedDish
    ? categories.find((c) => c.id === selectedDish.categoryId)
    : undefined;

  return (
    <div className="pb-16">
      {/* Editorial Parchment Title Banner */}
      <section className="py-10 sm:py-14 border-b border-[#8E0F14]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <EditorialReveal immediate>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#86673F] dark:text-[#EFCB8C]">
              <QrCode
                className="w-3.5 h-3.5 text-[#8E0F14] dark:text-[#EFCB8C]"
                aria-hidden="true"
              />
              <span>
                {t.menu.kicker} · {t.menu.qrBadge}
              </span>
            </div>
          </EditorialReveal>

          <MaskedHeadingReveal immediate delay={0.08}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-[0.06em] text-[#8B4513] dark:text-[#EFCB8C]">
              {t.menu.title}
            </h1>
          </MaskedHeadingReveal>

          <motion.div
            initial={
              prefersReduced
                ? false
                : { opacity: 0, clipPath: 'inset(0 50% 0 50%)' }
            }
            animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0%)' }}
            transition={{ duration: 0.65, delay: 0.16, ease: EDITORIAL_EASE }}
            className="flex justify-center"
          >
            <img
              src={LE_R_ASSETS.redBrushOrnament}
              alt=""
              aria-hidden="true"
              width={576}
              height={77}
              decoding="async"
              fetchPriority="high"
              className="w-48 sm:w-64 h-auto ler-artwork"
            />
          </motion.div>

          <EditorialReveal immediate delay={0.22}>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto">
              {t.menu.subtitle}
            </p>
          </EditorialReveal>
        </div>
      </section>

      {/* Graceful JSON error notice if menu.json was malformed */}
      {hasDataError && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
          <div
            role="alert"
            className="p-4 border border-[#8E0F14]/40 bg-[#FBF1DA] dark:bg-[var(--bg-elevated)] text-sm text-[#8E0F14] dark:text-[#EFCB8C] rounded-sm text-center"
          >
            {t.menu.dataErrorNotice}
          </div>
        </div>
      )}

      {/* Editorial Category Overview Index */}
      {!isLoading && visibleCategories.length > 0 && (
        <section
          aria-label={t.menu.overviewTitle}
          className="py-8 sm:py-10 border-b border-[#8E0F14]/15 bg-[#FBF1DA]/50 dark:bg-[var(--bg-surface)]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <EditorialReveal>
              <h2 className="font-editorial text-lg font-bold uppercase tracking-[0.16em] text-[#86673F] dark:text-[#EFCB8C] text-center">
                {t.menu.overviewTitle}
              </h2>
            </EditorialReveal>

            <EditorialStaggerGroup
              stagger={0.03}
              delayChildren={0.02}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
            >
              {visibleCategories.map((cat, catIdx) => {
                const count = menuItems.filter(
                  (i) => i.visible && i.categoryId === cat.id
                ).length;
                const isDarkFeature = cat.themeVariant === 'dark-feature';
                const engraving = resolveCategoryEngraving(
                  cat.engravingKey,
                  baseUrl
                );

                return (
                  <EditorialStaggerItem key={cat.id} className="flex">
                    <button
                      type="button"
                      onClick={() => jumpToCategory(cat.id)}
                      className={`group w-full p-3 rounded-sm border text-center flex flex-col items-center justify-between gap-2 ler-card-interactive ${
                        isDarkFeature
                          ? 'bg-[#5A4126] border-[#5A4126] text-[#F3E6CB] hover:border-[#EFCB8C]'
                          : 'parchment-card dark:bg-[var(--bg-elevated)] text-[#5A4126] dark:text-[#F3E6CB] hover:border-[#8E0F14]'
                      }`}
                    >
                      {engraving && (
                        <div
                          className={`h-14 w-24 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 overflow-hidden ${
                            isDarkFeature
                              ? 'rounded-sm bg-[#FCF1D8] px-2 py-1 border border-[#EFCB8C]/40'
                              : ''
                          }`}
                        >
                          <img
                            src={engraving}
                            srcSet={resolveResponsiveWebpSrcSet(engraving)}
                            sizes="96px"
                            width={180}
                            height={120}
                            alt=""
                            aria-hidden="true"
                            loading={catIdx < 8 ? 'eager' : 'lazy'}
                            decoding="async"
                            className="max-h-12 max-w-full w-auto h-auto object-contain object-center"
                          />
                        </div>
                      )}
                      <div className="space-y-0.5">
                        <p dir="auto" className="font-editorial text-sm font-bold leading-snug">
                          {getLocalizedValue(cat.name, lang)}
                        </p>
                        <p
                          className={`text-[11px] tabular-nums ${
                            isDarkFeature
                              ? 'text-[#EFCB8C]/90'
                              : 'text-[var(--text-muted)]'
                          }`}
                        >
                          {count} {t.menu.itemsCount}
                        </p>
                      </div>
                    </button>
                  </EditorialStaggerItem>
                );
              })}
            </EditorialStaggerGroup>
          </div>
        </section>
      )}

      {/* Sticky Anchor & Category Navigation Rail + Instant Search */}
      <div ref={stickyAnchorRef} aria-hidden="true" className="h-0 w-full" />
      <div
        ref={stickyBarRef}
        style={{ top: `${stickyTop}px` }}
        className="sticky z-30 bg-[var(--bg-canvas)]/96 backdrop-blur-md border-b border-[#8E0F14]/25 shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 space-y-2">
          {/* Search Row */}
          <div className="flex items-center">
            <div className="relative flex-1 min-w-0">
              <label htmlFor="menu-instant-search" className="sr-only">
                {t.menu.searchLabel}
              </label>
              <Search
                className="w-4 h-4 text-[#86673F] dark:text-[#EFCB8C] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="menu-instant-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.menu.searchPlaceholder}
                autoComplete="off"
                className="w-full min-h-[38px] ps-9 pe-9 py-1.5 bg-[#FBF1DA] dark:bg-[var(--bg-elevated)] border border-[#8E0F14]/30 focus:border-[#8E0F14] focus:outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] rounded-sm transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label={t.menu.clearSearch}
                  className="absolute end-2 top-1/2 -translate-y-1/2 w-7 h-7 inline-flex items-center justify-center text-[#86673F] hover:text-[#8E0F14] dark:text-[#EFCB8C] rounded-sm"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {isFiltered && (
            <div className="flex items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
              <span className="tabular-nums font-medium">
                {totalMatchesCount}{' '}
                {totalMatchesCount === 1
                  ? t.menu.searchResultsSingle
                  : t.menu.searchResultsPlural}
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="font-semibold text-[#8E0F14] dark:text-[#EFCB8C] hover:underline"
              >
                {t.menu.clearFilters}
              </button>
            </div>
          )}

          {/* Horizontal Category Jump Rail */}
          <nav
            ref={railNavRef}
            aria-label={t.menu.kicker}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5"
          >
            {(isFiltered
              ? sections.map((s) => s.category)
              : visibleCategories
            ).map((category) => {
              const isActive = activeCatId === category.id;
              return (
                <button
                  key={category.id}
                  ref={(el) => {
                    railButtonsRef.current[category.id] = el;
                  }}
                  type="button"
                  onClick={() => jumpToCategory(category.id)}
                  className={`relative min-h-[36px] px-3 py-1.5 text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 rounded-sm transition-colors active:scale-95 ${
                    isActive
                      ? 'text-[#8E0F14] dark:text-[#F3E6CB] font-bold bg-[#FBF1DA]/80 dark:bg-[#F3E6CB]/10'
                      : 'text-[var(--text-secondary)] hover:text-[#8E0F14] dark:hover:text-[#F3E6CB]'
                  }`}
                >
                  <span>{getLocalizedValue(category.name, lang)}</span>
                  {isActive && (
                    <motion.span
                      layoutId="menu-rail-indicator"
                      transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
                      className="absolute inset-x-1 bottom-0 h-[2px] bg-[#8E0F14] dark:bg-[#CC0000]"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Category Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 min-h-[45vh]">
        {isLoading ? (
          <MenuSkeletonGrid />
        ) : sections.length === 0 ? (
          <EditorialReveal className="py-16 text-center parchment-card dark:bg-[var(--bg-elevated)] rounded-sm px-6 space-y-4">
            <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
              {t.menu.emptyTitle}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
              {t.menu.emptyDesc}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="min-h-[40px] px-5 py-2 bg-[#8E0F14] text-[#FBF1DA] text-xs font-semibold rounded-sm active:scale-95 transition-transform"
            >
              {t.menu.clearFilters}
            </button>
          </EditorialReveal>
        ) : (
          <div className="space-y-14 sm:space-y-16">
            {sections.map(({ category, dishes, matchingSubSections }, secIdx) => {
              const catName = getLocalizedValue(category.name, lang);
              const catSubtitle = category.subtitle
                ? getLocalizedValue(category.subtitle, lang)
                : '';
              const isDarkFeature = category.themeVariant === 'dark-feature';
              const engraving = resolveCategoryEngraving(
                category.engravingKey,
                baseUrl
              );

              if (isDarkFeature) {
                return (
                  <section
                    key={category.id}
                    id={`cat-${category.id}`}
                    style={{ scrollMarginTop: `${scrollClearance}px` }}
                    className="dark-feature-panel p-3.5 sm:p-5 shadow-md"
                  >
                    <div className="dark-feature-inset p-5 sm:p-8 space-y-7">
                      <div className="flex flex-col items-center text-center space-y-3">
                        {engraving && (
                          <div className="w-36 h-24 rounded-sm bg-[#FCF1D8] border border-[#EFCB8C]/45 px-3 py-2 flex items-center justify-center shadow-xs">
                            <motion.img
                              src={engraving}
                              srcSet={resolveResponsiveWebpSrcSet(engraving)}
                              sizes="(max-width: 640px) 144px, 176px"
                              width={320}
                              height={220}
                              alt=""
                              aria-hidden="true"
                              loading="lazy"
                              decoding="async"
                              initial={
                                prefersReduced
                                  ? false
                                  : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }
                              }
                              whileInView={{
                                opacity: 1,
                                clipPath: 'inset(0 0 0% 0)',
                              }}
                              viewport={EDITORIAL_VIEWPORT}
                              transition={{
                                duration: 0.65,
                                ease: EDITORIAL_EASE,
                              }}
                              className="w-full h-full object-contain object-center"
                            />
                          </div>
                        )}
                        <MaskedHeadingReveal>
                          <h2 dir="auto" className="font-editorial text-3xl sm:text-4xl font-bold text-[#F3E6CB]">
                            {catName}
                          </h2>
                        </MaskedHeadingReveal>
                        <OrnamentalCategoryRule variant="cream" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
                        {dishes.map((item, idx) => {
                          const title = getLocalizedValue(item.name, lang);
                          const description = getLocalizedValue(
                            item.description,
                            lang
                          );

                          return (
                            <motion.button
                              key={item.id}
                              type="button"
                              onClick={() => setSelectedDish(item)}
                              initial={
                                prefersReduced ? false : { opacity: 0, y: 10 }
                              }
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={EDITORIAL_VIEWPORT}
                              transition={{
                                duration: 0.42,
                                delay: Math.min(idx * 0.03, 0.18),
                                ease: EDITORIAL_EASE,
                              }}
                              className={`w-full text-start py-1.5 px-1.5 -mx-1.5 group focus-visible:outline-2 focus-visible:outline-[#EFCB8C] rounded-sm ler-row-interactive hover:bg-[#F3E6CB]/5 ${
                                !item.available ? 'opacity-65' : ''
                              }`}
                            >
                              <div className="flex items-baseline gap-2">
                                <span className="font-editorial text-base sm:text-lg font-semibold text-[#F3E6CB] group-hover:text-[#EFCB8C] transition-colors inline-flex items-center gap-1.5 flex-wrap">
                                  <span dir="auto">{title}</span>
                                  {!item.available && (
                                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm border border-[#F3E6CB]/40 text-[#F3E6CB]/90">
                                      {t.menu.unavailableBadge}
                                    </span>
                                  )}
                                </span>
                                <span className="dotted-leader" />
                                <span
                                  dir="ltr"
                                  className="font-editorial text-base sm:text-lg font-bold tabular-nums text-[#EFCB8C] shrink-0"
                                >
                                  {formatPrice(item.price, lang)}
                                </span>
                              </div>
                              {description && (
                                <p
                                  dir="auto"
                                  className="text-sm italic text-[#F3E6CB]/80 mt-0.5 leading-relaxed"
                                >
                                  {description}
                                </p>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              }

              return (
                <section
                  key={category.id}
                  id={`cat-${category.id}`}
                  style={{ scrollMarginTop: `${scrollClearance}px` }}
                  className="parchment-card dark:bg-[var(--bg-elevated)] p-6 sm:p-10 rounded-sm space-y-7"
                >
                  {/* Printed Menu Category Header */}
                  <div className="flex flex-col items-center text-center space-y-3">
                    {engraving && (
                      <div className="h-20 sm:h-24 w-44 flex items-center justify-center overflow-hidden">
                        <motion.img
                          src={engraving}
                          srcSet={resolveResponsiveWebpSrcSet(engraving)}
                          sizes="(max-width: 640px) 144px, 176px"
                          width={320}
                          height={220}
                          alt=""
                          aria-hidden="true"
                          loading={secIdx === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                          initial={
                            prefersReduced || isFiltered
                              ? false
                              : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }
                          }
                          animate={
                            isFiltered
                              ? { opacity: 1, clipPath: 'inset(0 0 0% 0)' }
                              : undefined
                          }
                          whileInView={{
                            opacity: 1,
                            clipPath: 'inset(0 0 0% 0)',
                          }}
                          viewport={EDITORIAL_VIEWPORT}
                          transition={{ duration: 0.65, ease: EDITORIAL_EASE }}
                          className="max-h-full max-w-full w-auto h-auto object-contain object-center"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <MaskedHeadingReveal>
                        <h2 dir="auto" className="font-editorial text-3xl sm:text-4xl font-bold text-[#86673F] dark:text-[#EFCB8C]">
                          {catName}
                        </h2>
                      </MaskedHeadingReveal>
                      {catSubtitle && (
                        <p className="text-sm italic text-[#8E0F14] dark:text-[#EFCB8C]/85">
                          {catSubtitle}
                        </p>
                      )}
                    </div>
                    <OrnamentalCategoryRule variant="maroon" />
                  </div>

                  {/* Printed Item Rows (2-col desktop, 1-col mobile) */}
                  {dishes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
                      {dishes.map((item, idx) => {
                        const title = getLocalizedValue(item.name, lang);
                        const description = getLocalizedValue(
                          item.description,
                          lang
                        );

                        return (
                          <motion.button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedDish(item)}
                            initial={
                              prefersReduced ? false : { opacity: 0, y: 10 }
                            }
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={EDITORIAL_VIEWPORT}
                            transition={{
                              duration: 0.42,
                              delay: Math.min(idx * 0.025, 0.18),
                              ease: EDITORIAL_EASE,
                            }}
                            className={`w-full text-start py-1.5 px-1.5 -mx-1.5 group focus-visible:outline-2 focus-visible:outline-[#8E0F14] rounded-sm ler-row-interactive hover:bg-[#8E0F14]/[0.03] dark:hover:bg-[#F3E6CB]/[0.04] ${
                              !item.available ? 'opacity-60' : ''
                            }`}
                          >
                            <div className="flex items-baseline gap-2">
                              <span className="font-editorial text-base sm:text-lg font-bold text-[#7A5C3A] dark:text-[#F3E6CB] group-hover:text-[#8E0F14] dark:group-hover:text-[#EFCB8C] transition-colors inline-flex items-center gap-1.5 flex-wrap">
                                <span dir="auto">{title}</span>
                                {!item.available && (
                                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm border border-[#8E0F14]/35 text-[#8E0F14] dark:text-[#FF8A80]">
                                    {t.menu.unavailableBadge}
                                  </span>
                                )}
                              </span>
                              <span className="dotted-leader" />
                              <span
                                dir="ltr"
                                className="font-editorial text-base sm:text-lg font-bold tabular-nums text-[#8E0F14] dark:text-[#EFCB8C] shrink-0"
                              >
                                {formatPrice(item.price, lang)}
                              </span>
                            </div>
                            {description && (
                              <p
                                dir="auto"
                                className="text-sm italic text-[#6B5535] dark:text-[#DFCCA8] mt-0.5 leading-relaxed"
                              >
                                {description}
                              </p>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {/* Category Red Italic Supplements */}
                  {category.supplements && category.supplements.length > 0 && (
                    <EditorialReveal className="pt-4 border-t border-[#8E0F14]/20 space-y-2">
                      {category.supplements.map((supp) => (
                        <div
                          key={supp.id}
                          className="flex items-baseline gap-2 text-sm sm:text-base italic font-semibold text-[#CC0000] dark:text-[#FF8A80]"
                        >
                          <span>{getLocalizedValue(supp.label, lang)}</span>
                          <span className="dotted-leader" />
                          <span dir="ltr" className="tabular-nums shrink-0">
                            {formatPrice(supp.price, lang)}
                          </span>
                        </div>
                      ))}
                    </EditorialReveal>
                  )}

                  {/* Nested Dark Feature Sub-Section (Méga Pizza inside Pizzas) */}
                  {matchingSubSections.length > 0 &&
                    matchingSubSections.map((sub) => {
                      const subEngraving = resolveCategoryEngraving(
                        sub.engravingKey,
                        baseUrl
                      );
                      return (
                        <EditorialReveal
                          key={sub.id}
                          className="dark-feature-panel p-3 sm:p-4 mt-6"
                        >
                          <div className="dark-feature-inset p-5 sm:p-6 space-y-5">
                            <div className="flex flex-col items-center text-center gap-2.5">
                              {subEngraving && (
                                <div className="w-32 h-22 rounded-sm bg-[#FCF1D8] border border-[#EFCB8C]/45 px-2.5 py-1.5 flex items-center justify-center shadow-xs">
                                  <img
                                    src={subEngraving}
                                    srcSet={resolveResponsiveWebpSrcSet(subEngraving)}
                                    sizes="128px"
                                    width={247}
                                    height={166}
                                    alt=""
                                    aria-hidden="true"
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-contain object-center"
                                  />
                                </div>
                              )}
                              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F3E6CB]">
                                {getLocalizedValue(sub.title, lang)}
                              </h3>
                              <OrnamentalCategoryRule variant="cream" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                              {sub.items.map((tier) => (
                                <div
                                  key={tier.id}
                                  className="flex items-baseline gap-2 text-base text-[#F3E6CB]"
                                >
                                  <span dir="auto" className="font-medium">
                                    {getLocalizedValue(tier.label, lang)}
                                  </span>
                                  <span className="dotted-leader" />
                                  <span
                                    dir="ltr"
                                    className="font-bold tabular-nums text-[#EFCB8C] shrink-0"
                                  >
                                    {formatPrice(tier.price, lang)}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {sub.supplements && sub.supplements.length > 0 && (
                              <div className="bg-[#FBF1DA] text-[#CC0000] px-4 py-2 rounded-sm flex items-baseline gap-2 text-sm sm:text-base italic font-semibold">
                                {sub.supplements.map((supp) => (
                                  <React.Fragment key={supp.id}>
                                    <span>
                                      {getLocalizedValue(supp.label, lang)}
                                    </span>
                                    <span className="dotted-leader" />
                                    <span
                                      dir="ltr"
                                      className="tabular-nums shrink-0"
                                    >
                                      {formatPrice(supp.price, lang)}
                                    </span>
                                  </React.Fragment>
                                ))}
                              </div>
                            )}
                          </div>
                        </EditorialReveal>
                      );
                    })}
                </section>
              );
            })}
          </div>
        )}
      </div>

      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label={t.menu.backToTop}
          title={t.menu.backToTop}
          className="fixed bottom-5 end-5 z-30 w-11 h-11 rounded-sm bg-[#8E0F14] hover:bg-[#700B0F] text-[#FBF1DA] border border-[#EFCB8C]/45 shadow-lg inline-flex items-center justify-center transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8E0F14]"
        >
          <ArrowUp className="w-5 h-5" aria-hidden="true" />
        </button>
      )}

      <ProductDetailModal
        item={selectedDish}
        category={selectedDishCategory}
        onClose={() => setSelectedDish(null)}
      />
    </div>
  );
}
