import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import useStore from './store/useStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import './index.css';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Account = lazy(() => import('./pages/Account'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const Auth = lazy(() => import('./pages/Auth'));

// Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useStore();
  const location = useLocation();

  if (authLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Protected Admin Route
const ProtectedAdminRoute = ({ children }) => {
  const { adminAuthenticated } = useStore();

  if (!adminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// Page loading skeleton
const PageLoader = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    flexDirection: 'column',
    gap: '1rem',
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      border: '3px solid var(--border-color)',
      borderTopColor: 'var(--accent-primary)',
      borderRadius: '50%',
      animation: 'spin-slow 0.8s linear infinite',
    }} />
    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Loading...</span>
  </div>
);

// Animated page wrapper
const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Theme manager - Forced Dark Mode
const ThemeManager = () => {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);
  return null;
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <AnimatedPage>
            <Suspense fallback={<PageLoader />}><Home /></Suspense>
          </AnimatedPage>
        } />
        <Route path="/products" element={
          <AnimatedPage>
            <Suspense fallback={<PageLoader />}><Products /></Suspense>
          </AnimatedPage>
        } />
        <Route path="/product/:id" element={
          <AnimatedPage>
            <Suspense fallback={<PageLoader />}><ProductDetail /></Suspense>
          </AnimatedPage>
        } />
        <Route path="/cart" element={
          <AnimatedPage>
            <Suspense fallback={<PageLoader />}><Cart /></Suspense>
          </AnimatedPage>
        } />
        <Route path="/wishlist" element={
          <AnimatedPage>
            <Suspense fallback={<PageLoader />}><Wishlist /></Suspense>
          </AnimatedPage>
        } />
        <Route path="/account" element={
          <AnimatedPage>
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute><Account /></ProtectedRoute>
            </Suspense>
          </AnimatedPage>
        } />
        <Route path="/checkout" element={
          <AnimatedPage>
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute><Checkout /></ProtectedRoute>
            </Suspense>
          </AnimatedPage>
        } />
        <Route path="/login" element={
          <AnimatedPage>
            <Suspense fallback={<PageLoader />}><Auth /></Suspense>
          </AnimatedPage>
        } />
        <Route path="/orders" element={
          <AnimatedPage>
            <Suspense fallback={<PageLoader />}><OrderTracking /></Suspense>
          </AnimatedPage>
        } />

        {/* Admin Routes */}
        <Route path="/admin/login" element={
          <AnimatedPage>
            <Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>
          </AnimatedPage>
        } />

        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <Suspense fallback={<PageLoader />}><AdminLayout /></Suspense>
          </ProtectedAdminRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
          <Route path="products" element={<Suspense fallback={<PageLoader />}><AdminProducts /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<PageLoader />}><AdminOrders /></Suspense>} />
          <Route path="customers" element={<Suspense fallback={<PageLoader />}><AdminCustomers /></Suspense>} />
          <Route path="settings" element={<div style={{ padding: '2rem', textAlign: 'center' }}>Settings Coming Soon</div>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const Layout = ({ children }) => {
  const location = useLocation();
  // Check if current path is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {!isAdminRoute && <Navbar />}
      <main className="app__main" style={isAdminRoute ? { padding: 0, marginTop: 0 } : {}}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
      <Toast />
    </div>
  );
};

function App() {
  const { initAuth } = useStore();

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);

  return (
    <Router>
      <ThemeManager />
      <ScrollToTop />
      <Layout>
        <AppRoutes />
      </Layout>
    </Router>
  );
}

export default App;
