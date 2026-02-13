import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck } from 'react-icons/fi';
import useStore from '../../store/useStore';
import './AdminProducts.css';

const AdminProducts = () => {
    const { products, deleteProduct, addProduct, updateProduct } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: 'rings',
        price: '',
        originalPrice: '',
        image: '',
        description: '',
        rating: 4.5,
        reviews: 0,
        badge: ''
    });

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            originalPrice: product.originalPrice || '',
            image: product.image,
            description: product.description || '',
            rating: product.rating,
            reviews: product.reviews,
            badge: product.badge || ''
        });
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setCurrentProduct(null);
        setFormData({
            name: '',
            category: 'rings',
            price: '',
            originalPrice: '',
            image: '',
            description: '',
            rating: 4.5,
            reviews: 0,
            badge: ''
        });
        setIsEditing(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: Number(formData.price),
            originalPrice: Number(formData.originalPrice),
            rating: Number(formData.rating),
            reviews: Number(formData.reviews),
            colorNames: ['Gold'], // Default for now
            sizes: ['Standard'], // Default
            features: ['Premium Quality'], // Default
            material: 'Gold', // Default
        };

        if (currentProduct) {
            updateProduct(currentProduct.id, productData);
        } else {
            addProduct({
                ...productData,
                id: Date.now(), // Fallback ID if store doesn't handle it (store handles it actually)
            });
        }
        setIsEditing(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    return (
        <div className="admin-products-page">
            <div className="page-header">
                <div className="header-title">
                    <h2>Products Management</h2>
                    <p>Manage your catalog, prices, and inventory</p>
                </div>
                <button className="add-btn" onClick={handleAddNew}>
                    <FiPlus /> Add New Product
                </button>
            </div>

            <div className="search-bar-container">
                <FiSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search products by name or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="products-table-container">
                <table className="admin-products-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filteredProducts.map((product) => (
                                <motion.tr
                                    key={product.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    layout
                                >
                                    <td className="col-image">
                                        <img src={product.image} alt={product.name} />
                                    </td>
                                    <td className="col-name">
                                        <strong>{product.name}</strong>
                                        {product.badge && <span className="product-badge">{product.badge}</span>}
                                    </td>
                                    <td className="col-category">{product.category}</td>
                                    <td className="col-price">
                                        ₹{product.price.toLocaleString()}
                                        {product.originalPrice && <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>}
                                    </td>
                                    <td className="col-rating">★ {product.rating}</td>
                                    <td className="col-actions">
                                        <button className="icon-btn edit" onClick={() => handleEdit(product)}><FiEdit2 /></button>
                                        <button className="icon-btn delete" onClick={() => handleDelete(product.id)}><FiTrash2 /></button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
                {filteredProducts.length === 0 && (
                    <div className="no-results">
                        <p>No products found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>

            {/* Edit/Add Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="modal-backdrop">
                        <motion.div
                            className="modal-content"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="modal-header">
                                <h3>{currentProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                <button onClick={() => setIsEditing(false)}><FiX /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="product-form">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="E.g. Diamond Ring"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="rings">Rings</option>
                                            <option value="necklaces">Necklaces</option>
                                            <option value="earrings">Earrings</option>
                                            <option value="bracelets">Bracelets</option>
                                            <option value="pendants">Pendants</option>
                                            <option value="bangles">Bangles</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Image URL</label>
                                        <input
                                            required
                                            value={formData.image}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Price (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Original Price (₹)</label>
                                        <input
                                            type="number"
                                            value={formData.originalPrice}
                                            onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        rows="3"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Rating</label>
                                        <input
                                            type="number" step="0.1" max="5"
                                            value={formData.rating}
                                            onChange={e => setFormData({ ...formData, rating: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Badge (Optional)</label>
                                        <input
                                            value={formData.badge}
                                            onChange={e => setFormData({ ...formData, badge: e.target.value })}
                                            placeholder="e.g. Bestseller"
                                        />
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                                    <button type="submit" className="btn-save"><FiCheck /> Save Product</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminProducts;
