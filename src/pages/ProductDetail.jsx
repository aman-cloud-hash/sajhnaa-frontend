import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiStar, FiTruck, FiShield, FiRefreshCw, FiShare2, FiChevronRight, FiMinus, FiPlus, FiCheck } from 'react-icons/fi';
import FadeIn from '../components/FadeIn';
import ProductCard from '../components/ProductCard';
import { products as initialProducts, getRecommendations, getFrequentlyBought } from '../data/products';
import useStore from '../store/useStore';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products: storeProducts, addToCart, removeFromCart, addToWishlist, removeFromWishlist, isInWishlist, addToRecentlyViewed, fetchProducts } = useStore();

    // Find product in store products
    const product = storeProducts?.find(p => p.id === parseInt(id) || p.id === id || p.firebaseId === id);

    useEffect(() => {
        const unsubscribe = fetchProducts();
        return () => unsubscribe();
    }, [fetchProducts]);

    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedSize, setSelectedSize] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [addedItems, setAddedItems] = useState([]);

    useEffect(() => {
        if (product) {
            addToRecentlyViewed(product);
            setSelectedColor(0);
            setSelectedSize(0);
            setQuantity(1);
            setAddedItems([]);
            window.scrollTo(0, 0);
        }
    }, [id]);

    if (!product) {
        return (
            <div className="product-detail__not-found">
                <h2>Product not found</h2>
                <Link to="/products" className="btn btn-primary">Back to Shop</Link>
            </div>
        );
    }

    const wishlisted = isInWishlist(product.id);

    const recommendations = getRecommendations(product.id, 4);
    const frequentlyBought = getFrequentlyBought(product.id);

    const handleAddToCart = () => {
        addToCart(product, quantity, product.sizes[selectedSize], product.colors[selectedColor]);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity, product.sizes[selectedSize], product.colors[selectedColor]);
        navigate('/checkout');
    };

    const handleAddFrequentItem = (item) => {
        if (addedItems.includes(item.id)) {
            // Remove from cart
            removeFromCart(item.id, item.sizes[0], item.colors[0]);
            setAddedItems(prev => prev.filter(id => id !== item.id));
        } else {
            // Add to cart
            addToCart(item, 1, item.sizes[0], item.colors[0]);
            setAddedItems(prev => [...prev, item.id]);
        }
    };

    const totalWithFrequent = product.price + frequentlyBought.filter(p => addedItems.includes(p.id)).reduce((sum, p) => sum + p.price, 0);

    return (
        <div className="product-detail">
            {/* Breadcrumb */}
            <div className="container">
                <nav className="breadcrumb" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <FiChevronRight />
                    <Link to="/products">Shop</Link>
                    <FiChevronRight />
                    <Link to={`/products?category=${product.category}`}>{product.category}</Link>
                    <FiChevronRight />
                    <span>{product.name}</span>
                </nav>
            </div>

            {/* Main Content */}
            <div className="container">
                <div className="product-detail__main">
                    <motion.div
                        className="product-detail__media"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="product-detail__image-container">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="product-detail__main-img"
                            />
                            <button
                                className={`product-detail__wishlist-overlay ${wishlisted ? 'product-detail__wishlist-overlay--active' : ''}`}
                                onClick={() => wishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
                                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                                <FiHeart />
                            </button>
                        </div>
                    </motion.div>

                    {/* Right — Info */}
                    <motion.div
                        className="product-detail__info"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="product-detail__badges-row">
                            {product.badge && <span className="badge badge-accent">{product.badge}</span>}
                        </div>

                        <span className="product-detail__category">{product.category}</span>
                        <h1 className="product-detail__name text-display">{product.name}</h1>

                        {/* Rating */}
                        <div className="product-detail__rating">
                            <div className="product-detail__stars">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar key={i} className={i < Math.floor(product.rating) ? 'star--filled' : ''} />
                                ))}
                            </div>
                            <span>{product.rating}</span>
                            <span className="product-detail__reviews-count">({product.reviews} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="product-detail__pricing">
                            <span className="product-detail__price">\u20b9{product.price.toLocaleString()}</span>
                        </div>

                        <p className="product-detail__desc">{product.description}</p>

                        {/* Material */}
                        <div className="product-detail__material">
                            <span className="product-detail__material-label">Material</span>
                            <span>{product.material}</span>
                        </div>

                        {/* Colors */}
                        <div className="product-detail__option">
                            <span className="product-detail__option-label">
                                Color: <strong>{product.colorNames[selectedColor]}</strong>
                            </span>
                            <div className="product-detail__color-picker">
                                {product.colors.map((color, i) => (
                                    <button
                                        key={i}
                                        className={`product-detail__color-swatch ${selectedColor === i ? 'product-detail__color-swatch--active' : ''}`}
                                        style={{ background: color }}
                                        onClick={() => setSelectedColor(i)}
                                        aria-label={`Select ${product.colorNames[i]}`}
                                    >
                                        {selectedColor === i && <FiCheck />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="product-detail__option">
                            <span className="product-detail__option-label">Size</span>
                            <div className="product-detail__sizes">
                                {product.sizes.map((size, i) => (
                                    <button
                                        key={i}
                                        className={`product-detail__size-btn ${selectedSize === i ? 'product-detail__size-btn--active' : ''}`}
                                        onClick={() => setSelectedSize(i)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity + Buttons */}
                        <div className="product-detail__cart-row">
                            <div className="product-detail__quantity">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><FiMinus /></button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity"><FiPlus /></button>
                            </div>
                            <button className="btn btn-primary btn-lg product-detail__add-btn" onClick={handleAddToCart}>
                                <FiShoppingBag /> Add to Cart
                            </button>
                        </div>

                        {/* Buy Now Button */}
                        <button className="btn btn-secondary btn-lg product-detail__buy-now" onClick={handleBuyNow}>
                            Buy Now
                        </button>

                        {/* Trust Items */}
                        <div className="product-detail__trust">
                            <div className="product-detail__trust-item"><FiTruck /> Free shipping over $500</div>
                            <div className="product-detail__trust-item"><FiShield /> 2-year warranty</div>
                            <div className="product-detail__trust-item"><FiRefreshCw /> 30-day returns</div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs: Description / Features / Shipping */}
                <div className="product-detail__tabs">
                    <div className="product-detail__tabs-nav">
                        {['description', 'features', 'shipping'].map(tab => (
                            <button
                                key={tab}
                                className={`product-detail__tab ${activeTab === tab ? 'product-detail__tab--active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="product-detail__tab-content">
                        {activeTab === 'description' && <p>{product.description}</p>}
                        {activeTab === 'features' && (
                            <ul className="product-detail__features-list">
                                {product.features.map((f, i) => (
                                    <li key={i}><FiCheck className="product-detail__feature-check" /> {f}</li>
                                ))}
                            </ul>
                        )}
                        {activeTab === 'shipping' && (
                            <div>
                                <p><strong>Standard Shipping:</strong> 5-7 business days — Free over $500</p>
                                <p><strong>Express Shipping:</strong> 2-3 business days — $25</p>
                                <p><strong>Same-Day (select areas):</strong> Order by 2 PM — $50</p>
                                <p style={{ marginTop: '1rem', color: 'var(--text-tertiary)' }}>All orders include tracking and signature confirmation.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Frequently Bought Together */}
                {frequentlyBought.length > 0 && (
                    <FadeIn className="product-detail__section">
                        <section>
                            <h2 className="product-detail__section-title text-display">Frequently Bought Together</h2>
                            <div className="fbt-grid">
                                <div className="fbt-card fbt-card--main">
                                    <div className="fbt-card__img-container">
                                        <img src={product.image} alt={product.name} className="fbt-card__img" />
                                    </div>
                                    <span className="fbt-card__name">{product.name}</span>
                                    <span className="fbt-card__price">₹{product.price.toLocaleString()}</span>
                                    <span className="badge badge-accent">This Item</span>
                                </div>
                                {frequentlyBought.map(item => (
                                    <div key={item.id} className="fbt-card">
                                        <Link to={`/product/${item.id}`}>
                                            <div className="fbt-card__img-container">
                                                <img src={item.image} alt={item.name} className="fbt-card__img" />
                                            </div>
                                            <span className="fbt-card__name">{item.name}</span>
                                        </Link>
                                        <span className="fbt-card__price">₹{item.price.toLocaleString()}</span>
                                        <button
                                            className={`btn btn-sm ${addedItems.includes(item.id) ? 'btn-outline' : 'btn-primary'}`}
                                            onClick={() => handleAddFrequentItem(item)}
                                        >
                                            {addedItems.includes(item.id) ? <><FiCheck /> Remove</> : <><FiPlus /> Add</>}
                                        </button>
                                    </div>
                                ))}
                                <div className="fbt-total">
                                    <span>Bundle Total</span>
                                    <span className="fbt-total__price">₹{totalWithFrequent.toLocaleString()}</span>
                                </div>
                            </div>
                        </section>
                    </FadeIn>
                )}

                {/* Recommendations */}
                <section className="product-detail__section">
                    <FadeIn>
                        <h2 className="product-detail__section-title text-display">You May Also Like</h2>
                    </FadeIn>
                    <div className="products-grid">
                        {recommendations.map((p, i) => (
                            <ProductCard key={p.id} product={p} index={i} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProductDetail;
