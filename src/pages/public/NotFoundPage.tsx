import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UtensilsCrossed } from 'lucide-react';
import { LE_R_ASSETS } from '../../assets';
import { resolveMenuAsset } from '../../assets/resolveAsset';
import { useRestaurantData, useTranslation } from '../../hooks';
import { getLocalizedValue } from '../../utils/restaurantLogic';

export function NotFoundPage() {
  const { lang, t } = useTranslation();
  const { profile } = useRestaurantData();
  const brandName = getLocalizedValue(profile.brandName, lang);
  const logoSrc =
    resolveMenuAsset(profile.heroImage, 'ringLogo') || LE_R_ASSETS.ringLogo;

  return (
    <div className="py-16 sm:py-24 px-4">
      <div className="max-w-xl mx-auto text-center space-y-6 parchment-card dark:bg-[var(--bg-elevated)] border-2 border-[#8E0F14]/35 p-8 sm:p-12 rounded-sm">
        <img
          src={logoSrc}
          alt={brandName}
          width={96}
          height={92}
          decoding="async"
          className="w-24 h-auto mx-auto ler-artwork"
        />
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8E0F14] dark:text-[#EFCB8C]">
          404 · {t.notFound.kicker}
        </p>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#5A4126] dark:text-[#F3E6CB]">
          {t.notFound.title}
        </h1>
        <div className="flex justify-center">
          <img
            src={LE_R_ASSETS.redBrushOrnament}
            alt=""
            aria-hidden="true"
            width={576}
            height={77}
            decoding="async"
            className="w-40 h-auto ler-artwork"
          />
        </div>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          {t.notFound.description}
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 bg-[#8E0F14] hover:bg-[#700B0F] text-[#FBF1DA] text-sm font-medium rounded-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
            <span>{t.notFound.backHome}</span>
          </Link>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 border border-[#5A4126]/40 bg-[#F5E6C5]/60 dark:bg-[var(--bg-canvas)] text-sm font-medium text-[var(--text-primary)] hover:border-[#8E0F14] rounded-sm transition-colors"
          >
            <UtensilsCrossed className="w-4 h-4" aria-hidden="true" />
            <span>{t.notFound.goToMenu}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
