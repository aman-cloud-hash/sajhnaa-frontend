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
          get().addNotification('Success', 'Item added to wishlist.', 'success');
        }
      },

      // Orders
      orders: [
        {
          id: 'SJ-A7K2M9P1',
          date: '2026-02-13',
          customerName: 'Amit Patel',
          customerEmail: 'amit.patel@example.com',
          status: 'delivered',
          items: [
            { id: 1, name: 'Eternal Solitaire Ring', price: 45999, quantity: 1, image: 'https://images.unsplash.com/photo-1605100804763-047af5fef207?q=80&w=1000&auto=format&fit=crop' },
          ],
          total: 45999,
          shippingAddress: { name: 'Amit Patel', city: 'Mumbai', state: 'Maharashtra' },
          trackingSteps: [
            { label: 'Order Placed', date: '2026-02-10', completed: true },
            { label: 'Crafting & QC', date: '2026-02-10', completed: true },
            { label: 'Shipped', date: '2026-02-11', completed: true },
            { label: 'Out for Delivery', date: '2026-02-12', completed: true },
            { label: 'Delivered', date: '2026-02-12', completed: true },
          ],
        },
        {
          id: 'SJ-B4N9Q8W5',
          date: '2026-02-13',
          customerName: 'Sneha Rao',
          customerEmail: 'sneha.rao@example.com',
          status: 'shipped',
          items: [
            { id: 5, name: 'Lustrous Pearl Earrings', price: 28499, quantity: 1, image: 'https://images.unsplash.com/photo-1535633302704-c02995a32730?q=80&w=1000&auto=format&fit=crop' },
            { id: 8, name: 'Gold Bangle Set', price: 72500, quantity: 1, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1520a?q=80&w=1000&auto=format&fit=crop' },
          ],
          total: 100999,
          shippingAddress: { name: 'Sneha Rao', city: 'Bangalore', state: 'Karnataka' },
          trackingSteps: [
            { label: 'Order Placed', date: '2026-02-12', completed: true },
            { label: 'Crafting & QC', date: '2026-02-12', completed: true },
            { label: 'Shipped', date: '2026-02-13', completed: true },
            { label: 'Out for Delivery', date: '', completed: false },
            { label: 'Delivered', date: '', completed: false },
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
