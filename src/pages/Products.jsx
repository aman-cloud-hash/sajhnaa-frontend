import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiGrid, FiList, FiX, FiChevronDown, FiStar, FiSliders } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/products';
import useStore from '../store/useStore';
import './Products.css';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { filters = {}, setFilters, resetFilters, products = [], fetchProducts, productsLoading } = useStore();
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const unsubscribe = fetchProducts();
        return () => unsubscribe();
    }, [fetchProducts]);

    const activeCategory = searchParams.get('category') || 'all';

    const sortOptions = [
        { value: 'featured', label: 'Featured' },
        { value: 'price-asc', label: 'Price: Low → High' },
        { value: 'price-desc', label: 'Price: High → Low' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'newest', label: 'Newest' },
        { value: 'name', label: 'Name A-Z' },
    ];

    const allColors = [...new Set(products.flatMap(p => p.colorNames || []))];
    const allSizes = [...new Set(products.flatMap(p => p.sizes || []))];

    const filteredProducts = useMemo(() => {
        if (!products) return [];
        let result = [...products];

        // Category
        if (activeCategory !== 'all') {
            result = result.filter(p => p.category === activeCategory);
        }

        // Search
        if (filters?.searchQuery) {
            const q = filters.searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name?.toLowerCase().includes(q) ||
                p.category?.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q)
            );
        }

        // Price Range
        if (filters?.priceRange) {
            result = result.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
        }

        // Rating
        if (filters?.rating > 0) {
            result = result.filter(p => p.rating >= filters.rating);
        }

        // Colors
        if (filters?.colors?.length > 0) {
            result = result.filter(p => p.colorNames?.some(c => filters.colors.includes(c)));
        }

        // Sizes
        if (filters?.sizes?.length > 0) {
            result = result.filter(p => p.sizes?.some(s => filters.sizes.includes(s)));
        }

        // Sort
        const safeSortBy = filters?.sortBy || 'featured';
        switch (safeSortBy) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break;
            case 'price-desc': result.sort((a, b) => b.price - a.price); break;
            case 'rating': result.sort((a, b) => b.rating - a.rating); break;
            case 'name': result.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
            case 'newest':
                result.sort((a, b) => {
                    const dateA = new Date(a.createdAt || 0).getTime();
                    const dateB = new Date(b.createdAt || 0).getTime();
                    if (dateA !== dateB) return dateB - dateA;
                    // Fallback to numeric ID if available
                    return (typeof b.id === 'number' && typeof a.id === 'number') ? b.id - a.id : 0;
                });
                break;
            default: break;
        }

        return result;
    }, [activeCategory, filters, products]);

    const hasActiveFilters = filters?.rating > 0 || (filters?.colors?.length || 0) > 0 || (filters?.sizes?.length || 0) > 0 || (filters?.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000));
    const activeFilterCount = (filters?.rating > 0 ? 1 : 0) + (filters?.colors?.length || 0) + (filters?.sizes?.length || 0) + (filters?.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) ? 1 : 0);

    return (
        <div className="products-page">
            {/* Page Header */}
            <div className="products-page__header">
                <div className="container">
                    <motion.h1
                        className="products-page__title text-display"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {activeCategory === 'all' ? 'All Jewelry' : categories.find(c => c.id === activeCategory)?.name || 'Jewelry'}
                    </motion.h1>
                    <p className="products-page__count">{filteredProducts.length} designs</p>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="products-page__categories">
                <div className="container">
                    <div className="category-tabs">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`category-tab ${activeCategory === cat.id ? 'category-tab--active' : ''}`}
                                onClick={() => {
                                    if (cat.id === 'all') {
                                        setSearchParams({});
                                    } else {
                                        setSearchParams({ category: cat.id });
                                    }
                                }}
                            >
                                {cat.id !== 'all' && (
                                    <div className="category-tab__img-container">
                                        <img src={cat.image} alt="" className="category-tab__img" />
                                    </div>
                                )}
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="products-page__layout">
                    {/* Filters Sidebar */}
                    <aside className={`filters-sidebar ${showFilters ? 'filters-sidebar--open' : ''}`}>
                        <div className="filters-sidebar__header">
                            <h3><FiSliders /> Filters</h3>
                            {hasActiveFilters && (
                                <button className="btn btn-ghost btn-sm" onClick={resetFilters}>Clear All</button>
                            )}
                        </div>

                        {/* Search */}
                        <div className="filter-group">
                            <h4 className="filter-group__title">Search</h4>
                            <input
                                type="text"
                                className="input"
                                placeholder="Search jewelry..."
                                value={filters.searchQuery}
                                onChange={(e) => setFilters({ searchQuery: e.target.value })}
                                aria-label="Search products"
                            />
                        </div>

                        {/* Price Range */}
                        <div className="filter-group">
                            <h4 className="filter-group__title">Price Range</h4>
                            <div className="filter-group__price">
                                <span>₹{filters.priceRange[0].toLocaleString()}</span>
                                <span>—</span>
                                <span>₹{filters.priceRange[1].toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100000"
                                step="5000"
                                value={filters.priceRange[1]}
                                onChange={(e) => setFilters({ priceRange: [filters.priceRange[0], parseInt(e.target.value)] })}
                                className="filter-range"
                                aria-label="Maximum price"
                            />
                            <input
                                type="range"
                                min="0"
                                max="100000"
                                step="5000"
                                value={filters.priceRange[0]}
                                onChange={(e) => setFilters({ priceRange: [parseInt(e.target.value), filters.priceRange[1]] })}
                                className="filter-range"
                                aria-label="Minimum price"
                            />
                        </div>

                        {/* Rating */}
                        <div className="filter-group">
                            <h4 className="filter-group__title">Minimum Rating</h4>
                            <div className="filter-rating">
                                {[0, 4, 4.5, 4.7, 4.8].map(r => (
                                    <button
                                        key={r}
                                        className={`filter-rating__btn ${filters.rating === r ? 'filter-rating__btn--active' : ''}`}
                                        onClick={() => setFilters({ rating: r })}
                                    >
                                        {r === 0 ? 'All' : <><FiStar className="filter-rating__star" /> {r}+</>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Colors */}
                        <div className="filter-group">
                            <h4 className="filter-group__title">Colors</h4>
                            <div className="filter-colors">
                                {allColors.slice(0, 12).map(color => (
                                    <button
                                        key={color}
                                        className={`filter-color-btn ${filters.colors.includes(color) ? 'filter-color-btn--active' : ''}`}
                                        onClick={() => {
                                            const next = filters.colors.includes(color)
                                                ? filters.colors.filter(c => c !== color)
                                                : [...filters.colors, color];
                                            setFilters({ colors: next });
                                        }}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile close */}
                        <button className="filters-sidebar__close" onClick={() => setShowFilters(false)} aria-label="Close filters">
                            <FiX />
                        </button>
                    </aside>

                    {/* Products Main */}
                    <main className="products-page__main">
                        {/* Toolbar */}
                        <div className="products-toolbar">
                            <button className="btn btn-secondary btn-sm filters-toggle" onClick={() => setShowFilters(true)}>
                                <FiFilter /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                            </button>

                            <div className="products-toolbar__right">
                                <select
                                    className="products-toolbar__sort"
                                    value={filters.sortBy}
                                    onChange={(e) => setFilters({ sortBy: e.target.value })}
                                    aria-label="Sort products"
                                >
                                    {sortOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <div className="products-toolbar__view">
                                    <button
                                        className={`products-toolbar__view-btn ${viewMode === 'grid' ? 'products-toolbar__view-btn--active' : ''}`}
                                        onClick={() => setViewMode('grid')}
                                        aria-label="Grid view"
                                    >
                                        <FiGrid />
                                    </button>
                                    <button
                                        className={`products-toolbar__view-btn ${viewMode === 'list' ? 'products-toolbar__view-btn--active' : ''}`}
                                        onClick={() => setViewMode('list')}
                                        aria-label="List view"
                                    >
                                        <FiList />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Pills */}
                        {hasActiveFilters && (
                            <div className="active-filters">
                                {filters.colors.map(c => (
                                    <span key={c} className="active-filter-pill">
                                        {c} <FiX onClick={() => setFilters({ colors: filters.colors.filter(x => x !== c) })} />
                                    </span>
                                ))}
                                {filters.rating > 0 && (
                                    <span className="active-filter-pill">
                                        {filters.rating}+ Stars <FiX onClick={() => setFilters({ rating: 0 })} />
                                    </span>
                                )}
                                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) && (
                                    <span className="active-filter-pill">
                                        ₹{filters.priceRange[0]}–₹{filters.priceRange[1]} <FiX onClick={() => setFilters({ priceRange: [0, 100000] })} />
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Products */}
                        <AnimatePresence mode="wait">
                            {filteredProducts.length > 0 ? (
                                <motion.div
                                    key={`${activeCategory}-${filters.sortBy}`}
                                    className={`products-grid ${viewMode === 'list' ? 'products-grid--list' : ''}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {filteredProducts.map((product, i) => (
                                        <ProductCard key={product.id} product={product} index={i} />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    className="products-empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="products-empty__icon-container">
                                        <FiStar />
                                    </div>
                                    <h3>No products found</h3>
                                    <p>Try adjusting your filters or search criteria</p>
                                    <button className="btn btn-primary" onClick={resetFilters}>Clear Filters</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Products;
