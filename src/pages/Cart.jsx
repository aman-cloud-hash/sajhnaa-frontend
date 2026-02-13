import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiBookmark, FiTag, FiShoppingBag, FiChevronRight } from 'react-icons/fi';
import useStore from '../store/useStore';
import './Cart.css';

const Cart = () => {
    const { cart, updateCartQuantity, removeFromCart, getCartTotal, clearCart, appliedPromo, applyPromo, removePromo, saveForLater, savedForLater, moveToCart } = useStore();
    const [promoInput, setPromoInput] = useState('');

    const subtotal = getCartTotal();
    const discount = appliedPromo ? (appliedPromo.discount * subtotal) : 0;
    const shipping = subtotal > 5000 ? 0 : 99;
    const total = subtotal - discount + shipping;

    const handleApplyPromo = () => {
        if (promoInput.trim()) {
            applyPromo(promoInput);
            setPromoInput('');
        }
    };

    if (cart.length === 0 && savedForLater.length === 0) {
        return (
            <div className="cart-page cart-page--empty">
                <div className="container">
                    <motion.div
                        className="cart-empty"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="cart-empty__icon">🛒</span>
                        <h2 className="text-display">Your Cart is Empty</h2>
                        <p>Looks like you haven&apos;t added anything yet. Explore our collection!</p>
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Continue Shopping <FiArrowRight />
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <motion.h1
                    className="cart-page__title text-display"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Shopping Cart
                </motion.h1>

                <div className="cart-page__layout">
                    {/* Cart Items */}
                    <div className="cart-items">
                        <AnimatePresence>
                            {cart.map((item) => (
                                <motion.div
                                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                                    className="cart-item"
                                    layout
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Link to={`/product/${item.id}`} className="cart-item__image">
                                        <img src={item.image} alt={item.name} className="cart-item__img" />
                                    </Link>
                                    <div className="cart-item__info">
                                        <Link to={`/product/${item.id}`} className="cart-item__name">{item.name}</Link>
                                        <div className="cart-item__meta">
                                            {item.selectedColor && (
                                                <span className="cart-item__variant">
                                                    <span className="cart-item__color-dot" style={{ background: item.selectedColor }}></span>
                                                    {item.colorNames?.[item.colors?.indexOf(item.selectedColor)] || 'Color'}
                                                </span>
                                            )}
                                            {item.selectedSize && <span className="cart-item__variant">{item.selectedSize}</span>}
                                        </div>
                                        <div className="cart-item__actions">
                                            <button className="cart-item__action" onClick={() => saveForLater(item)}>
                                                <FiBookmark /> Save for Later
                                            </button>
                                            <button
                                                className="cart-item__action cart-item__action--remove"
                                                onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                                            >
                                                <FiTrash2 /> Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="cart-item__right">
                                        <span className="cart-item__price">\u20b9{(item.price * item.quantity).toLocaleString()}</span>
                                        <div className="cart-item__quantity">
                                            <button onClick={() => updateCartQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}>
                                                <FiMinus />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateCartQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}>
                                                <FiPlus />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Saved For Later */}
                        {savedForLater.length > 0 && (
                            <div className="cart-saved">
                                <h3 className="cart-saved__title">Saved for Later ({savedForLater.length})</h3>
                                {savedForLater.map((item) => (
                                    <div key={item.id} className="cart-saved__item">
                                        <div className="cart-saved__img-container">
                                            <img src={item.image} alt={item.name} className="cart-saved__img" />
                                        </div>
                                        <div className="cart-saved__info">
                                            <span className="cart-saved__name">{item.name}</span>
                                            <span className="cart-saved__price">\u20b9{item.price.toLocaleString()}</span>
                                        </div>
                                        <button className="btn btn-sm btn-primary" onClick={() => moveToCart(item)}>
                                            Move to Cart
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="cart-summary">
                        <div className="cart-summary__card">
                            <h3 className="cart-summary__title">Order Summary</h3>

                            {/* Promo Code */}
                            <div className="cart-summary__promo">
                                {appliedPromo ? (
                                    <div className="cart-summary__promo-applied">
                                        <FiTag /> <span>{appliedPromo.code} — {appliedPromo.label}</span>
                                        <button onClick={removePromo}>Remove</button>
                                    </div>
                                ) : (
                                    <div className="cart-summary__promo-input">
                                        <input
                                            type="text"
                                            placeholder="Enter promo code"
                                            value={promoInput}
                                            onChange={(e) => setPromoInput(e.target.value)}
                                            className="input"
                                            aria-label="Promo code"
                                        />
                                        <button className="btn btn-secondary btn-sm" onClick={handleApplyPromo}>Apply</button>
                                    </div>
                                )}
                            </div>

                            <div className="cart-summary__lines">
                                <div className="cart-summary__line">
                                    <span>Subtotal</span>
                                    <span>\u20b9{subtotal.toLocaleString()}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="cart-summary__line cart-summary__line--discount">
                                        <span>Discount ({appliedPromo.label})</span>
                                        <span>-\u20b9{discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="cart-summary__line">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? <span className="cart-summary__free">FREE</span> : `₹${shipping}`}</span>
                                </div>
                            </div>

                            <div className="cart-summary__total">
                                <span>Total</span>
                                <span>\u20b9{total.toLocaleString()}</span>
                            </div>

                            <Link to="/checkout" className="btn btn-primary btn-lg cart-summary__checkout">
                                Proceed to Checkout <FiArrowRight />
                            </Link>

                            <Link to="/products" className="btn btn-ghost cart-summary__continue">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
