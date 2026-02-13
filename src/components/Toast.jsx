import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';
import useStore from '../store/useStore';
import './Toast.css';

const icons = {
    success: <FiCheck />,
    error: <FiAlertCircle />,
    warning: <FiAlertTriangle />,
    info: <FiInfo />,
};

const Toast = () => {
    const { notifications, removeNotification } = useStore();

    return (
        <div className="toast-container" role="alert" aria-live="polite">
            <AnimatePresence>
                {notifications.map((notif) => (
                    <motion.div
                        key={notif.id}
                        className={`toast toast--${notif.type}`}
                        initial={{ x: 400, opacity: 0, scale: 0.8 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        exit={{ x: 400, opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', damping: 20 }}
                    >
                        <span className="toast__icon">{icons[notif.type]}</span>
                        <div className="toast__content">
                            <strong className="toast__title">{notif.title}</strong>
                            <p className="toast__message">{notif.message}</p>
                        </div>
                        <button className="toast__close" onClick={() => removeNotification(notif.id)} aria-label="Close notification">
                            <FiX />
                        </button>
                        <motion.div
                            className="toast__progress"
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: 0 }}
                            transition={{ duration: 4, ease: 'linear' }}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Toast;
