// ============================================
// Sajhnaa — Jewelry Product Catalog
// ============================================

export const products = [
    // RINGS
    {
        id: 1,
        name: 'Eternal Solitaire Ring',
        category: 'rings',
        price: 45999,
        originalPrice: 52999,
        rating: 4.9,
        reviews: 234,
        image: 'https://images.unsplash.com/photo-1605100804763-047af5fef207?q=80&w=1000&auto=format&fit=crop',
        colors: ['#FFD700', '#C0C0C0', '#E8B4B8'],
        colorNames: ['Yellow Gold', 'White Gold', 'Rose Gold'],
        sizes: ['5', '6', '7', '8', '9'],
        description: 'A timeless solitaire diamond ring set in 18K gold. The brilliant-cut diamond catches light from every angle, symbolizing eternal love and commitment.',
        features: ['18K Hallmarked Gold', 'IGI Certified Diamond', '0.5 Carat Brilliant Cut', 'VVS1 Clarity', 'Lifetime Exchange Policy'],
        material: '18K Gold with Natural Diamond',
        badge: 'Bestseller',
        modelPath: '/models/ring.glb',
    },
    {
        id: 2,
        name: 'Twisted Infinity Band',
        category: 'rings',
        price: 18999,
        originalPrice: 22999,
        rating: 4.7,
        reviews: 189,
        image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?q=80&w=1000&auto=format&fit=crop',
        colors: ['#E8B4B8', '#FFD700'],
        colorNames: ['Rose Gold', 'Yellow Gold'],
        sizes: ['5', '6', '7', '8', '9'],
        description: 'An elegant twisted infinity band symbolizing never-ending love. Delicate pavé diamonds add sparkle to this modern classic.',
        features: ['14K Hallmarked Gold', 'Natural Diamonds', 'Pavé Setting', 'Comfort Fit', 'BIS Hallmarked'],
        material: '14K Gold with Diamond Pavé',
        badge: 'Trending',
        modelPath: '/models/band.glb',
    },

    // NECKLACES
    {
        id: 3,
        name: 'Celestial Pendant Necklace',
        category: 'necklaces',
        price: 32999,
        originalPrice: 38999,
        rating: 4.8,
        reviews: 312,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
        colors: ['#FFD700', '#C0C0C0', '#E8B4B8'],
        colorNames: ['Yellow Gold', 'White Gold', 'Rose Gold'],
        sizes: ['16"', '18"', '20"'],
        description: 'A celestial-inspired pendant with a brilliant diamond star, suspended on a delicate chain. Perfect for everyday elegance.',
        features: ['18K Hallmarked Gold', 'Natural Diamond Pendant', 'Adjustable Chain Length', 'Lobster Clasp', 'Gift Box Included'],
        material: '18K Gold with Diamond',
        badge: 'New Arrival',
        modelPath: '/models/necklace.glb',
    },
    {
        id: 4,
        name: 'Layered Pearl Chain',
        category: 'necklaces',
        price: 15999,
        originalPrice: 19999,
        rating: 4.6,
        reviews: 167,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop',
        colors: ['#FFD700', '#C0C0C0'],
        colorNames: ['Yellow Gold', 'White Gold'],
        sizes: ['16"', '18"'],
        description: 'A sophisticated multi-layered necklace featuring freshwater pearls on delicate gold chains. Effortless elegance for any occasion.',
        features: ['14K Hallmarked Gold', 'Freshwater Pearls', 'Multi-Layer Design', 'Tarnish Resistant', 'Adjustable Length'],
        material: '14K Gold with Freshwater Pearls',
        badge: '',
        modelPath: '/models/chain.glb',
    },

    // EARRINGS
    {
        id: 5,
        name: 'Diamond Drop Earrings',
        category: 'earrings',
        price: 28999,
        originalPrice: 34999,
        rating: 4.9,
        reviews: 276,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
        colors: ['#FFD700', '#C0C0C0', '#E8B4B8'],
        colorNames: ['Yellow Gold', 'White Gold', 'Rose Gold'],
        sizes: ['Standard'],
        description: 'Exquisite diamond drop earrings that dance with light. Each earring features a cascade of brilliant-cut diamonds set in lustrous gold.',
        features: ['18K Hallmarked Gold', 'IGI Certified Diamonds', 'Push-Back Closure', 'Total 0.6 Carat', 'Matching Set Available'],
        material: '18K Gold with Natural Diamonds',
        badge: 'Bestseller',
        modelPath: '/models/earrings.glb',
    },
    {
        id: 6,
        name: 'Jhumka Heritage Earrings',
        category: 'earrings',
        price: 22999,
        originalPrice: 26999,
        rating: 4.8,
        reviews: 198,
        image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=1000&auto=format&fit=crop',
        colors: ['#FFD700', '#E8B4B8'],
        colorNames: ['Antique Gold', 'Rose Gold'],
        sizes: ['Standard'],
        description: 'Handcrafted traditional jhumka earrings with intricate filigree work and tiny pearl accents. A perfect blend of heritage and modern design.',
        features: ['22K Hallmarked Gold', 'Hand-Crafted Filigree', 'Pearl Accents', 'Lightweight Design', 'Cultural Heritage Piece'],
        material: '22K Gold with Pearls',
        badge: 'Heritage',
        modelPath: '/models/jhumka.glb',
    },

    // BRACELETS
    {
        id: 7,
        name: 'Tennis Diamond Bracelet',
        category: 'bracelets',
        price: 68999,
        originalPrice: 79999,
        rating: 4.9,
        reviews: 145,
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop',
        colors: ['#FFD700', '#C0C0C0'],
        colorNames: ['Yellow Gold', 'White Gold'],
        sizes: ['6.5"', '7"', '7.5"'],
        description: 'A classic tennis bracelet featuring a continuous line of brilliant-cut diamonds in a prong setting. The epitome of luxury on your wrist.',
        features: ['18K Hallmarked Gold', 'IGI Certified Diamonds', 'Total 3 Carat', 'Box Clasp with Safety', 'Lifetime Warranty'],
        material: '18K Gold with Natural Diamonds',
        badge: 'Premium',
        modelPath: '/models/bracelet.glb',
    },
    {
        id: 8,
        name: 'Charm Kada Bracelet',
        category: 'bracelets',
        price: 24999,
        originalPrice: 28999,
        rating: 4.7,
        reviews: 203,
        image: 'https://images.unsplash.com/photo-1611085583191-a3b1a30a8a0a?q=80&w=1000&auto=format&fit=crop',
        colors: ['#FFD700', '#E8B4B8'],
        colorNames: ['Yellow Gold', 'Rose Gold'],
        sizes: ['2.4"', '2.6"', '2.8"'],
        description: 'A modern take on the traditional kada, adorned with diamond-studded charms. Wear it solo or stack it for a bold statement.',
        features: ['18K Hallmarked Gold', 'Natural Diamond Charms', 'Open Kada Design', 'Adjustable Fit', 'Comes with Pouch'],
        material: '18K Gold with Diamonds',
        badge: 'New',
        modelPath: '/models/kada.glb',
    },

    // PENDANTS
    {
        id: 9,
        name: 'Evil Eye Diamond Pendant',
        category: 'pendants',
        price: 12999,
        originalPrice: 15999,
        rating: 4.6,
        reviews: 321,
        image: 'https://images.unsplash.com/photo-1615484477778-ca3b779401d5?q=80&w=1000&auto=format&fit=crop',
        colors: ['#FFD700', '#C0C0C0', '#E8B4B8'],
        colorNames: ['Yellow Gold', 'White Gold', 'Rose Gold'],
        sizes: ['With 16" Chain', 'With 18" Chain', 'Pendant Only'],
        description: 'A protective evil eye pendant set with blue sapphire and diamonds. Stylish, meaningful, and perfect for daily wear.',
        features: ['14K Hallmarked Gold', 'Natural Blue Sapphire', 'Diamond Accents', 'Hypoallergenic', 'Gift Wrapped'],
        material: '14K Gold with Sapphire & Diamonds',
        badge: 'Popular',
        modelPath: '/models/pendant.glb',
    },
    {
        id: 10,
        name: 'Heart Locket Pendant',
        category: 'pendants',
        price: 9999,
        originalPrice: 12999,
        rating: 4.5,
        reviews: 445,
        image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1000&auto=format&fit=crop',
        colors: ['#E8B4B8', '#FFD700', '#C0C0C0'],
        colorNames: ['Rose Gold', 'Yellow Gold', 'Silver'],
        sizes: ['With 16" Chain', 'With 18" Chain', 'Pendant Only'],
        description: 'A romantic heart locket that opens to hold your cherished photo. Adorned with tiny diamond accents on the surface.',
        features: ['14K Hallmarked Gold', 'Opens for Photo', 'Diamond Surface Accents', 'Spring-Ring Clasp', 'Personalization Available'],
        material: '14K Gold with Diamond Accents',
        badge: 'Gift Pick',
        modelPath: '/models/locket.glb',
    },

    // BANGLES
    {
        id: 11,
        name: 'Polki Bridal Bangle Set',
        category: 'bangles',
        price: 89999,
        originalPrice: 105999,
        rating: 4.9,
        reviews: 87,
        image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1000&auto=format&fit=crop',
        colors: ['#FFD700'],
        colorNames: ['Traditional Gold'],
        sizes: ['2.4"', '2.6"', '2.8"'],
        description: 'A stunning set of 4 bridal bangles with uncut polki diamonds and intricate meenakari enamel work. Heirloom-quality craftsmanship.',
        features: ['22K Hallmarked Gold', 'Uncut Polki Diamonds', 'Meenakari Enamel', 'Set of 4 Bangles', 'Certificate of Authenticity'],
        material: '22K Gold with Polki Diamonds',
        badge: 'Bridal',
        modelPath: '/models/bangles.glb',
    },
    {
        id: 12,
        name: 'Sleek Platinum Bangle',
        category: 'bangles',
        price: 55999,
        originalPrice: 62999,
        rating: 4.8,
        reviews: 134,
        image: 'https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?q=80&w=1000&auto=format&fit=crop',
        colors: ['#E5E4E2', '#FFD700'],
        colorNames: ['Platinum', 'White Gold'],
        sizes: ['2.4"', '2.6"', '2.8"'],
        description: 'A minimalist platinum bangle with a single row of channel-set diamonds. Modern luxury for the contemporary woman.',
        features: ['950 Platinum', 'Channel-Set Diamonds', 'Total 1.2 Carat', 'Hinged with Safety Clasp', 'Platinum Hallmarked'],
        material: '950 Platinum with Natural Diamonds',
        badge: 'Luxury',
        modelPath: '/models/bangle.glb',
    },
];

export const categories = [
    { id: 'rings', name: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-047af5fef207?q=80&w=500&auto=format&fit=crop', count: 2 },
    { id: 'necklaces', name: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=500&auto=format&fit=crop', count: 2 },
    { id: 'earrings', name: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=500&auto=format&fit=crop', count: 2 },
    { id: 'bracelets', name: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=500&auto=format&fit=crop', count: 2 },
    { id: 'pendants', name: 'Pendants', image: 'https://images.unsplash.com/photo-1615484477778-ca3b779401d5?q=80&w=500&auto=format&fit=crop', count: 2 },
    { id: 'bangles', name: 'Bangles', image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=500&auto=format&fit=crop', count: 2 },
];

// Frequently Bought Together mapping
const frequentlyBoughtTogether = {
    1: [5, 3],    // Ring → Earrings + Necklace
    2: [9, 4],    // Band → Pendant + Necklace
    3: [5, 9],    // Necklace → Earrings + Pendant
    4: [6, 10],   // Pearl Chain → Jhumkas + Locket
    5: [1, 3],    // Drop Earrings → Ring + Necklace
    6: [11, 3],   // Jhumkas → Bangles + Necklace
    7: [1, 5],    // Tennis Bracelet → Ring + Earrings
    8: [6, 11],   // Kada → Jhumkas + Bangles
    9: [4, 6],    // Evil Eye → Pearl Chain + Jhumkas
    10: [2, 5],   // Heart Locket → Ring + Earrings
    11: [6, 1],   // Polki Bangles → Jhumkas + Ring
    12: [7, 5],   // Platinum Bangle → Tennis Bracelet + Earrings
};

export const getRecommendations = (productId, count = 4) => {
    const current = products.find((p) => p.id === productId);
    if (!current) return products.slice(0, count);

    // Filter by same category first, then other categories
    const sameCategory = products.filter((p) => p.category === current.category && p.id !== productId);
    const otherCategory = products.filter((p) => p.category !== current.category && p.id !== productId);

    return [...sameCategory, ...otherCategory].slice(0, count);
};

export const getFrequentlyBought = (productId) => {
    const ids = frequentlyBoughtTogether[productId] || [];
    return ids.map((id) => products.find((p) => p.id === id)).filter(Boolean);
};
