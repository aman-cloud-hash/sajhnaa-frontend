import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowRight, FiGithub, FiChevronLeft } from 'react-icons/fi';
import { SiGoogle } from 'react-icons/si';
import useStore from '../store/useStore';
import './Auth.css';

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register } = useStore();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (isLogin) {
            const success = login(formData.email, formData.password);
            if (success) {
                const from = location.state?.from?.pathname || '/account';
                navigate(from, { replace: true });
            }
        } else {
            // Basic validation
            if (formData.password !== formData.confirmPassword) {
                alert('Passwords do not match');
                setLoading(false);
                return;
            }
            const success = register({ name: formData.name, email: formData.email });
            if (success) {
                navigate('/account');
            }
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <motion.div
                    className="auth-card__inner"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <header className="auth-header">
                        <span className="auth-logo">SAJHNAA</span>
                        <h1 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                        <p className="auth-subtitle">
                            {isLogin
                                ? 'Enter your details to access your account'
                                : 'Join Sajhnaa for a premium jewelry experience'}
                        </p>
                    </header>

                    <div className="auth-tabs">
                        <div
                            className={`auth-tab ${isLogin ? 'auth-tab--active' : ''}`}
                            onClick={() => setIsLogin(true)}
                        >
                            Login
                        </div>
                        <div
                            className={`auth-tab ${!isLogin ? 'auth-tab--active' : ''}`}
                            onClick={() => setIsLogin(false)}
                        >
                            Register
                        </div>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isLogin ? 'login' : 'register'}
                                initial={{ opacity: 0, x: isLogin ? -10 : 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: isLogin ? -10 : 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {!isLogin && (
                                    <div className="auth-field">
                                        <label>Full Name</label>
                                        <div className="auth-input-wrap">
                                            <FiUser className="auth-input-icon" />
                                            <input
                                                type="text"
                                                name="name"
                                                className="auth-input"
                                                placeholder="John Doe"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="auth-field" style={{ marginTop: !isLogin ? 'var(--space-md)' : 0 }}>
                                    <label>Email Address</label>
                                    <div className="auth-input-wrap">
                                        <FiMail className="auth-input-icon" />
                                        <input
                                            type="email"
                                            name="email"
                                            className="auth-input"
                                            placeholder="you@email.com"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="auth-field" style={{ marginTop: 'var(--space-md)' }}>
                                    <label>Password</label>
                                    <div className="auth-input-wrap">
                                        <FiLock className="auth-input-icon" />
                                        <input
                                            type="password"
                                            name="password"
                                            className="auth-input"
                                            placeholder="••••••••"
                                            required
                                            value={formData.password}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                {!isLogin && (
                                    <div className="auth-field" style={{ marginTop: 'var(--space-md)' }}>
                                        <label>Confirm Password</label>
                                        <div className="auth-input-wrap">
                                            <FiLock className="auth-input-icon" />
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                className="auth-input"
                                                placeholder="••••••••"
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {isLogin && (
                            <div className="auth-form-options">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="accent-gold" />
                                    <span className="text-tertiary">Remember me</span>
                                </label>
                                <a href="#" className="auth-forgot">Forgot Password?</a>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg auth-submit"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Login to Account' : 'Create Account')}
                            {!loading && <FiArrowRight className="ml-2" />}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>Or continue with</span>
                    </div>

                    <div className="auth-social">
                        <button className="btn-social">
                            <SiGoogle className="text-[#DB4437]" />
                            <span>Google</span>
                        </button>
                        <button className="btn-social">
                            <FiGithub />
                            <span>GitHub</span>
                        </button>
                    </div>

                    <p className="auth-footer">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); }}>
                            {isLogin ? 'Register now' : 'Log in here'}
                        </a>
                    </p>
                </motion.div>
            </div>

            {/* Back button */}
            <motion.button
                className="btn btn-icon btn-ghost"
                style={{ position: 'absolute', top: '2rem', left: '2rem' }}
                onClick={() => navigate(-1)}
                whileHover={{ x: -4 }}
            >
                <FiChevronLeft /> Back
            </motion.button>
        </div>
    );
};

export default Auth;
