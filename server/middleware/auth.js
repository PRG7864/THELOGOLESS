import { verifyToken } from '../utils/crypto.js';
import { findUserById } from '../models/database.js';

export const createAuthMiddleware = (dbContext) => {
  return async (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    const payload = verifyToken(token);

    if (!payload?.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await findUserById(payload.userId, dbContext);
    if (!user) {
      return res.status(401).json({ error: 'Invalid user session' });
    }

    req.user = user;
    next();
  };
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
