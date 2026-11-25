import type {
  LocalizedText,
  MenuCategory,
  MenuItem,
  MenuSubSection,
  MenuSupplement,
  RestaurantProfile,
} from '../types';

export type RawLocalizedField = string | Partial<LocalizedText> | null | undefined;

export interface RawMenuProductJson {
  id?: string | number;
  name?: RawLocalizedField;
  description?: RawLocalizedField;
  price?: number | string;
  image?: string;
  available?: boolean;
  visible?: boolean;
  dietaryNote?: RawLocalizedField;
}

export interface RawMenuCategoryJson {
  id?: string;
  name?: RawLocalizedField;
  subtitle?: RawLocalizedField;
  description?: RawLocalizedField;
  sortOrder?: number;
  active?: boolean;
  themeVariant?: 'default' | 'dark-feature';
  engravingKey?: string;
  supplements?: Array<{
    id?: string;
    label?: RawLocalizedField;
    price?: number | string;
  }>;
  subSections?: Array<{
    id?: string;
    title?: RawLocalizedField;
    themeVariant?: 'dark-feature';
    engravingKey?: string;
    items?: Array<{
      id?: string;
      label?: RawLocalizedField;
      price?: number | string;
    }>;
    supplements?: Array<{
      id?: string;
      label?: RawLocalizedField;
      price?: number | string;
    }>;
  }>;
  products?: RawMenuProductJson[];
}

export interface RawMenuDatasetJson {
  restaurant?: {
    logoLabel?: string;
    name?: RawLocalizedField;
    brandName?: RawLocalizedField;
    subtitle?: RawLocalizedField;
    brandSubtitle?: RawLocalizedField;
    logo?: string;
    mascotImage?: string;
    description?: RawLocalizedField;
    heroIntro?: RawLocalizedField;
    storyTitle?: RawLocalizedField;
    storyBody?: RawLocalizedField;
    atmosphereNote?: RawLocalizedField;
    address?: RawLocalizedField;
    hours?: RawLocalizedField;
    phone?: string;
    email?: string;
    social?: {
      tiktok?: string;
      snapchat?: string;
      instagram?: string;
      facebook?: string;
    };
    theme?: {
      brandColor?: string;
      accentRed?: string;
      parchmentBase?: string;
      parchmentLight?: string;
      darkFeature?: string;
    };
  };
  categories?: RawMenuCategoryJson[];
}

export interface ParsedMenuDataset {
  profile: RestaurantProfile;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  hasError: boolean;
}

export function normalizeLocalizedText(
  value: RawLocalizedField,
  fallback = ''
): LocalizedText {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return { fr: trimmed, en: trimmed, ar: trimmed };
  }
  if (value && typeof value === 'object') {
    const fr = typeof value.fr === 'string' ? value.fr.trim() : '';
    const en = typeof value.en === 'string' ? value.en.trim() : '';
    const ar = typeof value.ar === 'string' ? value.ar.trim() : '';
    const base = fr || en || ar || fallback;
    return {
      fr: fr || base,
      en: en || base,
      ar: ar || base,
    };
  }
  return { fr: fallback, en: fallback, ar: fallback };
}

export function parseNumericPrice(raw: unknown): number {
  if (typeof raw === 'number') {
    return Number.isFinite(raw) && raw >= 0 ? raw : 0;
  }
  if (typeof raw === 'string') {
    const num = Number(raw.trim());
    return Number.isFinite(num) && num >= 0 ? num : 0;
  }
  return 0;
}

/**
 * Resolves public-folder relative paths (e.g. "/images/logo.png" or "images/logo.png")
 * against Vite's configured BASE_URL so deployments under GitHub Pages subpaths
 * (e.g. "https://user.github.io/repo-name/") never break.
 */
export function resolvePublicAssetPath(
  rawPath: string | undefined,
  baseUrl = './'
): string {
  if (!rawPath || typeof rawPath !== 'string') return '';
  const trimmed = rawPath.trim();
  if (!trimmed) return '';

  if (
    trimmed.startsWith('le-r:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    /^https?:\/\//i.test(trimmed)
  ) {
    return trimmed;
  }

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const cleanRel = trimmed.replace(/^\.\//, '').replace(/^\/+/, '');
  return `${normalizedBase}${cleanRel}`;
}

function normalizeSupplements(
  raw: RawMenuCategoryJson['supplements'],
  prefix: string
): MenuSupplement[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const list = raw
    .filter((s) => s && (s.label !== undefined && s.label !== null))
    .map((s, idx) => ({
      id: s.id ? String(s.id) : `${prefix}-supp-${idx + 1}`,
      label: normalizeLocalizedText(s.label),
      price: parseNumericPrice(s.price),
    }));
  return list.length > 0 ? list : undefined;
}

function normalizeSubSections(
  raw: RawMenuCategoryJson['subSections'],
  catId: string
): MenuSubSection[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const list: MenuSubSection[] = [];
  raw.forEach((sub, idx) => {
    if (!sub || !sub.title) return;
    const subId = sub.id ? String(sub.id) : `${catId}-sub-${idx + 1}`;
    const items = Array.isArray(sub.items)
      ? sub.items
          .filter((item) => item && item.label)
          .map((item, iIdx) => ({
            id: item.id ? String(item.id) : `${subId}-item-${iIdx + 1}`,
            label: normalizeLocalizedText(item.label),
            price: parseNumericPrice(item.price),
          }))
      : [];
    list.push({
      id: subId,
      title: normalizeLocalizedText(sub.title),
      themeVariant: 'dark-feature',
      engravingKey: sub.engravingKey,
      items,
      supplements: normalizeSupplements(sub.supplements, subId),
    });
  });
  return list.length > 0 ? list : undefined;
}

const DEFAULT_EMPTY_PROFILE: RestaurantProfile = {
  logoLabel: 'Menu',
  brandName: { fr: 'Restaurant', en: 'Restaurant', ar: 'المطعم' },
  brandSubtitle: { fr: '', en: '', ar: '' },
  heroIntro: { fr: '', en: '', ar: '' },
  storyTitle: { fr: '', en: '', ar: '' },
  storyBody: { fr: '', en: '', ar: '' },
  atmosphereNote: { fr: '', en: '', ar: '' },
  address: { fr: '', en: '', ar: '' },
  hours: { fr: '', en: '', ar: '' },
  phone: '',
  email: '',
  heroImage: '',
  interiorImage: '',
  social: { tiktok: '', snapchat: '' },
};

/**
 * Parses and validates raw JSON menu data safely.
 * Supports both simple string fields (template mode) and localized { fr, en, ar } objects.
 * Never throws on malformed or partial JSON inputs.
 */
export function parseMenuDataset(
  raw: unknown,
  baseUrl = './'
): ParsedMenuDataset {
  if (!raw || typeof raw !== 'object') {
    return {
      profile: DEFAULT_EMPTY_PROFILE,
      categories: [],
      menuItems: [],
      hasError: true,
    };
  }

  const dataset = raw as RawMenuDatasetJson;
  const r = dataset.restaurant;

  const brandName = normalizeLocalizedText(
    r?.brandName ?? r?.name,
    'Restaurant'
  );
  const subtitle = normalizeLocalizedText(r?.brandSubtitle ?? r?.subtitle);
  const heroIntro = normalizeLocalizedText(r?.heroIntro ?? r?.description);
  const storyTitle = normalizeLocalizedText(
    r?.storyTitle,
    brandName.fr || 'Notre Maison'
  );
  const storyBody = normalizeLocalizedText(r?.storyBody ?? r?.description);

  const profile: RestaurantProfile = {
    logoLabel: (r?.logoLabel || brandName.fr || 'R').slice(0, 6),
    brandName,
    brandSubtitle: subtitle,
    heroIntro,
    storyTitle,
    storyBody,
    atmosphereNote: normalizeLocalizedText(r?.atmosphereNote),
    address: normalizeLocalizedText(r?.address),
    hours: normalizeLocalizedText(r?.hours),
    phone: typeof r?.phone === 'string' ? r.phone.trim() : '',
    email: typeof r?.email === 'string' ? r.email.trim() : '',
    heroImage: resolvePublicAssetPath(r?.logo, baseUrl),
    interiorImage: resolvePublicAssetPath(r?.mascotImage, baseUrl),
    social: {
      tiktok: typeof r?.social?.tiktok === 'string' ? r.social.tiktok.trim() : '',
      snapchat:
        typeof r?.social?.snapchat === 'string' ? r.social.snapchat.trim() : '',
      instagram:
        typeof r?.social?.instagram === 'string'
          ? r.social.instagram.trim()
          : undefined,
      facebook:
        typeof r?.social?.facebook === 'string'
          ? r.social.facebook.trim()
          : undefined,
    },
    theme: r?.theme,
  };

  if (!Array.isArray(dataset.categories)) {
    return {
      profile,
      categories: [],
      menuItems: [],
      hasError: true,
    };
  }

  const categories: MenuCategory[] = [];
  const menuItems: MenuItem[] = [];

  dataset.categories.forEach((rawCat, catIdx) => {
    if (!rawCat || typeof rawCat !== 'object') return;
    const catName = normalizeLocalizedText(rawCat.name);
    if (!catName.fr && !catName.en && !catName.ar) return;

    const catId =
      typeof rawCat.id === 'string' && rawCat.id.trim()
        ? rawCat.id.trim()
        : `cat-${catIdx + 1}`;

    categories.push({
      id: catId,
      name: catName,
      subtitle: rawCat.subtitle
        ? normalizeLocalizedText(rawCat.subtitle)
        : undefined,
      description: normalizeLocalizedText(rawCat.description),
      sortOrder:
        typeof rawCat.sortOrder === 'number' ? rawCat.sortOrder : catIdx + 1,
      active: rawCat.active !== false,
      themeVariant:
        rawCat.themeVariant === 'dark-feature' ? 'dark-feature' : 'default',
      engravingKey:
        typeof rawCat.engravingKey === 'string' ? rawCat.engravingKey : catId,
      supplements: normalizeSupplements(rawCat.supplements, catId),
      subSections: normalizeSubSections(rawCat.subSections, catId),
    });

    if (Array.isArray(rawCat.products)) {
      rawCat.products.forEach((rawProd, prodIdx) => {
        if (!rawProd || typeof rawProd !== 'object') return;
        const prodName = normalizeLocalizedText(rawProd.name);
        if (!prodName.fr && !prodName.en && !prodName.ar) return;

        const prodId =
          rawProd.id !== undefined && rawProd.id !== null && String(rawProd.id).trim()
            ? String(rawProd.id).trim()
            : `${catId}-item-${prodIdx + 1}`;

        const available = rawProd.available !== false;
        const visible = rawProd.visible !== false;

        menuItems.push({
          id: prodId,
          categoryId: catId,
          name: prodName,
          description: normalizeLocalizedText(rawProd.description),
          price: parseNumericPrice(rawProd.price),
          image: resolvePublicAssetPath(rawProd.image, baseUrl),
          available,
          visible,
          dietaryNote: rawProd.dietaryNote
            ? normalizeLocalizedText(rawProd.dietaryNote)
            : undefined,
        });
      });
    }
  });

  return {
    profile,
    categories,
    menuItems,
    hasError: false,
  };
}
