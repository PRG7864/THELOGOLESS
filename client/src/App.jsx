import { useState, useEffect, useRef } from 'react';
import './App.css';

// Default seeded products fallback
const defaultProducts = [
    {
        _id: 'prod_1',
        name: 'Obsidian Heavyweight Tee',
        price: 120,
        material: '320GSM Long-Staple Egyptian Cotton',
        image: '/logo_tee_mockup.png',
        hoverImage: '/hero_slide_4.png'
    },
    {

        
        _id: 'prod_2',
        name: 'Normandy Linen Shirt',
        price: 160,
        material: 'Pure Normandy Linen-Cotton Weave',
        image: '/logo_tag_mockup.png',
        hoverImage: '/hero_slide_8.png'
    },
    {
        _id: 'prod_3',
        name: 'Okayama Selvedge Denim',
        price: 220,
        material: 'Raw Selvedge Denim on Vintage Looms',
        image: '/logo_concept_seam.png',
        hoverImage: '/hero_slide_2.png'
    },
    {
        _id: 'prod_4',
        name: 'Sage Terry Hoodie',
        price: 190,
        material: '380GSM Organic Terry Fleece',
        image: '/logo_concept_dots.png',
        hoverImage: '/hero_slide_1.png'
    },
    {
        _id: 'prod_5',
        name: 'Bronze Cashmere Coat',
        price: 380,
        material: 'Brushed Italian Cashmere Blend',
        image: '/logo_concept_fold.png',
        hoverImage: '/hero_slide_9.png'
    },
    {
        _id: 'prod_6',
        name: 'Bronze Sculptural Hanger',
        price: 80,
        material: 'Solid Engraved Bronze Boutique Hardware',
        image: '/logo_concept_hanger.png',
        hoverImage: '/hero_slide_5.png'
    }
];

// Customizer Mappings
const fabricColorMap = {
    'obsidian': '#0D0E10',
    'cream': '#ECE7DE',
    'sage': '#6C7A69',
    'bronze': '#8C7862'
};

const logoColorMap = {
    'gold': '#C5B49E',
    'black': '#0B0B0C',
    'white': '#FAF9F6',
    'sage': '#4E5A4D'
};

const placementMap = {
    'chest': 'translate(42, 33) scale(1)',
    'sleeve': 'translate(28, 28) scale(0.8)',
    'tag': 'translate(36, 84) scale(0.8)',
    'collar': 'translate(50, 23) scale(0.6)'
};

const tshirtZoomMap = {
    'chest': 'scale(2.0) translate(8%, 15%)',
    'sleeve': 'scale(2.5) translate(22%, 22%)',
    'tag': 'scale(2.0) translate(14%, -24%)',
    'collar': 'scale(3.0) translate(0%, 27%)'
};

const presetsMap = {
    'obsidian-core': { fabric: 'obsidian', logo: 'slash', color: 'black', placement: 'chest' },
    'linen-nomad': { fabric: 'cream', logo: 'stitch', color: 'white', placement: 'sleeve' },
    'selvedge-artist': { fabric: 'sage', logo: 'stitch', color: 'sage', placement: 'collar' },
    'bronze-signature': { fabric: 'bronze', logo: 'slash', color: 'gold', placement: 'tag' }
};

// Center Peek Hero Slider Products Data
const heroSlidesData = [
    {
        id: 'hero_1',
        name: 'Classic Blue Cotton Shirt',
        category: 'SHIRTS',
        price: 1129,
        material: '100% Normandy Long-Staple Cotton',
        image: '/catalog/blue shirt man/WhatsApp Image 2026-05-26 at 16.11.43.jpeg',
        tagline: '100% FRENCH SEAMS. STRUCTURED COLLAR.',
        description: 'Clean structured collar and premium French seams. Woven from high-quality fibers for a refined feel and superior drape.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        gallery: [
            '/catalog/blue shirt man/WhatsApp Image 2026-05-26 at 16.11.43.jpeg',
            '/catalog/blue shirt man/WhatsApp Image 2026-05-26 at 16.11.43 (1).jpeg',
            '/catalog/blue shirt man/WhatsApp Image 2026-05-26 at 16.11.43 (2).jpeg'
        ]
    },
    {
        id: 'hero_2',
        name: 'High-Waist Classic Denim',
        category: 'JEANS',
        price: 1499,
        material: '14.5oz Raw Indigo Selvedge Denim',
        image: '/catalog/jeans girl/WhatsApp Image 2026-05-26 at 16.12.05.jpeg',
        tagline: '14.5oz RAW DENIM. OKAYAMA LOOM-WOVEN.',
        description: 'Straight-leg denim, woven on classic shuttle looms in Okayama. Features high-rise structured waistband and clean copper hardware.',
        sizes: ['28', '30', '32', '34'],
        gallery: [
            '/catalog/jeans girl/WhatsApp Image 2026-05-26 at 16.12.05.jpeg',
            '/catalog/jeans girl/WhatsApp Image 2026-05-26 at 16.12.04 (1).jpeg',
            '/catalog/jeans girl/WhatsApp Image 2026-05-26 at 16.12.04 (2).jpeg'
        ]
    },
    {
        id: 'hero_3',
        name: 'Premium Sage Green Knit Top',
        category: 'POLOS',
        price: 1249,
        material: 'Ribbed Cotton Linen-Blend',
        image: '/catalog/green top girl/WhatsApp Image 2026-05-26 at 16.12.02.jpeg',
        tagline: 'SUMMER LINEN KNIT. EXQUISITE TOUCH.',
        description: 'Pastel sage ribbed knit with elegant micro-stitch borders. Exquisite luxury hand feel and exceptional ventilation for summer days.',
        sizes: ['XS', 'S', 'M', 'L'],
        gallery: [
            '/catalog/green top girl/WhatsApp Image 2026-05-26 at 16.12.02.jpeg',
            '/catalog/green top girl/WhatsApp Image 2026-05-26 at 16.12.01 (1).jpeg',
            '/catalog/green top girl/WhatsApp Image 2026-05-26 at 16.12.02 (1).jpeg'
        ]
    },
    {
        id: 'hero_4',
        name: 'Heavyweight Matte Maroon Tee',
        category: 'T-SHIRTS',
        price: 999,
        material: '320GSM Long-Staple Egyptian Cotton',
        image: '/catalog/maroon tshirt man/WhatsApp Image 2026-05-26 at 16.11.42.jpeg',
        tagline: '320GSM ORGANIC COTTON. FLATLOCK SEAMS.',
        description: 'Premium weighted drop-shoulder tee designed with blind side-seam construction. Features double-needle lock stitching on hem.',
        sizes: ['S', 'M', 'L', 'XL'],
        gallery: [
            '/catalog/maroon tshirt man/WhatsApp Image 2026-05-26 at 16.11.42.jpeg',
            '/catalog/maroon tshirt man/WhatsApp Image 2026-05-26 at 16.11.42 (1).jpeg',
            '/catalog/maroon tshirt man/WhatsApp Image 2026-05-26 at 16.11.41.jpeg',
            '/catalog/maroon tshirt man/WhatsApp Image 2026-05-26 at 16.11.41 (1).jpeg'
        ]
    },
    {
        id: 'hero_5',
        name: 'Blossom Pink Ribbed Crop',
        category: 'POLOS',
        price: 1199,
        material: 'Supima Cotton & Silk Ribbed Weave',
        image: '/catalog/pink top girl/WhatsApp Image 2026-05-26 at 16.12.00 (1).jpeg',
        tagline: 'SUPIMA SILK KNIT. PASTEL FINISH.',
        description: 'An elegant minimal pastel pink ribbed top featuring clean borders. Soft contour stretch fit that maintains shape after repeated wears.',
        sizes: ['XS', 'S', 'M', 'L'],
        gallery: [
            '/catalog/pink top girl/WhatsApp Image 2026-05-26 at 16.12.00 (1).jpeg',
            '/catalog/pink top girl/WhatsApp Image 2026-05-26 at 16.12.00 (2).jpeg',
            '/catalog/pink top girl/WhatsApp Image 2026-05-26 at 16.12.01.jpeg'
        ]
    },
    {
        id: 'hero_6',
        name: 'Classic Walnut Brown Shirt',
        category: 'SHIRTS',
        price: 1299,
        material: 'Brushed Italian Cotton-Linen',
        image: '/catalog/brown shirt boy/WhatsApp Image 2026-05-26 at 16.11.44.jpeg',
        tagline: 'ITALIAN COTTON LINEN. HORN BUTTONS.',
        description: 'Earth-toned relaxed button-down shirt designed with structural chest pockets, horn buttons, and breathable medium-weight construction.',
        sizes: ['S', 'M', 'L', 'XL'],
        gallery: [
            '/catalog/brown shirt boy/WhatsApp Image 2026-05-26 at 16.11.44.jpeg',
            '/catalog/brown shirt boy/WhatsApp Image 2026-05-26 at 16.11.44 (1).jpeg'
        ]
    },
    {
        id: 'hero_7',
        name: 'Pastel Blue Cornflower Top',
        category: 'POLOS',
        price: 1149,
        material: 'Fine French Flax Linen',
        image: '/catalog/blue top girl/WhatsApp Image 2026-05-26 at 16.11.59.jpeg',
        tagline: 'GEOMETRIC FRENCH LINEN. BREATHABLE.',
        description: 'Premium light-blue top designed with geometric cuts. Highly breathable fabric with elegant touchpoints and clean blind seams.',
        sizes: ['XS', 'S', 'M', 'L'],
        gallery: [
            '/catalog/blue top girl/WhatsApp Image 2026-05-26 at 16.11.59.jpeg',
            '/catalog/blue top girl/WhatsApp Image 2026-05-26 at 16.12.00.jpeg'
        ]
    },
    {
        id: 'hero_8',
        name: 'Vintage White Crewneck Tee',
        category: 'T-SHIRTS',
        price: 899,
        material: '300GSM GOTS Organic Cotton',
        image: '/catalog/white tshirt man/WhatsApp Image 2026-05-26 at 16.11.40.jpeg',
        tagline: '300GSM ORGANIC COTTON. SEED SPECKLED.',
        description: 'Classic oversized streetwear silhouette with dropped shoulders and structural heavy-weight feel. Features raw seed speckles embedded in the weave.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        gallery: [
            '/catalog/white tshirt man/WhatsApp Image 2026-05-26 at 16.11.40.jpeg',
            '/catalog/white tshirt man/WhatsApp Image 2026-05-26 at 16.11.39.jpeg',
            '/catalog/white tshirt man/WhatsApp Image 2026-05-26 at 16.11.40 (1).jpeg'
        ]
    },
    {
        id: 'hero_9',
        name: 'Streetwear Off-Black Baggy Tee',
        category: 'T-SHIRTS',
        price: 1099,
        material: 'Combed Giza Cotton Knit',
        image: '/catalog/baggy tshirt girl/WhatsApp Image 2026-05-26 at 16.11.58.jpeg',
        tagline: 'BAGGY GIZA COTTON. URBAN SILHOUETTE.',
        description: 'Relaxed high neck and drop shoulders for a structured urban layout. Crafted in heavy combed cotton that feels cool and robust.',
        sizes: ['S', 'M', 'L', 'XL'],
        gallery: [
            '/catalog/baggy tshirt girl/WhatsApp Image 2026-05-26 at 16.11.58.jpeg',
            '/catalog/baggy tshirt girl/WhatsApp Image 2026-05-26 at 16.11.57.jpeg'
        ]
    },
    {
        id: 'hero_10',
        name: 'Cobalt Blue Architectural Kurti',
        category: 'PLUS-SIZE',
        price: 1899,
        material: 'Normandy Linen & Mulberry Silk',
        image: '/catalog/blue kurti girl/WhatsApp Image 2026-05-26 at 16.12.04.jpeg',
        tagline: 'LINEN MULBERRY SILK. GEOMETRIC PANELS.',
        description: 'Short kurti featuring structured geometric panels. Blends traditional ethnic comfort with modern architectural line weights.',
        sizes: ['M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'],
        gallery: [
            '/catalog/blue kurti girl/WhatsApp Image 2026-05-26 at 16.12.04.jpeg',
            '/catalog/blue kurti girl/WhatsApp Image 2026-05-26 at 16.12.03.jpeg',
            '/catalog/blue kurti girl/WhatsApp Image 2026-05-26 at 16.12.03 (1).jpeg'
        ]
    }
];

const storefrontCategories = ['ALL', 'NEW', 'SHIRTS', 'JEANS', 'T-SHIRTS', 'POLOS', 'PLUS-SIZE', 'TROUSERS', 'SHORTS'];

const storefrontFilterGroups = [
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

const productDetailAccordions = [
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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const getSavedUser = () => {
    try {
        const saved = localStorage.getItem('thelogoless_user');
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
};

const backendCartToLocalCart = (apiCart) => {
    return (apiCart?.items || []).map(item => ({
        product: {
            _id: item.productId,
            name: item.name,
            price: item.price,
            image: item.image
        },
        quantity: item.quantity,
        size: item.size || null
    }));
};

const parseCustomizerSize = (sizeStr) => {
    if (!sizeStr || !sizeStr.includes('|')) return null;
    const parts = sizeStr.split('|').map(p => p.trim());
    const size = parts[0];
    const details = {};
    parts.slice(1).forEach(part => {
        const [key, val] = part.split(':').map(s => s.trim());
        if (key && val) details[key] = val;
    });
    return { size, details };
};

export default function App() {
    // --- STYLING & NAVIGATION STATES ---
    const [light, setLight] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [navHidden, setNavHidden] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('collection');
    const [scrollProgress, setScrollProgress] = useState(0);

    // --- HERO AUTO-SLIDER STATES ---
    const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
    const [selectedHeroProduct, setSelectedHeroProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedStoreProduct, setSelectedStoreProduct] = useState(heroSlidesData[0]);
    const [selectedStoreSize, setSelectedStoreSize] = useState(heroSlidesData[0].sizes[0]);
    const [selectedStoreImage, setSelectedStoreImage] = useState(heroSlidesData[0].image);
    const [selectedStoreCategory, setSelectedStoreCategory] = useState('ALL');
    const [storeAccordionOpen, setStoreAccordionOpen] = useState('DETAILS');
    const [copiedCode, setCopiedCode] = useState('');
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(true);
    const [openStoreFilters, setOpenStoreFilters] = useState({});
    const [filterDraft, setFilterDraft] = useState({});
    const [appliedFilters, setAppliedFilters] = useState({});
    const [sortMode, setSortMode] = useState('Featured');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [routePath, setRoutePath] = useState(window.location.pathname);
    const productRouteMatch = routePath.match(/^\/product\/([^/]+)$/);
    const routeProduct = productRouteMatch
        ? heroSlidesData.find((product) => product.id === productRouteMatch[1]) || null
        : null;
    const isShopRoute = routePath === '/shop';
    const isProductRoute = Boolean(routeProduct);
    const isAdminRoute = routePath === '/admin';
    const isOrdersRoute = routePath === '/orders';
    const [routeTransitionPhase, setRouteTransitionPhase] = useState('idle');
    const [routeTransitionDirection] = useState('forward');

    // --- PRODUCTS & CART & CHECKOUT STATES ---
    const [products, setProducts] = useState(defaultProducts);
    const [cart, setCart] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [checkoutForm, setCheckoutForm] = useState(() => {
        const savedUser = getSavedUser();
        return { name: savedUser?.name || '', email: savedUser?.email || '', location: '' };
    });
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [authLoading, setAuthLoading] = useState(false);
    const [authMessage, setAuthMessage] = useState('');
    const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('thelogoless_token') || '');
    const [currentUser, setCurrentUser] = useState(() => getSavedUser());
        // --- ADMIN & ORDER HISTORY STATES ---
    const [ordersList, setOrdersList] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [adminOrders, setAdminOrders] = useState([]);
    const [adminOrdersLoading, setAdminOrdersLoading] = useState(false);
    const [adminSubs, setAdminSubs] = useState([]);
    const [adminSubsLoading, setAdminSubsLoading] = useState(false);
    const [adminTab, setAdminTab] = useState('orders');
    const [productModalOpen, setProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '',
        category: 'T-SHIRTS',
        price: '',
        material: '',
        description: '',
        image: '/logo_tee_mockup.png',
        sizes: 'S, M, L, XL',
        stock: 10
    });

    // --- CUSTOMIZER STATES ---
    const [customizerState, setCustomizerState] = useState({
        fabric: 'obsidian',
        logo: 'slash',
        color: 'gold',
        placement: 'chest'
    });
    const [activePreset, setActivePreset] = useState('');
    const tshirtTransform = tshirtZoomMap[customizerState.placement];

    // --- INTERACTIVE FEATURES STATES ---
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterMsg, setNewsletterMsg] = useState('');
    const [accordionOpen, setAccordionOpen] = useState(1);

    // --- ELEMENT REFS ---
    const collectionTrackRef = useRef(null);
    const isDownRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);

    // Toggle Light Theme
    useEffect(() => {
        document.body.className = light ? 'light' : '';
    }, [light]);

    useEffect(() => {
        const handlePopState = () => {
            const nextPath = window.location.pathname;
            if (nextPath === routePath) return;

            setRoutePath(nextPath);
            window.scrollTo({ top: 0, behavior: 'auto' });
            setRouteTransitionPhase('idle');
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [routePath]);

    useEffect(() => {
        if (!authToken) return;

        fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .then(res => {
                if (!res.ok) throw new Error('Session expired');
                return res.json();
            })
            .then(data => {
                setCurrentUser(data.user);
                localStorage.setItem('thelogoless_user', JSON.stringify(data.user));
            })
            .catch(() => {
                setAuthToken('');
                setCurrentUser(null);
                localStorage.removeItem('thelogoless_token');
                localStorage.removeItem('thelogoless_user');
            });
    }, [authToken]);

    useEffect(() => {
        if (!authToken) return;

        fetch(`${API_BASE_URL}/api/cart`, {
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .then(res => {
                if (!res.ok) throw new Error('Cart unavailable');
                return res.json();
            })
            .then(data => setCart(backendCartToLocalCart(data)))
            .catch(() => { });
    }, [authToken]);

    // Fetch Products from API
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/products`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) setProducts(data);
            })
            .catch(() => {
                console.log('MongoDB server offline, displaying local file fallback products.');
                setProducts(defaultProducts);
            });
    }, []);

    // Fetch Customer Orders
    useEffect(() => {
        if (!isOrdersRoute || !authToken) return;

        setOrdersLoading(true);
        fetch(`${API_BASE_URL}/api/orders/my`, {
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch orders');
                return res.json();
            })
            .then(data => {
                setOrdersList(data);
            })
            .catch(err => console.error('Error fetching customer orders:', err))
            .finally(() => setOrdersLoading(false));
    }, [isOrdersRoute, authToken]);

    // Fetch Admin Dashboard Data
    useEffect(() => {
        if (!isAdminRoute || !authToken || currentUser?.role !== 'admin') return;

        // Fetch Orders
        setAdminOrdersLoading(true);
        fetch(`${API_BASE_URL}/api/admin/orders`, {
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .then(res => res.ok ? res.json() : [])
            .then(data => setAdminOrders(data))
            .catch(err => console.error('Error fetching admin orders:', err))
            .finally(() => setAdminOrdersLoading(false));

        // Fetch Newsletter subscribers
        setAdminSubsLoading(true);
        fetch(`${API_BASE_URL}/api/admin/newsletter`, {
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .then(res => res.ok ? res.json() : [])
            .then(data => setAdminSubs(data))
            .catch(err => console.error('Error fetching admin newsletter:', err))
            .finally(() => setAdminSubsLoading(false));

        // Refetch products to get latest stock / active status
        fetch(`${API_BASE_URL}/api/products`)
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                if (data && data.length > 0) setProducts(data);
            })
            .catch(() => {});
    }, [isAdminRoute, authToken, currentUser]);

    // Scroll Effects
    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Sticky Navbar
            setScrolled(currentScrollY > 50);
            setNavHidden(currentScrollY > lastScrollY && currentScrollY > 160 && !menuOpen);
            lastScrollY = currentScrollY;

            // Scroll Progress
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            setScrollProgress((currentScrollY / docHeight) * 100);

            // Active Section Spy
            const sections = ['collection', 'concepts', 'customizer', 'brandbook'];
            for (let sec of [...sections].reverse()) {
                const el = document.getElementById(sec);
                if (el && currentScrollY >= (el.offsetTop - 200)) {
                    setActiveSection(sec);
                    break;
                }
            }

        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [menuOpen]);

    // Intersection Observer for scroll reveal transitions
    useEffect(() => {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [products]);

    // Customizer SVG update logic
    useEffect(() => {
        // Dynamically shift SVG Weave Pattern
        const fabricFilter = document.querySelector('#fabric-texture feTurbulence');
        const fabricColorMatrix = document.querySelector('#fabric-texture feColorMatrix');
        if (fabricFilter && fabricColorMatrix) {
            if (customizerState.fabric === 'cream') {
                fabricFilter.setAttribute('baseFrequency', '0.55');
                fabricColorMatrix.setAttribute('values', '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.16 0');
            } else if (customizerState.fabric === 'sage') {
                fabricFilter.setAttribute('baseFrequency', '0.45');
                fabricColorMatrix.setAttribute('values', '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0');
            } else if (customizerState.fabric === 'bronze') {
                fabricFilter.setAttribute('baseFrequency', '0.85');
                fabricColorMatrix.setAttribute('values', '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.10 0');
            } else {
                fabricFilter.setAttribute('baseFrequency', '0.75');
                fabricColorMatrix.setAttribute('values', '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.12 0');
            }
        }
    }, [customizerState]);

    // Apply Curator Preset Style
    const handlePresetApply = (key) => {
        const preset = presetsMap[key];
        if (!preset) return;
        setActivePreset(key);
        setCustomizerState(preset);
    };

    // Clear active presets when custom settings are clicked
    const clearPresetSelection = () => setActivePreset('');

    // Auto Advance hero slider
    useEffect(() => {
        const timer = setInterval(() => {
            if (!selectedHeroProduct) { // Pause while inspecting
                setCurrentHeroSlide(prev => (prev + 1) % heroSlidesData.length);
            }
        }, 6000);
        return () => clearInterval(timer);
    }, [selectedHeroProduct]);

    // --- CART FUNCTIONALITY ---
    const applyLocalAddToCart = (product) => {
        setCart(prev => {
            const size = product.size || null;
            const exists = prev.find(item => item.product._id === product._id && (item.size || null) === size);
            if (exists) {
                return prev.map(item =>
                    (item.product._id === product._id && (item.size || null) === size)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1, size }];
        });
    };

    const addToCart = (product) => {
        if (authToken) {
            const productId = product._id || product.id;
            fetch(`${API_BASE_URL}/api/cart/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    productId: productId,
                    quantity: 1,
                    size: product.size || null
                })
            })
                .then(res => {
                    if (!res.ok) throw new Error('Backend cart unavailable');
                    return res.json();
                })
                .then(data => setCart(backendCartToLocalCart(data)))
                .catch((err) => {
                    console.warn('Backend cart failed, using local cart:', err);
                    applyLocalAddToCart(product);
                });
        } else {
            applyLocalAddToCart(product);
        }
        setCartOpen(true);
    };

    const updateCartQty = (productId, size, change) => {
        const target = cart.find(item => item.product._id === productId && (item.size || null) === (size || null));
        const nextQty = Math.max(0, (target?.quantity || 0) + change);

        if (authToken && target) {
            fetch(`${API_BASE_URL}/api/cart/items/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ quantity: nextQty, size: target.size || null })
            })
                .then(res => {
                    if (!res.ok) throw new Error('Backend cart unavailable');
                    return res.json();
                })
                .then(data => setCart(backendCartToLocalCart(data)))
                .catch(() => { });
            return;
        }

        setCart(prev => {
            return prev.map(item => {
                if (item.product._id === productId && (item.size || null) === (size || null)) {
                    const newQty = item.quantity + change;
                    return newQty > 0 ? { ...item, quantity: newQty } : item;
                }
                return item;
            });
        });
    };

    const removeFromCart = (productId, size) => {
        const target = cart.find(item => item.product._id === productId && (item.size || null) === (size || null));

        if (authToken && target) {
            const sizeQuery = target.size ? `?size=${encodeURIComponent(target.size)}` : '';
            fetch(`${API_BASE_URL}/api/cart/items/${productId}${sizeQuery}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${authToken}` }
            })
                .then(res => {
                    if (!res.ok) throw new Error('Backend cart unavailable');
                    return res.json();
                })
                .then(data => setCart(backendCartToLocalCart(data)))
                .catch(() => { });
            return;
        }

        setCart(prev => prev.filter(item => !(item.product._id === productId && (item.size || null) === (size || null))));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleQuickBuy = (product) => {
        setCart([{ product, quantity: 1 }]);
        setCartOpen(false);
        setCheckoutSuccess(false);
        if (currentUser) {
            setCheckoutForm(prev => ({
                ...prev,
                name: prev.name || currentUser.name || '',
                email: prev.email || currentUser.email || ''
            }));
        }
        setCheckoutOpen(true);
    };

    const handleCopyCode = (code) => {
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(code).catch(() => { });
        }
        setCopiedCode(code);
        window.setTimeout(() => setCopiedCode(''), 1600);
    };

    const openAccountModal = (mode = 'login') => {
        setAuthMode(mode);
        setAuthMessage('');
        setAccountOpen(true);
    };

    const handleAuthSubmit = (e) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthMessage('');

        const endpoint = authMode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
        const payload = authMode === 'signup'
            ? authForm
            : { email: authForm.email, password: authForm.password };

        console.log('Auth request to:', `${API_BASE_URL}${endpoint}`, payload);

        fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(async res => {
                let data = {};
                const text = await res.text();
                try {
                    data = text ? JSON.parse(text) : {};
                } catch {
                    throw new Error(`Server returned status ${res.status}`);
                }
                if (!res.ok) throw new Error(data.error || 'Authentication failed');
                return data;
            })
            .then(data => {
                setAuthToken(data.token);
                setCurrentUser(data.user);
                setCheckoutForm(prev => ({
                    ...prev,
                    name: prev.name || data.user.name || '',
                    email: prev.email || data.user.email || ''
                }));
                localStorage.setItem('thelogoless_token', data.token);
                localStorage.setItem('thelogoless_user', JSON.stringify(data.user));
                setAuthForm({ name: '', email: '', password: '' });
                setAuthMessage(authMode === 'signup' ? 'Account created.' : 'Signed in.');
                if (cart.length > 0) {
                    Promise.all(cart.map(item => fetch(`${API_BASE_URL}/api/cart/items`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${data.token}`
                        },
                        body: JSON.stringify({
                            productId: item.product._id,
                            quantity: item.quantity,
                            size: item.size || null
                        })
                    })))
                        .then(() => fetch(`${API_BASE_URL}/api/cart`, {
                            headers: { Authorization: `Bearer ${data.token}` }
                        }))
                        .then(res => res.ok ? res.json() : null)
                        .then(apiCart => {
                            if (apiCart) setCart(backendCartToLocalCart(apiCart));
                        })
                        .catch(() => { });
                }
                window.setTimeout(() => setAccountOpen(false), 700);
            })
            .catch(error => {
                setAuthMessage(error.message || 'Unable to continue.');
            })
            .finally(() => setAuthLoading(false));
    };

    const handleLogout = () => {
        setAuthToken('');
        setCurrentUser(null);
        localStorage.removeItem('thelogoless_token');
        localStorage.removeItem('thelogoless_user');
        setAuthMessage('Signed out.');
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSuggestions([]);
            setSearchResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase().trim();
        const baseSuggestions = [
            'shirts',
            'shirts plain',
            'shirts linen',
            'shirts cotton',
            'shirts checks',
            'shorts',
            'shorts linen',
            'shorts cotton',
            'shorts relaxed',
            'jeans',
            'jeans denim',
            'jeans raw',
            'jeans straight',
            'jeans classic',
            'jeans high-waist',
            't-shirts',
            't-shirts oversized',
            't-shirts baggy',
            't-shirts organic',
            't-shirts heavyweight',
            'polos',
            'polos knit',
            'polos ribbed',
            'polos cotton',
            'polos classic',
            'polos pink',
            'trousers',
            'trousers relaxed',
            'trousers linen',
            'trousers cotton',
            'plus-size',
            'plus-size kurtas',
            'plus-size shirts',
            'plus-size tops',
        ];

        const startsWithQuery = baseSuggestions.filter(s => s.startsWith(lowerQuery));
        const containsQuery = baseSuggestions.filter(s => !s.startsWith(lowerQuery) && s.includes(lowerQuery));
        const filteredSuggestions = [...startsWithQuery, ...containsQuery].slice(0, 6);

        setSuggestions(filteredSuggestions);

        // Word-by-word matching logic for Enter and immediate filtering
        const filteredProducts = heroSlidesData.filter(p => {
            const words = lowerQuery.split(/\s+/).filter(Boolean);
            return words.every(w => {
                const wSingular = (w.endsWith('s') && w.length > 3) ? w.slice(0, -1) : w;
                const targets = [
                    p.name,
                    p.category,
                    p.material,
                    p.tagline,
                    p.description || ''
                ].map(t => t.toLowerCase());
                return targets.some(t => t.includes(w) || t.includes(wSingular));
            });
        });
        setSearchResults(filteredProducts);
    };

    const handleSelectSuggestion = (suggestion) => {
        setSearchQuery(suggestion);
        setSelectedStoreCategory('ALL');

        const lowerQuery = suggestion.toLowerCase().trim();
        const filteredProducts = heroSlidesData.filter(p => {
            const words = lowerQuery.split(/\s+/).filter(Boolean);
            return words.every(w => {
                const wSingular = (w.endsWith('s') && w.length > 3) ? w.slice(0, -1) : w;
                const targets = [
                    p.name,
                    p.category,
                    p.material,
                    p.tagline,
                    p.description || ''
                ].map(t => t.toLowerCase());
                return targets.some(t => t.includes(w) || t.includes(wSingular));
            });
        });
        setSearchResults(filteredProducts);

        navigateTo('/shop');
        setIsSearchFocused(false);
    };

    const handleExecuteSearch = (query) => {
        if (!query.trim()) return;
        setSelectedStoreCategory('ALL');
        navigateTo('/shop');
        setIsSearchFocused(false);
    };

    const handleCheckoutSubmit = (e) => {
        e.preventDefault();
        setCheckoutLoading(true);

        const orderData = {
            customerName: checkoutForm.name,
            customerEmail: checkoutForm.email,
            location: checkoutForm.location,
            items: cart.map(item => ({
                productId: item.product._id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                size: item.size || null
            })),
            total: subtotal
        };

        fetch(`${API_BASE_URL}/api/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
            },
            body: JSON.stringify(orderData)
        })
            .then(res => res.json())
            .then(data => {
                setCheckoutLoading(false);
                if (data.success) {
                    setCheckoutSuccess(true);
                    setCart([]);
                }
            })
            .catch(() => {
                // Local simulation fallback
                setTimeout(() => {
                    setCheckoutLoading(false);
                    setCheckoutSuccess(true);
                    setCart([]);
                }, 1800);
            });
    };

    // --- NEWSLETTER FORM SUBMISSION ---
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (!newsletterEmail) return;

        fetch(`${API_BASE_URL}/api/newsletter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: newsletterEmail })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setNewsletterMsg('YOU HAVE BEEN INCLUDED.');
                    setNewsletterEmail('');
                    setTimeout(() => setNewsletterMsg(''), 5000);
                }
            })
            .catch(() => {
                // Fallback simulation
                setNewsletterMsg('YOU HAVE BEEN INCLUDED.');
                setNewsletterEmail('');
                setTimeout(() => setNewsletterMsg(''), 5000);
            });
    };

    // --- PRODUCTS CAROUSEL SCROLL/DRAG DRAG HANDLERS ---
    const handleMouseDown = (e) => {
        isDownRef.current = true;
        startXRef.current = e.pageX - collectionTrackRef.current.offsetLeft;
        scrollLeftRef.current = collectionTrackRef.current.scrollLeft;
    };

    const handleMouseLeave = () => {
        isDownRef.current = false;
    };

    const handleMouseUp = () => {
        isDownRef.current = false;
    };

    const handleMouseMove = (e) => {
        if (!isDownRef.current) return;
        e.preventDefault();
        const x = e.pageX - collectionTrackRef.current.offsetLeft;
        const walk = (x - startXRef.current) * 1.5;
        collectionTrackRef.current.scrollLeft = scrollLeftRef.current - walk;
    };

    const navigateTo = (path) => {
        if (window.location.pathname === path) return;

        window.history.pushState({}, '', path);
        setRoutePath(path);
        window.scrollTo({ top: 0, behavior: 'auto' });
        setRouteTransitionPhase('idle');
    };

    const openStorefrontProduct = (product) => {
        setSelectedStoreProduct(product);
        setSelectedStoreSize(product.sizes[0]);
        setSelectedStoreImage(product.image);
        setSelectedStoreCategory('ALL');
        navigateTo('/shop');
    };

    const openStorefrontDetail = (product) => {
        setSelectedStoreProduct(product);
        setSelectedStoreSize(product.sizes[0]);
        setSelectedStoreImage(product.image);
        navigateTo(`/product/${product.id}`);
    };

    // Admin CRUD - Update Order Status
    const handleStatusChange = (orderId, newStatus) => {
        fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({ status: newStatus })
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to update status');
                return res.json();
            })
            .then(updatedOrder => {
                setAdminOrders(prev => prev.map(o => o._id === orderId ? updatedOrder : o));
            })
            .catch(err => alert(err.message));
    };

    // Admin CRUD - Toggle Product Active Status
    const handleProductActiveToggle = (productId, currentActive) => {
        const url = `${API_BASE_URL}/api/admin/products/${productId}`;
        const method = currentActive ? 'DELETE' : 'PATCH';
        const body = currentActive ? null : JSON.stringify({ active: true });

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            },
            ...(body ? { body } : {})
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to toggle product status');
                return res.json();
            })
            .then(() => {
                // Refetch products list
                fetch(`${API_BASE_URL}/api/products`)
                    .then(res => res.ok ? res.json() : [])
                    .then(data => {
                        if (data && data.length > 0) setProducts(data);
                    });
            })
            .catch(err => alert(err.message));
    };

    // Admin CRUD - Save Product (Create / Update)
    const handleSaveProduct = (e) => {
        e.preventDefault();
        const isEdit = Boolean(editingProduct);
        const url = isEdit
            ? `${API_BASE_URL}/api/admin/products/${editingProduct._id}`
            : `${API_BASE_URL}/api/admin/products`;
        const method = isEdit ? 'PATCH' : 'POST';

        const payload = {
            name: productForm.name,
            category: productForm.category,
            price: Number(productForm.price),
            material: productForm.material,
            description: productForm.description,
            image: productForm.image,
            sizes: productForm.sizes.split(',').map(s => s.trim()).filter(Boolean),
            stock: Number(productForm.stock),
            active: true
        };

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to save product');
                return res.json();
            })
            .then(() => {
                setProductModalOpen(false);
                setEditingProduct(null);
                setProductForm({ name: '', category: 'T-SHIRTS', price: '', material: '', description: '', image: '/logo_tee_mockup.png', sizes: 'S, M, L, XL', stock: 10 });
                // Refetch products
                fetch(`${API_BASE_URL}/api/products`)
                    .then(res => res.ok ? res.json() : [])
                    .then(data => {
                        if (data && data.length > 0) setProducts(data);
                    });
            })
            .catch(err => alert(err.message));
    };

    // Admin CRUD - Trigger Edit Product Form Modal
    const triggerEditProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            category: product.category || 'T-SHIRTS',
            price: product.price,
            material: product.material || '',
            description: product.description || '',
            image: product.image || '/logo_tee_mockup.png',
            sizes: (product.sizes || []).join(', '),
            stock: product.stock || 10
        });
        setProductModalOpen(true);
    };

    const getProductFilterText = (product) => {
        return `${product.name} ${product.category} ${product.material} ${product.description || ''}`.toUpperCase();
    };

    const matchesFilterGroup = (product, key, values = []) => {
        if (!values.length) return true;
        const productText = getProductFilterText(product);

        if (key === 'delivery') return true;
        if (key === 'size') return values.some((value) => product.sizes.includes(value));
        if (key === 'price') {
            return values.some((value) => {
                if (value === 'UNDER ₹1000') return product.price < 1000;
                if (value === '₹1000-₹1500') return product.price >= 1000 && product.price <= 1500;
                if (value === '₹1500+') return product.price > 1500;
                return false;
            });
        }

        return values.some((value) => productText.includes(value.replace('DROP SHOULDER', 'DROP')));
    };

    const toggleFilterOption = (key, option) => {
        setFilterDraft((prev) => {
            const current = prev[key] || [];
            const next = current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option];

            return {
                ...prev,
                [key]: next
            };
        });
    };

    const clearStoreFilters = () => {
        setFilterDraft({});
        setAppliedFilters({});
    };

    const activeFilterCount = Object.values(appliedFilters).reduce((sum, values) => sum + values.length, 0);

    const filteredStoreProducts = heroSlidesData.filter((product) => {
        // Filter by category
        if (selectedStoreCategory !== 'ALL' && selectedStoreCategory !== 'NEW') {
            const matchTarget = `${product.category} ${product.name}`.toUpperCase();
            if (!matchTarget.includes(selectedStoreCategory)) return false;
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const searchLower = searchQuery.toLowerCase();
            const words = searchLower.split(/\s+/).filter(Boolean);
            const matchesSearch = words.every(w => {
                const wSingular = (w.endsWith('s') && w.length > 3) ? w.slice(0, -1) : w;
                const targets = [
                    product.name,
                    product.category,
                    product.material,
                    product.tagline,
                    product.description || ''
                ].map(t => t.toLowerCase());
                return targets.some(t => t.includes(w) || t.includes(wSingular));
            });
            if (!matchesSearch) return false;
        }

        return true;
    }).filter((product) => {
        return storefrontFilterGroups.every((group) => matchesFilterGroup(product, group.key, appliedFilters[group.key] || []));
    }).sort((a, b) => {
        if (sortMode === 'Price Low') return a.price - b.price;
        if (sortMode === 'Price High') return b.price - a.price;
        if (sortMode === 'Newest') return Number(b.id.replace('hero_', '')) - Number(a.id.replace('hero_', ''));
        return 0;
    });

    const relatedStoreProducts = heroSlidesData
        .filter((product) => product.id !== selectedStoreProduct.id)
        .slice(0, 5);


    const listingTitle = selectedStoreCategory === 'ALL' || selectedStoreCategory === 'NEW'
        ? 'LINEN EDIT'
        : `${selectedStoreCategory} EDIT`;

    useEffect(() => {
        if (routeProduct) {
            const routeSyncTimer = window.setTimeout(() => {
                setSelectedStoreProduct(routeProduct);
                setSelectedStoreSize(routeProduct.sizes[0]);
                setSelectedStoreImage(routeProduct.image);
            }, 0);

            return () => window.clearTimeout(routeSyncTimer);
        }
    }, [routeProduct]);

    useEffect(() => {
        if (routePath.startsWith('/product/') && !routeProduct) {
            const invalidRouteTimer = window.setTimeout(() => navigateTo('/shop'), 0);
            return () => window.clearTimeout(invalidRouteTimer);
        }
    }, [routePath, routeProduct]);

    useEffect(() => {
        if (isProductRoute && routeProduct) {
            document.title = `${routeProduct.name} | THELOGOLESS`;
            return;
        }

        if (isShopRoute) {
            document.title = 'Shop | THELOGOLESS';
            return;
        }

        if (isAdminRoute) {
            document.title = 'Admin Dashboard | THELOGOLESS';
            return;
        }

        if (isOrdersRoute) {
            document.title = 'Order History | THELOGOLESS';
            return;
        }

        document.title = 'THELOGOLESS';
    }, [isProductRoute, isShopRoute, isAdminRoute, isOrdersRoute, routeProduct]);

    const renderedSlides = [
        { ...heroSlidesData[heroSlidesData.length - 2], id: 'hero_clone_9' },
        { ...heroSlidesData[heroSlidesData.length - 1], id: 'hero_clone_10' },
        ...heroSlidesData,
        { ...heroSlidesData[0], id: 'hero_clone_1' },
        { ...heroSlidesData[1], id: 'hero_clone_2' }
    ];
    const collectionProducts = heroSlidesData.map((prod, idx) => ({
        ...prod,
        _id: prod.id,
        primaryImage: prod.primaryImage || prod.image,
        hoverImage: prod.hoverImage || prod.gallery?.[1] || heroSlidesData[(idx + 1) % heroSlidesData.length].image
    }));
    const storefrontRouteTransitionClass = `storefront-route-layer route-${routeTransitionPhase} route-${routeTransitionDirection}`;

    return (
        <>
            {isSearchOpen && (
                <div className="navbar-search-backdrop" onMouseDown={() => { setIsSearchFocused(false); setIsSearchOpen(false); }}></div>
            )}

            {/* Scroll progress indicator */}
            <div className="progress-bar" style={{ transform: `scaleX(${scrollProgress / 100})` }}></div>

            {/* --- NAVIGATION BAR --- */}
            <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${navHidden ? 'nav-hidden' : ''}`}>
                <div className="container">
                    <div className="nav-left-controls">
                        <button
                            className={`nav-menu-btn ${menuOpen ? 'active' : ''}`}
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle categories menu"
                            type="button"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>

                    <a href="#hero" className="nav-logo">THELOGOLESS</a>

                    <div className="nav-right-controls">
                        <div className={`navbar-search-wrapper ${isSearchOpen ? 'open' : ''}`}>
                            {isSearchOpen ? (
                                <div className="navbar-search-input-wrapper">
                                    <svg className="navbar-search-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <circle cx="11" cy="11" r="7"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                    <input
                                        type="text"
                                        className="navbar-search-input"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleExecuteSearch(searchQuery)}
                                        autoFocus
                                    />
                                    <button
                                        className="navbar-search-clear"
                                        type="button"
                                        onClick={() => {
                                            if (searchQuery) {
                                                handleSearch('');
                                            } else {
                                                setIsSearchOpen(false);
                                            }
                                        }}
                                        aria-label="Close search"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="nav-icon-btn"
                                    type="button"
                                    aria-label="Open search"
                                    onClick={() => {
                                        setIsSearchOpen(true);
                                        setIsSearchFocused(true);
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="7"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </button>
                            )}

                            {isSearchOpen && isSearchFocused && searchQuery && suggestions.length > 0 && (
                                <div className="navbar-search-dropdown">
                                    {suggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            className="navbar-search-dropdown-item"
                                            onMouseDown={() => handleSelectSuggestion(suggestion)}
                                        >
                                            <svg className="navbar-search-dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <circle cx="11" cy="11" r="7"></circle>
                                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                            </svg>
                                            <span className="navbar-search-dropdown-text">{suggestion}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {currentUser?.role === 'admin' && (
                            <button
                                className="nav-icon-btn admin-badge-btn"
                                type="button"
                                aria-label="Admin Dashboard"
                                onClick={() => navigateTo('/admin')}
                                title="Admin Dashboard"
                                style={{
                                    border: '1px solid var(--color-accent-gold)',
                                    borderRadius: '12px',
                                    fontSize: '0.66rem',
                                    padding: '4px 8px',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    color: 'var(--color-accent-gold)',
                                    fontWeight: '700',
                                    marginRight: '6px'
                                }}
                            >
                                Admin
                            </button>
                        )}

                        <button
                            className={`nav-icon-btn ${currentUser ? 'signed-in' : ''}`}
                            type="button"
                            aria-label="Account"
                            onClick={() => openAccountModal(currentUser ? 'account' : 'login')}
                            title={currentUser ? currentUser.name : 'Login or signup'}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21a8 8 0 0 0-16 0"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </button>

                        <button className="theme-toggle-btn" onClick={() => setLight(prev => !prev)} aria-label="Toggle Theme">
                            <svg className="theme-icon sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                            <svg className="theme-icon moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        </button>

                        <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label="Open Cart" title="View Cart">
                            <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                        </button>
                    </div>
                </div>
                <div className={`nav-menu-panel ${menuOpen ? 'active' : ''}`}>
                    <div className="nav-menu-panel-inner">
                        <span className="nav-menu-label">Categories</span>
                        <ul className="nav-links">
                            <li><a href="/shop" onClick={(e) => { e.preventDefault(); navigateTo('/shop'); setMenuOpen(false); }}>Shop All</a></li>
                            <li><a href="#collection" className={activeSection === 'collection' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Collection</a></li>
                            <li><a href="#concepts" className={activeSection === 'concepts' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Signatures</a></li>
                            <li><a href="#customizer" className={activeSection === 'customizer' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Customizer</a></li>
                            <li><a href="#brandbook" className={activeSection === 'brandbook' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Brand Book</a></li>
                        </ul>
                    </div>
                </div>

                {/* --- HORIZONTAL SUB-NAVIGATION TABS BAR --- */}
                <div className="navbar-sub-nav">
                    <div className="container sub-nav-container">
                        <span className="deliver-badge">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            Deliver to: <strong>474006</strong> Gwalior
                        </span>
                        <div className="sub-nav-links">
                            <button className={`sub-nav-link ${routePath === '/' ? 'active' : ''}`} onClick={() => navigateTo('/')}>Discover</button>
                            <button className={`sub-nav-link ${isShopRoute && selectedStoreCategory === 'SHIRTS' ? 'active' : ''}`} onClick={() => { setSelectedStoreCategory('SHIRTS'); navigateTo('/shop'); }}>Shirts</button>
                            <button className={`sub-nav-link ${isShopRoute && selectedStoreCategory === 'T-SHIRTS' ? 'active' : ''}`} onClick={() => { setSelectedStoreCategory('T-SHIRTS'); navigateTo('/shop'); }}>T-shirts</button>
                            <button className={`sub-nav-link ${isShopRoute && selectedStoreCategory === 'JEANS' ? 'active' : ''}`} onClick={() => { setSelectedStoreCategory('JEANS'); navigateTo('/shop'); }}>Jeans</button>
                            <button className={`sub-nav-link ${isShopRoute && selectedStoreCategory === 'POLOS' ? 'active' : ''}`} onClick={() => { setSelectedStoreCategory('POLOS'); navigateTo('/shop'); }}>Polos</button>
                            <button className={`sub-nav-link ${isShopRoute && selectedStoreCategory === 'PLUS-SIZE' ? 'active' : ''}`} onClick={() => { setSelectedStoreCategory('PLUS-SIZE'); navigateTo('/shop'); }}>Plus-Size</button>
                            <button className={`sub-nav-link ${isShopRoute && selectedStoreCategory === 'TROUSERS' ? 'active' : ''}`} onClick={() => { setSelectedStoreCategory('TROUSERS'); navigateTo('/shop'); }}>Trousers</button>
                            <button className={`sub-nav-link ${isShopRoute && selectedStoreCategory === 'SHORTS' ? 'active' : ''}`} onClick={() => { setSelectedStoreCategory('SHORTS'); navigateTo('/shop'); }}>Shorts</button>
                            <button className="sub-nav-link" onClick={() => { setSelectedStoreCategory('ALL'); navigateTo('/shop'); alert('Quiet Luxury Shoes Collection is coming soon!'); }}>Shoes</button>
                            <button className="sub-nav-link" onClick={() => { setSelectedStoreCategory('ALL'); navigateTo('/shop'); alert('Minimalist Sunglasses are coming soon!'); }}>Sunglasses</button>
                            <button className="sub-nav-link" onClick={() => { setSelectedStoreCategory('ALL'); navigateTo('/shop'); alert('Premium Perfumes are coming soon!'); }}>Perfumes</button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section id="hero" className="hero-slider-mode">
                <div className="hero-slider-track-wrapper">
                    <div
                        className="hero-slider-track"
                        style={{
                            transform: `translate3d(calc(var(--slide-peek) - var(--slide-width) * ${currentHeroSlide + 2}), 0, 0)`
                        }}
                    >
                        {renderedSlides.map((slide, idx) => {
                            const originalIdx = idx - 2;
                            const isActive = originalIdx === currentHeroSlide;
                            return (
                                <div
                                    key={slide.id + '-' + idx}
                                    className={`hero-slide-pane ${isActive ? 'active' : ''}`}
                                    onClick={() => {
                                        if (originalIdx >= 0 && originalIdx < heroSlidesData.length) {
                                            if (isActive) {
                                                openStorefrontProduct(slide);
                                            } else {
                                                setCurrentHeroSlide(originalIdx);
                                            }
                                        } else {
                                            // Click on a clone card jumps to the original slide index
                                            const targetOrigIdx = originalIdx < 0 ? (originalIdx + heroSlidesData.length) : (originalIdx - heroSlidesData.length);
                                            setCurrentHeroSlide(targetOrigIdx);
                                        }
                                    }}
                                >
                                    <div
                                        className="hero-slide-bg-img"
                                        style={{ backgroundImage: `url("${encodeURI(slide.image)}")` }}
                                    ></div>
                                    <div className="hero-slide-overlay"></div>
                                    <div className="container hero-slide-container">
                                        <div className="hero-slide-content">
                                            <h1 className="hero-slide-title">
                                                {slide.name.split(' ').slice(0, -1).join(' ')} <span>{slide.name.split(' ').slice(-1)[0]}</span>
                                            </h1>
                                            <p className="hero-slide-tagline">
                                                {slide.tagline}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Arrows and Indicators */}
                <button
                    className="hero-slider-btn prev"
                    onClick={(e) => {
                        e.stopPropagation();
                        setCurrentHeroSlide(prev => (prev - 1 + heroSlidesData.length) % heroSlidesData.length);
                    }}
                    aria-label="Previous slide"
                >
                    &#8592;
                </button>
                <button
                    className="hero-slider-btn next"
                    onClick={(e) => {
                        e.stopPropagation();
                        setCurrentHeroSlide(prev => (prev + 1) % heroSlidesData.length);
                    }}
                    aria-label="Next slide"
                >
                    &#8594;
                </button>

                <div className="hero-slider-indicators">
                    {heroSlidesData.map((_, idx) => (
                        <div
                            key={idx}
                            className={`slider-dot ${idx === currentHeroSlide ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentHeroSlide(idx);
                            }}
                        ></div>
                    ))}
                </div>
            </section>

            {/* --- BRAND MARQUEE --- */}
            <div className="marquee-section">
                <div className="marquee-track">
                    <span className="marquee-item">Quiet Luxury <span className="marquee-sep">✦</span></span>
                    <span className="marquee-item">Organic Materials <span className="marquee-sep">✦</span></span>
                    <span className="marquee-item">Architectural Form <span className="marquee-sep">✦</span></span>
                    <span className="marquee-item">Tactile Craftsmanship <span className="marquee-sep">✦</span></span>
                    <span className="marquee-item">No Logo Policy <span className="marquee-sep">✦</span></span>
                    <span className="marquee-item">Premium Textiles <span className="marquee-sep">✦</span></span>
                    <span className="marquee-item">Zero Noise <span className="marquee-sep">✦</span></span>
                    <span className="marquee-item">Pure Garment <span className="marquee-sep">✦</span></span>
                    {/* Repeated items for seamless animation loop */}
                    <span className="marquee-item">Quiet Luxury <span className="marquee-sep">✦</span></span>
                    <span className="marquee-item">Organic Materials <span className="marquee-sep">✦</span></span>
                    <span className="marquee-item">Architectural Form <span className="marquee-sep">✦</span></span>
                    <span className="marquee-item">Tactile Craftsmanship <span className="marquee-sep">✦</span></span>
                    <span className="marquee-item">No Logo Policy <span className="marquee-sep">✦</span></span>
                    <span className="marquee-item">Premium Textiles <span className="marquee-sep">✦</span></span>
                    <span className="marquee-item">Zero Noise <span className="marquee-sep">✦</span></span>
                    <span className="marquee-item">Pure Garment <span className="marquee-sep">✦</span></span>
                </div>
            </div>

            {/* --- FEATURED CATEGORIES SECTION --- */}
            <section className="section-padding featured-categories">
                <div className="container">
                    <div className="text-center reveal">
                        <span className="accent-text">Curated Silhouettes</span>
                        <h2 className="section-title">Featured Categories</h2>
                        <div className="divider"></div>
                    </div>
                    <div className="featured-categories-grid reveal">
                        <div className="category-card-item" onClick={() => { setSelectedStoreCategory('SHIRTS'); navigateTo('/shop'); }}>
                            <div className="category-card-img-wrap">
                                <img src="/catalog/blue shirt man/WhatsApp Image 2026-05-26 at 16.11.43.jpeg" alt="Shirts Category" />
                                <div className="category-card-overlay"></div>
                            </div>
                            <div className="category-card-meta">
                                <h3>SHIRTS</h3>
                            </div>
                        </div>

                        <div className="category-card-item" onClick={() => { setSelectedStoreCategory('TROUSERS'); navigateTo('/shop'); }}>
                            <div className="category-card-img-wrap">
                                <img src="/hero_slide_3.png" alt="Trousers Category" />
                                <div className="category-card-overlay"></div>
                            </div>
                            <div className="category-card-meta">
                                <h3>TROUSERS</h3>
                            </div>
                        </div>

                        <div className="category-card-item" onClick={() => { setSelectedStoreCategory('POLOS'); navigateTo('/shop'); }}>
                            <div className="category-card-img-wrap">
                                <img src="/catalog/green top girl/WhatsApp Image 2026-05-26 at 16.12.02.jpeg" alt="Polos Category" />
                                <div className="category-card-overlay"></div>
                            </div>
                            <div className="category-card-meta">
                                <h3>POLOS</h3>
                            </div>
                        </div>

                        <div className="category-card-item" onClick={() => { setSelectedStoreCategory('JEANS'); navigateTo('/shop'); }}>
                            <div className="category-card-img-wrap">
                                <img src="/catalog/jeans girl/WhatsApp Image 2026-05-26 at 16.12.05.jpeg" alt="Jeans Category" />
                                <div className="category-card-overlay"></div>
                            </div>
                            <div className="category-card-meta">
                                <h3>JEANS</h3>
                            </div>
                        </div>

                        <div className="category-card-item" onClick={() => { setSelectedStoreCategory('TROUSERS'); navigateTo('/shop'); }}>
                            <div className="category-card-img-wrap">
                                <img src="/hero_slide_2.png" alt="Cargos Category" />
                                <div className="category-card-overlay"></div>
                            </div>
                            <div className="category-card-meta">
                                <h3>CARGOS</h3>
                            </div>
                        </div>

                        <div className="category-card-item" onClick={() => { setSelectedStoreCategory('T-SHIRTS'); navigateTo('/shop'); }}>
                            <div className="category-card-img-wrap">
                                <img src="/catalog/white tshirt man/WhatsApp Image 2026-05-26 at 16.11.40.jpeg" alt="T-Shirts Category" />
                                <div className="category-card-overlay"></div>
                            </div>
                            <div className="category-card-meta">
                                <h3>T-SHIRTS</h3>
                            </div>
                        </div>

                        <div className="category-card-item" onClick={() => { setSelectedStoreCategory('SHORTS'); navigateTo('/shop'); }}>
                            <div className="category-card-img-wrap">
                                <img src="/catalog/baggy tshirt girl/WhatsApp Image 2026-05-26 at 16.11.58.jpeg" alt="Shorts Category" />
                                <div className="category-card-overlay"></div>
                            </div>
                            <div className="category-card-meta">
                                <h3>SHORTS</h3>
                            </div>
                        </div>

                        <div className="category-card-item" onClick={() => { setSelectedStoreCategory('PLUS-SIZE'); navigateTo('/shop'); }}>
                            <div className="category-card-img-wrap">
                                <img src="/catalog/blue kurti girl/WhatsApp Image 2026-05-26 at 16.12.04.jpeg" alt="Plus Size Category" />
                                <span className="category-card-badge">3XL TO 6XL</span>
                                <div className="category-card-overlay"></div>
                            </div>
                            <div className="category-card-meta">
                                <h3>PLUS SIZE</h3>
                            </div>
                        </div>

                        <div className="category-card-item" onClick={() => alert('Shoes Collection is coming soon!')}>
                            <div className="category-card-img-wrap">
                                <img src="/logo_concept_dots.png" alt="Shoes Category" />
                                <span className="category-card-badge badge-launched">JUST LAUNCHED</span>
                                <div className="category-card-overlay"></div>
                            </div>
                            <div className="category-card-meta">
                                <h3>SHOES</h3>
                            </div>
                        </div>

                        <div className="category-card-item" onClick={() => { setSelectedStoreCategory('ALL'); navigateTo('/shop'); alert('Minimalist Sunglasses are coming soon!'); }}>
                            <div className="category-card-img-wrap">
                                <img src="/hero_slide_6.png" alt="Sunglasses Category" />
                                <div className="category-card-overlay"></div>
                            </div>
                            <div className="category-card-meta">
                                <h3>SUNGLASSES</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- MOVING PRODUCTS SECTION --- */}
            <section id="collection" className="collection">
                <div className="container">
                    <div className="text-center reveal">
                        <span className="accent-text">Woven Absence</span>
                        <h2 className="section-title">The Product Collection</h2>
                        <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                            Discover our structural silhouettes crafted from GOTS organic fibers. Drag left or right to browse.
                        </p>
                        <div className="divider"></div>
                    </div>

                    <div className="collection-slider-container reveal">
                        <div className="collection-grid">
                            <div
                                className="collection-slider-track"
                                ref={collectionTrackRef}
                                onMouseDown={handleMouseDown}
                                onMouseLeave={handleMouseLeave}
                                onMouseUp={handleMouseUp}
                                onMouseMove={handleMouseMove}
                            >
                                {collectionProducts.slice(0, 5).map((prod) => (
                                    <div className="product-card" key={prod._id || prod.id} onClick={() => openStorefrontDetail(prod)}>
                                        <div className="product-img-wrapper">
                                            <div className="product-image-stack">
                                                <img src={prod.primaryImage} alt={prod.name} className="product-image product-image-primary" draggable="false" />
                                                <img src={prod.hoverImage} alt={`${prod.name} worn by model`} className="product-image product-image-hover" draggable="false" />
                                            </div>
                                            {/* Hover Actions */}
                                            <div className="product-actions">
                                                <button className="btn-primary" onClick={(e) => { e.stopPropagation(); addToCart(prod); }} style={{ width: '100%' }}>Add To Cart</button>
                                                <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); handleQuickBuy(prod); }} style={{ width: '100%', borderColor: 'rgba(255,255,255,0.2)' }}>Quick Buy</button>
                                            </div>
                                        </div>
                                        <div className="product-info">
                                            <h3 className="product-name">{prod.name}</h3>
                                            <p className="product-material">{prod.material}</p>
                                            <div className="product-price-row">
                                                <span className="product-price">₹{prod.price}</span>
                                                <button className="product-add-btn" onClick={(e) => { e.stopPropagation(); addToCart(prod); }}>+ Add</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="collection-slider-track collection-slider-track-secondary">
                                {collectionProducts.slice(5, 10).map((prod) => (
                                    <div className="product-card" key={`secondary-${prod._id || prod.id}`} onClick={() => openStorefrontDetail(prod)}>
                                        <div className="product-img-wrapper">
                                            <div className="product-image-stack">
                                                <img src={prod.primaryImage} alt={prod.name} className="product-image product-image-primary" draggable="false" />
                                                <img src={prod.hoverImage} alt={`${prod.name} worn by model`} className="product-image product-image-hover" draggable="false" />
                                            </div>
                                            <div className="product-actions">
                                                <button className="btn-primary" onClick={(e) => { e.stopPropagation(); addToCart(prod); }} style={{ width: '100%' }}>Add To Cart</button>
                                                <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); handleQuickBuy(prod); }} style={{ width: '100%', borderColor: 'rgba(255,255,255,0.2)' }}>Quick Buy</button>
                                            </div>
                                        </div>
                                        <div className="product-info">
                                            <h3 className="product-name">{prod.name}</h3>
                                            <p className="product-material">{prod.material}</p>
                                            <div className="product-price-row">
                                                <span className="product-price">₹{prod.price}</span>
                                                <button className="product-add-btn" onClick={(e) => { e.stopPropagation(); addToCart(prod); }}>+ Add</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- BRAND CONCEPTS SECTION --- */}
            <section id="concepts" className="section-padding concepts">
                <div className="container">
                    <div className="text-center reveal">
                        <span className="accent-text">Design System</span>
                        <h2 className="section-title">The Four Design Signatures</h2>
                        <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }} className="philosophy-paragraph">
                            We replace traditional branding with four subtle architectural marks that carry the brand's identity quietly.
                        </p>
                        <div className="divider"></div>
                    </div>

                    <div className="concepts-grid">
                        {/* Concept 1 */}
                        <div className="concept-card reveal reveal-delay-1" id="card-concept-1">
                            <div className="concept-icon">/</div>
                            <h3 className="concept-title">The Elegant Slash</h3>
                            <p className="concept-desc">A subtle, diagonal line representing an empty space or missing label. An architectural slash carved into buttons or embroidered in tone-on-tone thread.</p>
                        </div>

                        {/* Concept 2 */}
                        <div className="concept-card reveal reveal-delay-2" id="card-concept-2">
                            <div className="concept-icon">
                                <svg className="concept-icon-svg" viewBox="0 0 24 24">
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                </svg>
                            </div>
                            <h3 className="concept-title">The Single Stitch</h3>
                            <p className="concept-desc">An abstract single hand-stitch or four corner threads at the neck seam. It emphasizes physical craftsmanship, tailoring, and textile construction.</p>
                        </div>

                        {/* Concept 3 */}
                        <div className="concept-card reveal reveal-delay-3" id="card-concept-3">
                            <div className="concept-icon" style={{ fontFamily: 'var(--font-display)' }}>TL</div>
                            <h3 className="concept-title">Architectural Monogram</h3>
                            <p className="concept-desc">A highly-stylized, single-stroke monogram combining T and L in a fluid geometric layout. Primarily used for custom customizer hardware.</p>
                        </div>

                        {/* Concept 4 */}
                        <div className="concept-card reveal reveal-delay-4" id="card-concept-4">
                            <div className="concept-icon">
                                <svg className="concept-icon-svg" viewBox="0 0 24 24">
                                    <rect x="4" y="4" width="16" height="16" rx="1" />
                                    <line x1="8" y1="12" x2="16" y2="12" />
                                </svg>
                            </div>
                            <h3 className="concept-title">The Pure Void</h3>
                            <p className="concept-desc">Blind debossed branding pressed into thick cotton clothing tags or fine paper wrap. No ink, no dye, only depth and tactile shadows.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- INTERACTIVE BRAND CUSTOMIZER --- */}
            <section id="customizer" className="section-padding customizer">
                <div className="container">
                    <div className="text-center reveal">
                        <span className="accent-text">Simulator</span>
                        <h2 className="section-title">Interactive Brand Customizer</h2>
                        <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }} className="philosophy-paragraph">
                            Experiment with placement, tone, and design of our minimalist signatures on a luxury organic t-shirt.
                        </p>
                        <div className="divider"></div>
                    </div>

                    <div className="customizer-layout">
                        {/* Canvas */}
                        <div className="canvas-container reveal-left" id="customizer-canvas">
                            <span className="placement-badge">Placement: {customizerState.placement}</span>

                            <svg className="tshirt-svg" id="tshirt-svg" style={{ transform: tshirtTransform }} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <filter id="fabric-texture" x="0%" y="0%" width="100%" height="100%">
                                        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" result="noise" />
                                        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.12 0" in="noise" result="coloredNoise" />
                                        <feComposite operator="in" in2="SourceGraphic" in="coloredNoise" result="textureOverlay" />
                                        <feBlend mode="multiply" in="SourceGraphic" in2="textureOverlay" />
                                    </filter>
                                </defs>
                                <path d="M41 18 C45 20.5, 55 20.5, 59 18 C58 14.5, 42 14.5, 41 18 Z" fill="#060607" opacity="0.3" />
                                <path className="tshirt-fabric" id="tshirt-fabric" filter="url(#fabric-texture)" d="M30 18 C33 19, 37 19, 40 18 C43 15, 57 15, 60 18 C63 19, 67 19, 70 18 L76 29 C77.5 31.5, 75 33, 73 33 L67 31 L67 85 C67 87.5, 65 89, 62 89 L38 89 C35 89, 33 87.5, 33 85 L33 31 L27 33 C25 33, 22.5 31.5, 24 29 Z" fill="#0D0E10" />
                                <path className="tshirt-collar" d="M40 18 C43 22, 57 22, 60 18" fill="none" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.08" />
                                <path d="M40.5 18 C43.5 21.5, 56.5 21.5, 59.5 18" fill="none" stroke="#000000" strokeWidth="0.8" opacity="0.4" />
                                <path d="M33 31 C34 33, 35 34, 37 35" fill="none" stroke="#000000" strokeWidth="0.5" opacity="0.3" />
                                <path d="M67 31 C66 33, 65 34, 63 35" fill="none" stroke="#000000" strokeWidth="0.5" opacity="0.3" />
                                <path d="M24 29 L27.2 32.5" fill="none" stroke="#000000" strokeWidth="0.4" opacity="0.2" />
                                <path d="M76 29 L72.8 32.5" fill="none" stroke="#000000" strokeWidth="0.4" opacity="0.2" />
                                <path d="M33 31 C35 48, 35 68, 37 89" fill="none" stroke="#000000" strokeWidth="0.6" opacity="0.25" />
                                <path d="M67 31 C65 48, 65 68, 63 89" fill="none" stroke="#000000" strokeWidth="0.6" opacity="0.25" />
                                <path d="M38 18 C36 40, 42 65, 40 89" fill="none" stroke="#000" strokeWidth="1.2" opacity="0.1" />
                                <path d="M60 18 C62 40, 56 65, 58 89" fill="none" stroke="#000" strokeWidth="1.2" opacity="0.1" />

                                <g id="tee-logo-group" className="tee-logo-element" transform={placementMap[customizerState.placement]}>
                                    <line
                                        id="logo-art-slash"
                                        x1="-1.5" y1="-3.5" x2="1.5" y2="3.5"
                                        stroke={logoColorMap[customizerState.color]}
                                        strokeWidth="0.6" strokeLinecap="round"
                                        style={{ display: customizerState.logo === 'slash' ? 'block' : 'none' }}
                                    />
                                    <g id="logo-art-stitch" style={{ display: customizerState.logo === 'stitch' ? 'block' : 'none' }}>
                                        <line x1="-1.5" y1="-1.5" x2="1.5" y2="1.5" stroke={logoColorMap[customizerState.color]} strokeWidth="0.5" />
                                        <line x1="1.5" y1="-1.5" x2="-1.5" y2="1.5" stroke={logoColorMap[customizerState.color]} strokeWidth="0.5" />
                                    </g>
                                    <text
                                        id="logo-art-text"
                                        x="0" y="0.8"
                                        fontFamily="'Cinzel', serif" fontSize="1.2" letterSpacing="0.1"
                                        fill={logoColorMap[customizerState.color]}
                                        textAnchor="middle"
                                        style={{ display: customizerState.logo === 'text' ? 'block' : 'none' }}
                                    >
                                        TL
                                    </text>
                                </g>
                            </svg>
                        </div>

                        {/* Controls */}
                        <div className="customizer-settings reveal-right">
                            {/* Preset Quick Bars */}
                            <div className="setting-group" id="preset-group">
                                <div className="setting-title">Curated Aesthetics <span style={{ textTransform: 'none' }}>Curated combinations</span></div>
                                <div className="option-grid">
                                    <button className={`btn-pill ${activePreset === 'obsidian-core' ? 'active' : ''}`} onClick={() => handlePresetApply('obsidian-core')}>Obsidian Core</button>
                                    <button className={`btn-pill ${activePreset === 'linen-nomad' ? 'active' : ''}`} onClick={() => handlePresetApply('linen-nomad')}>Linen Nomad</button>
                                    <button className={`btn-pill ${activePreset === 'selvedge-artist' ? 'active' : ''}`} onClick={() => handlePresetApply('selvedge-artist')}>Selvedge Artist</button>
                                    <button className={`btn-pill ${activePreset === 'bronze-signature' ? 'active' : ''}`} onClick={() => handlePresetApply('bronze-signature')}>Bronze Signature</button>
                                </div>
                            </div>

                            {/* Fabric */}
                            <div className="setting-group">
                                <div className="setting-title">Fabric & Color <span>{customizerState.fabric}</span></div>
                                <div className="option-grid">
                                    {Object.keys(fabricColorMap).map(f => (
                                        <div
                                            key={f}
                                            className={`swatch swatch-${f} ${customizerState.fabric === f ? 'active' : ''}`}
                                            title={f}
                                            onClick={() => {
                                                clearPresetSelection();
                                                setCustomizerState(prev => ({ ...prev, fabric: f }));
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Logo Concept */}
                            <div className="setting-group">
                                <div className="setting-title">Brand Signature <span>{customizerState.logo}</span></div>
                                <div className="option-grid">
                                    <div className={`logo-art-option ${customizerState.logo === 'slash' ? 'active' : ''}`} onClick={() => { clearPresetSelection(); setCustomizerState(prev => ({ ...prev, logo: 'slash' })); }}>
                                        <div className="logo-art-preview">/</div>
                                        <div className="logo-art-label">The Slash</div>
                                    </div>
                                    <div className={`logo-art-option ${customizerState.logo === 'stitch' ? 'active' : ''}`} onClick={() => { clearPresetSelection(); setCustomizerState(prev => ({ ...prev, logo: 'stitch' })); }}>
                                        <div className="logo-art-preview">×</div>
                                        <div className="logo-art-label">The Stitch</div>
                                    </div>
                                    <div className={`logo-art-option ${customizerState.logo === 'text' ? 'active' : ''}`} onClick={() => { clearPresetSelection(); setCustomizerState(prev => ({ ...prev, logo: 'text' })); }}>
                                        <div className="logo-art-preview" style={{ fontSize: '0.7rem' }}>T L</div>
                                        <div className="logo-art-label">Typography</div>
                                    </div>
                                </div>
                            </div>

                            {/* Thread Color */}
                            <div className="setting-group">
                                <div className="setting-title">Thread Color <span>{customizerState.color}</span></div>
                                <div className="option-grid">
                                    {Object.keys(logoColorMap).map(c => (
                                        <button
                                            key={c}
                                            className={`btn-pill ${customizerState.color === c ? 'active' : ''}`}
                                            onClick={() => {
                                                clearPresetSelection();
                                                setCustomizerState(prev => ({ ...prev, color: c }));
                                            }}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Placement */}
                            <div className="setting-group">
                                <div className="setting-title">Placement <span>{customizerState.placement}</span></div>
                                <div className="option-grid">
                                    {Object.keys(placementMap).map(p => (
                                        <button
                                            key={p}
                                            className={`btn-pill ${customizerState.placement === p ? 'active' : ''}`}
                                            onClick={() => {
                                                clearPresetSelection();
                                                setCustomizerState(prev => ({ ...prev, placement: p }));
                                            }}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size Selection & Add to Cart */}
                            <div className="setting-group" style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                <div className="setting-title">Select Size & Purchase</div>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div className="customizer-size-select-wrapper" style={{ flex: '0 0 100px' }}>
                                        <select
                                            value={selectedSize}
                                            onChange={(e) => setSelectedSize(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                background: 'transparent',
                                                border: '1px solid rgba(255, 255, 255, 0.16)',
                                                color: 'inherit',
                                                fontFamily: 'inherit',
                                                fontSize: '0.88rem',
                                                cursor: 'pointer'
                                            }}
                                            className="customizer-size-select"
                                        >
                                            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(sz => (
                                                <option key={sz} value={sz} style={{ background: '#121315', color: '#fff' }}>{sz}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        style={{ flex: 1, padding: '12px 24px', fontWeight: '700' }}
                                        className="btn-primary"
                                        onClick={() => {
                                            const baseTee = products.find(p => p._id === 'prod_1') || {
                                                _id: 'prod_1',
                                                name: 'Obsidian Heavyweight Tee',
                                                price: 120,
                                                image: '/logo_tee_mockup.png'
                                            };
                                            const customSizeString = `${selectedSize} | Fabric: ${customizerState.fabric} | Signature: ${customizerState.logo} | Thread: ${customizerState.color} | Placement: ${customizerState.placement}`;
                                            addToCart({
                                                ...baseTee,
                                                size: customSizeString
                                            });
                                        }}
                                    >
                                        Add Custom Tee to Bag • $120
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- BRAND BOOK DETAILS --- */}
            <section id="brandbook" className="section-padding brandbook">
                <div className="container">
                    <div className="brandbook-layout">
                        <div className="brandbook-intro reveal-left">
                            <span className="accent-text">Brand Book excerpt</span>
                            <h2 className="section-title">The Omission Guidelines</h2>
                            <p className="philosophy-paragraph" style={{ marginBottom: 0 }}>
                                An internal guide outlining visual design systems, quality control metrics, and material standards that preserve the "thelogoless" identity across physical space.
                            </p>
                        </div>

                        <div className="accordion reveal-right">
                            {/* Accordion Item 1 */}
                            <div className={`accordion-item ${accordionOpen === 1 ? 'active' : ''}`}>
                                <div className="accordion-header" onClick={() => setAccordionOpen(accordionOpen === 1 ? 0 : 1)}>
                                    <h3 className="accordion-title">01 / Material Standards</h3>
                                    <span className="accordion-icon">+</span>
                                </div>
                                <div className="accordion-content">
                                    <p>We source raw fibers from sustainable, traceably verified family farms. Every thread and weave is optimized for maximum structural memory and natural texture.</p>
                                    <ul>
                                        <li>Heavyweight 320GSM certified organic Egyptian cotton (long-staple).</li>
                                        <li>Eco-friendly linen-blend spun and milled in small batches in Normandy, France.</li>
                                        <li>Raw Japanese selvedge denim woven on vintage shuttle looms in Okayama.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Accordion Item 2 */}
                            <div className={`accordion-item ${accordionOpen === 2 ? 'active' : ''}`}>
                                <div className="accordion-header" onClick={() => setAccordionOpen(accordionOpen === 2 ? 0 : 2)}>
                                    <h3 className="accordion-title">02 / Stitching & Architecture</h3>
                                    <span className="accordion-icon">+</span>
                                </div>
                                <div className="accordion-content">
                                    <p>Without printed branding, structural seams become the decorative voice of the garment. Every stitch line serves an ergonomic and visual purpose.</p>
                                    <ul>
                                        <li>Reinforced french seams with 12 stitches per inch to prevent fraying and structural distortion.</li>
                                        <li>Double-needle drop stitching on necklines for structural longevity.</li>
                                        <li>A singular offset lock-stitch at the rear hem signifying tailors' authenticity.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Accordion Item 3 */}
                            <div className={`accordion-item ${accordionOpen === 3 ? 'active' : ''}`}>
                                <div className="accordion-header" onClick={() => setAccordionOpen(accordionOpen === 3 ? 0 : 3)}>
                                    <h3 className="accordion-title">03 / The Omission Philosophy</h3>
                                    <span className="accordion-icon">+</span>
                                </div>
                                <div className="accordion-content">
                                    <p>Branding is not a display; it is an intimate conversation between the garment and its owner. We believe in quiet sophistication.</p>
                                    <ul>
                                        <li>No external branded graphics or words on outer surfaces.</li>
                                        <li>Physical tags should be easily removable, leaving no stitch scars on the garment.</li>
                                        <li>Tone-on-tone embroidery should never exceed 1cm in size.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="footer" id="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <div className="footer-logo">T H E L O G O L E S S</div>
                            <p className="footer-brand-desc">
                                A modern design project returning clothing to the purity of textiles, geometry, and quiet elegance. Made for the discerning individual.
                            </p>
                        </div>

                        <div>
                            <h4 className="footer-title">Navigation</h4>
                            <div className="footer-links">
                                <a href="#collection">Collection</a>
                                <a href="#concepts">Design Signatures</a>
                                <a href="#customizer">Brand Simulator</a>
                                <a href="#brandbook">Brand Book</a>
                            </div>
                        </div>

                        <div>
                            <h4 className="footer-title">Include Yourself</h4>
                            <p className="footer-brand-desc" style={{ marginBottom: '20px' }}>
                                Receive notification of private releases and visual essays. Understated updates, never spam.
                            </p>
                            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                                <div className="input-group">
                                    <input
                                        type="email"
                                        placeholder="EMAIL ADDRESS"
                                        value={newsletterEmail}
                                        onChange={(e) => setNewsletterEmail(e.target.value)}
                                        required
                                        aria-label="Email address for updates"
                                    />
                                    <button type="submit" className="submit-btn" aria-label="Submit email address">
                                        &#8594;
                                    </button>
                                </div>
                                <div className={`form-response-msg ${newsletterMsg ? 'active' : ''}`}>{newsletterMsg}</div>
                            </form>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <div>&copy; 2026 thelogoless. All rights observed.</div>
                        <div>Quiet Luxury Brand Suite</div>
                    </div>
                </div>
            </footer>

            {/* --- SLIDING SHOPPING CART DRAWER --- */}
            <div className={`cart-overlay ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)}></div>
            <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
                <div className="cart-drawer-header">
                    <h3>Shopping Cart</h3>
                    <button className="cart-close-btn" onClick={() => setCartOpen(false)} aria-label="Close cart">&times;</button>
                </div>

                <div className="cart-drawer-items">
                    {cart.length === 0 ? (
                        <div className="cart-empty-msg">Your wardrobe is empty.</div>
                    ) : (
                        cart.map(item => (
                            <div className="cart-item" key={`${item.product._id}-${item.size || 'default'}`}>
                                <img src={item.product.image} alt={item.product.name} className="cart-item-img" />
                                <div className="cart-item-info">
                                    <div className="cart-item-name">{item.product.name}</div>
                                    {item.size && (() => {
                                        const parsed = parseCustomizerSize(item.size);
                                        if (parsed) {
                                            return (
                                                <div className="cart-item-custom-details" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '4px 0' }}>
                                                    <div style={{ textTransform: 'uppercase', fontSize: '0.74rem', letterSpacing: '0.04em', color: 'var(--color-text-light)' }}>Size: <strong>{parsed.size}</strong></div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px', borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '8px' }}>
                                                        <span>Fabric: <em>{parsed.details.Fabric}</em></span>
                                                        <span>Signature: <em>{parsed.details.Signature}</em></span>
                                                        <span>Thread: <em>{parsed.details.Thread}</em></span>
                                                        <span>Placement: <em>{parsed.details.Placement}</em></span>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return <div className="cart-item-price">Size {item.size}</div>;
                                    })()}
                                    <div className="cart-item-price">${item.product.price}</div>
                                    <div className="cart-item-qty">
                                        <button className="qty-btn" onClick={() => updateCartQty(item.product._id, item.size, -1)}>-</button>
                                        <span className="qty-num">{item.quantity}</span>
                                        <button className="qty-btn" onClick={() => updateCartQty(item.product._id, item.size, 1)}>+</button>
                                    </div>
                                    <button className="cart-remove-btn" onClick={() => removeFromCart(item.product._id, item.size)}>Remove</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-drawer-footer">
                        <div className="cart-total-row">
                            <span>Subtotal</span>
                            <span>${subtotal}</span>
                        </div>
                        <button
                            className="btn-primary checkout-btn"
                            onClick={() => {
                                setCartOpen(false);
                                setCheckoutSuccess(false);
                                if (currentUser) {
                                    setCheckoutForm(prev => ({
                                        ...prev,
                                        name: prev.name || currentUser.name || '',
                                        email: prev.email || currentUser.email || ''
                                    }));
                                }
                                setCheckoutOpen(true);
                            }}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>

            {/* --- ACCOUNT MODAL --- */}
            <div className={`auth-modal-overlay ${accountOpen ? 'open' : ''}`} onClick={() => setAccountOpen(false)}>
                <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="auth-close-btn" type="button" onClick={() => setAccountOpen(false)} aria-label="Close account modal">&times;</button>

                    {currentUser && authMode === 'account' ? (
                        <>
                            <h3>Account</h3>
                            <p className="auth-modal-sub">{currentUser.name}</p>
                            <div className="account-panel">
                                <div>
                                    <span>Email</span>
                                    <strong>{currentUser.email}</strong>
                                </div>
                                <div>
                                    <span>Role</span>
                                    <strong>{currentUser.role}</strong>
                                </div>
                            </div>
                            <div className="auth-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                <button type="button" className="btn-secondary" style={{ flex: '1 1 auto' }} onClick={() => setAccountOpen(false)}>Close</button>
                                <button type="button" className="btn-secondary" style={{ flex: '1 1 auto' }} onClick={() => { setAccountOpen(false); navigateTo('/orders'); }}>Orders</button>
                                {currentUser.role === 'admin' && (
                                    <button type="button" className="btn-secondary" style={{ flex: '1 1 auto', border: '1px solid var(--color-accent-gold)', color: 'var(--color-accent-gold)' }} onClick={() => { setAccountOpen(false); navigateTo('/admin'); }}>Admin</button>
                                )}
                                <button type="button" className="btn-primary" style={{ flex: '1 1 100%' }} onClick={handleLogout}>Logout</button>
                            </div>
                            <div className={`form-response-msg ${authMessage ? 'active' : ''}`}>{authMessage}</div>
                        </>
                    ) : (
                        <>
                            <h3>{authMode === 'signup' ? 'Create Account' : 'Login'}</h3>
                            <p className="auth-modal-sub">
                                {authMode === 'signup' ? 'Create your private wardrobe account.' : 'Access your private wardrobe account.'}
                            </p>
                            <div className="auth-tabs">
                                <button
                                    type="button"
                                    className={authMode === 'login' ? 'active' : ''}
                                    onClick={() => {
                                        setAuthMode('login');
                                        setAuthMessage('');
                                    }}
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    className={authMode === 'signup' ? 'active' : ''}
                                    onClick={() => {
                                        setAuthMode('signup');
                                        setAuthMessage('');
                                    }}
                                >
                                    Signup
                                </button>
                            </div>
                            <form className="auth-form" onSubmit={handleAuthSubmit}>
                                {authMode === 'signup' && (
                                    <div className="form-group">
                                        <label htmlFor="auth-name">Full Name</label>
                                        <input
                                            type="text"
                                            id="auth-name"
                                            required
                                            value={authForm.name}
                                            onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label htmlFor="auth-email">Email Address</label>
                                    <input
                                        type="email"
                                        id="auth-email"
                                        required
                                        value={authForm.email}
                                        onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="auth-password">Password</label>
                                    <input
                                        type="password"
                                        id="auth-password"
                                        required
                                        minLength={6}
                                        value={authForm.password}
                                        onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                                    />
                                </div>
                                <button type="submit" className="btn-primary" disabled={authLoading}>
                                    {authLoading ? 'Please Wait' : authMode === 'signup' ? 'Create Account' : 'Login'}
                                </button>
                                <div className={`form-response-msg ${authMessage ? 'active' : ''}`}>{authMessage}</div>
                            </form>
                        </>
                    )}
                </div>
            </div>

            {/* --- DYNAMIC CHECKOUT MODAL --- */}
            <div className={`checkout-modal-overlay ${checkoutOpen ? 'open' : ''}`}>
                <div className="checkout-modal">
                    {!checkoutLoading && !checkoutSuccess ? (
                        <>
                            <h3>Checkout</h3>
                            <p className="checkout-modal-sub">Secure your place in absence.</p>
                            <form className="checkout-form" onSubmit={handleCheckoutSubmit}>
                                <div className="form-group">
                                    <label htmlFor="chk-name">Full Name</label>
                                    <input
                                        type="text"
                                        id="chk-name"
                                        required
                                        value={checkoutForm.name}
                                        onChange={(e) => setCheckoutForm(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="chk-email">Email Address</label>
                                    <input
                                        type="email"
                                        id="chk-email"
                                        required
                                        value={checkoutForm.email}
                                        onChange={(e) => setCheckoutForm(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="chk-location">Shipping City</label>
                                    <input
                                        type="text"
                                        id="chk-location"
                                        required
                                        value={checkoutForm.location}
                                        onChange={(e) => setCheckoutForm(prev => ({ ...prev, location: e.target.value }))}
                                    />
                                </div>
                                <div className="checkout-total-row">
                                    <span>Total Due</span>
                                    <span>${subtotal}</span>
                                </div>
                                <div className="checkout-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setCheckoutOpen(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary">Submit Order</button>
                                </div>
                            </form>
                        </>
                    ) : checkoutLoading ? (
                        <div className="checkout-loading">
                            <div className="spinner"></div>
                            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-accent-gold)' }}>
                                Registering Absence...
                            </p>
                        </div>
                    ) : (
                        <div className="checkout-success-msg">
                            <h4>Order Confirmed</h4>
                            <p style={{ marginBottom: '25px' }}>Your wardrobe has been updated. Your shipping allocation is registered.</p>
                            <button className="btn-primary" onClick={() => setCheckoutOpen(false)}>Complete</button>
                        </div>
                    )}
                </div>
            </div>

            {/* --- PRODUCT DETAILS MODAL --- */}
            {selectedHeroProduct && (
                <div className="look-modal-overlay" onClick={() => setSelectedHeroProduct(null)}>
                    <div className="look-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="look-modal-close" onClick={() => setSelectedHeroProduct(null)}>&times;</button>
                        <div className="look-modal-grid">
                            {/* Left: Image Pane */}
                            <div className="look-modal-image-pane">
                                <img src={selectedHeroProduct.image} alt={selectedHeroProduct.name} className="look-modal-img" />
                            </div>
                            {/* Right: Details Pane */}
                            <div className="look-modal-details-pane">
                                <span className="look-modal-category">{selectedHeroProduct.category}</span>
                                <h3 className="look-modal-title">{selectedHeroProduct.name}</h3>
                                <div className="look-modal-price">${selectedHeroProduct.price}</div>
                                <div className="look-modal-divider"></div>

                                <p className="look-modal-desc">{selectedHeroProduct.description}</p>
                                <p className="look-modal-material">Material: <strong>{selectedHeroProduct.material}</strong></p>

                                {/* Sizes Selection */}
                                <div className="look-modal-sizes">
                                    <span className="look-modal-section-title">Select Size</span>
                                    <div className="size-options-grid">
                                        {selectedHeroProduct.sizes.map(sz => (
                                            <button
                                                key={sz}
                                                className={`size-btn ${selectedSize === sz ? 'active' : ''}`}
                                                onClick={() => setSelectedSize(sz)}
                                            >
                                                {sz}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="look-modal-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button
                                            className="btn-primary"
                                            style={{ flex: 1 }}
                                            onClick={() => {
                                                const productToCart = {
                                                    ...selectedHeroProduct,
                                                    _id: selectedHeroProduct.id,
                                                    name: selectedHeroProduct.name,
                                                    size: selectedSize
                                                };
                                                addToCart(productToCart);
                                                setSelectedHeroProduct(null);
                                            }}
                                        >
                                            Add To Cart
                                        </button>
                                        <button
                                            className="btn-secondary"
                                            style={{ flex: 1, color: 'var(--color-text-light)', border: '1px solid var(--color-border-dark)' }}
                                            onClick={() => {
                                                const productToCart = {
                                                    ...selectedHeroProduct,
                                                    _id: selectedHeroProduct.id,
                                                    name: selectedHeroProduct.name,
                                                    size: selectedSize
                                                };
                                                handleQuickBuy(productToCart);
                                                setSelectedHeroProduct(null);
                                            }}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                    <button
                                        className="btn-secondary"
                                        style={{ width: '100%', borderColor: 'var(--color-accent-gold)', color: 'var(--color-accent-gold)' }}
                                        onClick={() => {
                                            setSelectedHeroProduct(null);
                                            const customizerSection = document.getElementById('customizer');
                                            if (customizerSection) {
                                                customizerSection.scrollIntoView({ behavior: 'smooth' });
                                            }
                                            // Adapt customizer fabric color based on product
                                            let fabricColor = 'obsidian';
                                            if (selectedHeroProduct.id === 'hero_3' || selectedHeroProduct.id === 'hero_7' || selectedHeroProduct.id === 'hero_8') {
                                                fabricColor = 'cream';
                                            } else if (selectedHeroProduct.id === 'hero_2' || selectedHeroProduct.id === 'hero_6') {
                                                fabricColor = 'sage';
                                            } else if (selectedHeroProduct.id === 'hero_9' || selectedHeroProduct.id === 'hero_10') {
                                                fabricColor = 'bronze';
                                            }
                                            setCustomizerState(prev => ({
                                                ...prev,
                                                fabric: fabricColor
                                            }));
                                        }}
                                    >
                                        Simulate Brand Signature
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isShopRoute && (
                <section className={storefrontRouteTransitionClass}>
                    <div className="storefront-utility-bar">
                        <button className="storefront-utility-btn" type="button" onClick={() => navigateTo('/')}>Home</button>
                        <div className="storefront-utility-center">Shop</div>
                        <button className="storefront-utility-btn" type="button" onClick={() => setCartOpen(true)}>Bag ({cartCount})</button>
                    </div>
                    <div className="storefront-route-shell storefront-route-shell-listing">
                        <div className={`storefront-layout storefront-layout-full ${filterDrawerOpen ? '' : 'filters-collapsed'}`}>
                            <aside className="storefront-sidebar">
                                <div className="storefront-filter-header">
                                    <button
                                        className="storefront-filter-menu-btn"
                                        type="button"
                                        aria-label={filterDrawerOpen ? 'Minimize filters' : 'Open filters'}
                                        onClick={() => setFilterDrawerOpen((prev) => !prev)}
                                    >
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </button>
                                    <strong>Filters</strong>
                                    {activeFilterCount > 0 && <em>{activeFilterCount}</em>}
                                </div>
                                <div className="storefront-filter-list">
                                    {storefrontFilterGroups.map((filter) => (
                                        <div className={`storefront-filter-group ${openStoreFilters[filter.key] ? 'open' : ''}`} key={filter.key}>
                                            <button
                                                className="storefront-filter-item"
                                                type="button"
                                                onClick={() => setOpenStoreFilters((prev) => ({
                                                    ...prev,
                                                    [filter.key]: !prev[filter.key]
                                                }))}
                                            >
                                                <span>{filter.label}</span>
                                                <span>{openStoreFilters[filter.key] ? '−' : '+'}</span>
                                            </button>
                                            {openStoreFilters[filter.key] && (
                                                <div className="storefront-filter-options">
                                                    {filter.options.map((option) => {
                                                        const selected = (filterDraft[filter.key] || []).includes(option);
                                                        return (
                                                            <button
                                                                key={option}
                                                                type="button"
                                                                className={`storefront-filter-option ${selected ? 'selected' : ''}`}
                                                                onClick={() => toggleFilterOption(filter.key, option)}
                                                            >
                                                                {option}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="storefront-sidebar-actions">
                                    <button className="storefront-clear-btn" type="button" onClick={clearStoreFilters}>Clear</button>
                                    <button className="storefront-apply-btn" type="button" onClick={() => setAppliedFilters(filterDraft)}>Apply</button>
                                </div>
                            </aside>

                            <div className="storefront-main storefront-main-full">
                                <div className="storefront-toolbar">
                                    <button
                                        className="storefront-mobile-filter-btn"
                                        type="button"
                                        aria-label="Toggle filters"
                                        onClick={() => setFilterDrawerOpen((prev) => !prev)}
                                    >
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </button>
                                    <div>
                                        <span className="accent-text">Featured Edit</span>
                                        <h3>{listingTitle}</h3>
                                    </div>
                                    <div className="storefront-search-container">
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            className="storefront-search-input"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            aria-label="Search products"
                                        />
                                        {searchQuery && (
                                            <button
                                                className="storefront-search-clear"
                                                type="button"
                                                onClick={() => setSearchQuery('')}
                                                aria-label="Clear search"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                    <select
                                        className="storefront-sort"
                                        value={sortMode}
                                        onChange={(event) => setSortMode(event.target.value)}
                                        aria-label="Sort products"
                                    >
                                        <option>Featured</option>
                                        <option>Newest</option>
                                        <option>Price Low</option>
                                        <option>Price High</option>
                                    </select>
                                </div>

                                <div className="storefront-category-row">
                                    {storefrontCategories.map((category) => (
                                        <button
                                            key={category}
                                            type="button"
                                            className={`storefront-category-chip ${selectedStoreCategory === category ? 'active' : ''}`}
                                            onClick={() => setSelectedStoreCategory(category)}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>

                                <div className="storefront-product-grid storefront-product-grid-full">
                                    {filteredStoreProducts.length > 0 ? filteredStoreProducts.map((product) => (
                                        <article
                                            key={product.id}
                                            className={`store-card ${selectedStoreProduct.id === product.id ? 'active' : ''}`}
                                            onClick={() => openStorefrontDetail(product)}
                                        >
                                            <div className="store-card-image-wrap">
                                                <img src={product.image} alt={product.name} className="store-card-image" />
                                                <button type="button" className="store-card-heart" aria-label={`Save ${product.name}`}>
                                                    ♡
                                                </button>
                                            </div>
                                            <div className="store-card-meta">
                                                <h4>{product.name}</h4>
                                                <p>{product.material}</p>
                                                <div className="store-card-price-row">
                                                    <span className="store-card-compare">₹{Math.round(product.price * 1.35)}</span>
                                                    <strong>₹{product.price}</strong>
                                                </div>
                                            </div>
                                        </article>
                                    )) : (
                                        <div className="storefront-empty-state">
                                            <h4>No products found</h4>
                                            <p>Clear filters or choose another category.</p>
                                            <button type="button" onClick={clearStoreFilters}>Clear filters</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {isProductRoute && routeProduct && (
                <section className={storefrontRouteTransitionClass}>
                    <div className="storefront-utility-bar">
                        <button className="storefront-utility-btn" type="button" onClick={() => navigateTo('/shop')}>Back</button>
                        <div className="storefront-utility-center">{routeProduct.name}</div>
                        <button className="storefront-utility-btn" type="button" onClick={() => setCartOpen(true)}>Bag ({cartCount})</button>
                    </div>
                    <div className="storefront-route-shell storefront-route-shell-detail">
                        <div className="storefront-detail-shell storefront-detail-shell-full">
                            <div className="storefront-detail-grid">
                                <div className="storefront-gallery-column">
                                    <div className="storefront-thumb-rail">
                                        {(selectedStoreProduct.gallery || [selectedStoreProduct.image]).map((imgSrc, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                className={`storefront-thumb ${selectedStoreImage === imgSrc ? 'active' : ''}`}
                                                onClick={() => setSelectedStoreImage(imgSrc)}
                                            >
                                                <img src={imgSrc} alt={`${selectedStoreProduct.name} view ${idx + 1}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="storefront-main-image-frame">
                                        <img src={selectedStoreImage} alt={selectedStoreProduct.name} className="storefront-main-image" />
                                    </div>
                                </div>

                                <div className="storefront-detail-panel">
                                    <div className="storefront-detail-header">
                                        <div>
                                            <span className="storefront-detail-kicker">{selectedStoreProduct.category}</span>
                                            <h3>{selectedStoreProduct.name}</h3>
                                        </div>
                                        <div className="storefront-price-block">
                                            <span>₹{Math.round(selectedStoreProduct.price * 1.35)}</span>
                                            <strong>₹{selectedStoreProduct.price}</strong>
                                        </div>
                                    </div>

                                    <p className="storefront-detail-copy">{selectedStoreProduct.description}</p>

                                    {/* --- INTERACTIVE COUPON CODE SECTION --- */}
                                    <div className="detail-coupon-section">
                                        <div className="coupon-card" onClick={() => handleCopyCode('TRYSNITCH5')}>
                                            <div className="coupon-details">
                                                <span className="coupon-title">TRYSNITCH5</span>
                                                <p className="coupon-desc">Enjoy 5% off on your first order</p>
                                            </div>
                                            <button className="coupon-copy-btn" type="button">
                                                {copiedCode === 'TRYSNITCH5' ? 'COPIED!' : 'COPY'}
                                            </button>
                                        </div>
                                        <div className="coupon-card" onClick={() => handleCopyCode('NEW10')}>
                                            <div className="coupon-details">
                                                <span className="coupon-title">NEW10</span>
                                                <p className="coupon-desc">Enjoy 10% off on all fresh arrivals</p>
                                            </div>
                                            <button className="coupon-copy-btn" type="button">
                                                {copiedCode === 'NEW10' ? 'COPIED!' : 'COPY'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="storefront-detail-section">
                                        <div className="storefront-section-label">COLORS / STYLES</div>
                                        <div className="storefront-color-swatches">
                                            {heroSlidesData
                                                .filter(p => p.category === selectedStoreProduct.category)
                                                .slice(0, 4)
                                                .map((product) => (
                                                    <button
                                                        key={product.id}
                                                        type="button"
                                                        className={`storefront-swatch-card ${selectedStoreProduct.id === product.id ? 'active' : ''}`}
                                                        onClick={() => {
                                                            openStorefrontDetail(product);
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }}
                                                        title={product.name}
                                                    >
                                                        <img src={product.image} alt={product.name} />
                                                    </button>
                                                ))}
                                        </div>
                                    </div>

                                    <div className="storefront-detail-section">
                                        <div className="storefront-size-row">
                                            <span className="storefront-section-label">SIZES</span>
                                            <span className="storefront-size-chart" onClick={() => alert('Size Chart: Standard sizes S through XXL, regular tailored fit.')}>SIZE CHART</span>
                                        </div>
                                        <div className="storefront-size-grid">
                                            {selectedStoreProduct.sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    className={`storefront-size-btn ${selectedStoreSize === size ? 'active' : ''}`}
                                                    onClick={() => setSelectedStoreSize(size)}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="storefront-delivery-note">Free 1-2 day delivery on premium pin codes</p>
                                    </div>

                                    <div className="storefront-cta-stack">
                                        <button
                                            className="storefront-primary-cta"
                                            type="button"
                                            onClick={() => addToCart({
                                                ...selectedStoreProduct,
                                                _id: selectedStoreProduct.id,
                                                name: selectedStoreProduct.name,
                                                size: selectedStoreSize
                                            })}
                                        >
                                            Add To Bag
                                        </button>
                                        <button
                                            className="storefront-secondary-cta"
                                            type="button"
                                            onClick={() => {
                                                setSelectedSize(selectedStoreSize);
                                                setSelectedHeroProduct(selectedStoreProduct);
                                            }}
                                        >
                                            Open Quick View
                                        </button>
                                    </div>

                                    <div className="storefront-accordion-list">
                                        {productDetailAccordions.map((item) => (
                                            <div className="storefront-accordion-item" key={item.title}>
                                                <button
                                                    type="button"
                                                    className="storefront-accordion-trigger"
                                                    onClick={() => setStoreAccordionOpen((prev) => prev === item.title ? '' : item.title)}
                                                >
                                                    <span>{item.title}</span>
                                                    <span>{storeAccordionOpen === item.title ? '−' : '+'}</span>
                                                </button>
                                                {storeAccordionOpen === item.title && (
                                                    <p className="storefront-accordion-body">{item.body}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>

                            <div className="storefront-recommendations">
                                <h3>YOU MAY ALSO LIKE</h3>
                                <div className="storefront-recommendation-grid">
                                    {relatedStoreProducts.map((product) => (
                                        <article
                                            key={product.id}
                                            className="storefront-recommendation-card"
                                            onClick={() => openStorefrontDetail(product)}
                                        >
                                            <div className="storefront-recommendation-image-wrap">
                                                <img src={product.image} alt={product.name} />
                                                <button type="button" className="store-card-heart" aria-label={`Save ${product.name}`}>
                                                    ♡
                                                </button>
                                            </div>
                                            <h4>{product.name}</h4>
                                            <div className="store-card-price-row" style={{ marginTop: '4px' }}>
                                                <span className="store-card-compare" style={{ fontSize: '0.84rem' }}>₹{Math.round(product.price * 1.35)}</span>
                                                <strong style={{ fontSize: '0.94rem' }}>₹{product.price}</strong>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {isOrdersRoute && (
                <section className="storefront-route-layer orders-route-layer">
                    <div className="storefront-utility-bar">
                        <button className="storefront-utility-btn" type="button" onClick={() => navigateTo('/')}>Home</button>
                        <div className="storefront-utility-center">Order History</div>
                        <button className="storefront-utility-btn" type="button" onClick={() => setCartOpen(true)}>Bag ({cartCount})</button>
                    </div>

                    <div className="storefront-route-shell" style={{ padding: '40px 24px' }}>
                        <div className="container" style={{ maxWidth: '800px' }}>
                            <h2 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em', marginBottom: '8px' }}>YOUR Wardrobe orders</h2>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px', fontSize: '0.9rem' }}>Review your registered orders and tracking statuses.</p>

                            {!authToken ? (
                                <div style={{ textAlign: 'center', padding: '48px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                                    <p style={{ marginBottom: '20px', color: 'var(--color-text-muted)' }}>You must be logged in to view your order history.</p>
                                    <button className="btn-primary" onClick={() => openAccountModal('login')}>Log In</button>
                                </div>
                            ) : ordersLoading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                                    <div className="spinner"></div>
                                </div>
                            ) : ordersList.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '48px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>No orders found in your archive.</p>
                                    <button className="btn-primary" onClick={() => navigateTo('/shop')}>Visit Shop</button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {ordersList.map(order => (
                                        <div key={order._id} className="order-history-card" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', padding: '24px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px', marginBottom: '16px' }}>
                                                <div>
                                                    <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>Order ID</span>
                                                    <div style={{ fontFamily: 'monospace', fontSize: '0.84rem', fontWeight: 'bold' }}>{order._id}</div>
                                                </div>
                                                <div>
                                                    <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>Placed On</span>
                                                    <div style={{ fontSize: '0.88rem' }}>{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</div>
                                                </div>
                                                <div>
                                                    <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>Status</span>
                                                    <div>
                                                        <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {order.items.map((item, idx) => {
                                                    const parsed = parseCustomizerSize(item.size);
                                                    return (
                                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                                                            <div>
                                                                <strong style={{ color: 'var(--color-text-light)' }}>{item.name}</strong>
                                                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginLeft: '12px' }}>
                                                                    Qty: {item.quantity}
                                                                </span>
                                                                {parsed ? (
                                                                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px', paddingLeft: '8px', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                                                                        Size: {parsed.size} | {parsed.details.Fabric} | {parsed.details.Signature} | {parsed.details.Thread}
                                                                    </div>
                                                                ) : item.size ? (
                                                                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                                                                        Size: {item.size}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                            <div style={{ fontWeight: 'bold' }}>${item.price * item.quantity}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', marginTop: '16px', alignItems: 'center' }}>
                                                <div>
                                                    <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Ship To</span>
                                                    <div style={{ fontSize: '0.88rem' }}>{order.customerName} — {order.location}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Total Amount</span>
                                                    <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent-gold)', fontWeight: 'bold' }}>${order.total}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {isAdminRoute && (
                <section className="storefront-route-layer admin-route-layer">
                    <div className="storefront-utility-bar">
                        <button className="storefront-utility-btn" type="button" onClick={() => navigateTo('/')}>Home</button>
                        <div className="storefront-utility-center">Admin Control Panel</div>
                        <div />
                    </div>

                    {currentUser?.role !== 'admin' ? (
                        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                            <div className="container" style={{ maxWidth: '600px', border: '1px solid rgba(255,255,255,0.08)', padding: '48px', background: 'rgba(255,255,255,0.01)', margin: '0 auto' }}>
                                <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent-gold)', marginBottom: '16px' }}>Access Denied</h2>
                                <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>This area is reserved for authenticated administrators only.</p>
                                <button className="btn-primary" onClick={() => { navigateTo('/'); openAccountModal('login'); }}>Admin Login</button>
                            </div>
                        </div>
                    ) : (
                        <div className="storefront-route-shell" style={{ padding: '40px 24px' }}>
                            <div className="container" style={{ maxWidth: '1200px' }}>
                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
                                    <div>
                                        <h2 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em', marginBottom: '8px' }}>THELOGOLESS BACKOFFICE</h2>
                                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>Welcome back, {currentUser.name}. Manage inventory, orders, and subscriptions.</p>
                                    </div>
                                    {adminTab === 'products' && (
                                        <button 
                                            className="btn-primary" 
                                            onClick={() => {
                                                setEditingProduct(null);
                                                setProductForm({ name: '', category: 'T-SHIRTS', price: '', material: '', description: '', image: '/logo_tee_mockup.png', sizes: 'S, M, L, XL', stock: 10 });
                                                setProductModalOpen(true);
                                            }}
                                            style={{ padding: '10px 20px', fontSize: '0.8rem', letterSpacing: '0.08em' }}
                                        >
                                            + Add Product
                                        </button>
                                    )}
                                </div>

                                {/* Tabs Navigation */}
                                <div className="admin-tabs" style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '32px', paddingBottom: '8px' }}>
                                    <button 
                                        className={`admin-tab-btn ${adminTab === 'orders' ? 'active' : ''}`} 
                                        onClick={() => setAdminTab('orders')}
                                        style={{ background: 'none', border: 'none', color: adminTab === 'orders' ? 'var(--color-accent-gold)' : 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', padding: '8px 16px', borderBottom: adminTab === 'orders' ? '2px solid var(--color-accent-gold)' : 'none' }}
                                    >
                                        Orders ({adminOrders.length})
                                    </button>
                                    <button 
                                        className={`admin-tab-btn ${adminTab === 'products' ? 'active' : ''}`} 
                                        onClick={() => setAdminTab('products')}
                                        style={{ background: 'none', border: 'none', color: adminTab === 'products' ? 'var(--color-accent-gold)' : 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', padding: '8px 16px', borderBottom: adminTab === 'products' ? '2px solid var(--color-accent-gold)' : 'none' }}
                                    >
                                        Products ({products.length})
                                    </button>
                                    <button 
                                        className={`admin-tab-btn ${adminTab === 'newsletter' ? 'active' : ''}`} 
                                        onClick={() => setAdminTab('newsletter')}
                                        style={{ background: 'none', border: 'none', color: adminTab === 'newsletter' ? 'var(--color-accent-gold)' : 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', padding: '8px 16px', borderBottom: adminTab === 'newsletter' ? '2px solid var(--color-accent-gold)' : 'none' }}
                                    >
                                        Subscribers ({adminSubs.length})
                                    </button>
                                </div>

                                {/* Orders Tab content */}
                                {adminTab === 'orders' && (
                                    adminOrdersLoading ? (
                                        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}><div className="spinner"></div></div>
                                    ) : adminOrders.length === 0 ? (
                                        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '48px' }}>No orders found.</p>
                                    ) : (
                                        <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
                                            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                                                <thead>
                                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text-light)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        <th style={{ padding: '12px' }}>Order ID</th>
                                                        <th style={{ padding: '12px' }}>Customer</th>
                                                        <th style={{ padding: '12px' }}>Items</th>
                                                        <th style={{ padding: '12px' }}>Total</th>
                                                        <th style={{ padding: '12px' }}>Status</th>
                                                        <th style={{ padding: '12px' }}>Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {adminOrders.map(order => (
                                                        <tr key={order._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.88rem' }}>
                                                            <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '0.78rem' }}>{order._id}</td>
                                                            <td style={{ padding: '12px' }}>
                                                                <div style={{ fontWeight: 'bold', color: 'var(--color-text-light)' }}>{order.customerName}</div>
                                                                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{order.customerEmail}</div>
                                                                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{order.location}</div>
                                                            </td>
                                                            <td style={{ padding: '12px' }}>
                                                                {order.items.map((item, idx) => {
                                                                    const parsed = parseCustomizerSize(item.size);
                                                                    return (
                                                                        <div key={idx} style={{ margin: '4px 0', fontSize: '0.8rem' }}>
                                                                            • {item.name} x {item.quantity} 
                                                                            {parsed ? (
                                                                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.74rem', display: 'block', paddingLeft: '8px' }}>
                                                                                    [{parsed.size} | {parsed.details.Fabric} | {parsed.details.Signature}]
                                                                                </span>
                                                                            ) : item.size ? (
                                                                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.74rem' }}> [{item.size}]</span>
                                                                            ) : null}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </td>
                                                            <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--color-accent-gold)' }}>${order.total}</td>
                                                            <td style={{ padding: '12px' }}>
                                                                <select
                                                                    value={order.status}
                                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                                    style={{
                                                                        padding: '6px 10px',
                                                                        background: '#121315',
                                                                        border: '1px solid rgba(255,255,255,0.12)',
                                                                        color: '#fff',
                                                                        fontSize: '0.78rem',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
                                                                        <option key={st} value={st}>{st}</option>
                                                                    ))}
                                                                </select>
                                                            </td>
                                                            <td style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                                                {new Date(order.createdAt).toLocaleDateString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                )}

                                {/* Products Tab content */}
                                {adminTab === 'products' && (
                                    <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
                                        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text-light)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    <th style={{ padding: '12px' }}>Image</th>
                                                    <th style={{ padding: '12px' }}>Product Details</th>
                                                    <th style={{ padding: '12px' }}>Category</th>
                                                    <th style={{ padding: '12px' }}>Price</th>
                                                    <th style={{ padding: '12px' }}>Stock</th>
                                                    <th style={{ padding: '12px' }}>Status</th>
                                                    <th style={{ padding: '12px' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.map(product => (
                                                    <tr key={product._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.88rem', opacity: product.active === false ? 0.5 : 1 }}>
                                                        <td style={{ padding: '12px' }}>
                                                            <img src={product.image} alt={product.name} style={{ width: '40px', height: '52px', objectFit: 'cover' }} />
                                                        </td>
                                                        <td style={{ padding: '12px' }}>
                                                            <div style={{ fontWeight: 'bold', color: 'var(--color-text-light)' }}>{product.name}</div>
                                                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '300px' }}>{product.material}</div>
                                                        </td>
                                                        <td style={{ padding: '12px', fontSize: '0.8rem', textTransform: 'uppercase' }}>{product.category}</td>
                                                        <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--color-text-light)' }}>${product.price}</td>
                                                        <td style={{ padding: '12px' }}>{product.stock || 0} items</td>
                                                        <td style={{ padding: '12px' }}>
                                                            <span className={`status-badge status-${product.active !== false ? 'delivered' : 'cancelled'}`} style={{ fontSize: '0.7rem' }}>
                                                                {product.active !== false ? 'Active' : 'Archived'}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '12px' }}>
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <button
                                                                    type="button"
                                                                    className="btn-secondary"
                                                                    onClick={() => triggerEditProduct(product)}
                                                                    style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn-secondary"
                                                                    onClick={() => handleProductActiveToggle(product._id, product.active !== false)}
                                                                    style={{ padding: '4px 8px', fontSize: '0.74rem', borderColor: product.active !== false ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)', color: product.active !== false ? 'rgba(239, 68, 68, 0.8)' : 'rgba(16, 185, 129, 0.8)' }}
                                                                >
                                                                    {product.active !== false ? 'Archive' : 'Restore'}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Newsletter Subscribers Tab */}
                                {adminTab === 'newsletter' && (
                                    adminSubsLoading ? (
                                        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}><div className="spinner"></div></div>
                                    ) : adminSubs.length === 0 ? (
                                        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '48px' }}>No subscribers found.</p>
                                    ) : (
                                        <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
                                            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                                                <thead>
                                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text-light)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        <th style={{ padding: '12px' }}>Subscriber Email</th>
                                                        <th style={{ padding: '12px' }}>Date Registered</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {adminSubs.map((sub, idx) => (
                                                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.88rem' }}>
                                                            <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--color-text-light)' }}>{sub.email}</td>
                                                            <td style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                                                                {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleString() : 'N/A'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* --- ADMIN PRODUCT ADD/EDIT MODAL --- */}
            {productModalOpen && (
                <div className="auth-modal-overlay open" onClick={() => setProductModalOpen(false)}>
                    <div className="auth-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <button className="auth-close-btn" type="button" onClick={() => setProductModalOpen(false)}>&times;</button>
                        <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                        <p className="auth-modal-sub">Define clothing specifications</p>

                        <form className="auth-form" onSubmit={handleSaveProduct}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={productForm.name}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={productForm.category}
                                        onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                                        style={{ padding: '10px', background: '#121315', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', width: '100%' }}
                                    >
                                        {['SHIRTS', 'JEANS', 'T-SHIRTS', 'POLOS', 'PLUS-SIZE', 'TROUSERS', 'SHORTS', 'ACCESSORIES'].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Price ($)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={productForm.price}
                                        onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Material Composition</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 320GSM Organic Giza Cotton"
                                    value={productForm.material}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, material: e.target.value }))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={productForm.description}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                                    style={{ width: '100%', minHeight: '80px', padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'inherit', fontFamily: 'inherit' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                                <div className="form-group">
                                    <label>Available Sizes (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={productForm.sizes}
                                        onChange={(e) => setProductForm(prev => ({ ...prev, sizes: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Stock Level</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={productForm.stock}
                                        onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Image Path / URL</label>
                                <input
                                    type="text"
                                    value={productForm.image}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                                />
                            </div>

                            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px', padding: '12px' }}>
                                {editingProduct ? 'Update Product Specifications' : 'Publish Product to Store'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
