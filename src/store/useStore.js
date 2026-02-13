import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as initialProducts } from '../data/products';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';

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

      // User Authentication
      isAuthenticated: false,
      user: null,
      login: (email, password) => {
        const mockUser = { name: 'Jewelry Lover', email };
        set({ isAuthenticated: true, user: mockUser });
        get().addNotification?.('Welcome back!', `Signed in as ${email}`, 'success');
        return true;
      },
      register: (userData) => {
        set({ isAuthenticated: true, user: userData });
        get().addNotification?.('Account Created', 'Welcome to Sajhnaa!', 'success');
        return true;
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
        get().addNotification?.('Signed Out', 'See you soon!', 'info');
      },

      // Products (Admin)
      products: initialProducts,
      addProduct: (product) => {
        set((state) => ({ products: [...state.products, { ...product, id: Date.now() }] }));
        get().addNotification?.('Product Added', `${product.name} has been added to catalog.`, 'success');
      },
      updateProduct: (id, updatedData) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updatedData } : p)),
        }));
        get().addNotification?.('Product Updated', 'Product details have been saved.', 'success');
      },
      deleteProduct: (id) => {
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
        get().addNotification?.('Product Deleted', 'Product has been removed from catalog.', 'info');
      },

      // Cart
      cart: [],
      addToCart: (product, quantity = 1, selectedSize = null, selectedColor = null) => {
        const cart = get().cart || [];
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
        get().addNotification?.('Added to cart', `${product.name} has been added to your cart.`, 'success');
      },
      removeFromCart: (productId, selectedSize, selectedColor) => {
        set({
          cart: (get().cart || []).filter(
            (item) => !(item.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
          ),
        });
      },
      updateCartQuantity: (productId, selectedSize, selectedColor, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart?.(productId, selectedSize, selectedColor);
          return;
        }
        set({
          cart: (get().cart || []).map((item) =>
            item.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
              ? { ...item, quantity }
              : item
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return (get().cart || []).reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
      },
      getCartCount: () => {
        return (get().cart || []).reduce((count, item) => count + item.quantity, 0);
      },

      // Saved for Later
      savedForLater: [],
      saveForLater: (product) => {
        const saved = get().savedForLater || [];
        if (!saved.find((item) => item.id === product.id)) {
          set({ savedForLater: [...saved, product] });
          get().removeFromCart?.(product.id, product.selectedSize, product.selectedColor);
        }
      },
      moveToCart: (product) => {
        get().addToCart?.(product);
        set({ savedForLater: (get().savedForLater || []).filter((item) => item.id !== product.id) });
      },

      // Wishlist
      wishlist: [],
      addToWishlist: (product) => {
        const wishlist = get().wishlist || [];
        if (!wishlist.find((item) => item.id === product.id)) {
          set({ wishlist: [...wishlist, product] });
          get().addNotification?.('Success', 'Item added to wishlist.', 'success');
        }
      },
      removeFromWishlist: (productId) => {
        set({ wishlist: (get().wishlist || []).filter((item) => item.id !== productId) });
        get().addNotification?.('Removed', 'Item removed from wishlist.', 'info');
      },
      isInWishlist: (productId) => {
        return (get().wishlist || []).some((item) => item.id === productId);
      },

      // Orders
      orders: [],
      placeOrder: (shippingAddress, paymentMethod) => {
        const cart = get().cart || [];
        const total = get().getCartTotal?.() || 0;
        const orderId = generateOrderId();
        const today = new Date().toISOString().split('T')[0];
        const newOrder = {
          id: orderId,
          date: today,
          customerName: shippingAddress.name,
          customerEmail: shippingAddress.email || get().user?.email || 'guest@example.com',
          city: shippingAddress.city || 'Unknown',
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
          createdAt: new Date().toISOString()
        };

        try {
          addDoc(collection(db, 'orders'), newOrder);
        } catch (error) {
          console.error("Error adding order to Firebase: ", error);
        }

        set({ cart: [] });
        get().addNotification?.('Order Placed!', `Your order ${orderId} has been confirmed.`, 'success');
        return orderId;
      },
      fetchOrders: () => {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const orders = [];
          querySnapshot.forEach((doc) => {
            orders.push({ ...doc.data(), firebaseId: doc.id });
          });
          set({ orders });
        });
        return unsubscribe;
      },
      updateOrderStatus: async (orderId, newStatus) => {
        const today = new Date().toISOString().split('T')[0];
        const order = (get().orders || []).find(o => o.id === orderId);

        if (!order) return;

        let updatedSteps = (order.trackingSteps || []).map(step => ({ ...step }));

        const markComplete = (labelPattern, date) => {
          const step = updatedSteps.find(s => s.label.toLowerCase().includes(labelPattern.toLowerCase()));
          if (step && !step.completed) {
            step.completed = true;
            step.date = date;
          }
        };

        if (newStatus === 'shipped') {
          markComplete('shipped', today);
        } else if (newStatus === 'delivered') {
          markComplete('shipped', (order.trackingSteps || []).find(s => s.label.toLowerCase().includes('shipped'))?.date || today);
          markComplete('out for delivery', today);
          markComplete('delivered', today);
        }

        if (order.firebaseId) {
          try {
            const orderRef = doc(db, 'orders', order.firebaseId);
            await updateDoc(orderRef, {
              status: newStatus,
              trackingSteps: updatedSteps
            });
            get().addNotification?.('Order Updated', `Order #${orderId} marked as ${newStatus}.`, 'success');
          } catch (error) {
            console.error("Error updating order: ", error);
            get().addNotification?.('Error', 'Failed to update order in database.', 'error');
          }
        }
      },

      // Notifications
      notifications: [],
      addNotification: (title, message, type = 'info') => {
        const id = Date.now() + Math.random();
        set({ notifications: [...(get().notifications || []), { id, title, message, type }] });
        setTimeout(() => {
          set({ notifications: (get().notifications || []).filter((n) => n.id !== id) });
        }, 4000);
      },
      removeNotification: (id) => {
        set({ notifications: (get().notifications || []).filter((n) => n.id !== id) });
      },

      // Recently Viewed
      recentlyViewed: [],
      addToRecentlyViewed: (product) => {
        if (!product) return;
        const recent = (get().recentlyViewed || []).filter((p) => p.id !== product.id);
        set({ recentlyViewed: [product, ...recent].slice(0, 10) });
      },

      // Admin Authentication
      adminAuthenticated: false,
      adminLogin: (password) => {
        if (password === 'shivani@70464') {
          set({ adminAuthenticated: true });
          get().addNotification?.('Admin Access Granted', 'Welcome to the Dashboard.', 'success');
          return true;
        } else {
          get().addNotification?.('Access Denied', 'Incorrect password.', 'error');
          return false;
        }
      },
      adminLogout: () => {
        set({ adminAuthenticated: false });
        get().addNotification?.('Logged Out', 'Admin session ended.', 'info');
      },
    }),
    {
      name: 'sajhnaa-store-v5',
      partialize: (state) => ({
        darkMode: state.darkMode,
        adminAuthenticated: state.adminAuthenticated,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        cart: state.cart,
        wishlist: state.wishlist,
        recentlyViewed: state.recentlyViewed,
        savedForLater: state.savedForLater
      }),
    }
  )
);

export default useStore;
