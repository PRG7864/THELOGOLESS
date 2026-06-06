export const fabricColorMap = {
  'obsidian': '#0D0E10',
  'cream': '#ECE7DE',
  'sage': '#6C7A69',
  'bronze': '#8C7862'
};

export const logoColorMap = {
  'gold': '#C5B49E',
  'black': '#0B0B0C',
  'white': '#FAF9F6',
  'sage': '#4E5A4D'
};

export const placementMap = {
  'chest': 'translate(42, 33) scale(1)',
  'sleeve': 'translate(28, 28) scale(0.8)',
  'tag': 'translate(36, 84) scale(0.8)',
  'collar': 'translate(50, 23) scale(0.6)'
};

export const tshirtZoomMap = {
  'chest': 'scale(2.0) translate(8%, 15%)',
  'sleeve': 'scale(2.5) translate(22%, 22%)',
  'tag': 'scale(2.0) translate(14%, -24%)',
  'collar': 'scale(3.0) translate(0%, 27%)'
};

export const presetsMap = {
  'obsidian-core': { fabric: 'obsidian', logo: 'slash', color: 'black', placement: 'chest' },
  'linen-nomad': { fabric: 'cream', logo: 'stitch', color: 'white', placement: 'sleeve' },
  'selvedge-artist': { fabric: 'sage', logo: 'stitch', color: 'sage', placement: 'collar' },
  'bronze-signature': { fabric: 'bronze', logo: 'slash', color: 'gold', placement: 'tag' }
};

export const storefrontCategories = ['ALL', 'NEW', 'SHIRTS', 'JEANS', 'T-SHIRTS', 'POLOS', 'PLUS-SIZE', 'TROUSERS', 'SHORTS'];

export const storefrontFilterGroups = [
  { key: 'delivery', label: 'Delivery Time', options: ['60 MINS', 'TODAY', '2 DAYS'] },
  { key: 'size', label: 'Size', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'] },
  { key: 'color', label: 'Color', options: ['BLACK', 'WHITE', 'BLUE', 'GREY', 'GREEN', 'BEIGE', 'NAVY', 'BROWN', 'OLIVE', 'MAROON', 'PINK'] },
  { key: 'pattern', label: 'Pattern', options: ['SOLID', 'STRIPED', 'RIBBED', 'KNIT', 'GEOMETRIC'] },
  { key: 'fit', label: 'Fit', options: ['REGULAR', 'RELAXED', 'BAGGY', 'CROP', 'OVERSIZED', 'STRAIGHT'] },
  { key: 'material', label: 'Material', options: ['COTTON', 'LINEN', 'DENIM', 'SILK', 'GIZA', 'SUPIMA'] },
  { key: 'collar', label: 'Collar', options: ['CREWNECK', 'HIGH NECK', 'STRUCTURED', 'BUTTON-DOWN'] },
  { key: 'sleeves', label: 'Sleeves', options: ['SLEEVELESS', 'SHORT', 'LONG', 'DROP SHOULDER'] },
  { key: 'price', label: 'Price', options: ['UNDER ₹1000', '₹1000-₹1500', '₹1500+'] }
];

export const productDetailAccordions = [
  {
    title: 'DETAILS',
    body: 'Relaxed premium tailoring with clean finishing, concealed placket engineering, breathable lining, and a sharp everyday silhouette built for repeat wear.'
  },
  {
    title: 'REVIEWS',
    body: 'Customers respond best to the fabric hand feel, fit balance, and polished look. This block is ready for ratings, UGC, or verified buyer reviews.'
  },
  {
    title: 'DELIVERY',
    body: 'Express dispatch in metro cities, standard shipping nationwide, and low-friction exchange handling designed for a startup DTC experience.'
  },
  {
    title: 'RETURNS',
    body: 'Easy size exchange within 7 days, structured return pickup flows, and a reusable packaging concept that fits your premium brand positioning.'
  }
];

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
