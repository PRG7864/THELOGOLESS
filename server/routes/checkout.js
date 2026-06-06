import { Router } from 'express';
import { getOrCreateCart, saveJsonCart, getProductById, readJsonDB, writeJsonDB, findUserById, createId } from '../models/database.js';
import { normalizeEmail, isEmail, validateCheckout } from '../utils/validators.js';
import { sendOrderEmails } from '../utils/email.js';
import { ORDERS_FILE } from '../config/constants.js';
import { verifyToken } from '../utils/crypto.js';

export const createCheckoutRouter = (dbContext) => {
  const router = Router();
  const { Order, Cart, isMongo } = dbContext;

  router.post('/', async (req, res) => {
    const authHeader = req.headers.authorization || '';
    const payload = authHeader.startsWith('Bearer ') ? verifyToken(authHeader.slice(7)) : null;
    const user = payload?.userId ? await findUserById(payload.userId, dbContext) : null;

    const customerName = String(req.body.customerName || user?.name || '').trim();
    const customerEmail = normalizeEmail(req.body.customerEmail || user?.email);
    const location = String(req.body.location || '').trim();
    const requestItems = Array.isArray(req.body.items) ? req.body.items : [];

    const errors = validateCheckout(customerName, customerEmail, requestItems);
    if (errors.length) {
      return res.status(400).json({ error: errors.join('; ') });
    }

    try {
      const items = [];
      for (const item of requestItems) {
        const product = await getProductById(String(item.productId), dbContext);
        const quantity = Math.max(1, Number(item.quantity || 1));
        const fallbackName = String(item.name || '').trim();
        const fallbackPrice = Number(item.price);

        if (!product && (!fallbackName || !Number.isFinite(fallbackPrice))) continue;
        if (product && product.active === false) continue;

        items.push({
          productId: product ? String(product._id) : String(item.productId || createId('item')),
          name: product ? product.name : fallbackName,
          price: product ? product.price : fallbackPrice,
          quantity,
          size: item.size || null
        });
      }

      if (items.length === 0) {
        return res.status(400).json({ error: 'No valid products in order' });
      }

      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const orderData = {
        userId: user ? String(user._id) : null,
        customerName,
        customerEmail,
        location,
        items,
        subtotal,
        total: subtotal,
        paymentStatus: 'pending',
        status: 'Pending'
      };

      if (isMongo) {
        const newOrder = await Order.create(orderData);
        if (user) await Cart.findOneAndUpdate({ userId: String(user._id) }, { items: [] });
        const emailStatus = await sendOrderEmails(newOrder.toObject());
        return res.json({ success: true, orderId: newOrder._id, order: newOrder, email: emailStatus });
      }

      const orders = readJsonDB(ORDERS_FILE);
      const newOrder = {
        _id: createId('ord'),
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      orders.push(newOrder);
      writeJsonDB(ORDERS_FILE, orders);

      if (user) {
        const cart = await getOrCreateCart(String(user._id), dbContext);
        saveJsonCart({ ...cart, items: [] });
      }

      const emailStatus = await sendOrderEmails(newOrder);
      res.json({ success: true, orderId: newOrder._id, order: newOrder, email: emailStatus });
    } catch (error) {
      console.error('Checkout error:', error);
      res.status(500).json({ error: 'Failed to process checkout' });
    }
  });

  return router;
};
