import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as initialProducts } from '../data/products';

const generateOrderId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'SJ-';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

const useStore = create(
  persist(
    (set, get) => ({
      // Dark Mode
      darkMode: true,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      // Products (Admin)
      products: initialProducts,
      addProduct: (product) => {
        set((state) => ({ products: [...state.products, { ...product, id: Date.now() }] }));
        get().addNotification('Product Added', `${product.name} has been added to catalog.`, 'success');
      },
      updateProduct: (id, updatedData) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updatedData } : p)),
        }));
        get().addNotification('Product Updated', 'Product details have been saved.', 'success');
      },
      deleteProduct: (id) => {
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
        get().addNotification('Product Deleted', 'Product has been removed from catalog.', 'info');
      },

      // Cart
      cart: [],
      addToCart: (product, quantity = 1, selectedSize = null, selectedColor = null) => {
        const cart = get().cart;
        const existingIndex = cart.findIndex(
          (item) => item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
        );
        if (existingIndex >= 0) {
          const newCart = [...cart];
          newCart[existingIndex].quantity += quantity;
          set({ cart: newCart });
        } else {
          set({
            cart: [...cart, { ...product, quantity, selectedSize, selectedColor }],
          });
        }
        get().addNotification('Added to cart', `${product.name} has been added to your cart.`, 'success');
      },
      removeFromCart: (productId, selectedSize, selectedColor) => {
        set({
          cart: get().cart.filter(
            (item) => !(item.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
          ),
        });
      },
      updateCartQuantity: (productId, selectedSize, selectedColor, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, selectedSize, selectedColor);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
              ? { ...item, quantity }
              : item
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Saved for Later
      savedForLater: [],
      saveForLater: (product) => {
        const saved = get().savedForLater;
        if (!saved.find((item) => item.id === product.id)) {
          set({ savedForLater: [...saved, product] });
          get().removeFromCart(product.id, product.selectedSize, product.selectedColor);
        }
      },
      moveToCart: (product) => {
        get().addToCart(product);
        set({ savedForLater: get().savedForLater.filter((item) => item.id !== product.id) });
      },

      // Wishlist
      wishlist: [],
      addToWishlist: (product) => {
        const wishlist = get().wishlist;
        if (!wishlist.find((item) => item.id === product.id)) {
          set({ wishlist: [...wishlist, product] });
          get().addNotification('Added to wishlist', `${product.name} saved to your wishlist.`, 'info');
        }
      },
      removeFromWishlist: (productId) => {
        set({ wishlist: get().wishlist.filter((item) => item.id !== productId) });
      },
      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item.id === productId);
      },

      // User
      user: {
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        avatar: null,
        phone: '+91 98765 43210',
        addresses: [
          {
            id: 1,
            label: 'Home',
            street: '42, Lotus Lane, Banjara Hills',
            city: 'Hyderabad',
            state: 'Telangana',
            zip: '500034',
            country: 'India',
            isDefault: true,
          },
          {
            id: 2,
            label: 'Office',
            street: '15, Tech Park, HITEC City',
            city: 'Hyderabad',
            state: 'Telangana',
            zip: '500081',
            country: 'India',
            isDefault: false,
          },
        ],
        preferences: {
          newsletter: true,
          smsAlerts: false,
          twoFactorAuth: false,
        },
      },
      isAuthenticated: false,
      login: (email, password) => {
        // Mock login - in reality this would be an API call
        set({ isAuthenticated: true });
        get().addNotification('Welcome Back!', 'You have successfully logged in to Sajhnaa.', 'success');
        return true;
      },
      register: (userData) => {
        // Mock registration
        set({ user: { ...get().user, ...userData }, isAuthenticated: true });
        get().addNotification('Welcome to Sajhnaa!', 'Your account has been created successfully.', 'success');
        return true;
      },
      logout: () => {
        set({ isAuthenticated: false });
        get().addNotification('Logged Out', 'You have been safely logged out.', 'info');
      },
      updateUser: (updates) => set({ user: { ...get().user, ...updates } }),

      // Orders
      orders: [
        {
          id: 'SJ-7A92K1L8',
          date: '2026-02-13',
          customerName: 'Amit Patel',
          customerEmail: 'amit.patel@example.com',
          status: 'processing',
          items: [
            { id: 1, name: 'Eternal Solitaire Ring', price: 45999, quantity: 1, image: 'https://images.unsplash.com/photo-1605100804763-047af5fef207?q=80&w=1000&auto=format&fit=crop' },
          ],
          total: 45999,
          shippingAddress: { name: 'Amit Patel', city: 'Mumbai', state: 'Maharashtra' },
          trackingSteps: [
            { label: 'Order Placed', date: '2026-02-13', completed: true },
            { label: 'Processing', date: '2026-02-13', completed: true },
            { label: 'Shipped', date: '', completed: false },
            { label: 'Out for Delivery', date: '', completed: false },
            { label: 'Delivered', date: '', completed: false },
          ],
        },
        {
          id: 'SJ-4M1P9Q5Z',
          date: '2026-02-12',
          customerName: 'Sneha Rao',
          customerEmail: 'sneha.rao@example.com',
          status: 'shipped',
          items: [
            { id: 5, name: 'Diamond Drop Earrings', price: 28999, quantity: 1, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop' },
          ],
          total: 28999,
          shippingAddress: { name: 'Sneha Rao', city: 'Bangalore', state: 'Karnataka' },
          trackingSteps: [
            { label: 'Order Placed', date: '2026-02-12', completed: true },
            { label: 'Crafting & QC', date: '2026-02-12', completed: true },
            { label: 'Shipped', date: '2026-02-13', completed: true },
            { label: 'Out for Delivery', date: '', completed: false },
            { label: 'Delivered', date: '', completed: false },
          ],
        },
        {
          id: 'SJ-R5T8U2V3',
          date: '2026-02-12',
          customerName: 'Vikram Singh',
          customerEmail: 'vikram.singh@example.com',
          status: 'delivered',
          items: [
            { id: 9, name: 'Evil Eye Diamond Pendant', price: 12999, quantity: 2, image: 'https://images.unsplash.com/photo-1615484477778-ca3b779401d5?q=80&w=1000&auto=format&fit=crop' },
          ],
          total: 25998,
          shippingAddress: { name: 'Vikram Singh', city: 'Delhi', state: 'Delhi' },
          trackingSteps: [
            { label: 'Order Placed', date: '2026-02-11', completed: true },
            { label: 'Crafting & QC', date: '2026-02-11', completed: true },
            { label: 'Shipped', date: '2026-02-12', completed: true },
            { label: 'Out for Delivery', date: '2026-02-12', completed: true },
            { label: 'Delivered', date: '2026-02-12', completed: true },
          ],
        },
        {
          id: 'SJ-G3H7J1K0',
          date: '2026-02-11',
          customerName: 'Ananya Iyer',
          customerEmail: 'ananya.iyer@example.com',
          status: 'processing',
          items: [
            { id: 12, name: 'Rose Gold Bracelet', price: 18499, quantity: 1, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop' },
          ],
          total: 18499,
          shippingAddress: { name: 'Ananya Iyer', city: 'Chennai', state: 'Tamil Nadu' },
          trackingSteps: [
            { label: 'Order Placed', date: '2026-02-11', completed: true },
            { label: 'Processing', date: '2026-02-11', completed: true },
            { label: 'Shipped', date: '', completed: false },
            { label: 'Out for Delivery', date: '', completed: false },
            { label: 'Delivered', date: '', completed: false },
          ],
        },
        {
          id: 'SJ-X1Y2Z3W4',
          date: '2026-02-10',
          customerName: 'Rahul Mehra',
          customerEmail: 'rahul.mehra@example.com',
          status: 'cancelled',
          items: [
            { id: 3, name: 'Classic Gold Band', price: 15000, quantity: 1, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop' },
          ],
          total: 15000,
          shippingAddress: { name: 'Rahul Mehra', city: 'Pune', state: 'Maharashtra' },
          trackingSteps: [
            { label: 'Order Placed', date: '2026-02-10', completed: true },
            { label: 'Cancelled', date: '2026-02-10', completed: true },
          ],
        },
      ],
      placeOrder: (shippingAddress, paymentMethod) => {
        const cart = get().cart;
        const total = get().getCartTotal();
        const orderId = generateOrderId();
        const today = new Date().toISOString().split('T')[0];
        const newOrder = {
          id: orderId,
          date: today,
          customerName: shippingAddress.name,
          customerEmail: shippingAddress.email || get().user?.email || 'guest@example.com',
          status: 'processing',
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
          })),
          total,
          shippingAddress,
          paymentMethod,
          trackingSteps: [
            { label: 'Order Placed', date: today, completed: true },
            { label: 'Processing', date: today, completed: true },
            { label: 'Shipped', date: '', completed: false },
            { label: 'Out for Delivery', date: '', completed: false },
            { label: 'Delivered', date: '', completed: false },
          ],
        };
        set({ orders: [newOrder, ...get().orders], cart: [] });
        get().addNotification('Order Placed!', `Your order ${orderId} has been confirmed.`, 'success');
        return orderId;
      },
      updateOrderStatus: (orderId, newStatus) => {
        const today = new Date().toISOString().split('T')[0];

        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== orderId) return order;

            // Deep clone tracking steps
            let updatedSteps = order.trackingSteps.map(step => ({ ...step }));

            // Helper to update a specific step
            const markComplete = (labelPattern, date) => {
              const step = updatedSteps.find(s => s.label.toLowerCase().includes(labelPattern.toLowerCase()));
              if (step && !step.completed) {
                step.completed = true;
                step.date = date;
              }
            };

            // Enhanced Logic: Automatically complete previous steps based on status
            if (newStatus === 'shipped') {
              markComplete('shipped', today);
            } else if (newStatus === 'delivered') {
              // Ensure shipped is marked if jumped directly to delivered
              markComplete('shipped', order.trackingSteps.find(s => s.label.toLowerCase().includes('shipped'))?.date || today);
              markComplete('out for delivery', today);
              markComplete('delivered', today);
            } else if (newStatus === 'cancelled') {
              // Add a cancelled step or update status to show cancelled
              // For now, simpler to just rely on status badge, but we could append a step.
              // Letting basic status handle 'cancelled' visual.
            }

            return { ...order, status: newStatus, trackingSteps: updatedSteps };
          }),
        }));
        get().addNotification('Order Updated', `Order #${orderId} marked as ${newStatus}. Customer tracking updated.`, 'success');
      },

      // Promo Codes
      appliedPromo: null,
      applyPromo: (code) => {
        const promos = {
          SAJHNAA20: { discount: 0.2, label: '20% OFF' },
          FIRST10: { discount: 0.1, label: '10% OFF' },
          FREESHIP: { discount: 0, label: 'Free Shipping', freeShipping: true },
        };
        const promo = promos[code.toUpperCase()];
        if (promo) {
          set({ appliedPromo: { code: code.toUpperCase(), ...promo } });
          get().addNotification('Promo Applied!', `${promo.label} has been applied.`, 'success');
          return true;
        }
        get().addNotification('Invalid Code', 'This promo code is not valid.', 'error');
        return false;
      },
      removePromo: () => set({ appliedPromo: null }),

      // Filters
      filters: {
        category: 'all',
        priceRange: [0, 100000],
        rating: 0,
        colors: [],
        sizes: [],
        sortBy: 'featured',
        searchQuery: '',
      },
      setFilters: (newFilters) => set({ filters: { ...get().filters, ...newFilters } }),
      resetFilters: () =>
        set({
          filters: {
            category: 'all',
            priceRange: [0, 100000],
            rating: 0,
            colors: [],
            sizes: [],
            sortBy: 'featured',
            searchQuery: '',
          },
        }),

      // Notifications
      notifications: [],
      addNotification: (title, message, type = 'info') => {
        const id = Date.now() + Math.random();
        set({ notifications: [...get().notifications, { id, title, message, type }] });
        setTimeout(() => {
          set({ notifications: get().notifications.filter((n) => n.id !== id) });
        }, 4000);
      },
      removeNotification: (id) => {
        set({ notifications: get().notifications.filter((n) => n.id !== id) });
      },

      // Recently Viewed
      recentlyViewed: [],
      addToRecentlyViewed: (product) => {
        const recent = get().recentlyViewed.filter((p) => p.id !== product.id);
        set({ recentlyViewed: [product, ...recent].slice(0, 10) });
      },

      // Search
      searchOpen: false,
      toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),

      // Admin Authentication
      adminAuthenticated: false,
      adminLogin: (password) => {
        if (password === 'shivani@70464') {
          set({ adminAuthenticated: true });
          get().addNotification('Admin Access Granted', 'Welcome to the Dashboard.', 'success');
          return true;
        } else {
          get().addNotification('Access Denied', 'Incorrect password.', 'error');
          return false;
        }
      },
      adminLogout: () => {
        set({ adminAuthenticated: false });
        get().addNotification('Logged Out', 'Admin session ended.', 'info');
      },
    }),
    {
      name: 'sajhnaa-store',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        orders: state.orders,
        darkMode: state.darkMode,
        recentlyViewed: state.recentlyViewed,
        savedForLater: state.savedForLater,
        savedForLater: state.savedForLater,
        user: state.user,
        adminAuthenticated: state.adminAuthenticated,
      }),
    }
  )
);

export default useStore;
