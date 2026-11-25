import { resolvePublicAssetPath } from '../utils/jsonMenuLoader';
import { LE_R_ASSETS } from './index';

const OFFICIAL_CATEGORY_ILLUSTRATIONS: Record<string, string> = {
  pizzas: '/images/categories/pizzas.webp',
  'mega-pizza': '/images/categories/mega-pizza.webp',
  'pizza-geant': '/images/categories/mega-pizza.webp',
  entrees: '/images/categories/entrees.webp',
  'les-pastas': '/images/categories/les-pastas.webp',
  sandwichs: '/images/categories/sandwichs.webp',
  'les-tacos': '/images/categories/les-tacos.webp',
  tacos: '/images/categories/les-tacos.webp',
  'burger-menu': '/images/categories/burger-menu.webp',
  burgers: '/images/categories/burger-menu.webp',
  'les-plats': '/images/categories/les-plats.webp',
  plats: '/images/categories/les-plats.webp',
  'les-plats-kentucky': '/images/categories/les-plats-kentucky.webp',
  'chawarma-sandwich': '/images/categories/chawarma-sandwich.webp',
  'sandwichs-chawarma': '/images/categories/chawarma-sandwich.webp',
  'chawarma-plat': '/images/categories/chawarma-plat.webp',
  'chawarma-box': '/images/categories/chawarma-plat.webp',
  'les-boissons': '/images/categories/les-boissons.webp',
  boissons: '/images/categories/les-boissons.webp',
  'jus-frais-autres': '/images/categories/jus-frais-autres.webp',
  cocktails: '/images/categories/jus-frais-autres.webp',
};

/**
 * Resolves the optimized WebP illustration path for a category key,
 * safely respecting Vite's BASE_URL (subpath-safe on GitHub Pages).
 */
export function resolveCategoryEngraving(
  engravingKey: string | undefined,
  baseUrl = './'
): string {
  if (!engravingKey) return '';
  const relPath = OFFICIAL_CATEGORY_ILLUSTRATIONS[engravingKey];
  if (!relPath) return '';
  return resolvePublicAssetPath(relPath, baseUrl);
}

/**
 * Generates a responsive WebP srcSet (`-sm.webp` 180w/220w + `.webp` 380w)
 * for category and product illustrations under `/images/categories/`.
 */
export function resolveResponsiveWebpSrcSet(resolvedSrc: string): string | undefined {
  if (!resolvedSrc || !resolvedSrc.includes('/images/categories/') || !resolvedSrc.endsWith('.webp')) {
    return undefined;
  }
  if (resolvedSrc.endsWith('-sm.webp')) return undefined;
  const smSrc = resolvedSrc.replace(/\.webp$/, '-sm.webp');
  const isLargerDish =
    resolvedSrc.includes('les-pastas.webp') || resolvedSrc.includes('chawarma-plat.webp');
  const smWidth = isLargerDish ? '220w' : '180w';
  const mainWidth = resolvedSrc.includes('les-pastas.webp') ? '380w' : '320w';
  return `${smSrc} ${smWidth}, ${resolvedSrc} ${mainWidth}`;
}

/**
 * Resolves either a bundled Le R asset key (e.g. "le-r:ringLogo")
 * or a standard static URL / public relative image path ("./images/categories/pizzas.webp").
 */
export function resolveMenuAsset(
  imageRef: string | undefined,
  engravingKey?: string,
  baseUrl = './'
): string {
  const ref = (imageRef || '').trim();

  if (ref.startsWith('le-r:')) {
    const key = ref.slice('le-r:'.length);
    if (key === 'ringLogo') return LE_R_ASSETS.ringLogo;
    if (key === 'chefMascot') return LE_R_ASSETS.chefMascot;
    if (key === 'redBrushOrnament') return LE_R_ASSETS.redBrushOrnament;
    const catImg = resolveCategoryEngraving(key, baseUrl);
    if (catImg) return catImg;
  }

  if (ref) {
    if (ref.startsWith('/images/')) {
      return resolvePublicAssetPath(ref, baseUrl);
    }
    return ref;
  }

  if (engravingKey) {
    return resolveCategoryEngraving(engravingKey, baseUrl);
  }

  return '';
}
