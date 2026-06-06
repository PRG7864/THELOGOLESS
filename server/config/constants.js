import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PORT = process.env.PORT || 5001;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';

export const TOKEN_SECRET = process.env.JWT_SECRET || process.env.TOKEN_SECRET || 'dev-secret-change-before-production';
export const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/thelogoless';
export const MONGODB_TIMEOUT = 3000;

export const DB_DIR = path.join(path.dirname(__dirname), 'server', 'data');
export const PRODUCTS_FILE = path.join(DB_DIR, 'products.json');
export const ORDERS_FILE = path.join(DB_DIR, 'orders.json');
export const NEWSLETTER_FILE = path.join(DB_DIR, 'newsletter.json');
export const USERS_FILE = path.join(DB_DIR, 'users.json');
export const CARTS_FILE = path.join(DB_DIR, 'carts.json');

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
export const ADMIN_EMAIL = normalizeEmail(process.env.ADMIN_EMAIL || 'rajvishvakarma088@gmail.com');
export const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER;
export const SMTP_PASS = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
export const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
export const SMTP_SERVICE = process.env.SMTP_SERVICE || 'gmail';
export const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER || ADMIN_EMAIL;
