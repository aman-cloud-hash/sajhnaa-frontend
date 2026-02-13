import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiGrid,
    FiPackage,
    FiShoppingBag,
    FiUsers,
    FiSettings,
    FiLogOut,
    FiMenu,
    FiX
} from 'react-icons/fi';
import useStore from '../../store/useStore';
import './AdminLayout.css';

const AdminLayout = () => {
    const { adminLogout } = useStore();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        adminLogout();
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: <FiGrid />, label: 'Dashboard' },
        { path: '/admin/products', icon: <FiPackage />, label: 'Products' },
        { path: '/admin/orders', icon: <FiShoppingBag />, label: 'Orders' },
        { path: '/admin/customers', icon: <FiUsers />, label: 'Customers' },
        { path: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <motion.aside
                className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}
                initial={false}
                animate={{ width: sidebarOpen ? '280px' : '80px' }}
            >
                <div className="admin-sidebar-header">
                    <motion.h2
                        initial={false}
                        animate={{ opacity: sidebarOpen ? 1 : 0, scale: sidebarOpen ? 1 : 0.8 }}
                    >
                        SAJHNAA
                    </motion.h2>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="toggle-btn">
                        {sidebarOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>

                <nav className="admin-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <span className="icon">{item.icon}</span>
                            <AnimatePresence>
                                {sidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="label"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <span className="icon"><FiLogOut /></span>
                        {sidebarOpen && <span className="label">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="admin-content">
                <header className="admin-topbar">
                    <div className="topbar-search">
                        {/* Placeholder for future search if needed */}
                    </div>
                    <div className="admin-profile">
                        <div className="admin-info">
                            <span>Admin User</span>
                            <p>Administrator</p>
                        </div>
                        <div className="avatar">A</div>
                    </div>
                </header>
                <div className="admin-page-container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
