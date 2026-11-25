import QRCode from 'qrcode';

export interface QrUrlValidationResult {
  valid: boolean;
  normalizedUrl?: string;
  reason?:
    | 'empty'
    | 'invalid_url'
    | 'invalid_protocol'
    | 'localhost_forbidden'
    | 'placeholder_forbidden';
}

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);

/**
 * Validates that a QR code target is a real published HTTPS/HTTP URL.
 * Explicitly refuses localhost, loopback IPs, .local hosts, and placeholder domains.
 */
export function validatePublishedMenuUrl(rawUrl: string): QrUrlValidationResult {
  const trimmed = typeof rawUrl === 'string' ? rawUrl.trim() : '';
  if (!trimmed) {
    return { valid: false, reason: 'empty' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, reason: 'invalid_url' };
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { valid: false, reason: 'invalid_protocol' };
  }

  const host = parsed.hostname.toLowerCase();
  if (
    LOCAL_HOSTS.has(host) ||
    host.endsWith('.localhost') ||
    host.endsWith('.local')
  ) {
    return { valid: false, reason: 'localhost_forbidden' };
  }

  if (
    host === 'example.com' ||
    host.endsWith('.example') ||
    host.includes('your-restaurant') ||
    host.includes('placeholder')
  ) {
    return { valid: false, reason: 'placeholder_forbidden' };
  }

  return { valid: true, normalizedUrl: parsed.toString() };
}

export function buildQrDownloadFilename(
  brandName: string,
  extension: 'png' | 'svg'
): string {
  const slug = brandName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const prefix = slug || 'restaurant';
  return `${prefix}-menu-qr.${extension}`;
}

export async function generateQrSvgString(url: string): Promise<string> {
  const validation = validatePublishedMenuUrl(url);
  if (!validation.valid || !validation.normalizedUrl) {
    throw new Error(
      `Refusing to generate QR code (${validation.reason}): provide the real published URL.`
    );
  }
  return QRCode.toString(validation.normalizedUrl, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 4,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });
}

export async function generateQrPngDataUrl(
  url: string,
  width = 1024
): Promise<string> {
  const validation = validatePublishedMenuUrl(url);
  if (!validation.valid || !validation.normalizedUrl) {
    throw new Error(
      `Refusing to generate QR code (${validation.reason}): provide the real published URL.`
    );
  }
  return QRCode.toDataURL(validation.normalizedUrl, {
    width,
    errorCorrectionLevel: 'H',
    margin: 4,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });
}
