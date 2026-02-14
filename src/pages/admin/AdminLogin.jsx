import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useStore from '../../store/useStore';
import logoImg from '../../assets/logo.svg';
import './AdminLogin.css';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { adminLogin } = useStore();

    const handleLogin = (e) => {
        e.preventDefault();
        if (adminLogin(password)) {
            navigate('/admin/dashboard');
        } else {
            setError('Incorrect Password');
            setPassword('');
            // Shake animation trigger could be added here
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-overlay"></div>
            <motion.div
                className="admin-login-box"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="admin-logo">
                    <img src={logoImg} alt="SAJHNAA" className="admin-logo-img" style={{ height: '90px' }} />
                    <span>ADMIN PANEL</span>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Enter Admin Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            autoFocus
                        />
                        <span className="focus-border"></span>
                    </div>

                    {error && <motion.p
                        className="error-msg"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                    >{error}</motion.p>}

                    <button type="submit" className="admin-login-btn">
                        ACCESS DASHBOARD
                    </button>
                </form>

                <div className="decorative-corner top-left"></div>
                <div className="decorative-corner bottom-right"></div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
