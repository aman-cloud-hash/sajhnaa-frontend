import { useRef, useEffect, useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Environment, Sparkles, useTexture } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight, FiAward, FiRefreshCw, FiShield, FiTruck, FiStar, FiHeart } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';
import './Home.css';
import FadeIn from '../components/FadeIn';

// 3D Ring for jewelry e-commerce
const HeroGem = () => {
    const ringRef = useRef();
    const diamondRef = useRef();
    const product = products[0]; // Bestseller Ring

    // Safety check for image
    const imageUrl = product?.image || 'https://images.unsplash.com/photo-1605100804763-047af5fef207?q=80&w=500&auto=format&fit=crop';
    const texture = useTexture(imageUrl);

    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.y = state.clock.elapsedTime * 0.5;
            ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
        }
        if (diamondRef.current) {
            diamondRef.current.rotation.y = state.clock.elapsedTime * 0.8;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
            <group ref={ringRef} scale={1.0} rotation={[Math.PI / 6, Math.PI / 4, 0]}>
                {/* Product Image on a 3D Plane */}
                <mesh castShadow position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
                    <boxGeometry args={[1.5, 1.5, 0.05]} />
                    <meshPhysicalMaterial
                        map={texture}
                        metalness={0.1}
                        roughness={0.2}
                        clearcoat={1}
                    />
                </mesh>

                {/* Ring Band */}
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
                    <torusGeometry args={[0.9, 0.08, 16, 64]} />
                    <meshPhysicalMaterial
                        color="#d4a853"
                        metalness={0.9}
                        roughness={0.1}
                        envMapIntensity={2}
                    />
                </mesh>

                {/* Diamond on top */}
                <mesh ref={diamondRef} position={[0, 0.6, 0]} scale={0.3}>
                    <octahedronGeometry args={[1, 0]} />
                    <meshPhysicalMaterial
                        color="#ffffff"
                        metalness={0.1}
                        roughness={0}
                        transmission={0.9}
                        thickness={1}
                        envMapIntensity={3}
                        transparent
                        opacity={0.9}
                    />
                </mesh>

                {/* Diamond sparkles */}
                <Sparkles
                    count={20}
                    scale={2}
                    size={2}
                    speed={0.3}
                    color="#ffffff"
                    opacity={0.8}
                    position={[0, 0.6, 0]}
                />
            </group>
        </Float>
    );
};

const BridalGem = () => {
    const bridalProduct = products.find(p => p.badge === 'Bridal') || products[0];
    const texture = useTexture(bridalProduct.image);

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh scale={2.5}>
                <boxGeometry args={[1.2, 1.2, 0.05]} />
                <meshPhysicalMaterial
                    map={texture}
                    metalness={0.2}
                    roughness={0.2}
                    clearcoat={1}
                />
            </mesh>
        </Float>
    );
};

const Home = () => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll();
    const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

    const trending = products.filter(p => p.badge === 'Bestseller' || p.badge === 'Trending' || p.badge === 'Popular');
    const newArrivals = products.filter(p => p.badge === 'New Arrival' || p.badge === 'New');
    const bridal = products.filter(p => p.badge === 'Bridal' || p.badge === 'Heritage' || p.badge === 'Premium');

    return (
        <div className="home">
            {/* ═══════════ HERO ═══════════ */}
            <section className="hero" ref={heroRef}>
                <div className="hero__bg">
                    <img
                        src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2000&auto=format&fit=crop"
                        alt="Premium Jewelry Background"
                        className="hero__bg-img"
                    />
                    <div className="hero__overlay" />
                </div>

                <motion.div className="hero__content container" style={{ y: heroY, opacity: heroOpacity }}>
                    <motion.span
                        className="hero__label"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        ✦ Handcrafted with Love ✦
                    </motion.span>
                    <motion.h1
                        className="hero__title text-display"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Anti-Tarnish &<br />
                        <span className="hero__title-accent">Demi-Fine Luxury</span>
                    </motion.h1>
                    <motion.p
                        className="hero__subtitle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Discover timeless jewelry that speaks your language. From everyday elegance to bridal splendor — each piece crafted to celebrate you.
                    </motion.p>
                    <motion.div
                        className="hero__cta"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Explore Collection <FiArrowRight />
                        </Link>
                        <Link to="/products?category=rings" className="btn btn-outline btn-lg">
                            Shop Rings
                        </Link>
                    </motion.div>
                </motion.div>

                <div className="hero__scroll-hint">
                    <span>Scroll to Discover</span>
                    <div className="hero__scroll-line" />
                </div>
            </section>



            {/* ═══════════ TRUST BAR ═══════════ */}
            <section className="trust-bar">
                <div className="container">
                    <div className="trust-bar__grid">
                        <FadeIn delay={0.1}>
                            <div className="trust-bar__item">
                                <FiAward />
                                <div>
                                    <strong>Anti-Tarnish</strong>
                                    <span>Jewelry</span>
                                </div>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <div className="trust-bar__item">
                                <FiTruck />
                                <div>
                                    <strong>Insured Shipping</strong>
                                    <span>Free on All Orders</span>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ═══════════ CATEGORIES ═══════════ */}
            <section className="section categories-section">
                <div className="container">
                    <div className="section__header">
                        <FadeIn>
                            <span className="section__label">Shop by Category</span>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <h2 className="section__title text-display">Find Your Perfect Piece</h2>
                        </FadeIn>
                    </div>
                    <div className="categories-grid">
                        {categories.map((cat, i) => (
                            <FadeIn key={cat.id} delay={i * 0.1}>
                                <Link to={`/products?category=${cat.id}`} className="category-card">
                                    <div className="category-card__img-container">
                                        <img src={cat.image} alt={cat.name} className="category-card__img" />
                                    </div>
                                    <h3 className="category-card__name">{cat.name}</h3>
                                    <span className="category-card__count">{cat.count} Designs</span>
                                    <span className="category-card__arrow"><FiArrowRight /></span>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ TRENDING ═══════════ */}
            <section className="section">
                <div className="container">
                    <div className="section__header">
                        <FadeIn>
                            <span className="section__label">Most Loved</span>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <h2 className="section__title text-display">Trending Right Now</h2>
                        </FadeIn>
                    </div>
                    <div className="products-grid">
                        {trending.map((p, i) => (
                            <ProductCard key={p.id} product={p} index={i} />
                        ))}
                    </div>
                    <FadeIn delay={0.2} className="section__cta">
                        <Link to="/products" className="btn btn-outline btn-lg">View All Jewelry <FiArrowRight /></Link>
                    </FadeIn>
                </div>
            </section>

            {/* ═══════════ BRIDAL BANNER ═══════════ */}
            <section className="bridal-banner">
                <div className="container">
                    <div className="bridal-banner__content">
                        <div className="bridal-banner__text">
                            <FadeIn>
                                <span className="bridal-banner__label">✦ Bridal Collection ✦</span>
                            </FadeIn>
                            <FadeIn delay={0.1}>
                                <h2 className="bridal-banner__title text-display">
                                    Your Dream Jewelry<br />for the Big Day
                                </h2>
                            </FadeIn>
                            <FadeIn delay={0.2}>
                                <p className="bridal-banner__desc">
                                    From polki sets to diamond solitaires — explore our curated bridal collection designed to make your special moments unforgettable.
                                </p>
                            </FadeIn>
                            <FadeIn delay={0.3}>
                                <Link to="/products?category=bangles" className="btn btn-primary btn-lg">
                                    Shop Bridal <FiHeart />
                                </Link>
                            </FadeIn>
                        </div>
                        {/* Visual keeps Canvas */}
                        <FadeIn delay={0.2} className="bridal-banner__visual">
                            <div className="bridal-banner__img-fallback">
                                <img
                                    src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop"
                                    alt="Bridal Collection Preview"
                                    className="bridal-banner__img"
                                />
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ═══════════ NEW ARRIVALS ═══════════ */}
            <section className="section">
                <div className="container">
                    <div className="section__header">
                        <FadeIn>
                            <span className="section__label">✦ Just In ✦</span>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <h2 className="section__title text-display">New Arrivals</h2>
                        </FadeIn>
                    </div>
                    <div className="products-grid">
                        {newArrivals.map((p, i) => (
                            <ProductCard key={p.id} product={p} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ HERITAGE PICKS ═══════════ */}
            {bridal.length > 0 && (
                <section className="section">
                    <div className="container">
                        <div className="section__header">
                            <FadeIn>
                                <span className="section__label">Heritage & Premium</span>
                            </FadeIn>
                            <FadeIn delay={0.1}>
                                <h2 className="section__title text-display">Timeless Masterpieces</h2>
                            </FadeIn>
                        </div>
                        <div className="products-grid">
                            {bridal.map((p, i) => (
                                <ProductCard key={p.id} product={p} index={i} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════ STATS ═══════════ */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {[
                            { value: '25K+', label: 'Happy Customers' },
                            { value: '5000+', label: 'Jewelry Designs' },
                            { value: '100%', label: 'Certified Gold' },
                            { value: '50+', label: 'Years of Craft' },
                        ].map((stat, i) => (
                            <FadeIn key={i} delay={i * 0.1} className="stat-card">
                                <span className="stat-card__value">{stat.value}</span>
                                <span className="stat-card__label">{stat.label}</span>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ TESTIMONIAL ═══════════ */}
            <section className="section testimonial-section">
                <div className="container">
                    <div className="section__header">
                        <FadeIn>
                            <span className="section__label">Loved by Thousands</span>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <h2 className="section__title text-display">What Our Customers Say</h2>
                        </FadeIn>
                    </div>
                    <div className="testimonials-grid">
                        {[
                            { name: 'Priya M.', text: 'The solitaire ring was even more beautiful in person. The diamond sparkles are absolutely mesmerizing!', rating: 5 },
                            { name: 'Ananya R.', text: 'Bought the jhumka earrings for my wedding. The craftsmanship is incredible — received so many compliments.', rating: 5 },
                            { name: 'Kavita S.', text: 'Sajhnaa has become my go-to for gifting. The packaging is premium and delivery is always on time.', rating: 5 },
                        ].map((review, i) => (
                            <FadeIn key={i} delay={i * 0.15} className="testimonial-card">
                                <div className="testimonial-card__stars">
                                    {[...Array(review.rating)].map((_, si) => (
                                        <FiStar key={si} className="star--filled" />
                                    ))}
                                </div>
                                <p className="testimonial-card__text">"{review.text}"</p>
                                <span className="testimonial-card__author">— {review.name}</span>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
