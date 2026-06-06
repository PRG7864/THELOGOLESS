import { Router } from 'express';
import { hashPassword, verifyPassword, signToken } from '../utils/crypto.js';
import { toPublicUser } from '../utils/helpers.js';
import { normalizeEmail, isEmail, validateSignup, validateLogin } from '../utils/validators.js';
import { readJsonDB, writeJsonDB, findUserById } from '../models/database.js';
import { createId } from '../utils/crypto.js';
import { USERS_FILE } from '../config/constants.js';

export const createAuthRouter = (dbContext, requireAuth) => {
  const router = Router();
  const { User, isMongo } = dbContext;

  router.post('/signup', async (req, res) => {
    const name = String(req.body.name || '').trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    const errors = validateSignup(name, email, password);
    if (errors.length) {
      return res.status(400).json({ error: errors.join('; ') });
    }

    try {
      if (isMongo) {
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ error: 'Email is already registered' });

        const user = await User.create({
          name,
          email,
          passwordHash: hashPassword(password),
          role: 'customer'
        });
        const token = signToken({ userId: user._id, role: user.role });
        return res.status(201).json({ success: true, token, user: toPublicUser(user) });
      }

      const users = readJsonDB(USERS_FILE);
      if (users.some((user) => user.email === email)) {
        return res.status(409).json({ error: 'Email is already registered' });
      }

      const user = {
        _id: createId('usr'),
        name,
        email,
        passwordHash: hashPassword(password),
        role: 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      users.push(user);
      writeJsonDB(USERS_FILE, users);

      const token = signToken({ userId: user._id, role: user.role });
      res.status(201).json({ success: true, token, user: toPublicUser(user) });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Failed to create account' });
    }
  });

  router.post('/login', async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    const errors = validateLogin(email, password);
    if (errors.length) {
      return res.status(400).json({ error: errors.join('; ') });
    }

    try {
      const user = isMongo
        ? await User.findOne({ email })
        : readJsonDB(USERS_FILE).find((entry) => entry.email === email);

      if (!user || !verifyPassword(password, user.passwordHash)) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = signToken({ userId: user._id, role: user.role });
      res.json({ success: true, token, user: toPublicUser(user) });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  });

  router.post('/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out on client' });
  });

  router.get('/me', requireAuth, (req, res) => {
    res.json({ user: toPublicUser(req.user) });
  });

  return router;
};
