import type {
  Language,
  LocalizedText,
  MenuCategory,
  MenuItem,
  MenuSubSection,
} from '../types';

export function getLocalizedValue(
  text: LocalizedText,
  lang: Language
): string {
  const val = text[lang]?.trim();
  if (val) return val;
  return text.fr || text.en || text.ar || '';
}

/**
 * Normalizes Latin diacritics, Arabic hamza/tashkeel/orthographic variants,
 * punctuation, and repeated whitespace for resilient client-side menu search.
 */
export function normalizeSearchText(value: string): string {
  if (!value) return '';
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .toLowerCase()
    .replace(/شاورما/g, 'شورما')
    .replace(/\bshawarma\b/g, 'chawarma')
    .replace(/[’'`´_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenizeSearchQuery(query: string): string[] {
  const normalized = normalizeSearchText(query);
  return normalized ? normalized.split(' ').filter(Boolean) : [];
}

function buildLocalizedHaystack(text?: LocalizedText): string {
  if (!text) return '';
  return `${text.fr || ''} ${text.en || ''} ${text.ar || ''}`;
}

export function getPublicCategories(
  categories: MenuCategory[],
  items: MenuItem[]
): MenuCategory[] {
  const visibleCatIds = new Set(
    items.filter((item) => item.visible).map((item) => item.categoryId)
  );
  return [...categories]
    .filter((cat) => cat.active && visibleCatIds.has(cat.id))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPublicMenuItems(
  items: MenuItem[],
  categories: MenuCategory[],
  categoryId: string | 'all',
  searchQuery = '',
  lang: Language = 'fr'
): MenuItem[] {
  const activeCatIds = new Set(
    categories.filter((c) => c.active).map((c) => c.id)
  );
  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const tokens = tokenizeSearchQuery(searchQuery);

  return items.filter((item) => {
    if (!item.visible) return false;
    if (!activeCatIds.has(item.categoryId)) return false;
    if (categoryId !== 'all' && item.categoryId !== categoryId) return false;
    if (tokens.length === 0) return true;

    const category = categoryMap.get(item.categoryId);
    const haystack = normalizeSearchText(
      [
        getLocalizedValue(item.name, lang),
        getLocalizedValue(item.description, lang),
        buildLocalizedHaystack(item.name),
        buildLocalizedHaystack(item.description),
        category ? getLocalizedValue(category.name, lang) : '',
        category ? buildLocalizedHaystack(category.name) : '',
      ].join(' ')
    );

    return tokens.every((token) => haystack.includes(token));
  });
}

export function doesSubSectionMatchQuery(
  subSection: MenuSubSection,
  category: MenuCategory,
  searchQuery: string,
  lang: Language = 'fr'
): boolean {
  const tokens = tokenizeSearchQuery(searchQuery);
  if (tokens.length === 0) return true;

  const haystack = normalizeSearchText(
    [
      getLocalizedValue(subSection.title, lang),
      buildLocalizedHaystack(subSection.title),
      getLocalizedValue(category.name, lang),
      buildLocalizedHaystack(category.name),
      ...subSection.items.map(
        (tier) =>
          `${getLocalizedValue(tier.label, lang)} ${buildLocalizedHaystack(tier.label)}`
      ),
    ].join(' ')
  );

  return tokens.every((token) => haystack.includes(token));
}

/**
 * Formats prices in Algerian Dinars (DA) exactly as printed on the Le R menu.
 * Integer prices display without decimals (e.g. "600 DA", "1000 DA").
 * Always uses Western digits across FR, EN, and AR.
 */
export function formatPrice(amount: number, _lang?: Language): string {
  if (!Number.isFinite(amount) || amount < 0) {
    return '0 DA';
  }
  const rounded = Math.round(amount * 100) / 100;
  const formatted = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(2);
  return `${formatted} DA`;
}
