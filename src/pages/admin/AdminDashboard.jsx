import React from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiShoppingBag, FiUsers, FiPackage, FiRefreshCw } from 'react-icons/fi';
import useStore from '../../store/useStore';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { orders, user, customers, products } = useStore();

    // Calculate Stats
    const totalSales = orders.filter(o => o.status !== 'cancelled').reduce((acc, order) => acc + order.total, 0);
    const totalOrders = orders.length;

    // Recent Revenue (Actual Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentRevenue = orders
        .filter(o => o.status !== 'cancelled' && new Date(o.date) >= sevenDaysAgo)
        .reduce((acc, o) => acc + o.total, 0);

    // Genuine User Count based on Firestore users collection + unique emails in orders
    const uniqueEmails = new Set(orders.map(o => o.customerEmail));
    if (user?.email) uniqueEmails.add(user.email);
    const registeredUsersCount = Math.max(customers?.length || 0, uniqueEmails.size, 1);

    // Genuine stats based on available data
    const stats = [
        {
            title: 'Total Sales',
            value: `₹${totalSales.toLocaleString()}`,
            icon: <FiDollarSign />,
            color: '#eaeaea',
            description: 'Lifetime income'
        },
        {
            title: 'Total Orders',
            value: totalOrders,
            icon: <FiShoppingBag />,
            color: '#4facfe',
            description: 'Orders processed'
        },
        {
            title: 'Recent Revenue',
            value: `₹${recentRevenue.toLocaleString()}`,
            icon: <FiDollarSign />,
            color: '#00f260',
            description: 'Last 7 days revenue'
        },
        {
            title: 'Registered Users',
            value: registeredUsersCount.toLocaleString(),
            icon: <FiUsers />,
            color: '#ff5757',
            description: 'Total customers'
        },
    ];

    const recentOrders = orders.slice(0, 5);

    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const { refreshOrders } = useStore();

    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Manual one-time refresh
        await refreshOrders();
        setIsRefreshing(false);
    };

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>Dashboard Overview <span style={{ fontSize: '0.5em', opacity: 0.5 }}>(Live V2.0)</span></h1>
                    <p>Welcome back. Here is your store's live data.</p>
                </div>
                <div className="current-date" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <motion.button
                        onClick={handleRefresh}
                        className="btn-ghost"
                        style={{ padding: '8px', borderRadius: '50%' }}
                        animate={{ rotate: isRefreshing ? 360 : 0 }}
                        transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}
                        title="Refresh Data"
                    >
                        <FiRefreshCw />
                    </motion.button>
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </header>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <motion.div
                        className="stat-card"
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="stat-card-top">
                            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                                {stat.icon}
                            </div>
                        </div>
                        <div className="stat-info">
                            <h4>{stat.title}</h4>
                            <h2>{stat.value}</h2>
                            <p className="stat-desc">{stat.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="dashboard-sections">
                <motion.div
                    className="recent-orders-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="section-header">
                        <h3>Recent Orders</h3>
                        <button className="view-all-btn">View All Orders</button>
                    </div>
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Product</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="order-id">#{order.id}</td>
                                        <td>
                                            <div className="customer-cell">
                                                <div className="customer-avatar">
                                                    {order.customerName?.charAt(0) || 'G'}
                                                </div>
                                                <div className="customer-meta">
                                                    <span className="customer-name">{order.customerName || 'Guest'}</span>
                                                    <span className="customer-email">{order.customerEmail || ''}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="product-cell">
                                            {order.items[0]?.name}
                                            {order.items.length > 1 && <span className="more-items"> +{order.items.length - 1} more</span>}
                                        </td>
                                        <td className="amount-cell">₹{order.total.toLocaleString()}</td>
                                        <td>{order.date}</td>
                                        <td>
                                            <span className={`status-badge ${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
