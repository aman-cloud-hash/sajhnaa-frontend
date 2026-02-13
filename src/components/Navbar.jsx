import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiUser, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import useStore from '../store/useStore';
import SearchOverlay from './SearchOverlay';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const { darkMode, toggleDarkMode, getCartCount, wishlist, searchOpen, toggleSearch, isAuthenticated } = useStore();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Completely hide navbar on admin routes
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Update scrolled state for styling
            setScrolled(currentScrollY > 20);

            // Show/hide based on scroll direction
            if (currentScrollY < lastScrollY || currentScrollY < 100) {
                // Scrolling up or near top - show navbar
                setVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down and past threshold - hide navbar
                setVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        setMobileMenu(false);
    }, [location]);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/products', label: 'Shop All' },
        { path: '/products?category=rings', label: 'Rings' },
        { path: '/products?category=necklaces', label: 'Necklaces' },
        { path: '/products?category=earrings', label: 'Earrings' },
    ];

    const cartCount = getCartCount();

    return (
        <>
            <motion.header
                className={`navbar ${scrolled ? 'navbar--scrolled' : ''} navbar--visible`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
                <div className="navbar__inner">
                    {/* Mobile Menu Toggle */}
                    <button
                        className="navbar__mobile-toggle"
                        onClick={() => setMobileMenu(!mobileMenu)}
                        aria-label={mobileMenu ? 'Close menu' : 'Open menu'}
                    >
                        {mobileMenu ? <FiX /> : <FiMenu />}
                    </button>

                    {/* Logo */}
                    <Link to="/" className="navbar__logo" aria-label="Sajhnaa Home">
                        <span className="navbar__logo-text">SAJHNAA</span>
                        <span className="navbar__logo-dot"></span>
                    </Link>

                    {/* Nav Links */}
                    <nav className="navbar__nav" role="navigation" aria-label="Main navigation">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="navbar__actions">
                        <button className="navbar__action-btn" onClick={toggleSearch} aria-label="Search">
                            <FiSearch />
                        </button>
                        <Link to="/wishlist" className="navbar__action-btn" aria-label="Wishlist">
                            <FiHeart />
                            {wishlist.length > 0 && (
                                <span className="navbar__badge">{wishlist.length}</span>
                            )}
                        </Link>
                        <Link to="/cart" className="navbar__action-btn" aria-label="Cart">
                            <FiShoppingBag />
                            {cartCount > 0 && (
                                <motion.span
                                    className="navbar__badge"
                                    key={cartCount}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </Link>
                        <Link
                            to={isAuthenticated ? "/account" : "/login"}
                            className="navbar__action-btn navbar__action-btn--avatar"
                            aria-label={isAuthenticated ? "My Account" : "Login"}
                        >
                            <FiUser />
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenu && (
                        <motion.div
                            className="navbar__mobile-menu"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="navbar__mobile-link"
                                    onClick={() => setMobileMenu(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="navbar__mobile-divider"></div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            <AnimatePresence>
                {searchOpen && <SearchOverlay />}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
