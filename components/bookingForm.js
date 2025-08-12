"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "./ui/select";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useMutate } from "@/hooks/useMutate";
import { useAuthStore } from "@/store/authStote";
import { useFetch } from "@/hooks/useFetch";
import { useQueryClient } from "@tanstack/react-query";
// Validation schema
const bookingSchema = z.object({
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  // FIX 1: Change 'guests' to 'guest' to match the API's expectation
  guest: z.string().min(1, "Number of guests is required").transform((val) => parseInt(val, 10)),
  roomId: z.string().min(1, "Room is required"),
});

export default function BookingForm() {
  const router = useRouter();
  const { user } = useAuthStore();
  console.log(user)
  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkIn: "",
      checkOut: "",
      // FIX 2: Change 'guests' to 'guest'
      guest: "",
      roomId: "",
    },
  });

  // Fetch rooms data for the dropdown
  const { data: rooms, isLoading: roomsLoading, isError: roomsError } = useFetch("/api/rooms", ["rooms"]);


  const roomsData = rooms?.rooms?.filter(room => room.status === "AVAILABLE");
  const queryClient  = useQueryClient();
  // Mutation hook for creating a booking
  const { execute, isPending: bookingPending } = useMutate("/api/bookings", ["bookings"], {
    method: "POST",
    requireAuth: true,
    onSuccess: () => {
      toast.success("Booking Created", {
        description: "The booking has been successfully created.",
      });
      form.reset();
      queryClient.invalidateQueries(["bookings"]);
      router.push("/bookings"); // Redirect t
    },
    onError: (err) => {
      console.error("Booking Error:", err.message);
      if (err.message.includes("Access denied") || err.message.includes("token") || err.message.includes("unauthorized")) {
        toast.error("Session expired", { description: "Please login again to continue." });
        router.push("/sign-in");
      } else {
        toast.error(err.message || "Booking failed");
      }
    },
  });

  const onSubmit = (values) => {
    if (!user) {
      toast.error("Please log in to book");
      router.push("/sign-in");
      return;
    }

    const payload = {
      userId: user.id,
      ...values,
      fullName: user.name,
      checkIn: new Date(values.checkIn),
      checkOut: new Date(values.checkOut),
    };

    execute(payload);
  };
  

  return (
    <div className="w-full max-w-5xl rounded-lg bg-card p-6 shadow-lg">
      <h2 className="mb-4 text-center text-2xl font-bold">Book Your Stay</h2>
      <Tabs defaultValue="reservation" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reservation">Reservation</TabsTrigger>
          <TabsTrigger value="availability">Check Availability</TabsTrigger>
        </TabsList>

        {/* Reservation Tab */}
        <TabsContent value="reservation" className="mt-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col md:flex-row gap-4"
            >
              {/* Check In */}
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Check In</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Check Out */}
              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Check Out</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Guests */}
              <FormField
                control={form.control}
                // FIX 3: Change 'guests' to 'guest'
                name="guest"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Guests</FormLabel>
                    <FormControl>
                      <Select
                        // FIX 4: Change 'guests' to 'guest' for onValueChange and defaultValue
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select guests" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Guests</SelectLabel>
                            {[1, 2, 3, 4, 5].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} Guest{num > 1 && "s"}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Room ID */}
              <FormField
                control={form.control}
                name="roomId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Room</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={roomsLoading || roomsError}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={!roomsData ? "Loading rooms..." : "Select a room"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Available Rooms</SelectLabel>
                            {roomsData?.length > 0 ? (
                              roomsData.map((room) => (
                                <SelectItem key={room.id} value={room.id}>
                                  Room {room.number} - {room.type} (${room.price})
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem disabled value="no-rooms">
                                {!roomsData ? "Loading..." : "No available rooms"}
                              </SelectItem>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <div className="flex items-end">
                <Button
                  type="submit"
                  className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={bookingPending}
                >
                  {bookingPending ? "Booking..." : "Book Now"}
                </Button>
              </div>
            </form>
          </Form>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Best rate guaranteed. No reservation fees.
          </p>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="mt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input type="date" placeholder="Check In" />
            </div>
            <div className="flex-1">
              <Input type="date" placeholder="Check Out" />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Check Availability
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}