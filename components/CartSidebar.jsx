'use client';

import { ShoppingCart, X, MapPin, CheckCircle, AlertCircle, Loader2, Plus, Minus, Trash2, Receipt, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useFetch } from "@/hooks/useFetch";
import { useMutate } from "@/hooks/useMutate";
import { useAuthStore } from "@/store/authStote";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";

const CartSidebar = ({ isOpen, onClose }) => {
  // Corrected line: Use a selector to properly get state and actions from the Zustand store
  const { cart, updateQuantity, getCartTotal, placeOrder, removeFromCart } = useCartStore((state) => state);
  
  const [destination, setDestination] = useState("table");
  const [destinationNumber, setDestinationNumber] = useState("");
  const [description, setDescription] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuthStore();
  
  const subtotal = getCartTotal();
  const tax = subtotal * 0.05;
  const totalWithTax = subtotal + tax;

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle escape key for mobile
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen && isMobile) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isMobile, onClose]);

  // Fetch data
  const { data: tablesData, isLoading: tablesLoading, isError: tablesError } = useFetch('/api/tables', ['tables']);
  const { data: bookingsData } = useFetch('/api/bookings', ['bookings']);
  const { execute } = useMutate('/api/orders', ['orders'], { method: 'POST', requireAuth: true });

  const tables = tablesData?.tables || tablesData || [];
  const bookings = bookingsData?.bookings || bookingsData || [];
  
  const filteredBookings = user?.id ? bookings?.filter(booking => 
    user.id === booking.userId && booking.status === 'CONFIRMED'
  ) : [];

  const availableTables = tables?.filter(table => table.available !== false && table.status !== 'OCCUPIED') || [];
  const hasBookings = filteredBookings && filteredBookings.length > 0;

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder.png';
    try {
      const imageArray = JSON.parse(imageUrl);
      if (Array.isArray(imageArray) && imageArray.length > 0) {
        const imagePath = imageArray[0];
        return imagePath.startsWith('http') ? imagePath : `${BASE_URL}${imagePath}`;
      }
      return '/placeholder.png';
    } catch {
      return imageUrl?.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}` || '/placeholder.png';
    }
  };

  const handlePlaceOrder = async () => {
    if (!destinationNumber || cart.length === 0) {
      toast.error('Please select a destination and add items to your cart');
      return;
    }
  
    if (!user?.id) {
      toast.error('Please log in to place an order');
      return;
    }
  
    setIsPlacingOrder(true);
  
    const orderData = {
      userId: user.id,
      tableId: destination === 'table' ? destinationNumber : null,
      roomId: destination === 'room' ? destinationNumber : null,
      status: 'PENDING',
      total: parseFloat(totalWithTax.toFixed(2)),
      description: description,
      items: cart.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        price: parseFloat(item.price), // ensure it's a number
      })),
    };
  
    execute(orderData, {
      onSuccess: (createdOrder) => {
        toast.success('Order placed successfully');
  
        // ✅ Clear cart in Zustand
        useCartStore.setState({ cart: [] });
  
        // ✅ Save backend order in local state
        useCartStore.setState(state => ({
          orders: [createdOrder, ...state.orders]
        }));
  
        setIsPlacingOrder(false);
        onClose();
        setDestinationNumber('');
        setDescription('');
      },
      onError: () => {
        toast.error('Failed to place order');
        setIsPlacingOrder(false);
      }
    });
  };
  

  const isOrderReady = () => {
    if (cart.length === 0) return false;
    if (!user?.id) return false;
    if (destination === "room") return destinationNumber !== "" && hasBookings;
    if (destination === "table") return destinationNumber !== "" && availableTables.length > 0;
    return false;
  };

  if (!isOpen) return null;

  const cartContent = (
    <>
      {/* Header - Sticky on scroll */}
      <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 backdrop-blur-sm border-b px-4 py-4 flex justify-between items-center z-20 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Your Cart</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/50 dark:hover:bg-black/20 rounded-full transition-all duration-200 hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 min-h-0 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Cart is empty state */}
        {!cart || cart.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Add items from the menu to get started</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 py-4 pb-6">
            {/* Destination Selection */}
            <div className="flex-shrink-0 border rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-card-foreground">Delivery Destination</h3>
              </div>
              
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => {
                    setDestination("table");
                    setDestinationNumber("");
                  }}
                  className={cn(
                    hasBookings ? 'flex-1' : 'w-full',
                    "py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-[1.02]",
                    destination === "table"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                  )}
                >
                  🍽️ Table
                </button>
                {hasBookings && (
                  <button
                    onClick={() => {
                      setDestination("room");
                      setDestinationNumber("");
                    }}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-[1.02]",
                      destination === "room"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                        : "bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                    )}
                  >
                    🏠 Room
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  {destination === "room" ? "Select Your Room" : "Select Available Table"}
                </label>
                
                {((destination === 'table' && tablesLoading)) ? (
                  <div className="p-3 border rounded-xl text-center text-muted-foreground bg-background">
                    <Clock className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-sm">Loading {destination}s...</span>
                  </div>
                ) : ((destination === 'table' && tablesError)) ? (
                  <div className="p-3 border rounded-xl text-center text-destructive bg-destructive/10 border-destructive/20">
                    <span className="text-sm">Error loading {destination}s</span>
                  </div>
                ) : destination === "room" && hasBookings ? (
                  <select
                    value={destinationNumber}
                    onChange={(e) => setDestinationNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background transition-all duration-200 hover:border-blue-300"
                  >
                    <option value="">Choose your booked room</option>
                    {filteredBookings?.map(booking => (
                      <option key={booking.id} value={booking.room?.id}>
                        🏠 Room {booking.room?.number} - {booking.room?.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={destinationNumber}
                    onChange={(e) => setDestinationNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background transition-all duration-200 hover:border-blue-300"
                  >
                    <option value="">Choose an available table</option>
                    {availableTables?.map(table => (
                      <option key={table.id} value={table.id}>
                        🍽️ Table {table.number} • {table.capacity} seats
                      </option>
                    ))}
                  </select>
                )}
                
                {destination === "table" && availableTables?.length === 0 && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    No available tables at the moment
                  </p>
                )}
              </div>
            </div>

            {/* Order Description Input */}
            <div className="flex-shrink-0 border rounded-xl p-4">
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Order Notes / Special Requests (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., 'No onions on the burger,' or 'Extra ketchup please.'"
                className="w-full h-24 px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background transition-all duration-200 resize-none"
              />
            </div>

            
            {/* Scrollable Cart Items */}
            <div className="space-y-3 py-4">
              {cart.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-card rounded-xl border p-4 transition-all duration-200 hover:shadow-md hover:border-border shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <Image
                        src={getImageUrl(item.imageUrl)}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-lg object-cover border"
                        onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                      />
                      <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate text-card-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        ${parseFloat(item.price).toFixed(2)} each
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-muted/60 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0 hover:bg-background rounded-md transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-3 h-3 mx-auto" />
                          </button>
                          <span className="min-w-[32px] text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0 hover:bg-background rounded-md transition-colors"
                          >
                            <Plus className="w-3 h-3 mx-auto" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            {(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </span>
                          <button 
                            onClick={() => removeFromCart(item.id)} 
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                          >
                            <Trash2 className="w-3 h-3 mx-auto" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Bottom padding for smooth scroll */}
              <div className="h-6"></div>
            </div>
          </div>
        )}
      </div>

      {/* Summary and Place Order - Fixed bottom */}
      {cart.length > 0 && (
        <div className="flex-shrink-0 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-900/50 border-t border-border/50 p-4 space-y-4 backdrop-blur-sm z-20">
          <div className="bg-muted/30 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (5%):</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                ${tax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border/30">
              <span className="text-foreground">Total:</span>
              <span className="text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ${totalWithTax.toFixed(2)}
              </span>
            </div>
          </div>
          
          <button
            onClick={handlePlaceOrder}
            disabled={!isOrderReady() || isPlacingOrder}
            className={cn(
              "w-full h-12 text-base font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2",
              isOrderReady() && !isPlacingOrder
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                : "bg-gray-200 dark:bg-gray-700 text-muted-foreground cursor-not-allowed"
            )}
          >
            {isPlacingOrder ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Placing Order...
              </>
            ) : !isOrderReady() && cart.length > 0 ? (
              `Select ${destination === "room" ? "room" : "table"} to place order`
            ) : (
              <>
                🚀 Place Order • {cart.length} item{cart.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      )}
    </>
  );

  // Mobile implementation
  if (isMobile) {
    return (
      <>
        {/* Mobile Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={onClose}
          />
        )}

        {/* Mobile Bottom Sheet */}
        <div className={cn(
          "fixed bottom-0 left-0 right-0 bg-background z-50 transition-transform duration-300 ease-out",
          "max-h-[90vh] min-h-[50vh] flex flex-col rounded-t-2xl shadow-2xl border-t overflow-hidden",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}>
          {/* Drag Handle */}
          <div className="flex justify-center py-3 bg-muted/30 rounded-t-2xl flex-shrink-0">
            <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
          </div>
          
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {cartContent}
          </div>
        </div>
      </>
    );
  }

  // Desktop implementation
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="bg-background/80 flex-1" onClick={onClose} />
      <div className="w-full max-w-sm bg-card border-l border-border h-full overflow-hidden shadow-2xl backdrop-blur-sm flex flex-col">
        {cartContent}
      </div>
    </div>
  );
};

export default CartSidebar;

