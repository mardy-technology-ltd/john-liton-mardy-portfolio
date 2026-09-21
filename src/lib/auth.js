/**
 * Core Authentication & Security Utilities
 * Uses standard Web Crypto API (HMAC-SHA256) compatible with Edge & Node.js runtimes.
 */

export const AUTH_COOKIE_NAME = 'jlm_admin_session';

const DEFAULT_SECRET = 'jlm_super_secret_cyberpunk_jwt_key_2026_98372648239746';

// Helper: Convert ArrayBuffer to Base64URL string
function bufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Helper: Convert Base64URL string to ArrayBuffer
function base64UrlToBuffer(base64Url) {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Helper: Import crypto key for HMAC-SHA256
async function getCryptoKey(secret) {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(secret || DEFAULT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Sign a payload and return a compact HMAC-SHA256 signed token
 */
export async function signSessionToken(payload, customSecret = null) {
  const secret = customSecret || process.env.ADMIN_JWT_SECRET || DEFAULT_SECRET;
  const key = await getCryptoKey(secret);

  const header = { alg: 'HS256', typ: 'JWT' };
  const fullPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days expiration
  };

  const enc = new TextEncoder();
  const headerB64 = bufferToBase64Url(enc.encode(JSON.stringify(header)));
  const payloadB64 = bufferToBase64Url(enc.encode(JSON.stringify(fullPayload)));
  const dataToSign = `${headerB64}.${payloadB64}`;

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    enc.encode(dataToSign)
  );

  const signatureB64 = bufferToBase64Url(signature);
  return `${dataToSign}.${signatureB64}`;
}

/**
 * Verify and decode an HMAC-SHA256 token
 */
export async function verifySessionToken(token, customSecret = null) {
  if (!token || typeof token !== 'string') return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const secret = customSecret || process.env.ADMIN_JWT_SECRET || DEFAULT_SECRET;
    const key = await getCryptoKey(secret);

    const enc = new TextEncoder();
    const dataToVerify = `${headerB64}.${payloadB64}`;
    const signatureBuffer = base64UrlToBuffer(signatureB64);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBuffer,
      enc.encode(dataToVerify)
    );

    if (!isValid) return null;

    // Decode and parse payload
    const payloadJson = new TextDecoder().decode(base64UrlToBuffer(payloadB64));
    const payload = JSON.parse(payloadJson);

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch (err) {
    console.error('Session token verification failed:', err);
    return null;
  }
}

/**
 * Standard cookie configuration for session cookie
 */
export function getSessionCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    name: AUTH_COOKIE_NAME,
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  };
}

// In-Memory Rate Limiting Guard for Brute Force Protection
const loginAttempts = new Map();

export function checkRateLimit(ipKey) {
  const key = ipKey || 'global';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  const record = loginAttempts.get(key) || { count: 0, firstAttempt: now, blockedUntil: 0 };

  if (record.blockedUntil > now) {
    const remainingSec = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, remainingSec };
  }

  // Reset if outside window
  if (now - record.firstAttempt > windowMs) {
    record.count = 0;
    record.firstAttempt = now;
  }

  return { allowed: true, attempts: record.count, maxAttempts };
}

export function recordFailedAttempt(ipKey) {
  const key = ipKey || 'global';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 5;

  const record = loginAttempts.get(key) || { count: 0, firstAttempt: now, blockedUntil: 0 };

  if (now - record.firstAttempt > windowMs) {
    record.count = 1;
    record.firstAttempt = now;
  } else {
    record.count += 1;
  }

  if (record.count >= maxAttempts) {
    record.blockedUntil = now + windowMs; // Block for 15 mins
  }

  loginAttempts.set(key, record);
}

export function resetRateLimit(ipKey) {
  loginAttempts.delete(ipKey || 'global');
}
