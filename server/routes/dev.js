import { Router } from 'express';
import { IS_PRODUCTION, ADMIN_EMAIL, MONGODB_URI } from '../config/constants.js';
import { getMailTransport } from '../utils/email.js';
import { normalizeEmail, isEmail } from '../utils/validators.js';
import { readJsonDB } from '../models/database.js';
import { PRODUCTS_FILE, USERS_FILE, CARTS_FILE, ORDERS_FILE, NEWSLETTER_FILE } from '../config/constants.js';

export const createDevRouter = (dbContext) => {
  const router = Router();
  const { Product, User, Cart, Order, Newsletter, isMongo } = dbContext;

  router.get('/health', (req, res) => {
    res.json({
      ok: true,
      database: isMongo ? 'mongodb' : 'json',
      adminEmail: ADMIN_EMAIL,
      mailReady: Boolean(process.env.SMTP_USER || process.env.EMAIL_USER) && Boolean(process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD),
      timestamp: new Date().toISOString()
    });
  });

  if (!IS_PRODUCTION) {
    router.get('/mail-status', (req, res) => {
      res.json({
        ready: Boolean(process.env.SMTP_USER || process.env.EMAIL_USER) && Boolean(process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD),
        adminEmail: ADMIN_EMAIL,
        smtpService: process.env.SMTP_SERVICE || 'gmail',
        hasSmtpHost: Boolean(process.env.SMTP_HOST),
        hasSmtpUser: Boolean(process.env.SMTP_USER || process.env.EMAIL_USER),
        hasSmtpPassword: Boolean(process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD),
        mailFrom: process.env.MAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER || ADMIN_EMAIL
      });
    });

    router.post('/test-mail', async (req, res) => {
      const to = normalizeEmail(req.body.to || ADMIN_EMAIL);
      if (!isEmail(to)) {
        return res.status(400).json({ error: 'Valid recipient email is required' });
      }

      const transport = getMailTransport();
      if (!transport) {
        return res.status(400).json({ error: 'SMTP config is missing' });
      }

      try {
        const result = await transport.sendMail({
          from: process.env.MAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER || ADMIN_EMAIL,
          to,
          subject: 'THELOGOLESS mail test',
          text: `Mail test from THELOGOLESS at ${new Date().toISOString()}`
        });

        res.json({ success: true, accepted: result.accepted, rejected: result.rejected, response: result.response });
      } catch (error) {
        console.error('Test mail failed:', error);
        res.status(500).json({
          success: false,
          code: error.code,
          command: error.command,
          response: error.response,
          message: error.message
        });
      }
    });

    router.get('/database', async (req, res) => {
      try {
        if (isMongo) {
          const [products, users, carts, orders, newsletter] = await Promise.all([
            Product.find({}).lean(),
            User.find({}).select('-passwordHash').lean(),
            Cart.find({}).lean(),
            Order.find({}).lean(),
            Newsletter.find({}).lean()
          ]);

          return res.json({
            mode: 'mongodb',
            connection: MONGODB_URI,
            collections: { products, users, carts, orders, newsletter }
          });
        }

        res.json({
          mode: 'json',
          files: {
            products: PRODUCTS_FILE,
            users: USERS_FILE,
            carts: CARTS_FILE,
            orders: ORDERS_FILE,
            newsletter: NEWSLETTER_FILE
          },
          collections: {
            products: readJsonDB(PRODUCTS_FILE),
            users: readJsonDB(USERS_FILE).map(({ passwordHash, ...user }) => user),
            carts: readJsonDB(CARTS_FILE),
            orders: readJsonDB(ORDERS_FILE),
            newsletter: readJsonDB(NEWSLETTER_FILE)
          }
        });
      } catch (error) {
        console.error('Database viewer error:', error);
        res.status(500).json({ error: 'Failed to read database' });
      }
    });
  }

  return router;
};
