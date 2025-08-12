"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useFetch } from "@/hooks/useFetch";
import CategoryNav from "./CategoryNav";
import MenuItemCard from "./MenuItemCard";
import CartSidebar from "./CartSidebar";
import OrdersModal from "./OrdersMOdel";

export default function RestaurantMenu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const {
    cart,
    orders,
    addToCart,
    updateQuantity,
    getCartTotal,
    placeOrder,
  } = useCartStore();

  const { data: menu, isloading } = useFetch("/api/menu", ["menu"]);

  if (isloading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Safely get menu items
  const menuItems = menu?.menuItems || [];

  // Unique categories from menu
  const categories = [...new Set(menuItems.map((item) => item.category))];

  // Filter menu items
  const filteredMenuItems =
    activeCategory !== "All"
      ? menuItems.filter((item) => item.category === activeCategory)
      : menuItems;

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-chart-2 text-white";
      case "PREPARING":
        return "bg-chart-1 text-white";
      case "PENDING":
        return "bg-chart-5 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Restaurant Menu</h1>
        </div>

        {/* Categories */}
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={addToCart}
              />
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center py-10 text-muted-foreground">
              No menu items found.
            </div>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        cartTotal={getCartTotal()}
        onUpdateQuantity={updateQuantity}
        onPlaceOrder={placeOrder}
      />

      {/* Orders Modal */}
      <OrdersModal
        isOpen={showOrders}
        onClose={() => setShowOrders(false)}
        orders={orders}
        getStatusColor={getStatusColor}
      />
    </div>
  );
}
