import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  doesSubSectionMatchQuery,
  formatPrice,
  getLocalizedValue,
  getPublicCategories,
  getPublicMenuItems,
  normalizeSearchText,
} from './restaurantLogic';
import { parseMenuDataset } from './jsonMenuLoader';
import { TRANSLATIONS } from '../i18n/translations';
import type { MenuCategory, MenuItem } from '../types';

const categories: MenuCategory[] = [
  {
    id: 'cat2',
    name: { fr: 'Les Tacos', en: 'Les Tacos', ar: 'Les Tacos' },
    description: { fr: '', en: '', ar: '' },
    sortOrder: 2,
    active: true,
  },
  {
    id: 'cat1',
    name: { fr: 'Pizzas', en: 'Pizzas', ar: 'Pizzas' },
    description: { fr: '', en: '', ar: '' },
    sortOrder: 1,
    active: true,
  },
  {
    id: 'cat3',
    name: { fr: 'Inactive', en: 'Inactive', ar: 'Inactive' },
    description: { fr: '', en: '', ar: '' },
    sortOrder: 3,
    active: false,
  },
];

const items: MenuItem[] = [
  {
    id: 'i1',
    categoryId: 'cat1',
    name: { fr: 'Végétarienne', en: 'Végétarienne', ar: 'Végétarienne' },
    description: {
      fr: 'Poulet, viande hachée',
      en: 'Poulet, viande hachée',
      ar: 'Poulet, viande hachée',
    },
    price: 800,
    image: '/images/categories/pizzas.webp',
    available: true,
    visible: true,
  },
  {
    id: 'i2',
    categoryId: 'cat1',
    name: { fr: 'Plat Caché', en: 'Plat Caché', ar: 'Plat Caché' },
    description: { fr: 'Non visible', en: 'Non visible', ar: 'Non visible' },
    price: 700,
    image: '/images/categories/pizzas.webp',
    available: true,
    visible: false,
  },
  {
    id: 'i3',
    categoryId: 'cat2',
    name: { fr: 'Poulet', en: 'Poulet', ar: 'Poulet' },
    description: { fr: '', en: '', ar: '' },
    price: 600,
    image: '/images/categories/les-tacos.webp',
    available: false,
    visible: true,
  },
  {
    id: 'i4',
    categoryId: 'cat3',
    name: {
      fr: 'Plat Catégorie Inactive',
      en: 'Plat Catégorie Inactive',
      ar: 'Plat Catégorie Inactive',
    },
    description: { fr: 'Inactif', en: 'Inactif', ar: 'Inactif' },
    price: 500,
    image: '',
    available: true,
    visible: true,
  },
];

const officialJson = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'src/data/menu.json'), 'utf8')
);
const officialDataset = parseMenuDataset(officialJson, './');

test('getPublicMenuItems supports instant search, diacritics, and category-aware matching', () => {
  assert.equal(getPublicMenuItems(items, categories, 'all', '', 'fr').length, 2);
  assert.equal(getPublicMenuItems(items, categories, 'cat1', '', 'fr').length, 1);
  assert.equal(
    getPublicMenuItems(items, categories, 'all', 'tacos poulet', 'fr')[0]?.id,
    'i3'
  );
  assert.equal(
    getPublicMenuItems(items, categories, 'all', 'vegetarienne', 'fr')[0]?.id,
    'i1'
  );
  assert.equal(
    getPublicMenuItems(items, categories, 'all', '  viande   hachee ', 'fr')[0]?.id,
    'i1'
  );
});

test('official menu search handles accents, multi-word tokens, Arabic variants, and zero-match edge cases', () => {
  const { menuItems, categories: officialCats } = officialDataset;

  assert.equal(
    getPublicMenuItems(menuItems, officialCats, 'all', 'cafe', 'fr').some(
      (i) => i.id === 'jus-cafe'
    ),
    true
  );
  assert.equal(
    getPublicMenuItems(menuItems, officialCats, 'all', '  penne   fromages ', 'fr')[0]?.id,
    'pasta-penne-3-fromages'
  );
  assert.equal(
    getPublicMenuItems(menuItems, officialCats, 'all', 'plat crevette ail', 'fr')[0]?.id,
    'plat-crevette-sautee-ail'
  );
  assert.equal(
    getPublicMenuItems(menuItems, officialCats, 'all', 'tacos', 'en').length,
    3
  );
  assert.ok(
    getPublicMenuItems(menuItems, officialCats, 'all', 'شاورما', 'ar').length >= 10
  );
  assert.equal(
    getPublicMenuItems(menuItems, officialCats, 'all', 'اسكندر', 'ar')[0]?.id,
    'pchaw-viande-iskandar'
  );
  assert.equal(
    getPublicMenuItems(menuItems, officialCats, 'all', 'ارز لحم', 'ar')[0]?.id,
    'pchaw-viande-riz'
  );
  assert.equal(
    getPublicMenuItems(menuItems, officialCats, 'all', 'zzzz-nonexistent', 'fr').length,
    0
  );
});

test('doesSubSectionMatchQuery matches Méga Pizza tiers cleanly', () => {
  const pizzas = officialDataset.categories.find((c) => c.id === 'pizzas')!;
  const mega = pizzas.subSections![0]!;
  assert.equal(doesSubSectionMatchQuery(mega, pizzas, 'mega', 'fr'), true);
  assert.equal(doesSubSectionMatchQuery(mega, pizzas, '2 parts', 'en'), true);
  assert.equal(doesSubSectionMatchQuery(mega, pizzas, 'margherita', 'fr'), false);
});

test('normalizeSearchText strips Latin diacritics and normalizes Arabic letters cleanly', () => {
  assert.equal(normalizeSearchText('  Éscalope  à   la Crème '), 'escalope a la creme');
  assert.equal(normalizeSearchText('طبق أرز إسكندر'), 'طبق ارز اسكندر');
  assert.equal(normalizeSearchText('شاورما'), 'شورما');
});

test('getPublicCategories sorts active visible categories by sortOrder', () => {
  const publicCats = getPublicCategories(categories, items);
  assert.deepEqual(
    publicCats.map((c) => c.id),
    ['cat1', 'cat2']
  );
});

test('formatPrice formats Algerian Dinar (DA) and getLocalizedValue falls back safely', () => {
  assert.equal(formatPrice(600, 'fr'), '600 DA');
  assert.equal(formatPrice(1000, 'ar'), '1000 DA');
  assert.equal(formatPrice(24.5, 'en'), '24.50 DA');
  assert.equal(formatPrice(-10, 'fr'), '0 DA');
  assert.equal(
    getLocalizedValue({ fr: 'Français', en: '', ar: '' }, 'ar'),
    'Français'
  );
});

test('TRANSLATIONS maintains full non-empty key parity across FR, EN, and AR', () => {
  const languages = ['fr', 'en', 'ar'] as const;
  const sections = Object.keys(TRANSLATIONS.fr) as Array<keyof typeof TRANSLATIONS.fr>;
  for (const lang of languages) {
    for (const section of sections) {
      const entries = Object.entries(TRANSLATIONS[lang][section]);
      assert.ok(entries.length > 0, `Empty section ${section} in ${lang}`);
      for (const [key, val] of entries) {
        assert.equal(
          typeof val === 'string' && val.trim().length > 0,
          true,
          `Missing translation string for ${lang}.${section}.${key}`
        );
      }
    }
  }
});
