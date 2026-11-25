import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LE_R_ASSETS } from '../../assets';
import { resolveMenuAsset } from '../../assets/resolveAsset';
import { useRestaurantData, useTranslation } from '../../hooks';
import { getLocalizedValue } from '../../utils/restaurantLogic';
import {
  EditorialReveal,
  LanguageSwitcher,
  OrnamentalCategoryRule,
} from '../common';

export function PublicFooter() {
  const { lang, setLanguage, t } = useTranslation();
  const { profile } = useRestaurantData();
  const [logoError, setLogoError] = useState(false);

  const brandName = getLocalizedValue(profile.brandName, lang);
  const subtitle = getLocalizedValue(profile.brandSubtitle, lang);
  const address = getLocalizedValue(profile.address, lang);
  const hours = getLocalizedValue(profile.hours, lang);
  const telHref = profile.phone ? `tel:${profile.phone.replace(/\s+/g, '')}` : '';
  const logoSrc = resolveMenuAsset(profile.heroImage, 'ringLogo') || LE_R_ASSETS.ringLogo;

  useEffect(() => {
    setLogoError(false);
  }, [logoSrc]);

  return (
    <footer className="bg-[#5A4126] text-[#F3E6CB] border-t-4 border-[#8E0F14] mt-16">
      <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Identity */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 bg-[#F5E6C5] rounded-full p-1 flex items-center justify-center shrink-0">
                {!logoError ? (
                  <img
                    src={logoSrc}
                    alt={brandName}
                    width={48}
                    height={46}
                    loading="lazy"
                    decoding="async"
                    onError={() => setLogoError(true)}
                    className="w-full h-full ler-artwork"
                  />
                ) : (
                  <span className="font-editorial font-bold text-base text-[#8E0F14]">
                    {profile.logoLabel}
                  </span>
                )}
              </div>
              <div>
                <h2 className="font-editorial text-2xl font-bold text-[#F3E6CB]">
                  {brandName}
                </h2>
                {subtitle && (
                  <p className="text-xs tracking-[0.14em] uppercase text-[#EFCB8C]">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#F3E6CB]/85 max-w-md">
              {getLocalizedValue(profile.atmosphereNote, lang) || t.footer.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#EFCB8C]">
              {t.footer.navigationTitle}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-[#F3E6CB]/90 hover:text-[#EFCB8C] transition-colors"
                >
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link
                  to="/menu"
                  className="text-[#F3E6CB]/90 hover:text-[#EFCB8C] transition-colors"
                >
                  {t.nav.menu}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#EFCB8C]">
              {t.footer.contactTitle}
            </h3>
            <div className="space-y-2.5 text-sm text-[#F3E6CB]/90">
              {address && <p>{address}</p>}
              {hours && <p className="text-xs text-[#EFCB8C]/90">{hours}</p>}
              {telHref && (
                <p>
                  <a
                    href={telHref}
                    dir="ltr"
                    className="font-semibold tabular-nums hover:text-[#EFCB8C] transition-colors"
                  >
                    {profile.phone}
                  </a>
                </p>
              )}
              {profile.email && (
                <p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="hover:text-[#EFCB8C] transition-colors break-all"
                  >
                    {profile.email}
                  </a>
                </p>
              )}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#EFCB8C]">
                {profile.social.tiktok && (
                  <span>
                    {t.about.tiktokLabel}: {profile.social.tiktok}
                  </span>
                )}
                {profile.social.snapchat && (
                  <span>
                    {t.about.snapchatLabel}: {profile.social.snapchat}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <OrnamentalCategoryRule variant="cream" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-[#F3E6CB]/80">
            © {new Date().getFullYear()} {brandName}
            {subtitle ? ` · ${subtitle}` : ''}
          </p>
          <LanguageSwitcher
            lang={lang}
            onChange={setLanguage}
            label={t.nav.languageLabel}
          />
        </div>
      </EditorialReveal>
    </footer>
  );
}
