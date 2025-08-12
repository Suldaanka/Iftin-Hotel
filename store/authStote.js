// store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: ({ user, token }) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        // Optionally, redirect to sign-in page after logout
        // This should ideally be handled by the AuthProvider or a router listener
        // For now, we'll just clear the state.
      },

      // Initialize auth state on app load (important!)
      initializeAuth: () => {
        const state = get();
        // If there's a token but isAuthenticated is false, fix it
        if (state.token && !state.isAuthenticated) {
          set({ isAuthenticated: true });
        }
        // You can also add token expiry check here later if needed
      },
    }),
    {
      name: 'auth-storage', // key in localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);``