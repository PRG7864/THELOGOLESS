export const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

export const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateSignup = (name, email, password) => {
  const errors = [];
  if (!String(name || '').trim()) errors.push('Name is required');
  if (!isEmail(email)) errors.push('Valid email is required');
  if (String(password || '').length < 6) errors.push('Password must be at least 6 characters');
  return errors;
};

export const validateLogin = (email, password) => {
  const errors = [];
  if (!isEmail(email)) errors.push('Valid email is required');
  if (!password) errors.push('Password is required');
  return errors;
};

export const validateCheckout = (customerName, customerEmail, items) => {
  const errors = [];
  if (!String(customerName || '').trim()) errors.push('Customer name is required');
  if (!isEmail(customerEmail)) errors.push('Valid email is required');
  if (!Array.isArray(items) || items.length === 0) errors.push('Cart items are required');
  return errors;
};
