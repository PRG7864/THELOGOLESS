import crypto from 'crypto';
import { TOKEN_SECRET, TOKEN_TTL_MS } from '../config/constants.js';

export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

export const verifyPassword = (password, passwordHash) => {
  const [salt, storedHash] = String(passwordHash || '').split(':');
  if (!salt || !storedHash) return false;

  const hash = crypto.scryptSync(password, salt, 64);
  const stored = Buffer.from(storedHash, 'hex');
  return stored.length === hash.length && crypto.timingSafeEqual(stored, hash);
};

export const signToken = (payload) => {
  const body = {
    ...payload,
    exp: Date.now() + TOKEN_TTL_MS
  };
  const encoded = Buffer.from(JSON.stringify(body)).toString('base64url');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
};

export const verifyToken = (token) => {
  const [encoded, signature] = String(token || '').split('.');
  if (!encoded || !signature) return null;

  const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url');
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
  return payload.exp && payload.exp > Date.now() ? payload : null;
};

export const createId = (prefix) => `${prefix}_${crypto.randomBytes(8).toString('hex')}`;
