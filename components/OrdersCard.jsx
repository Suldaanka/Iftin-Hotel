"use client";

import React, { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Loading from "./Loading";
import { useMutate } from "@/hooks/useMutate";
import Image from "next/image";
export default function OrdersCard({ data, isLoading }) {
  const queryClient = useQueryClient();

  // Show loading state


  if(!data) {
    return(
      <div className="h-64 flex items-center justify-center">
        <h1>Sing-In to see your resent orders</h1>
      </div>
    )
  }
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Handle case when data is not available yet
  if (!data) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Handle empty orders
  if (data.length === 0) {
    return (
      <Alert variant="default" className="h-64 flex items-center justify-center">
        <AlertDescription className="text-center">
          <div className="text-muted-foreground">
            <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm">You haven't placed any orders yet.</p>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  const orders = data;

  const OrderCardItem = ({ order }) => {
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [isItemsExpanded, setIsItemsExpanded] = useState(false);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

    // Mutation hook for updating order status
    const { execute: updateOrderStatus, isLoading: isUpdatingStatus } = useMutate(
      `/api/orders/${order.id}`, 
      ['orders', 'order', order.id], 
      {
        method: 'PUT',
        requireAuth: true,
        onSuccess: () => {
          toast.success('Order cancelled successfully');
          queryClient.invalidateQueries(['orders']);
          setIsCancelDialogOpen(false);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to cancel order');
        }
      }
    );

    const handleStatusClick = (e) => {
      // Prevent event bubbling
      e.stopPropagation();
      setIsDetailsDialogOpen(true);
    };

    const handleToggleItems = (e) => {
      // Prevent event bubbling
      e.stopPropagation();
      setIsItemsExpanded(!isItemsExpanded);
    };

    const handleCancelOrder = () => {
      updateOrderStatus({ status: 'CANCELLED' });
    };

    const handleCancelClick = (e) => {
      e.stopPropagation();
      setIsCancelDialogOpen(true);
    };

    const getStatusStyle = () => {
      switch (order.status) {
        case "COMPLETED":
        case "DELIVERED":
          return "bg-chart-2 text-white px-3 py-1 rounded text-xs font-medium";
        case "PENDING":
          return "bg-blue-500 text-white px-3 py-1 rounded text-xs font-medium";
        case "PREPARING":
          return "bg-yellow-500 text-white px-3 py-1 rounded text-xs font-medium";
        case "CANCELLED":
          return "bg-destructive text-destructive-foreground px-3 py-1 rounded text-xs font-medium";
        default:
          return "bg-muted text-muted-foreground px-3 py-1 rounded text-xs font-medium";
      }
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const getTotalItems = () => {
      return order.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    };

    const totalItems = getTotalItems();

    // Check if order can be cancelled (not already cancelled or completed)
    const canBeCancelled = !['CANCELLED', 'COMPLETED', 'DELIVERED', 'SERVED'].includes(order.status);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
        {/* Main Card Content */}
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Items Count Section */}
          <div className="bg-muted flex flex-col justify-center items-center px-6 py-4 md:py-0 md:w-40">
            <span className="text-5xl font-bold text-blue-500">{totalItems}</span>
            <span className="text-sm font-medium text-blue-500">
              item{totalItems !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Details Section */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-foreground text-lg font-semibold">
                {order.user?.name || "Guest"}
              </h3>
              <div className="flex items-center space-x-2">
                <Dialog
                  open={isDetailsDialogOpen}
                  onOpenChange={setIsDetailsDialogOpen}
                >
                  <DialogTrigger asChild>
                    <button 
                      className={getStatusStyle()} 
                      onClick={handleStatusClick}
                    >
                      {order.status}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-popover border border-border max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-popover-foreground">
                        Order Details
                      </DialogTitle>
                    </DialogHeader>
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">
                            CUSTOMER NAME
                          </p>
                          <p className="text-sm font-medium text-popover-foreground">
                            {order.user?.name || "Guest"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">
                            EMAIL
                          </p>
                          <p className="text-sm font-medium text-popover-foreground">
                            {order.user?.email || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">
                            TABLE
                          </p>
                          <p className="text-sm font-medium text-popover-foreground">
                            {order.table ? `Table #${order.table.number} (${order.table.capacity} seats)` : order.room ? `Room #${order.room.number}` : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">
                            TOTAL ITEMS
                          </p>
                          <p className="text-sm font-medium text-popover-foreground">
                            {totalItems} Item{totalItems !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-blue-500 font-medium">
                            ORDER ID
                          </p>
                          <p className="text-sm font-medium text-blue-500">
                            {order.id.slice(-8)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">
                            PAYMENT STATUS
                          </p>
                          <p className="text-sm font-medium text-popover-foreground">
                            {order.paymentId ? "Paid" : "Pending"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Cancel Button - Only show if order can be cancelled */}
                {canBeCancelled && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelClick}
                    disabled={isUpdatingStatus}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                  >
                    {isUpdatingStatus ? 'Cancelling...' : 'Cancel'}
                  </Button>
                )}

                {/* Accordion Toggle Button */}
                <button
                  onClick={handleToggleItems}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label={isItemsExpanded ? "Hide items" : "Show items"}
                >
                  <svg
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                      isItemsExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Location Info */}
            <div className="flex items-center text-chart-1 mb-1">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-semibold">
                {order.table ? `Table #${order.table.number}` : order.room ? `Room #${order.room.number}` : "Takeaway"}
              </span>
            </div>
            <div className="text-muted-foreground text-sm mb-3">
              {order.table ? `Capacity: ${order.table.capacity} guests` : order.room ? `Room Service` : "For pickup"}
            </div>

            {/* Date & Total */}
            <div className="flex justify-between items-center border-t pt-3 mt-auto">
              <span className="text-sm text-muted-foreground">
                {formatDate(order.createdAt)}
              </span>
              <span className="text-chart-1 font-bold text-base">
                Total: ${parseFloat(order.total || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Accordion Content - Order Items */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isItemsExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t bg-muted/30 p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">Order Items:</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-card rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-chart-1 rounded-lg flex items-center justify-center">
                        {item.menuItem?.imageUrl ? (
                          <Image
                            src={baseUrl + item.menuItem.imageUrl}
                            alt={item.menuItem.name}
                            width={20}
                            height={20}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <svg
                            className="w-5 h-5 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm5.5 3a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm2.5 7.5h-5v-1a2 2 0 012-2h1a2 2 0 012 2v1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {item.menuItem?.name || "Unknown Item"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.menuItem?.category || "N/A"} • ${parseFloat(item.price || 0).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                          x{item.quantity}
                        </div>
                        <div className="font-semibold text-chart-1">
                          ${(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No items found for this order
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cancel Confirmation Dialog */}
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent className="bg-popover border border-border">
            <DialogHeader>
              <DialogTitle className="text-popover-foreground">
                Cancel Order
              </DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCancelDialogOpen(false)}
                  disabled={isUpdatingStatus}
                >
                  Keep Order
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelOrder}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? 'Cancelling...' : 'Cancel Order'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {orders.map((order) => (
        <OrderCardItem key={order.id} order={order} />
      ))}
    </div>
  );
}