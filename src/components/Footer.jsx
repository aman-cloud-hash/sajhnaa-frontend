import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiMail, FiArrowUpRight } from 'react-icons/fi';
import logoImg from '../assets/logo.svg';
import './Footer.css';

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="footer">
            <div className="footer__glow" />
            <div className="container">
                <div className="footer__grid">
                    {/* Brand */}
                    <div className="footer__brand">
                        <Link to="/" className="footer__logo">
                            <img src={logoImg} alt="SAJHNAA" style={{ height: '75px' }} />
                        </Link>
                        <p className="footer__tagline">
                            Handcrafted jewelry that tells your story. From everyday sparkle to bridal splendor — adorned with love.
                        </p>
                        <div className="footer__socials">
                            <a href="#" className="footer__social" aria-label="Twitter"><FiTwitter /></a>
                            <a href="#" className="footer__social" aria-label="Instagram"><FiInstagram /></a>
                            <a href="#" className="footer__social" aria-label="GitHub"><FiGithub /></a>
                            <a href="#" className="footer__social" aria-label="Email"><FiMail /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer__col">
                        <h4 className="footer__col-title">Shop</h4>
                        <Link to="/products" className="footer__link">All Jewelry</Link>
                        <Link to="/products?category=rings" className="footer__link">Rings</Link>
                        <Link to="/products?category=necklaces" className="footer__link">Necklaces</Link>
                        <Link to="/products?category=earrings" className="footer__link">Earrings</Link>
                        <Link to="/products?category=bracelets" className="footer__link">Bracelets</Link>
                    </div>

                    <div className="footer__col">
                        <h4 className="footer__col-title">Account</h4>
                        <Link to="/account" className="footer__link">My Profile</Link>
                        <Link to="/orders" className="footer__link">Track Order</Link>
                        <Link to="/wishlist" className="footer__link">Wishlist</Link>
                        <Link to="/cart" className="footer__link">Cart</Link>
                    </div>

                    <div className="footer__col">
                        <h4 className="footer__col-title">Company</h4>
                        <a href="#" className="footer__link">About Us <FiArrowUpRight /></a>
                        <a href="#" className="footer__link">Careers <FiArrowUpRight /></a>
                        <a href="#" className="footer__link">Sustainability <FiArrowUpRight /></a>
                        <a href="#" className="footer__link">Press Kit <FiArrowUpRight /></a>
                    </div>

                    {/* Newsletter */}
                    <div className="footer__newsletter">
                        <h4 className="footer__col-title">Stay in the Loop</h4>
                        <p className="footer__newsletter-text">Be the first to know about new collections, exclusive offers & jewelry care tips.</p>
                        <div className="footer__newsletter-form">
                            <input type="email" placeholder="your@email.com" className="footer__newsletter-input" aria-label="Email for newsletter" />
                            <button className="btn btn-primary btn-sm">Subscribe</button>
                        </div>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>© {year} Sajhnaa. All rights reserved.</p>
                    <div className="footer__bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
