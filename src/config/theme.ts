/**
 * Centralized Le R brand configuration & fixed QR menu destination.
 *
 * Permanent public menu URL placeholder until the owner provides
 * the final production domain (passed via VITE_PUBLIC_MENU_URL).
 */

const rawMenuUrl =
  typeof import.meta !== 'undefined' &&
  typeof import.meta.env?.VITE_PUBLIC_MENU_URL === 'string'
    ? import.meta.env.VITE_PUBLIC_MENU_URL.trim().replace(/^["']+|["']+$/g, '')
    : '';

const configuredMenuUrl =
  /^https:\/\/.+/i.test(rawMenuUrl) && !rawMenuUrl.includes('localhost')
    ? rawMenuUrl
    : 'https://le-r-oran.example/menu';

export const BRAND_EXPLORATION_CONFIG = {
  isTemporaryExploration: false,
  currencySymbol: 'DA',
  defaultLanguage: 'fr' as const,
  defaultTheme: 'light' as const,
  fixedMenuQrUrl: configuredMenuUrl,
};
