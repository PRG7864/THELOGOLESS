import { Router } from 'express';
import { normalizeEmail, isEmail } from '../utils/validators.js';
import { readJsonDB, writeJsonDB } from '../models/database.js';
import { NEWSLETTER_FILE } from '../config/constants.js';

export const createNewsletterRouter = (dbContext) => {
  const router = Router();
  const { Newsletter, isMongo } = dbContext;

  router.post('/', async (req, res) => {
    const email = normalizeEmail(req.body.email);
    if (!isEmail(email)) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    try {
      if (isMongo) {
        const existing = await Newsletter.findOne({ email });
        if (existing) return res.json({ success: true, message: 'Already subscribed.' });

        await Newsletter.create({ email });
        return res.json({ success: true, message: 'Subscribed.' });
      }

      const subs = readJsonDB(NEWSLETTER_FILE);
      if (subs.some((entry) => entry.email === email)) {
        return res.json({ success: true, message: 'Already subscribed.' });
      }

      subs.push({ email, subscribedAt: new Date().toISOString() });
      writeJsonDB(NEWSLETTER_FILE, subs);
      res.json({ success: true, message: 'Subscribed.' });
    } catch (error) {
      console.error('Newsletter error:', error);
      res.status(500).json({ error: 'Failed to subscribe email' });
    }
  });

  return router;
};
