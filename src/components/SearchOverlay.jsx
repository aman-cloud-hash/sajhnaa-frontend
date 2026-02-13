import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiX, FiArrowRight } from 'react-icons/fi';
import { products } from '../data/products';
import useStore from '../store/useStore';
import './SearchOverlay.css';

const SearchOverlay = () => {
    const { toggleSearch } = useStore();
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const results = query.trim()
        ? products.filter(
            (p) =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.category.toLowerCase().includes(query.toLowerCase()) ||
                p.description.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    const popular = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Pendants'];

    return (
        <motion.div
            className="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={toggleSearch}
        >
            <motion.div
                className="search-overlay__content"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="search-overlay__input-wrap">
                    <FiSearch className="search-overlay__icon" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search rings, necklaces, earrings..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-overlay__input"
                        aria-label="Search products"
                    />
                    <button onClick={toggleSearch} className="search-overlay__close" aria-label="Close search">
                        <FiX />
                    </button>
                </div>

                {!query.trim() && (
                    <div className="search-overlay__popular">
                        <p className="search-overlay__label">Popular Searches</p>
                        <div className="search-overlay__tags">
                            {popular.map((tag) => (
                                <button key={tag} className="search-overlay__tag" onClick={() => setQuery(tag)}>
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {results.length > 0 && (
                    <div className="search-overlay__results">
                        {results.map((product) => (
                            <Link
                                key={product.id}
                                to={`/product/${product.id}`}
                                className="search-overlay__result"
                                onClick={toggleSearch}
                            >
                                <div className="search-overlay__result-img-container">
                                    <img src={product.image} alt="" className="search-overlay__result-img" />
                                </div>
                                <div className="search-overlay__result-info">
                                    <span className="search-overlay__result-name">{product.name}</span>
                                    <span className="search-overlay__result-category">{product.category}</span>
                                </div>
                                <span className="search-overlay__result-price">₹{product.price.toLocaleString()}</span>
                                <FiArrowRight />
                            </Link>
                        ))}
                    </div>
                )}

                {query.trim() && results.length === 0 && (
                    <div className="search-overlay__empty">
                        <p>No results found for &ldquo;{query}&rdquo;</p>
                        <p className="search-overlay__empty-sub">Try different keywords or browse our categories</p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default SearchOverlay;
