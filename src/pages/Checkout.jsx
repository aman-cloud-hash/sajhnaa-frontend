import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCreditCard, FiTruck, FiCheck, FiLock, FiArrowRight, FiHeart, FiChevronRight } from 'react-icons/fi';
import useStore from '../store/useStore';
import { getFrequentlyBought } from '../data/products';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, placeOrder, appliedPromo, addToCart } = useStore();
    const [step, setStep] = useState(1);
    const [shippingData, setShippingData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        address: '', city: '', state: '', zip: '', country: 'India'
    });
    const [paymentData, setPaymentData] = useState({
        cardNumber: '', name: '', expiry: '', cvv: '', method: 'card'
    });
    const [addedUpsells, setAddedUpsells] = useState([]);

    const subtotal = getCartTotal();
    const discount = appliedPromo ? (appliedPromo.discount * subtotal) : 0;
    const shipping = subtotal > 5000 ? 0 : 99;
    const total = subtotal - discount + shipping;

    // Upsell: get suggestions from first cart item
    const upsellItems = cart.length > 0 ? getFrequentlyBought(cart[0].id).filter(p => !cart.find(c => c.id === p.id)) : [];

    const handleSubmit = async () => {
        try {
            const orderId = await placeOrder(shippingData, paymentData);
            navigate(`/orders?id=${orderId}`);
        } catch (error) {
            console.error("Checkout failed:", error);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="checkout-page checkout-page--empty">
                <div className="container">
                    <motion.div className="checkout-empty" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="checkout-empty__icon">📦</span>
                        <h2 className="text-display">Nothing to Checkout</h2>
                        <p>Add some items to your cart first.</p>
                        <Link to="/products" className="btn btn-primary btn-lg">Shop Now <FiArrowRight /></Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <motion.h1 className="checkout-page__title text-display" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    Checkout
                </motion.h1>

                {/* Progress Steps */}
                <div className="checkout-steps">
                    {['Shipping', 'Payment', 'Review'].map((s, i) => (
                        <div key={s} className={`checkout-step ${step > i ? 'checkout-step--done' : ''} ${step === i + 1 ? 'checkout-step--active' : ''}`}>
                            <span className="checkout-step__num">{step > i + 1 ? <FiCheck /> : i + 1}</span>
                            <span className="checkout-step__label">{s}</span>
                        </div>
                    ))}
                </div>

                <div className="checkout-page__layout">
                    <main className="checkout-form">
                        {/* Step 1: Shipping */}
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                <h2 className="checkout-form__title"><FiTruck /> Shipping Information</h2>
                                <div className="checkout-form__grid">
                                    <div className="checkout-form__field">
                                        <label>First Name</label>
                                        <input className="input" value={shippingData.firstName} onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })} />
                                    </div>
                                    <div className="checkout-form__field">
                                        <label>Last Name</label>
                                        <input className="input" value={shippingData.lastName} onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })} />
                                    </div>
                                    <div className="checkout-form__field">
                                        <label>Email</label>
                                        <input className="input" type="email" value={shippingData.email} onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })} />
                                    </div>
                                    <div className="checkout-form__field">
                                        <label>Phone</label>
                                        <input className="input" type="tel" value={shippingData.phone} onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })} />
                                    </div>
                                    <div className="checkout-form__field checkout-form__field--full">
                                        <label>Address</label>
                                        <input className="input" value={shippingData.address} onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })} />
                                    </div>
                                    <div className="checkout-form__field">
                                        <label>City</label>
                                        <input className="input" value={shippingData.city} onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })} />
                                    </div>
                                    <div className="checkout-form__field">
                                        <label>State</label>
                                        <input className="input" value={shippingData.state} onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })} />
                                    </div>
                                    <div className="checkout-form__field">
                                        <label>PIN Code</label>
                                        <input className="input" value={shippingData.zip} onChange={(e) => setShippingData({ ...shippingData, zip: e.target.value })} />
                                    </div>
                                    <div className="checkout-form__field">
                                        <label>Country</label>
                                        <input className="input" value={shippingData.country} onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })} />
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-lg" onClick={() => setStep(2)}>
                                    Continue to Payment <FiArrowRight />
                                </button>
                            </motion.div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                <h2 className="checkout-form__title"><FiCreditCard /> Payment Method</h2>
                                <div className="checkout-payment-methods">
                                    {['card', 'paypal', 'apple'].map(method => (
                                        <button
                                            key={method}
                                            className={`checkout-payment-btn ${paymentData.method === method ? 'checkout-payment-btn--active' : ''}`}
                                            onClick={() => setPaymentData({ ...paymentData, method })}
                                        >
                                            {method === 'card' && <><FiCreditCard /> Credit Card</>}
                                            {method === 'paypal' && <><FiChevronRight /> UPI</>}
                                            {method === 'apple' && <><FiChevronRight /> Net Banking</>}
                                        </button>
                                    ))}
                                </div>
                                {paymentData.method === 'card' && (
                                    <div className="checkout-form__grid">
                                        <div className="checkout-form__field checkout-form__field--full">
                                            <label>Card Number</label>
                                            <input className="input" placeholder="1234 5678 9012 3456" value={paymentData.cardNumber} onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })} />
                                        </div>
                                        <div className="checkout-form__field checkout-form__field--full">
                                            <label>Name on Card</label>
                                            <input className="input" value={paymentData.name} onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })} />
                                        </div>
                                        <div className="checkout-form__field">
                                            <label>Expiry</label>
                                            <input className="input" placeholder="MM/YY" value={paymentData.expiry} onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })} />
                                        </div>
                                        <div className="checkout-form__field">
                                            <label>CVV</label>
                                            <input className="input" placeholder="123" value={paymentData.cvv} onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })} />
                                        </div>
                                    </div>
                                )}
                                <div className="checkout-form__actions">
                                    <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
                                    <button className="btn btn-primary btn-lg" onClick={() => setStep(3)}>
                                        Review Order <FiArrowRight />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Review */}
                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                <h2 className="checkout-form__title"><FiCheck /> Review Your Order</h2>
                                <div className="checkout-review">
                                    <div className="checkout-review__section">
                                        <h4>Shipping to</h4>
                                        <p>{shippingData.firstName} {shippingData.lastName}<br />{shippingData.address}<br />{shippingData.city}, {shippingData.state} {shippingData.zip}</p>
                                    </div>
                                    <div className="checkout-review__section">
                                        <h4>Payment</h4>
                                        <p>{paymentData.method === 'card' ? `Card ending in ${paymentData.cardNumber.slice(-4) || '****'}` : paymentData.method}</p>
                                    </div>
                                    <div className="checkout-review__section">
                                        <h4>Items ({cart.length})</h4>
                                        {cart.map(item => (
                                            <div key={`${item.id}-${item.selectedSize}`} className="checkout-review__item">
                                                <div className="checkout-review__item-img-container">
                                                    <img src={item.image} alt={item.name} className="checkout-review__item-img" />
                                                </div>
                                                <span>{item.name} × {item.quantity}</span>
                                                <span className="checkout-review__item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Upsell */}
                                    {upsellItems.length > 0 && (
                                        <div className="checkout-review__section checkout-upsell">
                                            <h4><FiHeart /> Frequently Bought Together</h4>
                                            {upsellItems.map(item => (
                                                <div key={item.id} className="checkout-upsell__item">
                                                    <div className="checkout-upsell__img-container">
                                                        <img src={item.image} alt={item.name} className="checkout-upsell__img" />
                                                    </div>
                                                    <div className="checkout-upsell__info">
                                                        <span>{item.name}</span>
                                                        <span className="checkout-upsell__price">₹{item.price.toLocaleString()}</span>
                                                    </div>
                                                    <button
                                                        className={`btn btn-sm ${addedUpsells.includes(item.id) ? 'btn-secondary' : 'btn-primary'}`}
                                                        onClick={() => {
                                                            addToCart(item, 1, item.sizes[0], item.colors[0]);
                                                            setAddedUpsells(prev => [...prev, item.id]);
                                                        }}
                                                        disabled={addedUpsells.includes(item.id)}
                                                    >
                                                        {addedUpsells.includes(item.id) ? 'Added ✓' : 'Add'}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="checkout-form__actions">
                                    <button className="btn btn-ghost" onClick={() => setStep(2)}>Back</button>
                                    <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
                                        <FiLock /> Place Order — ₹{total.toLocaleString()}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </main>

                    {/* Sidebar Summary */}
                    <aside className="checkout-sidebar">
                        <div className="checkout-sidebar__card">
                            <h3>Order Summary</h3>
                            <div className="checkout-sidebar__items">
                                {cart.map(item => (
                                    <div key={`${item.id}-${item.selectedSize}`} className="checkout-sidebar__item">
                                        <div className="checkout-sidebar__item-img-container">
                                            <img src={item.image} alt={item.name} className="checkout-sidebar__item-img" />
                                        </div>
                                        <div>
                                            <span className="checkout-sidebar__item-name">{item.name}</span>
                                            <span className="checkout-sidebar__item-qty">Qty: {item.quantity}</span>
                                        </div>
                                        <span className="checkout-sidebar__item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="checkout-sidebar__lines">
                                <div className="checkout-sidebar__line"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                                {discount > 0 && <div className="checkout-sidebar__line checkout-sidebar__line--discount"><span>Discount</span><span>-₹{discount.toLocaleString()}</span></div>}
                                <div className="checkout-sidebar__line"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                            </div>
                            <div className="checkout-sidebar__total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
                            <div className="checkout-sidebar__secure"><FiLock /> Secure checkout powered by Sajhnaa</div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
