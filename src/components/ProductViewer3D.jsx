import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment, ContactShadows, useTexture } from '@react-three/drei';
import { FiMove, FiZoomIn } from 'react-icons/fi';
import './ProductViewer3D.css';

const ProductModel = ({ image, color = '#eaeaea' }) => {
    const meshRef = useRef();

    // Safety fallback for image
    const imageUrl = image || 'https://images.unsplash.com/photo-1605100804763-047af5fef207?q=80&w=500&auto=format&fit=crop';
    const texture = useTexture(imageUrl);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group ref={meshRef}>
                {/* Product Image on a 3D Plane */}
                <mesh castShadow>
                    <boxGeometry args={[2.5, 2.5, 0.1]} />
                    <meshPhysicalMaterial
                        map={texture}
                        metalness={0.2}
                        roughness={0.2}
                        clearcoat={1}
                    />
                </mesh>

                {/* Decorative Frame */}
                <mesh>
                    <boxGeometry args={[2.7, 2.7, 0.05]} />
                    <meshPhysicalMaterial
                        color={color}
                        metalness={0.9}
                        roughness={0.1}
                        clearcoat={1}
                        envMapIntensity={2}
                    />
                </mesh>

                {/* Floating Orbitals */}
                {[0, 1, 2].map((i) => (
                    <mesh key={i} position={[Math.cos(i * 2) * 2, Math.sin(i * 2) * 1, 0]}>
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshPhysicalMaterial
                            color={color}
                            metalness={1}
                            roughness={0}
                            emissive={color}
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                ))}
            </group>
        </Float>
    );
};

// Check for WebGL support
const isWebGLAvailable = () => {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
};

const LoadingFallback = () => (
    <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#c3a16e" wireframe />
    </mesh>
);

const ProductViewer3D = ({ product, miniMode = false }) => {
    const accentColor = product?.colors?.[0] || '#c3a16e';

    if (!isWebGLAvailable()) {
        return (
            <div className={`viewer3d ${miniMode ? 'viewer3d--mini' : ''}`}>
                <div className="viewer3d__fallback">
                    <img src={product?.image} alt={product?.name} className="viewer3d__fallback-img" />
                </div>
            </div>
        );
    }

    return (
        <div className={`viewer3d ${miniMode ? 'viewer3d--mini' : ''}`}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            >
                <Suspense fallback={<LoadingFallback />}>
                    <ambientLight intensity={0.3} />
                    <spotLight
                        position={[10, 10, 5]}
                        angle={0.3}
                        penumbra={1}
                        intensity={1}
                        castShadow
                    />
                    <pointLight position={[-10, -10, -5]} intensity={0.5} color="#a8834e" />

                    <ProductModel image={product?.image} color={accentColor} />

                    <ContactShadows
                        position={[0, -2, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2}
                    />

                    <Environment preset="city" />

                    {!miniMode && (
                        <OrbitControls
                            enableZoom={true}
                            enablePan={false}
                            minDistance={3}
                            maxDistance={8}
                            autoRotate
                            autoRotateSpeed={1}
                        />
                    )}
                </Suspense>
            </Canvas>

            {!miniMode && (
                <div className="viewer3d__controls-hint">
                    <span><FiMove /> Drag to rotate</span>
                    <span><FiZoomIn /> Scroll to zoom</span>
                </div>
            )}
        </div>
    );
};

export default ProductViewer3D;
