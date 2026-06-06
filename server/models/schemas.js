import mongoose from 'mongoose';
import { createId } from '../utils/crypto.js';

export const ProductSchema = new mongoose.Schema({
  _id: { type: String, default: () => createId('prod') },
  name: { type: String, required: true },
  category: { type: String, default: 'UNCATEGORIZED' },
  price: { type: Number, required: true },
  material: String,
  description: String,
  image: String,
  gallery: [String],
  sizes: [String],
  stock: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' }
}, { timestamps: true });

export const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [{
    productId: String,
    quantity: Number,
    size: String
  }]
}, { timestamps: true });

export const OrderSchema = new mongoose.Schema({
  userId: String,
  customerName: String,
  customerEmail: String,
  location: String,
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    size: String
  }],
  subtotal: Number,
  total: Number,
  paymentStatus: { type: String, default: 'pending' },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

export const NewsletterSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  subscribedAt: { type: Date, default: Date.now }
});
