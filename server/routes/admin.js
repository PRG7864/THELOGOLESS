import { Router } from 'express';
import { readJsonDB, writeJsonDB, createId } from '../models/database.js';
import { PRODUCTS_FILE, ORDERS_FILE, NEWSLETTER_FILE } from '../config/constants.js';
import { requireAdmin } from '../middleware/auth.js';

export const createAdminRouter = (dbContext) => {
  const router = Router();
  const { Product, Order, Newsletter, isMongo } = dbContext;

  router.use(requireAdmin);

  router.get('/orders', async (req, res) => {
    try {
      const orders = isMongo
        ? await Order.find({}).sort({ createdAt: -1 })
        : readJsonDB(ORDERS_FILE).reverse();

      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve admin orders' });
    }
  });

  router.patch('/orders/:id/status', async (req, res) => {
    const status = String(req.body.status || '').trim();
    if (!status) return res.status(400).json({ error: 'Status is required' });

    try {
      if (isMongo) {
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        return res.json(order);
      }

      const orders = readJsonDB(ORDERS_FILE);
      const index = orders.findIndex((order) => order._id === req.params.id);
      if (index === -1) return res.status(404).json({ error: 'Order not found' });

      orders[index] = { ...orders[index], status, updatedAt: new Date().toISOString() };
      writeJsonDB(ORDERS_FILE, orders);
      res.json(orders[index]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });

  router.post('/products', async (req, res) => {
    const productData = {
      name: String(req.body.name || '').trim(),
      category: String(req.body.category || 'UNCATEGORIZED').trim(),
      price: Number(req.body.price),
      material: String(req.body.material || '').trim(),
      description: String(req.body.description || '').trim(),
      image: String(req.body.image || '').trim(),
      gallery: Array.isArray(req.body.gallery) ? req.body.gallery : [],
      sizes: Array.isArray(req.body.sizes) ? req.body.sizes : [],
      stock: Number(req.body.stock || 0),
      active: req.body.active !== false
    };

    if (!productData.name || !Number.isFinite(productData.price) || productData.price < 0) {
      return res.status(400).json({ error: 'Product name and valid price are required' });
    }

    try {
      if (isMongo) {
        const product = await Product.create(productData);
        return res.status(201).json(product);
      }

      const products = readJsonDB(PRODUCTS_FILE);
      const product = {
        _id: createId('prod'),
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      products.push(product);
      writeJsonDB(PRODUCTS_FILE, products);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  router.patch('/products/:id', async (req, res) => {
    const allowed = ['name', 'category', 'price', 'material', 'description', 'image', 'gallery', 'sizes', 'stock', 'active'];
    const updates = {};

    allowed.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates[key] = req.body[key];
      }
    });

    try {
      if (isMongo) {
        const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        return res.json(product);
      }

      const products = readJsonDB(PRODUCTS_FILE);
      const index = products.findIndex((product) => product._id === req.params.id);
      if (index === -1) return res.status(404).json({ error: 'Product not found' });

      products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
      writeJsonDB(PRODUCTS_FILE, products);
      res.json(products[index]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  router.delete('/products/:id', async (req, res) => {
    try {
      if (isMongo) {
        const product = await Product.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        return res.json({ success: true, product });
      }

      const products = readJsonDB(PRODUCTS_FILE);
      const index = products.findIndex((product) => product._id === req.params.id);
      if (index === -1) return res.status(404).json({ error: 'Product not found' });

      products[index] = { ...products[index], active: false, updatedAt: new Date().toISOString() };
      writeJsonDB(PRODUCTS_FILE, products);
      res.json({ success: true, product: products[index] });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  router.get('/newsletter', async (req, res) => {
    try {
      const subs = isMongo
        ? await Newsletter.find({}).sort({ subscribedAt: -1 })
        : readJsonDB(NEWSLETTER_FILE).reverse();

      res.json(subs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve newsletter subscribers' });
    }
  });

  return router;
};
