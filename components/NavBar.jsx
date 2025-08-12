"use client";

import { Menu, User } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { ModeToggle } from "./ModeToggle";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import CartSidebar from "./CartSidebar";
import CartButton from "./CartButton";
import { useAuthStore } from "@/store/authStote";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    cart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    placeOrder,
  } = useCartStore();

  const routes = [
    { label: "Home", href: "/" },
    { label: "Rooms", href: "/#rooms" },
    { label: "Bookings", href: "/booking" },
    { label: "Menu", href: "/menu" },
    { label: "Orders", href: "/orders" },
    { label: "Amenities", href: "/#amenities" },
    { label: "Gallery", href: "/#gallery" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ];

  const handleSignOut = () => {
    logout();
    router.push("/");
  };

  // Handles click for desktop & mobile nav
  const handleNavClick = (e, href) => {
    const isHashLink = href.includes("#");
    if (isHashLink) {
      e.preventDefault();
      const id = href.split("#")[1];

      if (pathname !== "/") {
        // Navigate to homepage with hash
        router.push("/" + href);
      } else {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "smooth" });
      }
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  // Smooth scroll after navigating from another page
  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 200); // wait a bit for the page to render
    }
  }, [pathname, searchParams]);

  const renderNavLinks = () =>
    routes.map((route) => (
      <motion.li
        key={route.label}
        className="font-medium"
        whileHover={{ scale: 1.05 }}
      >
        <Link
          href={route.href}
          className="hover:text-blue-500 transition-colors"
          onClick={(e) => handleNavClick(e, route.href)}
        >
          {route.label}
        </Link>
      </motion.li>
    ));

  return (
    <>
      {/* Sticky Navbar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg shadow-sm"
      >
        <div className="flex flex-row justify-between items-center container mx-auto px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src="/logo.png" width={35} height={35} alt="logo" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <nav>
              <ul className="flex gap-5 items-center">{renderNavLinks()}</ul>
            </nav>
          </div>

          {/* Mobile Dropdown */}
          {isOpen && (
            <nav className="md:hidden absolute top-full left-0 w-full backdrop-blur-lg bg-white/100 dark:bg-black/95 shadow-lg p-4 z-50">
              <ul className="flex flex-col gap-3">{renderNavLinks()}</ul>
            </nav>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <CartButton
              onClick={() => setShowCart(true)}
              itemCount={getCartCount()}
            />
            <ModeToggle />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/recent-bookings" className="w-full">
                      Recent Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left"
                    >
                      Sign Out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Menu
              className="md:hidden cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </div>
      </motion.div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        cartTotal={getCartTotal()}
        onUpdateQuantity={updateQuantity}
        onPlaceOrder={placeOrder}
      />
    </>
  );
}
