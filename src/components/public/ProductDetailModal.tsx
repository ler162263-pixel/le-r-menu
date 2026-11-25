import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { resolveResponsiveWebpSrcSet } from '../../assets/resolveAsset';
import { useTranslation } from '../../hooks';
import type { MenuCategory, MenuItem } from '../../types';
import { formatPrice, getLocalizedValue } from '../../utils/restaurantLogic';
import {
  EDITORIAL_EASE,
  OrnamentalCategoryRule,
  SafeMenuImage,
} from '../common';

interface ProductDetailModalProps {
  item: MenuItem | null;
  category?: MenuCategory;
  onClose: () => void;
}

export function ProductDetailModal({
  item,
  category,
  onClose,
}: ProductDetailModalProps) {
  const { lang, t } = useTranslation();
  const prefersReduced = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!item) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 20);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      previousFocusRef.current?.focus();
    };
  }, [item, onClose]);

  const title = item ? getLocalizedValue(item.name, lang) : '';
  const description = item
    ? getLocalizedValue(item.description, lang).trim()
    : '';
  const categoryName = category ? getLocalizedValue(category.name, lang) : '';
  const isDarkCategory = category?.themeVariant === 'dark-feature';
  const productImageSrc = item?.image?.trim() || '';

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="product-detail-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: prefersReduced ? 0.01 : 0.22,
            ease: EDITORIAL_EASE,
          }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#24190E]/65 backdrop-blur-[2px] p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-detail-title"
          onClick={onClose}
        >
          <motion.div
            key={item.id}
            ref={dialogRef}
            initial={
              prefersReduced
                ? { opacity: 1 }
                : { opacity: 0, y: 20, scale: 0.965 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, y: 14, scale: 0.975 }
            }
            transition={{
              duration: prefersReduced ? 0.01 : 0.3,
              ease: EDITORIAL_EASE,
            }}
            className="w-full sm:max-w-lg bg-[#FBF1DA] dark:bg-[var(--bg-elevated)] border-t-2 sm:border-2 border-[#8E0F14]/45 shadow-2xl rounded-t-xl sm:rounded-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Ornamental Header Strip */}
            <div
              className={`px-6 pt-6 pb-5 flex items-start justify-between gap-4 border-b border-[#8E0F14]/20 ${
                isDarkCategory
                  ? 'bg-[#5A4126] text-[#F3E6CB]'
                  : 'bg-[#F5E6C5]/75 dark:bg-[var(--bg-surface)]'
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <motion.div
                  initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.06,
                    ease: EDITORIAL_EASE,
                  }}
                  className={`w-24 h-18 sm:w-28 sm:h-20 aspect-[4/3] rounded-sm flex items-center justify-center p-2 shrink-0 overflow-hidden ${
                    isDarkCategory
                      ? 'bg-[#FCF1D8] border border-[#EFCB8C]/45 shadow-xs'
                      : 'bg-[#FCF1D8] dark:bg-[#F5E6C5]/90 border border-[#8E0F14]/20 shadow-xs'
                  }`}
                >
                  <SafeMenuImage
                    src={productImageSrc}
                    srcSet={resolveResponsiveWebpSrcSet(productImageSrc)}
                    sizes="(max-width: 640px) 96px, 112px"
                    width={240}
                    height={180}
                    alt={title}
                    objectFit="contain"
                    objectPosition="center"
                    lazy={false}
                    className="w-full h-full"
                  />
                </motion.div>

                <div className="space-y-1 min-w-0">
                  {categoryName && (
                    <p
                      dir="auto"
                      className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                        isDarkCategory
                          ? 'text-[#EFCB8C]'
                          : 'text-[#86673F] dark:text-[#EFCB8C]'
                      }`}
                    >
                      {categoryName}
                    </p>
                  )}
                  <h2
                    id="product-detail-title"
                    dir="auto"
                    className={`font-editorial text-2xl sm:text-3xl font-bold leading-tight ${
                      isDarkCategory
                        ? 'text-[#F3E6CB]'
                        : 'text-[#5A4126] dark:text-[#F3E6CB]'
                    }`}
                  >
                    {title}
                  </h2>
                </div>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label={t.menu.detailClose}
                className={`w-10 h-10 flex items-center justify-center rounded-sm border shrink-0 transition-all active:scale-90 ${
                  isDarkCategory
                    ? 'border-[#F3E6CB]/35 text-[#F3E6CB] hover:bg-[#F3E6CB]/10'
                    : 'border-[#5A4126]/30 text-[#5A4126] dark:text-[#F3E6CB] hover:border-[#8E0F14] hover:text-[#8E0F14]'
                }`}
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Body Content: Availability, Price (DA), Description (when present) */}
            <div className="p-6 sm:p-7 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-sm border ${
                    item.available
                      ? 'bg-emerald-700/10 border-emerald-700/25 text-emerald-800 dark:text-emerald-300'
                      : 'bg-[#8E0F14]/10 border-[#8E0F14]/30 text-[#8E0F14] dark:text-[#FF8A80]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.available ? 'bg-emerald-600' : 'bg-[#CC0000]'
                    }`}
                    aria-hidden="true"
                  />
                  <span>
                    {item.available
                      ? t.menu.availableBadge
                      : t.menu.unavailableBadge}
                  </span>
                </span>

                <p
                  dir="ltr"
                  className="font-editorial text-2xl sm:text-3xl font-bold tabular-nums text-[#8E0F14] dark:text-[#EFCB8C]"
                >
                  {formatPrice(item.price, lang)}
                </p>
              </div>

              {description && (
                <>
                  <OrnamentalCategoryRule variant="maroon" />
                  <p
                    dir="auto"
                    className="text-base italic leading-relaxed text-[#6B5535] dark:text-[#DFCCA8]"
                  >
                    {description}
                  </p>
                </>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[42px] px-6 py-2 bg-[#8E0F14] hover:bg-[#700B0F] text-[#FBF1DA] text-sm font-medium rounded-sm transition-all active:scale-[0.97]"
                >
                  {t.menu.detailClose}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
