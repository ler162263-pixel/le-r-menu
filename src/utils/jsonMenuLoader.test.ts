import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  normalizeLocalizedText,
  parseMenuDataset,
  resolvePublicAssetPath,
} from './jsonMenuLoader';

test('parseMenuDataset parses complete official Le R PDF menu.json accurately with verified images', () => {
  const jsonPath = path.resolve(process.cwd(), 'src/data/menu.json');
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const parsed = parseMenuDataset(raw, './');

  assert.equal(parsed.hasError, false);
  assert.equal(parsed.profile.brandName.fr, 'Le R');
  assert.equal(parsed.profile.address.fr, 'Avenue Mekki Khlifa, Maraval - Oran');
  assert.equal(parsed.profile.phone, '0549 93 31 41');
  assert.equal(parsed.categories.length, 14);
  assert.equal(parsed.menuItems.length, 82);

  // Zero recommendation properties should exist in menu.json
  for (const cat of raw.categories) {
    for (const prod of cat.products) {
      assert.equal('featured' in prod, false);
      if (prod.image) {
        const assetFile = path.resolve(
          process.cwd(),
          'public',
          prod.image.replace(/^\//, '')
        );
        assert.equal(
          fs.existsSync(assetFile),
          true,
          `Missing product image asset: ${prod.image}`
        );
        if (prod.image.endsWith('.webp')) {
          const smFile = assetFile.replace(/\.webp$/, '-sm.webp');
          assert.equal(
            fs.existsSync(smFile),
            true,
            `Missing responsive -sm.webp variant: ${smFile}`
          );
        }
      }
    }
  }

  // Verify no duplicate product IDs and no duplicate product names within a category
  const itemIds = new Set(parsed.menuItems.map((i) => i.id));
  assert.equal(itemIds.size, parsed.menuItems.length);
  for (const cat of parsed.categories) {
    const catItems = parsed.menuItems.filter((i) => i.categoryId === cat.id);
    const names = new Set(catItems.map((i) => i.name.fr.toLowerCase()));
    assert.equal(names.size, catItems.length);
  }

  // Every item has a positive price
  assert.ok(parsed.menuItems.every((i) => i.price > 0));

  const pizzas = parsed.categories.find((c) => c.id === 'pizzas');
  assert.equal(pizzas?.subSections?.[0]?.id, 'mega-pizza');
  assert.equal(pizzas?.subSections?.[0]?.items.length, 3);
  assert.equal(pizzas?.subSections?.[0]?.supplements, undefined);
});

test('parseMenuDataset supports simple single-language template JSON with custom image paths and availability', () => {
  const templateJson = {
    restaurant: {
      name: 'La Bella',
      logo: '/images/logo.png',
      description: 'Welcome to our restaurant',
    },
    categories: [
      {
        id: 'pizza',
        name: 'Pizza',
        products: [
          {
            id: 1,
            name: 'Margherita',
            description: 'Tomato, mozzarella and basil',
            price: 800,
            image: '/images/products/margherita.jpg',
            available: true,
          },
          {
            id: 2,
            name: 'Calzone',
            description: 'Folded pizza',
            price: 950,
            image: '/images/products/calzone.jpg',
            available: false,
          },
        ],
      },
    ],
  };

  const parsed = parseMenuDataset(templateJson, '/la-bella/');
  assert.equal(parsed.hasError, false);
  assert.equal(parsed.profile.brandName.fr, 'La Bella');
  assert.equal(parsed.profile.heroImage, '/la-bella/images/logo.png');
  assert.equal(parsed.categories.length, 1);
  assert.equal(parsed.menuItems.length, 2);
  assert.equal(parsed.menuItems[0]?.id, '1');
  assert.equal(
    parsed.menuItems[0]?.image,
    '/la-bella/images/products/margherita.jpg'
  );
  assert.equal(parsed.menuItems[0]?.available, true);
  assert.equal(parsed.menuItems[1]?.available, false);
});

test('parseMenuDataset handles invalid or malformed JSON gracefully without throwing', () => {
  const broken = parseMenuDataset(null, './');
  assert.equal(broken.hasError, true);
  assert.equal(broken.categories.length, 0);
  assert.equal(broken.menuItems.length, 0);

  const partial = parseMenuDataset({ restaurant: { name: 'Test' } }, './');
  assert.equal(partial.hasError, true);
  assert.equal(partial.profile.brandName.fr, 'Test');
});

test('resolvePublicAssetPath keeps bundled keys and resolves relative paths for GitHub Pages', () => {
  assert.equal(resolvePublicAssetPath('le-r:pizzas', '/repo/'), 'le-r:pizzas');
  assert.equal(
    resolvePublicAssetPath('/images/logo.png', '/repo/'),
    '/repo/images/logo.png'
  );
  assert.equal(
    resolvePublicAssetPath('./images/dish.jpg', './'),
    './images/dish.jpg'
  );
  assert.equal(
    normalizeLocalizedText({ fr: '', en: 'English Title', ar: '' }).fr,
    'English Title'
  );
});
