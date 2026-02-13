import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiTrash2, FiArrowRight, FiHeart, FiShare2 } from 'react-icons/fi';
import useStore from '../store/useStore';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlist, removeFromWishlist, addToCart } = useStore();

    const handleMoveToCart = (product) => {
        addToCart(product, 1, product.sizes[0], product.colors[0]);
        removeFromWishlist(product.id);
    };

    if (wishlist.length === 0) {
        return (
            <div className="wishlist-page wishlist-page--empty">
                <div className="container">
                    <motion.div className="wishlist-empty" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="wishlist-empty__icon">💜</span>
                        <h2 className="text-display">Your Wishlist is Empty</h2>
                        <p>Save your favorite items to your wishlist and shop them later.</p>
                        <Link to="/products" className="btn btn-primary btn-lg">Discover Products <FiArrowRight /></Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <div className="container">
                <div className="wishlist-page__header">
                    <motion.h1 className="wishlist-page__title text-display" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        My Wishlist
                    </motion.h1>
                    <span className="wishlist-page__count">{wishlist.length} items</span>
                </div>

                <div className="wishlist-grid">
                    <AnimatePresence>
                        {wishlist.map((item, i) => (
                            <motion.div
                                key={item.id}
                                className="wishlist-card"
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link to={`/product/${item.id}`} className="wishlist-card__image">
                                    <img src={item.image} alt={item.name} className="wishlist-card__img" />
                                </Link>
                                <div className="wishlist-card__info">
                                    <span className="wishlist-card__category">{item.category}</span>
                                    <Link to={`/product/${item.id}`} className="wishlist-card__name">{item.name}</Link>
                                    <div className="wishlist-card__pricing">
                                        <span className="wishlist-card__price">\u20b9{item.price.toLocaleString()}</span>
                                        <button className="product-card__buy-btn" onClick={() => handleMoveToCart(item)}>
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                                <div className="wishlist-card__actions">
                                    <button className="btn btn-primary btn-sm" onClick={() => handleMoveToCart(item)}>
                                        <FiShoppingBag /> Add to Cart
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-sm wishlist-card__remove"
                                        onClick={() => removeFromWishlist(item.id)}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
