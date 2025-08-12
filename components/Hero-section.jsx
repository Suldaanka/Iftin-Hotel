"use client"

import Image from 'next/image'
import React from 'react'
//import { Button } from 'react-day-picker'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
//import { Calendar } from './ui/calendar'
import { Input } from './ui/input'
import { Users } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import NavBar from './NavBar'
import Link from 'next/link'
import BookingForm from './bookingForm'




export default function HeroSection() {
  return (
   <div className=''>
     <section id="home" className="relative ">
          <div className="absolute inset-0">
            <Image
              src="/bg.png"
              alt="Luxury hotel lobby"
              fill
              className="object-cover brightness-[0.3] opacity-90 blur-[2px]"
              priority
            />
          </div>
          <div className="container mx-auto relative z-10 py-24 md:py-32 flex items-center justify-center p-2">
            <div className="flex flex-col items-center">
              <div className="mb-12 text-center text-white">
                <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white">
                  Iftin Hotel, Hobyo
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-white">
                  The perfect balance of luxury, comfort, and value are Iftin Hotel. Your home away from home.
                </p>
                <div className="mt-8 flex gap-4 justify-center">
                  <Button size="lg" className="bg-blue-700 hover:bg-blue-400 text-white">
                    <Link href="#rooms">
                        Explore Rooms
                    </Link>
                  </Button>
                </div>
              </div>
                <BookingForm />
            </div>
          </div>
    </section>
   </div>
  )
}
