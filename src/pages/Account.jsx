import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMapPin, FiPackage, FiSettings, FiShield, FiLogOut, FiEdit2, FiPlus, FiChevronRight, FiMail, FiPhone } from 'react-icons/fi';
import useStore from '../store/useStore';
import './Account.css';

const Account = () => {
    const { user, orders, updateUser, logout } = useStore();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('profile');

    const menuItems = [
        { id: 'profile', label: 'Profile', icon: <FiUser /> },
        { id: 'addresses', label: 'Addresses', icon: <FiMapPin /> },
        { id: 'orders', label: 'Order History', icon: <FiPackage /> },
        { id: 'preferences', label: 'Preferences', icon: <FiSettings /> },
        { id: 'security', label: 'Security', icon: <FiShield /> },
    ];

    return (
        <div className="account-page">
            <div className="container">
                <motion.h1
                    className="account-page__title text-display"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    My Account
                </motion.h1>

                <div className="account-page__layout">
                    {/* Sidebar */}
                    <aside className="account-sidebar">
                        <div className="account-sidebar__user">
                            <div className="account-sidebar__avatar">
                                <FiUser />
                            </div>
                            <div>
                                <strong>{user?.name || 'User'}</strong>
                                <span>{user?.email || 'No email provided'}</span>
                            </div>
                        </div>
                        <nav className="account-sidebar__nav">
                            {menuItems.map(item => (
                                <button
                                    key={item.id}
                                    className={`account-sidebar__link ${activeSection === item.id ? 'account-sidebar__link--active' : ''}`}
                                    onClick={() => setActiveSection(item.id)}
                                >
                                    {item.icon} {item.label}
                                </button>
                            ))}
                            <button
                                className="account-sidebar__link account-sidebar__link--logout"
                                onClick={() => {
                                    logout();
                                    navigate('/');
                                }}
                            >
                                <FiLogOut /> Log Out
                            </button>
                        </nav>
                    </aside>

                    {/* Content */}
                    <main className="account-content">
                        {/* Profile */}
                        {activeSection === 'profile' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="account-content__title">Personal Information</h2>
                                <div className="account-form">
                                    <div className="account-form__row">
                                        <div className="account-form__field">
                                            <label>Full Name</label>
                                            <input type="text" className="input" value={user?.name || ''} readOnly />
                                        </div>
                                        <div className="account-form__field">
                                            <label>Email</label>
                                            <input type="email" className="input" value={user?.email || ''} readOnly />
                                        </div>
                                    </div>
                                    <div className="account-form__row">
                                        <div className="account-form__field">
                                            <label>Phone</label>
                                            <input type="tel" className="input" value={user.phone} onChange={(e) => updateUser({ phone: e.target.value })} />
                                        </div>
                                    </div>
                                    <button className="btn btn-primary">Save Changes</button>
                                </div>
                            </motion.div>
                        )}

                        {/* Addresses */}
                        {activeSection === 'addresses' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="account-content__header-row">
                                    <h2 className="account-content__title">My Addresses</h2>
                                    <button className="btn btn-secondary btn-sm"><FiPlus /> Add Address</button>
                                </div>
                                <div className="addresses-grid">
                                    {(user?.addresses || []).map(addr => (
                                        <div key={addr.id} className={`address-card ${addr.isDefault ? 'address-card--default' : ''}`}>
                                            <div className="address-card__header">
                                                <span className="address-card__label">{addr.label}</span>
                                                {addr.isDefault && <span className="badge badge-accent">Default</span>}
                                            </div>
                                            <p className="address-card__text">{addr.street}<br />{addr.city}, {addr.state} {addr.zip}<br />{addr.country}</p>
                                            <div className="address-card__actions">
                                                <button className="btn btn-ghost btn-sm"><FiEdit2 /> Edit</button>
                                            </div>
                                        </div>
                                    ))}
                                    {(!user?.addresses || user.addresses.length === 0) && (
                                        <div className="empty-state">No addresses saved yet.</div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Orders */}
                        {activeSection === 'orders' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="account-content__title">Order History</h2>
                                <div className="orders-list">
                                    {orders.map(order => (
                                        <Link key={order.id} to={`/orders?id=${order.id}`} className="order-card">
                                            <div className="order-card__header">
                                                <span className="order-card__id">{order.id}</span>
                                                <span className={`badge badge-${order.status === 'delivered' ? 'success' : order.status === 'shipped' ? 'info' : 'warning'}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="order-card__items">
                                                {order.items.map(item => (
                                                    <div key={item.id} className="order-card__item-img-container">
                                                        <img src={item.image} alt="" className="order-card__item-img" />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="order-card__footer">
                                                <span className="order-card__date">{order.date}</span>
                                                <span className="order-card__total">₹{order.total.toLocaleString()}</span>
                                                <FiChevronRight />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Preferences */}
                        {activeSection === 'preferences' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="account-content__title">Preferences</h2>
                                <div className="preferences-list">
                                    <label className="preference-toggle">
                                        <div>
                                            <strong>Email Newsletter</strong>
                                            <span>Receive updates about new products and offers</span>
                                        </div>
                                        <input type="checkbox" checked={user?.preferences?.newsletter || false} readOnly />
                                    </label>
                                    <label className="preference-toggle">
                                        <div>
                                            <strong>SMS Alerts</strong>
                                            <span>Get order status updates via text message</span>
                                        </div>
                                        <input type="checkbox" checked={user?.preferences?.smsAlerts || false} readOnly />
                                    </label>
                                </div>
                            </motion.div>
                        )}

                        {/* Security */}
                        {activeSection === 'security' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="account-content__title">Security Settings</h2>
                                <div className="account-form">
                                    <div className="account-form__field">
                                        <label>Current Password</label>
                                        <input type="password" className="input" placeholder="Enter current password" />
                                    </div>
                                    <div className="account-form__field">
                                        <label>New Password</label>
                                        <input type="password" className="input" placeholder="Enter new password" />
                                    </div>
                                    <div className="account-form__field">
                                        <label>Confirm Password</label>
                                        <input type="password" className="input" placeholder="Confirm new password" />
                                    </div>
                                    <label className="preference-toggle">
                                        <div>
                                            <strong>Two-Factor Authentication</strong>
                                            <span>Add an extra layer of security to your account</span>
                                        </div>
                                        <input type="checkbox" checked={user.preferences.twoFactorAuth} onChange={() => updateUser({ preferences: { ...user.preferences, twoFactorAuth: !user.preferences.twoFactorAuth } })} />
                                    </label>
                                    <button className="btn btn-primary">Update Security</button>
                                </div>
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Account;
