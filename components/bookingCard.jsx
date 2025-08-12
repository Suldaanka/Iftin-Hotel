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
import Loading from "./Loading";

export default function BookingCard({ data }) {
  if (!Array.isArray(data)) {
    return (
     <Loading/>
    );
  }

  if (data.length === 0) {
    return (
      <Alert variant="default" className="h-64 flex items-center justify-center">
        <AlertDescription className="text-center">
            <Loading/>
        </AlertDescription>
      </Alert>
    );
  }

  const bookings = data;

  const BookingCardItem = ({ booking }) => {
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    console.log(booking);
    const getStatusStyle = () => {
      switch (booking.status) {
        case "CONFIRMED":
        case "COMPLETED":
          return "bg-chart-2 text-white px-3 py-1 rounded text-xs font-medium";
        case "PENDING":
          return "bg-blue-500 text-white px-3 py-1 rounded text-xs font-medium";
        case "CANCELLED":
          return "bg-destructive text-destructive-foreground px-3 py-1 rounded text-xs font-medium";
        default:
          return "bg-muted text-muted-foreground px-3 py-1 rounded text-xs font-medium";
      }
    };

    const calculateNights = () => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const diffTime = Math.abs(checkOut - checkIn);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const formatDateRange = () => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      return `${checkIn.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })} - ${checkOut.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    };

    const nights = calculateNights();

    return (
      <div className="flex flex-col md:flex-row bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 items-stretch">
        {/* Night Count Section */}
        <div className="bg-muted flex flex-col justify-center items-center px-6 py-4 md:py-0 md:w-40">
          <span className="text-5xl font-bold text-blue-500">{nights}</span>
          <span className="text-sm font-medium text-blue-500">
            night{nights > 1 ? "s" : ""}
          </span>
        </div>

        {/* Details Section */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-foreground text-lg font-semibold">
              {booking.fullName}
            </h3>
            <Dialog
              open={isDetailsDialogOpen}
              onOpenChange={setIsDetailsDialogOpen}
            >
              <DialogTrigger asChild>
                <button className={getStatusStyle()}>{booking.status}</button>
              </DialogTrigger>
              <DialogContent className="bg-popover border border-border">
                <DialogHeader>
                  <DialogTitle className="text-popover-foreground">
                    Booking Details
                  </DialogTitle>
                </DialogHeader>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        GUEST NAME
                      </p>
                      <p className="text-sm font-medium text-popover-foreground">
                        {booking.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        EMAIL
                      </p>
                      <p className="text-sm font-medium text-popover-foreground">
                        {booking.user.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        PHONE
                      </p>
                      <p className="text-sm font-medium text-popover-foreground">
                        {booking.phoneNumber || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        GUESTS
                      </p>
                      <p className="text-sm font-medium text-popover-foreground">
                        {booking.guest} Guest
                        {booking.guest > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-500 font-medium">
                        ROOM
                      </p>
                      <p className="text-sm font-medium text-blue-500 light:text">
                        #{booking.room.number} ({booking.room.type})
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        BOOKING ID
                      </p>
                      <p className="text-sm font-medium text-popover-foreground">
                        {booking.id.slice(-8)}
                      </p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Room Info */}
          <div className="flex items-center text-chart-1 mb-1">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v2H6V6zm0 4h8v2H6v-2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-semibold">
              Room #{booking.room.number}
            </span>
          </div>
          <div className="text-muted-foreground text-sm mb-3">
            {booking.room.type}
          </div>

          {/* Date & Price */}
          <div className="flex justify-between items-center border-t pt-3 mt-auto">
            <span className="text-sm text-muted-foreground">
              {formatDateRange()}
            </span>
            <span className="text-chart-1 font-bold text-base">
              ${booking.room.price}/night
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {bookings.map((booking) => (
        <BookingCardItem key={booking.id} booking={booking} />
      ))}
    </div>
  );
}
