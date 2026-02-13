import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import useStore from '../store/useStore';
import './ProductCard.css';

const ProductCard = ({ product, index = 0 }) => {
    const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
    const wishlisted = isInWishlist(product.id);

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        wishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1, product.sizes[0], product.colors[0]);
    };



    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
        >
            <Link to={`/product/${product.id}`} className="product-card" aria-label={`View ${product.name}`}>
                {/* Image Area */}
                <div className="product-card__image-area">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-card__image"
                        loading="lazy"
                    />

                    {/* Badges */}
                    <div className="product-card__badges">
                        {product.badge && (
                            <span className="badge badge-accent">{product.badge}</span>
                        )}
                    </div>

                    {/* Hover Actions */}
                    <div className="product-card__actions">
                        <button
                            className={`product-card__action ${wishlisted ? 'product-card__action--active' : ''}`}
                            onClick={handleWishlist}
                            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            <FiHeart />
                        </button>
                        <button className="product-card__action" onClick={handleAddToCart} aria-label="Add to cart">
                            <FiShoppingBag />
                        </button>
                    </div>

                    {/* Color Dots */}
                    <div className="product-card__colors">
                        {product.colors.slice(0, 3).map((color, i) => (
                            <span
                                key={i}
                                className="product-card__color-dot"
                                style={{ background: color }}
                            />
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="product-card__info">
                    <span className="product-card__category">{product.category}</span>
                    <h3 className="product-card__name">{product.name}</h3>
                    <div className="product-card__rating">
                        <FiStar className="product-card__star" />
                        <span>{product.rating}</span>
                        <span className="product-card__reviews">({product.reviews})</span>
                    </div>
                    <div className="product-card__pricing">
                        <span className="product-card__price">₹{product.price.toLocaleString()}</span>
                        <button className="product-card__buy-btn" onClick={handleAddToCart}>
                            Buy Now
                        </button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
