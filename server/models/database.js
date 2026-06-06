import fs from 'fs';
import { PRODUCTS_FILE, ORDERS_FILE, NEWSLETTER_FILE, USERS_FILE, CARTS_FILE, DB_DIR } from '../config/constants.js';
import { createId } from '../utils/crypto.js';

export { createId };

export const readJsonDB = (filePath) => {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  return raw ? JSON.parse(raw) : [];
};

export const writeJsonDB = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

export const ensureJsonFiles = () => {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  [PRODUCTS_FILE, ORDERS_FILE, NEWSLETTER_FILE, USERS_FILE, CARTS_FILE].forEach((filePath) => {
    if (!fs.existsSync(filePath)) {
      writeJsonDB(filePath, []);
    }
  });
};

export const getProductById = async (productId, { Product, isMongo }) => {
  if (isMongo) return Product.findById(productId);
  return readJsonDB(PRODUCTS_FILE).find((product) => product._id === productId) || null;
};

export const hydrateCart = async (cart, { Product, isMongo }) => {
  const items = [];

  for (const item of cart.items || []) {
    const product = await getProductById(item.productId, { Product, isMongo });
    if (!product || product.active === false) continue;

    items.push({
      productId: String(product._id),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: item.quantity,
      size: item.size || null,
      lineTotal: product.price * item.quantity
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return {
    _id: cart._id,
    userId: cart.userId,
    items,
    subtotal,
    total: subtotal
  };
};

export const getOrCreateCart = async (userId, { Cart, isMongo }) => {
  if (isMongo) {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    return cart;
  }

  const carts = readJsonDB(CARTS_FILE);
  let cart = carts.find((entry) => entry.userId === userId);
  if (!cart) {
    cart = {
      _id: createId('cart'),
      userId,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    carts.push(cart);
    writeJsonDB(CARTS_FILE, carts);
  }
  return cart;
};

export const saveJsonCart = (cart) => {
  const carts = readJsonDB(CARTS_FILE);
  const index = carts.findIndex((entry) => entry._id === cart._id);
  const nextCart = { ...cart, updatedAt: new Date().toISOString() };

  if (index >= 0) {
    carts[index] = nextCart;
  } else {
    carts.push(nextCart);
  }

  writeJsonDB(CARTS_FILE, carts);
  return nextCart;
};

export const findUserById = async (userId, { User, isMongo }) => {
  if (isMongo) return User.findById(userId);
  return readJsonDB(USERS_FILE).find((user) => user._id === userId) || null;
};
