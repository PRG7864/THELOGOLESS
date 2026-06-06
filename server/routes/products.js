import { Router } from 'express';
import { readJsonDB } from '../models/database.js';
import { PRODUCTS_FILE } from '../config/constants.js';
import { getProductById } from '../models/database.js';

export const createProductsRouter = (dbContext) => {
  const router = Router();
  const { Product, isMongo } = dbContext;

  router.get('/', async (req, res) => {
    try {
      const products = isMongo
        ? await Product.find({ active: { $ne: false } }).sort({ createdAt: -1 })
        : readJsonDB(PRODUCTS_FILE).filter((product) => product.active !== false);

      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to retrieve products' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const product = await getProductById(req.params.id, dbContext);
      if (!product || product.active === false) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve product' });
    }
  });

  router.get('/categories/list', async (req, res) => {
    try {
      const products = isMongo ? await Product.find({ active: { $ne: false } }) : readJsonDB(PRODUCTS_FILE);
      const categories = [...new Set(products.map((product) => product.category).filter(Boolean))].sort();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve categories' });
    }
  });

  return router;
};
