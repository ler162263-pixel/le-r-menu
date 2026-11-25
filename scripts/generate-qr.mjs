#!/usr/bin/env node
/**
 * Developer QR Code Generator for Published Static Menu Deployments
 *
 * Usage:
 *   npm run generate-qr -- https://username.github.io/le-r-menu/#/menu
 *
 * Strict Rules:
 *   - Must be run AFTER deploying so the live published URL is known.
 *   - Rejects localhost, 127.0.0.1, .local, and placeholder domains.
 *   - Outputs a print-ready 1024x1024 PNG (pure black on pure white, Error Correction H).
 */
import fs from 'node:fs';
import path from 'node:path';
import QRCode from 'qrcode';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);

function validateUrl(raw) {
  const trimmed = typeof raw === 'string' ? raw.trim() : '';
  if (!trimmed) {
    throw new Error(
      'Missing published URL.\nUsage: npm run generate-qr -- https://username.github.io/repo-name/#/menu'
    );
  }
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error(`Invalid URL: "${trimmed}"`);
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error(`Unsupported protocol "${parsed.protocol}". Use https://`);
  }
  const host = parsed.hostname.toLowerCase();
  if (LOCAL_HOSTS.has(host) || host.endsWith('.localhost') || host.endsWith('.local')) {
    throw new Error(
      `Refusing to generate QR code for local URL ("${trimmed}"). Deploy first and pass the live published URL.`
    );
  }
  if (host === 'example.com' || host.endsWith('.example') || host.includes('placeholder')) {
    throw new Error(
      `Refusing to generate QR code for placeholder URL ("${trimmed}"). Pass the real published URL.`
    );
  }
  return parsed.toString();
}

function slugify(name) {
  return (
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'restaurant'
  );
}

async function main() {
  const targetUrl = validateUrl(process.argv[2]);
  const menuJsonPath = path.resolve(process.cwd(), 'src/data/menu.json');
  let brandName = 'restaurant';

  if (fs.existsSync(menuJsonPath)) {
    const raw = JSON.parse(fs.readFileSync(menuJsonPath, 'utf8'));
    const rawName = raw?.restaurant?.name;
    if (typeof rawName === 'string') brandName = rawName;
    else if (rawName && typeof rawName === 'object') {
      brandName = rawName.fr || rawName.en || rawName.ar || 'restaurant';
    }
  }

  const outDir = path.resolve(process.cwd(), 'qr-output');
  fs.mkdirSync(outDir, { recursive: true });

  const slug = slugify(brandName);
  const pngPath = path.join(outDir, `${slug}-menu-qr.png`);

  await QRCode.toFile(pngPath, targetUrl, {
    type: 'png',
    width: 1024,
    errorCorrectionLevel: 'H',
    margin: 4,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });

  console.log(`Generated print-ready QR PNG: ${pngPath}`);
  console.log(`Target URL: ${targetUrl}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
