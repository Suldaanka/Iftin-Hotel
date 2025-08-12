'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const rooms = [
  {
    id: 1,
    name: 'Single Room',
    description: 'Perfect for solo travelers, our single rooms offer comfort and convenience.',
    price: 50,
    image: '/single.jpg',
  },
  {
    id: 2,
    name: 'Double Room',
    description: 'Spacious and comfortable, ideal for couples or business travelers.',
    price: 75,
    image: '/double.jpg',
  },
  {
    id: 3,
    name: 'Family Room',
    description: 'Perfect for families, featuring extra space and amenities for everyone.',
    price: 120,
    image: '/family.jpg',
  }
]

export default function RoomsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-12"
      >
        Our Rooms
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-lg overflow-hidden shadow-lg"
          >
            <div className="relative h-64">
              <Image
                src={room.image}
                alt={room.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{room.name}</h2>
              <p className="text-muted-foreground mb-4">{room.description}</p>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <span className="text-xl font-bold">${room.price}/night</span>
                <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
                  <Link href={`/rooms/${room.id}`} className="w-full sm:w-auto text-center bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors">
                    View Room
                  </Link>
                  <button className="w-full sm:w-auto bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}