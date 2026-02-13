import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiPackage, FiCheck, FiTruck, FiMapPin, FiCopy, FiChevronDown } from 'react-icons/fi';
import useStore from '../store/useStore';
import './OrderTracking.css';

const OrderTracking = () => {
    const [searchParams] = useSearchParams();
    const { orders, addNotification } = useStore();
    const [searchId, setSearchId] = useState(searchParams.get('id') || '');
    const [expandedOrder, setExpandedOrder] = useState(searchParams.get('id') || null);

    const displayOrders = searchId
        ? orders.filter(o => o.id.toLowerCase().includes(searchId.toLowerCase()))
        : orders;

    const copyOrderId = (id) => {
        navigator.clipboard.writeText(id);
        addNotification('Copied!', `Order ID ${id} copied to clipboard.`, 'success');
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <FiCheck />;
            case 'shipped': return <FiTruck />;
            default: return <FiPackage />;
        }
    };

    return (
        <div className="tracking-page">
            <div className="container">
                <motion.div
                    className="tracking-page__header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="tracking-page__title text-display">Order Tracking</h1>
                    <p className="tracking-page__subtitle">Track your orders in real time</p>
                </motion.div>

                {/* Search */}
                <div className="tracking-search">
                    <div className="tracking-search__input-wrap">
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Enter order ID (e.g., SJ-A7K2M9P1)"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            className="tracking-search__input"
                            aria-label="Search order ID"
                        />
                    </div>
                </div>

                {/* Orders */}
                <div className="tracking-orders">
                    {displayOrders.length === 0 ? (
                        <div className="tracking-empty">
                            <div className="tracking-empty__icon-container">
                                <FiPackage />
                            </div>
                            <h3>No orders found</h3>
                            <p>Check your order ID and try again</p>
                        </div>
                    ) : (
                        displayOrders.map((order, i) => (
                            <motion.div
                                key={order.id}
                                className="tracking-order"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <button
                                    className="tracking-order__header"
                                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                    aria-expanded={expandedOrder === order.id}
                                >
                                    <div className="tracking-order__header-left">
                                        <div className={`tracking-order__icon tracking-order__icon--${order.status}`}>
                                            {getStatusIcon(order.status)}
                                        </div>
                                        <div>
                                            <div className="tracking-order__id-row">
                                                <span className="tracking-order__id">{order.id}</span>
                                                <button
                                                    className="tracking-order__copy"
                                                    onClick={(e) => { e.stopPropagation(); copyOrderId(order.id); }}
                                                    aria-label="Copy order ID"
                                                >
                                                    <FiCopy />
                                                </button>
                                            </div>
                                            <span className="tracking-order__date">{order.date}</span>
                                        </div>
                                    </div>
                                    <div className="tracking-order__header-right">
                                        <span className={`badge badge-${order.status === 'delivered' ? 'success' : order.status === 'shipped' ? 'info' : 'warning'}`}>
                                            {order.status}
                                        </span>
                                        <span className="tracking-order__total">\u20b9{order.total.toLocaleString()}</span>
                                        <FiChevronDown className={`tracking-order__chevron ${expandedOrder === order.id ? 'tracking-order__chevron--open' : ''}`} />
                                    </div>
                                </button>

                                {expandedOrder === order.id && (
                                    <motion.div
                                        className="tracking-order__body"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {/* Timeline */}
                                        <div className="tracking-timeline">
                                            {order.trackingSteps.map((step, si) => (
                                                <div
                                                    key={si}
                                                    className={`tracking-timeline__step ${step.completed ? 'tracking-timeline__step--done' : ''}`}
                                                >
                                                    <div className="tracking-timeline__dot">
                                                        {step.completed && <FiCheck />}
                                                    </div>
                                                    <div className="tracking-timeline__info">
                                                        <span className="tracking-timeline__label">{step.label}</span>
                                                        {step.date && <span className="tracking-timeline__date">{step.date}</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Items */}
                                        <div className="tracking-order__items">
                                            <h4 className="tracking-order__items-title">Items in this order</h4>
                                            {order.items.map(item => (
                                                <div key={item.id} className="tracking-order__item">
                                                    <div className="tracking-order__item-img-container">
                                                        <img src={item.image} alt={item.name} className="tracking-order__item-img" />
                                                    </div>
                                                    <div className="tracking-order__item-info">
                                                        <span className="tracking-order__item-name">{item.name}</span>
                                                        <span className="tracking-order__item-qty">Qty: {item.quantity}</span>
                                                    </div>
                                                    <span className="tracking-order__item-price">₹{item.price.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Delivery Map Placeholder */}
                                        {order.status === 'shipped' && (
                                            <div className="tracking-map">
                                                <div className="tracking-map__placeholder">
                                                    <FiMapPin />
                                                    <span>Live tracking map</span>
                                                    <p>Your package is on its way! Estimated delivery: 2-3 business days</p>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
