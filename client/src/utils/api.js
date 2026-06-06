import { API_BASE_URL } from '../data/constants.js';

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}/api${endpoint}`;
  const token = localStorage.getItem('thelogoless_token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

export const auth = {
  signup: (name, email, password) => apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  }),
  login: (email, password) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  getMe: () => apiCall('/auth/me'),
};

export const products = {
  getAll: () => apiCall('/products'),
  getById: (id) => apiCall(`/products/${id}`),
  getCategories: () => apiCall('/products/categories/list'),
};

export const cart = {
  get: () => apiCall('/cart'),
  addItem: (productId, quantity, size) => apiCall('/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity, size })
  }),
  updateItem: (productId, quantity, size) => apiCall(`/cart/items/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity, size })
  }),
  removeItem: (productId, size) => apiCall(`/cart/items/${productId}?size=${encodeURIComponent(size || '')}`, {
    method: 'DELETE'
  }),
};

export const orders = {
  checkout: (data) => apiCall('/checkout', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getMyOrders: () => apiCall('/orders/my'),
  getById: (id) => apiCall(`/orders/${id}`),
};

export const newsletter = {
  subscribe: (email) => apiCall('/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
};
