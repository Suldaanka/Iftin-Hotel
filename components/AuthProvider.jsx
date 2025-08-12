// components/AuthProvider.js
"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Loading from './Loading';
import { useAuthStore } from '@/store/authStote';

export function AuthProvider({ children }) {
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth once
  useEffect(() => {
    const init = async () => {
      await initializeAuth();
      setIsInitialized(true);
    };
    init();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isInitialized) return;

    const AUTH_ROUTES = ['/sign-in', '/sign-up'];

    // ✅ Only these are protected
    const PROTECTED_ROUTES = [
      '/recent-orders',
      '/recent-bookings',
      '/profile',
    ];

    const isAuthPage = AUTH_ROUTES.includes(pathname);
    const isProtectedPage = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    // Logged in
    if (isAuthenticated === true) {
      if (isAuthPage) {
        router.replace('/');
      }
      return;
    }

    // Not logged in
    if (isAuthenticated === false) {
      if (isProtectedPage) {
        router.push(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      }
    }

  }, [isInitialized, isAuthenticated, pathname, router]);

  if (!isInitialized) {
    return <Loading />;
  }

  return children;
}
