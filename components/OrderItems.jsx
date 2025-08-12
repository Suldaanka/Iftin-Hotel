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

export default function OrderItemsPage({ orderData }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);

  if (!orderData || !orderData.items || !Array.isArray(orderData.items)) {
    return (
      <Alert variant="destructive" className="h-64 flex items-center justify-center">
        <AlertDescription className="text-center">
          No order data available
        </AlertDescription>
      </Alert>
    );
  }

  const { items, user, table, room, total, status, createdAt, id } = orderData;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyle = () => {
    switch (status) {
      case "COMPLETED":
      case "DELIVERED":
        return "bg-chart-2 text-white";
      case "PENDING":
        return "bg-blue-500 text-white";
      case "PREPARING":
        return "bg-yellow-500 text-white";
      case "CANCELLED":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const openItemDialog = (item) => {
    setSelectedItem(item);
    setIsItemDialogOpen(true);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Order Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Order #{id.slice(-8)}
            </h1>
            <p className="text-muted-foreground">{formatDate(createdAt)}</p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusStyle()}`}>
            {status}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">CUSTOMER</p>
            <p className="text-sm font-medium">{user?.name || "Guest"}</p>
            <p className="text-xs text-muted-foreground">{user?.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">LOCATION</p>
            {table && (
              <>
                <p className="text-sm font-medium">Table #{table.number}</p>
                <p className="text-xs text-muted-foreground">Capacity: {table.capacity} guests</p>
              </>
            )}
            {room && (
              <>
                <p className="text-sm font-medium">Room #{room.number}</p>
                <p className="text-xs text-muted-foreground">Room Service</p>
              </>
            )}
            {!table && !room && (
              <>
                <p className="text-sm font-medium">Takeaway</p>
                <p className="text-xs text-muted-foreground">For pickup</p>
              </>
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">TOTAL</p>
            <p className="text-lg font-bold text-chart-1">${parseFloat(total || 0).toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">{getTotalItems()} items</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Order Items</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors"
              onClick={() => openItemDialog(item)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-chart-1 rounded-lg flex items-center justify-center">
                  {item.menuItem?.imageUrl ? (
                    <img
                      src={item.menuItem.imageUrl}
                      alt={item.menuItem.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <svg
                      className="w-6 h-6 text-white"
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
                  <h3 className="font-medium text-foreground">{item.menuItem?.name || "Unknown Item"}</h3>
                  <p className="text-sm text-muted-foreground">
                    Category: {item.menuItem?.category || "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${parseFloat(item.price || 0).toFixed(2)} each
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm font-medium">
                    Qty: {item.quantity}
                  </div>
                  <div className="text-lg font-semibold text-chart-1">
                    ${(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Item Details Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="bg-popover border border-border">
          <DialogHeader>
            <DialogTitle className="text-popover-foreground">
              {selectedItem?.menuItem?.name || "Item Details"}
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="p-4 space-y-4">
              {/* Item Image */}
              <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                {selectedItem.menuItem?.imageUrl ? (
                  <img
                    src={selectedItem.menuItem.imageUrl}
                    alt={selectedItem.menuItem.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-muted-foreground">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Item Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">CATEGORY</p>
                  <p className="text-sm font-medium text-popover-foreground capitalize">
                    {selectedItem.menuItem?.category || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">UNIT PRICE</p>
                  <p className="text-sm font-medium text-popover-foreground">
                    ${parseFloat(selectedItem.price || 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">QUANTITY</p>
                  <p className="text-sm font-medium text-popover-foreground">
                    {selectedItem.quantity}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-500 font-medium">TOTAL</p>
                  <p className="text-lg font-bold text-blue-500">
                    ${(parseFloat(selectedItem.price || 0) * selectedItem.quantity).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Description if available */}
              {selectedItem.menuItem?.description && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-2">DESCRIPTION</p>
                  <p className="text-sm text-popover-foreground">
                    {selectedItem.menuItem.description}
                  </p>
                </div>
              )}

              {/* Item ID */}
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Item ID: {selectedItem.id.slice(-8)}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}