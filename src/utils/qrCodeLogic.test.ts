import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildQrDownloadFilename,
  generateQrPngDataUrl,
  generateQrSvgString,
  validatePublishedMenuUrl,
} from './qrCodeLogic';

test('validatePublishedMenuUrl rejects empty, localhost, and placeholder URLs', () => {
  assert.equal(validatePublishedMenuUrl('').valid, false);
  assert.equal(validatePublishedMenuUrl('http://localhost:3000/menu').valid, false);
  assert.equal(validatePublishedMenuUrl('https://127.0.0.1/#/menu').valid, false);
  assert.equal(validatePublishedMenuUrl('https://le-r.local/#/menu').valid, false);
  assert.equal(validatePublishedMenuUrl('https://le-r-oran.example/menu').valid, false);
  assert.equal(validatePublishedMenuUrl('ftp://files.example.org/menu').valid, false);
});

test('validatePublishedMenuUrl accepts real published GitHub Pages HTTPS URLs', () => {
  const result = validatePublishedMenuUrl('https://studio-menu.github.io/le-r/#/menu');
  assert.equal(result.valid, true);
  assert.equal(result.normalizedUrl, 'https://studio-menu.github.io/le-r/#/menu');
});

test('buildQrDownloadFilename sanitizes restaurant brand name into clean slug', () => {
  assert.equal(buildQrDownloadFilename('Le R', 'png'), 'le-r-menu-qr.png');
  assert.equal(
    buildQrDownloadFilename('Café Étoile', 'svg'),
    'cafe-etoile-menu-qr.svg'
  );
  assert.equal(buildQrDownloadFilename('أوستيريا', 'png'), 'restaurant-menu-qr.png');
});

test('generateQrSvgString and generateQrPngDataUrl generate scannable QR only for valid published URLs', async () => {
  await assert.rejects(() => generateQrPngDataUrl('http://localhost:3000/#/menu'));

  const publishedUrl = 'https://studio-menu.github.io/le-r/#/menu';
  const svg = await generateQrSvgString(publishedUrl);
  assert.ok(svg.includes('<svg'));
  assert.ok(svg.includes('#000000'));

  const png = await generateQrPngDataUrl(publishedUrl, 512);
  assert.ok(png.startsWith('data:image/png;base64,'));
});
