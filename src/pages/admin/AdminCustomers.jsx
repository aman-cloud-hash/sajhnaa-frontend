import React, { useMemo } from 'react';
import { FiUsers, FiMail, FiShoppingCart } from 'react-icons/fi';
import useStore from '../../store/useStore';
import './AdminCustomers.css';

const AdminCustomers = () => {
    const { orders } = useStore();

    // Derive unique customers from orders (Genuine Data)
    const customers = useMemo(() => {
        const unique = {};

        // Sort orders by date descending to get latest info first
        const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedOrders.forEach(order => {
            // Use top-level customer fields we added recently
            const emailKey = order.customerEmail || order.shippingAddress?.email || 'guest@example.com';

            if (!unique[emailKey]) {
                unique[emailKey] = {
                    id: emailKey,
                    name: order.customerName || order.shippingAddress?.name || 'Guest User',
                    email: emailKey,
                    phone: order.shippingAddress?.phone || 'N/A',
                    city: order.shippingAddress?.city || 'Unknown',
                    totalSpent: 0,
                    orderCount: 0,
                    lastOrderDate: order.date,
                    status: 'Active' // Simple logic: everyone with an order is active
                };
            }

            // Accumulate stats
            if (order.status !== 'cancelled') {
                unique[emailKey].totalSpent += order.total;
            }
            unique[emailKey].orderCount += 1;
        });

        return Object.values(unique);
    }, [orders]);

    return (
        <div className="admin-customers-page">
            <div className="customers-header">
                <h2>Customer Insights</h2>
                <div className="summary-cards">
                    <div className="summary-card">
                        <FiUsers className="icon" />
                        <div>
                            <h4>Total Customers</h4>
                            <h3>{customers.length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="customers-table-container">
                <table className="customers-table">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Contact Info</th>
                            <th>Location</th>
                            <th>Total Spent</th>
                            <th>Orders</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="customer-name">
                                        <div className="avatar">{customer.name.charAt(0)}</div>
                                        <div>
                                            <div>{customer.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 'normal' }}>ID: #{customer.id.substring(0, 8)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="contact-info">
                                        <span>
                                            <FiMail className="contact-icon" /> {customer.email}
                                        </span>
                                        {/* <span><FiPhone className="contact-icon" /> {customer.phone}</span> */}
                                    </div>
                                </td>
                                <td>
                                    <span style={{ color: 'var(--text-secondary)' }}>{customer.city}</span>
                                </td>
                                <td className="spent-amount">₹{customer.totalSpent.toLocaleString()}</td>
                                <td>
                                    <span className="order-count-badge">
                                        {customer.orderCount}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${customer.status.toLowerCase()}`}>
                                        {customer.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {customers.length === 0 && (
                    <div className="no-customers">
                        <p>No customer data available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCustomers;
