import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { LE_R_ASSETS } from '../../assets';
import {
  resolveCategoryEngraving,
  resolveMenuAsset,
  resolveResponsiveWebpSrcSet,
} from '../../assets/resolveAsset';
import {
  EDITORIAL_EASE,
  EDITORIAL_VIEWPORT,
  EditorialReveal,
  EditorialStaggerGroup,
  EditorialStaggerItem,
  MaskedHeadingReveal,
  OrnamentalCategoryRule,
} from '../../components/common';
import {
  HeroSection,
  ProductDetailModal,
} from '../../components/public';
import { useRestaurantData, useTranslation } from '../../hooks';
import type { MenuCategory, MenuItem } from '../../types';
import { formatPrice, getLocalizedValue } from '../../utils/restaurantLogic';

export function HomePage() {
  const { lang, t } = useTranslation();
  const prefersReduced = useReducedMotion();
  const { profile, categories, menuItems } = useRestaurantData();
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  const brandName = getLocalizedValue(profile.brandName, lang);
  const brandSubtitle =
    getLocalizedValue(profile.brandSubtitle, lang) || t.hero.kicker;
  const heroIntro = getLocalizedValue(profile.heroIntro, lang);
  const storyTitle = getLocalizedValue(profile.storyTitle, lang);
  const storyBody = getLocalizedValue(profile.storyBody, lang);
  const address = getLocalizedValue(profile.address, lang);
  const hours = getLocalizedValue(profile.hours, lang);
  const telHref = profile.phone ? `tel:${profile.phone.replace(/\s+/g, '')}` : '';
  const logoSrc =
    resolveMenuAsset(profile.heroImage, 'ringLogo') || LE_R_ASSETS.ringLogo;
  const mascotSrc =
    resolveMenuAsset(profile.interiorImage, 'chefMascot') ||
    LE_R_ASSETS.chefMascot;

  const pizzasCategory = useMemo(
    () => categories.find((c) => c.id === 'pizzas'),
    [categories]
  );
  const pizzaGeantSub = pizzasCategory?.subSections?.[0];
  const darkFeaturePanels = useMemo(
    () =>
      categories
        .filter((c) => c.active && c.themeVariant === 'dark-feature')
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .slice(0, 2)
        .map((category) => ({
          category,
          items: menuItems.filter(
            (i) => i.categoryId === category.id && i.visible
          ),
        }))
        .filter((panel) => panel.items.length > 0),
    [categories, menuItems]
  );

  const selectedCategory: MenuCategory | undefined = selectedDish
    ? categories.find((c) => c.id === selectedDish.categoryId)
    : undefined;

  const baseUrl =
    typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
      ? import.meta.env.BASE_URL
      : './';

  return (
    <div>
      {/* 1. LIVING PRINTED COVER HERO + RESPONSIVE PALM COMPOSITION */}
      <HeroSection
        brandName={brandName}
        logoSrc={logoSrc}
        kicker={brandSubtitle}
        menuDisplayTitle={t.hero.menuDisplayTitle}
        heroIntro={heroIntro}
        ctaMenu={t.hero.ctaMenu}
        phone={profile.phone}
        telHref={telHref}
      />

      {/* 2. FEATURED DARK-BROWN HOUSE PANELS */}
      {(pizzaGeantSub || darkFeaturePanels.length > 0) && (
        <section className="py-14 sm:py-20 border-t border-[#8E0F14]/20 bg-[#EFCB8C]/25 dark:bg-[var(--bg-surface)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <EditorialReveal>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8E0F14] dark:text-[#EFCB8C]">
                  {t.panels.kicker}
                </p>
              </EditorialReveal>
              <MaskedHeadingReveal delay={0.06}>
                <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#5A4126] dark:text-[#F3E6CB]">
                  {t.panels.title}
                </h2>
              </MaskedHeadingReveal>
            </div>

            <EditorialStaggerGroup
              stagger={0.09}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Sub-section Dark Feature Panel (Méga Pizza) */}
              {pizzaGeantSub && (
                <EditorialStaggerItem className="flex">
                  <div className="group dark-feature-panel p-3.5 shadow-md flex flex-col w-full ler-card-interactive border border-transparent hover:border-[#EFCB8C]/35">
                    <div className="dark-feature-inset p-5 sm:p-6 flex-1 flex flex-col justify-between gap-5">
                      <div className="space-y-4">
                        <div className="flex flex-col items-center text-center gap-3">
                          {(() => {
                            const subImg = resolveCategoryEngraving(
                              pizzaGeantSub.engravingKey,
                              baseUrl
                            );
                            if (!subImg) return null;
                            return (
                              <div className="w-28 h-20 rounded-sm bg-[#FCF1D8] border border-[#EFCB8C]/45 px-2.5 py-1.5 flex items-center justify-center shadow-xs">
                                <motion.img
                                  src={subImg}
                                  srcSet={resolveResponsiveWebpSrcSet(subImg)}
                                  sizes="112px"
                                  width={247}
                                  height={166}
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
                                  transition={{ duration: 0.65, ease: EDITORIAL_EASE }}
                                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                            );
                          })()}
                          <h3 className="font-editorial text-2xl font-bold text-[#F3E6CB]">
                            {getLocalizedValue(pizzaGeantSub.title, lang)}
                          </h3>
                          <OrnamentalCategoryRule variant="cream" />
                        </div>

                        <ul className="space-y-3 pt-1">
                          {pizzaGeantSub.items.map((tier) => (
                            <li
                              key={tier.id}
                              className="flex items-baseline gap-2 text-base text-[#F3E6CB]"
                            >
                              <span dir="auto" className="font-medium">
                                {getLocalizedValue(tier.label, lang)}
                              </span>
                              <span className="dotted-leader" />
                              <span
                                dir="ltr"
                                className="font-bold tabular-nums shrink-0"
                              >
                                {formatPrice(tier.price, lang)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {pizzaGeantSub.supplements &&
                        pizzaGeantSub.supplements.length > 0 && (
                          <div className="bg-[#FBF1DA] text-[#CC0000] px-3.5 py-2 rounded-sm flex items-baseline justify-between gap-2 text-sm italic font-semibold">
                            {pizzaGeantSub.supplements.map((supp) => (
                              <React.Fragment key={supp.id}>
                                <span>{getLocalizedValue(supp.label, lang)}</span>
                                <span dir="ltr" className="tabular-nums shrink-0">
                                  {formatPrice(supp.price, lang)}
                                </span>
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </EditorialStaggerItem>
              )}

              {/* Dynamic Dark Feature Category Panels */}
              {darkFeaturePanels.map(({ category, items }, panelIdx) => {
                const panelEngraving = resolveCategoryEngraving(
                  category.engravingKey,
                  baseUrl
                );
                return (
                  <EditorialStaggerItem key={category.id} className="flex">
                    <div className="group dark-feature-panel p-3.5 shadow-md flex flex-col w-full ler-card-interactive border border-transparent hover:border-[#EFCB8C]/35">
                      <div className="dark-feature-inset p-5 sm:p-6 flex-1 flex flex-col justify-between gap-5">
                        <div className="space-y-4">
                          <div className="flex flex-col items-center text-center gap-3">
                            {panelEngraving && (
                              <div className="w-28 h-20 rounded-sm bg-[#FCF1D8] border border-[#EFCB8C]/45 px-2.5 py-1.5 flex items-center justify-center shadow-xs">
                                <motion.img
                                  src={panelEngraving}
                                  srcSet={resolveResponsiveWebpSrcSet(panelEngraving)}
                                  sizes="112px"
                                  width={322}
                                  height={156}
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
                                    delay: (panelIdx + 1) * 0.06,
                                    ease: EDITORIAL_EASE,
                                  }}
                                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                            )}
                            <h3
                              dir="auto"
                              className="font-editorial text-2xl font-bold text-[#F3E6CB]"
                            >
                              {getLocalizedValue(category.name, lang)}
                            </h3>
                            <OrnamentalCategoryRule variant="cream" />
                          </div>

                          <ul className="space-y-2.5">
                            {items.map((item) => (
                              <li key={item.id}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedDish(item)}
                                  className={`w-full flex items-baseline gap-2 text-start text-sm sm:text-base text-[#F3E6CB] hover:text-[#EFCB8C] transition-colors ler-row-interactive py-0.5 rounded-sm ${
                                    !item.available ? 'opacity-65' : ''
                                  }`}
                                >
                                  <span dir="auto" className="font-medium">
                                    {getLocalizedValue(item.name, lang)}
                                  </span>
                                  <span className="dotted-leader" />
                                  <span
                                    dir="ltr"
                                    className="font-bold tabular-nums shrink-0"
                                  >
                                    {formatPrice(item.price, lang)}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Link
                          to={`/menu#cat-${category.id}`}
                          className="group/link inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.16em] text-[#EFCB8C] hover:text-[#FBF1DA] pt-2 border-t border-[#F3E6CB]/25"
                        >
                          <span>{t.panels.viewFullMenu}</span>
                          <ArrowRight
                            className="w-3.5 h-3.5 rtl:rotate-180 transition-transform duration-200 group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    </div>
                  </EditorialStaggerItem>
                );
              })}
            </EditorialStaggerGroup>
          </div>
        </section>
      )}

      {/* 4. RESTAURANT IDENTITY & CONTACT SECTION (#contact) */}
      <section
        id="contact"
        className="py-14 sm:py-20 border-t border-[#8E0F14]/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <EditorialReveal className="w-full flex justify-center">
              <figure className="parchment-card dark:bg-[var(--bg-elevated)] p-6 sm:p-8 rounded-sm text-center space-y-3 max-w-sm w-full ler-card-interactive">
                <motion.img
                  src={mascotSrc}
                  srcSet={
                    mascotSrc === LE_R_ASSETS.chefMascot
                      ? `${LE_R_ASSETS.chefMascotSm} 320w, ${LE_R_ASSETS.chefMascot} 479w`
                      : undefined
                  }
                  sizes="(max-width: 640px) 224px, 256px"
                  width={479}
                  height={650}
                  alt={brandName}
                  loading="lazy"
                  decoding="async"
                  initial={
                    prefersReduced
                      ? false
                      : { opacity: 0, scale: 0.94, y: 10 }
                  }
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={EDITORIAL_VIEWPORT}
                  transition={{ duration: 0.65, ease: EDITORIAL_EASE }}
                  className="w-56 sm:w-64 h-auto mx-auto ler-artwork"
                />
                <figcaption className="text-xs font-medium tracking-[0.16em] uppercase text-[#86673F] dark:text-[#B8A47E] pt-2 border-t border-[#8E0F14]/15">
                  {brandSubtitle
                    ? `${brandName} · ${brandSubtitle}`
                    : t.about.figureCaption}
                </figcaption>
              </figure>
            </EditorialReveal>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <EditorialReveal>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8E0F14] dark:text-[#EFCB8C]">
                  {t.about.kicker}
                </p>
              </EditorialReveal>
              <MaskedHeadingReveal delay={0.05}>
                <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#5A4126] dark:text-[#F3E6CB]">
                  {storyTitle}
                </h2>
              </MaskedHeadingReveal>
              {storyBody && (
                <EditorialReveal delay={0.1}>
                  <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                    {storyBody}
                  </p>
                </EditorialReveal>
              )}
            </div>

            <div className="double-maroon-divider" />

            <EditorialStaggerGroup
              stagger={0.06}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {/* Phone */}
              {telHref && (
                <EditorialStaggerItem>
                  <a
                    href={telHref}
                    className="group parchment-card dark:bg-[var(--bg-elevated)] p-4 rounded-sm flex items-center gap-3.5 hover:border-[#8E0F14] ler-card-interactive"
                  >
                    <img
                      src={LE_R_ASSETS.contactIcons.phone}
                      alt=""
                      aria-hidden="true"
                      width={32}
                      height={32}
                      loading="lazy"
                      decoding="async"
                      className="w-8 h-8 shrink-0 ler-artwork transition-transform duration-200 group-hover:scale-110"
                    />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        {t.about.phoneLabel}
                      </p>
                      <p
                        dir="ltr"
                        className="font-editorial text-base font-bold tabular-nums text-[var(--text-primary)] group-hover:text-[#8E0F14] dark:group-hover:text-[#EFCB8C] transition-colors"
                      >
                        {profile.phone}
                      </p>
                    </div>
                  </a>
                </EditorialStaggerItem>
              )}

              {/* Address */}
              {address && (
                <EditorialStaggerItem>
                  <div className="group parchment-card dark:bg-[var(--bg-elevated)] p-4 rounded-sm flex items-center gap-3.5 ler-card-interactive">
                    <img
                      src={LE_R_ASSETS.contactIcons.location}
                      alt=""
                      aria-hidden="true"
                      width={32}
                      height={32}
                      loading="lazy"
                      decoding="async"
                      className="w-8 h-8 shrink-0 ler-artwork transition-transform duration-200 group-hover:scale-110"
                    />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        {t.about.addressLabel}
                      </p>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {address}
                      </p>
                    </div>
                  </div>
                </EditorialStaggerItem>
              )}

              {/* TikTok */}
              {profile.social.tiktok && (
                <EditorialStaggerItem>
                  <div className="group parchment-card dark:bg-[var(--bg-elevated)] p-4 rounded-sm flex items-center gap-3.5 ler-card-interactive">
                    <img
                      src={LE_R_ASSETS.contactIcons.tiktok}
                      alt=""
                      aria-hidden="true"
                      width={32}
                      height={32}
                      loading="lazy"
                      decoding="async"
                      className="w-8 h-8 shrink-0 ler-artwork transition-transform duration-200 group-hover:scale-110"
                    />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        {t.about.tiktokLabel}
                      </p>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {profile.social.tiktok}
                      </p>
                    </div>
                  </div>
                </EditorialStaggerItem>
              )}

              {/* Snapchat */}
              {profile.social.snapchat && (
                <EditorialStaggerItem>
                  <div className="group parchment-card dark:bg-[var(--bg-elevated)] p-4 rounded-sm flex items-center gap-3.5 ler-card-interactive">
                    <img
                      src={LE_R_ASSETS.contactIcons.snapchat}
                      alt=""
                      aria-hidden="true"
                      width={32}
                      height={32}
                      loading="lazy"
                      decoding="async"
                      className="w-8 h-8 shrink-0 ler-artwork transition-transform duration-200 group-hover:scale-110"
                    />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        {t.about.snapchatLabel}
                      </p>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {profile.social.snapchat}
                      </p>
                    </div>
                  </div>
                </EditorialStaggerItem>
              )}

              {/* Optional hours */}
              {hours && (
                <EditorialStaggerItem className="sm:col-span-2">
                  <div className="parchment-card dark:bg-[var(--bg-elevated)] p-4 rounded-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      {t.about.hoursLabel}
                    </p>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {hours}
                    </p>
                  </div>
                </EditorialStaggerItem>
              )}

              {/* Optional email */}
              {profile.email && (
                <EditorialStaggerItem className="sm:col-span-2">
                  <div className="parchment-card dark:bg-[var(--bg-elevated)] p-4 rounded-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      {t.about.emailLabel}
                    </p>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-sm font-medium text-[var(--text-primary)] hover:text-[#8E0F14]"
                    >
                      {profile.email}
                    </a>
                  </div>
                </EditorialStaggerItem>
              )}
            </EditorialStaggerGroup>
          </div>
        </div>
      </section>

      <ProductDetailModal
        item={selectedDish}
        category={selectedCategory}
        onClose={() => setSelectedDish(null)}
      />
    </div>
  );
}
