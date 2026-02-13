import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import useStore from '../../store/useStore';
import './AdminOrders.css';

const AdminOrders = () => {
    const { orders, updateOrderStatus } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'processing': return '#ffc107'; // Amber
            case 'shipped': return '#2196f3'; // Blue
            case 'delivered': return '#4caf50'; // Green
            case 'cancelled': return '#f44336'; // Red
            default: return '#999';
        }
    };

    return (
        <div className="admin-orders-page">
            <div className="orders-header">
                <div className="header-left">
                    <h2>Order Management</h2>
                    <p>Manage and track all customer orders</p>
                </div>
                <div className="orders-controls">
                    <div className="search-order">
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Search by ID or Customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="status-filter"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="orders-table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>Product Name</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filteredOrders.map(order => (
                                <motion.tr
                                    key={order.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    layout
                                >
                                    <td className="order-id">#{order.id}</td>
                                    <td>
                                        <div className="customer-info">
                                            <strong>{order.customerName || 'Guest'}</strong>
                                            <span>{order.customerEmail || ''}</span>
                                        </div>
                                    </td>
                                    <td className="product-info">
                                        <span title={order.items.map(i => i.name).join(', ')}>
                                            {order.items[0]?.name}
                                            {order.items.length > 1 && <span className="more-count"> +{order.items.length - 1} more</span>}
                                        </span>
                                    </td>
                                    <td className="order-total">₹{order.total.toLocaleString()}</td>
                                    <td>{order.date}</td>
                                    <td>
                                        <div className="status-cell">
                                            <select
                                                className={`status-select ${order.status}`}
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                style={{ borderColor: getStatusColor(order.status) }}
                                            >
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className="no-orders text-center">
                        <p>No orders found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
