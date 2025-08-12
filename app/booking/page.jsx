"use client"


import BookingCard from '@/components/bookingCard'
import FooterSection from '@/components/footer-section'
import NavBar from '@/components/NavBar'
import { useFetch } from '@/hooks/useFetch'
import { useAuthStore } from '@/store/authStote'
import React from 'react'

export default function page() {

    const {user} = useAuthStore();

    const {data, isloading,error} = useFetch('/api/bookings', ['bookings']);
    
    const bookings = data?.bookings || [];
    const filteredBookings = user?.id ? bookings.filter(booking => user.id === booking.userId) : [];
    
  return (
    <div>
        <NavBar/>
          <div className='w-[60%] container m-auto'>
            <h1 className='text-3xl font-bold mt-10'>Your Bookings</h1>
          </div>
            <div className='p-10'>
            <BookingCard data={filteredBookings}/>
            </div>
        <FooterSection/>
    </div>
  )
}
