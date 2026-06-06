import { Router } from 'express';
import { readJsonDB } from '../models/database.js';
import { ORDERS_FILE } from '../config/constants.js';

export const createOrdersRouter = (dbContext) => {
  const router = Router();
  const { Order, isMongo } = dbContext;

  router.get('/my', async (req, res) => {
    try {
      const userId = String(req.user._id);
      const orders = isMongo
        ? await Order.find({ userId }).sort({ createdAt: -1 })
        : readJsonDB(ORDERS_FILE).filter((order) => order.userId === userId).reverse();

      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve orders' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const order = isMongo
        ? await Order.findById(req.params.id)
        : readJsonDB(ORDERS_FILE).find((entry) => entry._id === req.params.id);

      if (!order) return res.status(404).json({ error: 'Order not found' });
      if (req.user.role !== 'admin' && order.userId !== String(req.user._id)) {
        return res.status(403).json({ error: 'You cannot view this order' });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve order' });
    }
  });

  return router;
};
