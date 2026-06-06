import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import { PORT, MONGODB_URI, MONGODB_TIMEOUT, IS_PRODUCTION } from './config/constants.js';
import { ensureJsonFiles, readJsonDB, writeJsonDB, createId } from './models/database.js';
import { ProductSchema, UserSchema, CartSchema, OrderSchema, NewsletterSchema } from './models/schemas.js';
import { hashPassword } from './utils/crypto.js';
import { defaultProducts } from './data/defaultProducts.js';

import { createAuthRouter } from './routes/auth.js';
import { createProductsRouter } from './routes/products.js';
import { createCartRouter } from './routes/cart.js';
import { createCheckoutRouter } from './routes/checkout.js';
import { createOrdersRouter } from './routes/orders.js';
import { createNewsletterRouter } from './routes/newsletter.js';
import { createAdminRouter } from './routes/admin.js';
import { createDevRouter } from './routes/dev.js';
import { createAuthMiddleware } from './middleware/auth.js';

import { USERS_FILE, ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } from './config/constants.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

let isMongo = false;
let Product, User, Cart, Order, Newsletter;

console.log('Attempting to connect to MongoDB...');
try {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: MONGODB_TIMEOUT });
  console.log('Successfully connected to MongoDB.');
  isMongo = true;

  Product = mongoose.model('Product', ProductSchema);
  User = mongoose.model('User', UserSchema);
  Cart = mongoose.model('Cart', CartSchema);
  Order = mongoose.model('Order', OrderSchema);
  Newsletter = mongoose.model('Newsletter', NewsletterSchema);

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    console.log('Seeding default products to MongoDB...');
    await Product.insertMany(defaultProducts);
  }
} catch (err) {
  console.warn('MongoDB connection failed. Switching to Local JSON File database mode.');
  isMongo = false;
  ensureJsonFiles();
}

const seedAdminUser = async () => {
  const email = ADMIN_EMAIL.toLowerCase();
  if (!email || !ADMIN_PASSWORD) return;

  if (isMongo) {
    const existing = await User.findOne({ email });
    if (!existing) {
      await User.create({
        name: ADMIN_NAME,
        email,
        passwordHash: hashPassword(ADMIN_PASSWORD),
        role: 'admin'
      });
      console.log(`Seeded admin user ${email}`);
    }
  } else {
    const users = readJsonDB(USERS_FILE);
    if (!users.some((user) => user.email === email)) {
      users.push({
        _id: createId('usr'),
        name: ADMIN_NAME,
        email,
        passwordHash: hashPassword(ADMIN_PASSWORD),
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      writeJsonDB(USERS_FILE, users);
      console.log(`Seeded admin user ${email}`);
    }
  }
};

await seedAdminUser();

const dbContext = { Product, User, Cart, Order, Newsletter, isMongo };
const requireAuth = createAuthMiddleware(dbContext);

app.get('/api/health', (req, res, next) => {
  createDevRouter(dbContext).stack[0].route.stack[0].handle(req, res, next);
});

app.use('/api/auth', createAuthRouter(dbContext, requireAuth));
app.use('/api/products', createProductsRouter(dbContext));

app.use('/api/cart', requireAuth, createCartRouter(dbContext));
app.use('/api/checkout', createCheckoutRouter(dbContext));
app.use('/api/orders', requireAuth, createOrdersRouter(dbContext));

app.use('/api/newsletter', createNewsletterRouter(dbContext));
app.use('/api/admin', requireAuth, createAdminRouter(dbContext));

app.use('/api/dev', createDevRouter(dbContext));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

if (!IS_PRODUCTION && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${isMongo ? 'MongoDB' : 'Local File'} database mode.`);
  });
}

export default app;
