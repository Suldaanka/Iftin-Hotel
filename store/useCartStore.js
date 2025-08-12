// store/useCartStore.js
// Make sure your store looks similar to this

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      orders: [],
      
      addToCart: (item) => {
        set((state) => {
          const existingItem = state.cart.find(cartItem => cartItem.id === item.id);
          
          if (existingItem) {
            // If item exists, increase quantity
            return {
              cart: state.cart.map(cartItem =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              )
            };
          } else {
            // If new item, add with quantity 1
            return {
              cart: [...state.cart, { ...item, quantity: 1 }]
            };
          }
        });
        console.log('Item added to cart:', item);
        console.log('Updated cart:', get().cart);
      },
      
      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter(item => item.id !== id)
        }));
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        
        set((state) => ({
          cart: state.cart.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        }));
      },
      
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getCartCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage', // unique name for localStorage
      getStorage: () => localStorage, // use localStorage
    }
  )
);

export { useCartStore };