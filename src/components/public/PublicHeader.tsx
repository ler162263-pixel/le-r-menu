import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Phone, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { LE_R_ASSETS } from '../../assets';
import { resolveMenuAsset } from '../../assets/resolveAsset';
import { useRestaurantData, useTranslation } from '../../hooks';
import { getLocalizedValue } from '../../utils/restaurantLogic';
import { EDITORIAL_EASE, LanguageSwitcher } from '../common';

export function PublicHeader() {
  const { lang, setLanguage, t } = useTranslation();
  const { profile } = useRestaurantData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const brandName = getLocalizedValue(profile.brandName, lang);
  const brandSubtitle = getLocalizedValue(profile.brandSubtitle, lang) || t.hero.kicker;
  const telHref = profile.phone ? `tel:${profile.phone.replace(/\s+/g, '')}` : '';
  const logoSrc = resolveMenuAsset(profile.heroImage, 'ringLogo') || LE_R_ASSETS.ringLogo;

  useEffect(() => {
    setLogoError(false);
  }, [logoSrc]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    const scrollTarget = () => {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    };
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scrollTarget, 120);
    } else {
      scrollTarget();
    }
  };

  const navItems = [
    { to: '/', label: t.nav.home, end: true },
    { to: '/menu', label: t.nav.menu, end: false },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-shadow duration-300 double-maroon-rule ${
        scrolled
          ? 'bg-[var(--bg-canvas)]/96 backdrop-blur-md shadow-[0_6px_22px_rgba(90,65,38,0.10)]'
          : 'bg-[var(--bg-canvas)]/92 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[70px] flex items-center justify-between gap-4">
        {/* Restaurant Logo & Identity */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="group inline-flex items-center gap-2.5 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8E0F14]"
        >
          {!logoError ? (
            <img
              src={logoSrc}
              alt={brandName}
              width={44}
              height={42}
              decoding="async"
              fetchPriority="high"
              onError={() => setLogoError(true)}
              className="w-10 h-10 sm:w-11 sm:h-11 ler-artwork transition-transform duration-200 group-hover:scale-[1.04] group-active:scale-95"
            />
          ) : (
            <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#8E0F14] bg-[#FBF1DA] flex items-center justify-center font-editorial font-bold text-sm text-[#8E0F14]">
              {profile.logoLabel}
            </span>
          )}
          <div className="flex flex-col leading-none">
            <span className="font-editorial text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)]">
              {brandName}
            </span>
            <span className="text-[11px] tracking-[0.14em] uppercase text-[var(--text-muted)] mt-0.5">
              {brandSubtitle}
            </span>
          </div>
        </Link>

        {/* Primary Desktop Navigation */}
        <nav aria-label={t.nav.primaryAriaLabel} className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative text-sm font-medium tracking-wide transition-colors whitespace-nowrap shrink-0 py-1.5 active:scale-[0.97] ${
                  isActive
                    ? 'text-[#8E0F14] dark:text-[#F3E6CB]'
                    : 'text-[var(--text-secondary)] hover:text-[#8E0F14] dark:hover:text-[#F3E6CB]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="public-nav-underline"
                      transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
                      className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-[#8E0F14] dark:bg-[#CC0000]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
          <a
            href="#contact"
            onClick={handleContactClick}
            className="text-sm font-medium tracking-wide transition-colors whitespace-nowrap shrink-0 py-1.5 border-b-2 border-transparent text-[var(--text-secondary)] hover:text-[#8E0F14] dark:hover:text-[#F3E6CB] active:scale-[0.97]"
          >
            {t.nav.contact}
          </a>
        </nav>

        {/* Right Controls: Language Switcher + Mobile Drawer Trigger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:block">
            <LanguageSwitcher
              lang={lang}
              onChange={setLanguage}
              label={t.nav.languageLabel}
            />
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-sm transition-transform active:scale-95"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EDITORIAL_EASE }}
            className="md:hidden absolute top-full inset-x-0 z-40 border-t border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-4 space-y-3 shadow-lg"
          >
            <nav aria-label={t.nav.mobileAriaLabel} className="flex flex-col space-y-1">
              <NavLink
                to="/"
                end
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 text-sm font-medium rounded-sm transition-colors ${
                    isActive
                      ? 'bg-[#8E0F14] text-[#FBF1DA]'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-canvas)]'
                  }`
                }
              >
                {t.nav.home}
              </NavLink>
              <NavLink
                to="/menu"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 text-sm font-medium rounded-sm transition-colors ${
                    isActive
                      ? 'bg-[#8E0F14] text-[#FBF1DA]'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-canvas)]'
                  }`
                }
              >
                {t.nav.menu}
              </NavLink>
              <a
                href="#contact"
                onClick={handleContactClick}
                className="px-3 py-2.5 text-sm font-medium rounded-sm text-[var(--text-primary)] hover:bg-[var(--bg-canvas)] transition-colors"
              >
                {t.nav.contact}
              </a>
            </nav>

            <div className="pt-3 border-t border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-3">
              <LanguageSwitcher
                lang={lang}
                onChange={setLanguage}
                label={t.nav.languageLabel}
              />
              {telHref && (
                <a
                  href={telHref}
                  className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 bg-[#8E0F14] text-[#FBF1DA] text-xs font-medium rounded-sm active:scale-95 transition-transform"
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  <span dir="ltr" className="tabular-nums">
                    {profile.phone}
                  </span>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
