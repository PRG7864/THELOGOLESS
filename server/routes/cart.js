import { Router } from 'express';
import { getOrCreateCart, saveJsonCart, hydrateCart, getProductById } from '../models/database.js';

export const createCartRouter = (dbContext) => {
  const router = Router();
  const { Cart, isMongo } = dbContext;

  router.get('/', async (req, res) => {
    try {
      const cart = await getOrCreateCart(String(req.user._id), { Cart, isMongo });
      res.json(await hydrateCart(cart, dbContext));
    } catch (error) {
      console.error('Cart fetch error:', error);
      res.status(500).json({ error: 'Failed to retrieve cart' });
    }
  });

  router.post('/items', async (req, res) => {
    const productId = String(req.body.productId || '');
    const quantity = Math.max(1, Number(req.body.quantity || 1));
    const size = req.body.size ? String(req.body.size) : null;

    try {
      const product = await getProductById(productId, dbContext);
      if (!product || product.active === false) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const cart = await getOrCreateCart(String(req.user._id), { Cart, isMongo });
      const existing = cart.items.find((item) => item.productId === productId && (item.size || null) === size);

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, size });
      }

      if (isMongo) {
        await cart.save();
        return res.json(await hydrateCart(cart, dbContext));
      }

      res.json(await hydrateCart(saveJsonCart(cart), dbContext));
    } catch (error) {
      console.error('Cart add error:', error);
      res.status(500).json({ error: 'Failed to add cart item' });
    }
  });

  router.patch('/items/:productId', async (req, res) => {
    const quantity = Number(req.body.quantity);
    const size = req.body.size ? String(req.body.size) : null;

    if (!Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({ error: 'Quantity must be a positive integer or zero' });
    }

    try {
      const cart = await getOrCreateCart(String(req.user._id), { Cart, isMongo });
      cart.items = cart.items.filter((item) => {
        const matches = item.productId === req.params.productId && (item.size || null) === size;
        if (matches && quantity > 0) item.quantity = quantity;
        return !matches || quantity > 0;
      });

      if (isMongo) {
        await cart.save();
        return res.json(await hydrateCart(cart, dbContext));
      }

      res.json(await hydrateCart(saveJsonCart(cart), dbContext));
    } catch (error) {
      console.error('Cart update error:', error);
      res.status(500).json({ error: 'Failed to update cart item' });
    }
  });

  router.delete('/items/:productId', async (req, res) => {
    const size = req.query.size ? String(req.query.size) : null;

    try {
      const cart = await getOrCreateCart(String(req.user._id), { Cart, isMongo });
      cart.items = cart.items.filter((item) => !(item.productId === req.params.productId && (item.size || null) === size));

      if (isMongo) {
        await cart.save();
        return res.json(await hydrateCart(cart, dbContext));
      }

      res.json(await hydrateCart(saveJsonCart(cart), dbContext));
    } catch (error) {
      console.error('Cart remove error:', error);
      res.status(500).json({ error: 'Failed to remove cart item' });
    }
  });

  return router;
};
