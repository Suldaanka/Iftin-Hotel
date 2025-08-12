'use client'

import FooterSection from '@/components/footer-section'
import NavBar from '@/components/NavBar'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useParams } from 'next/navigation'

const rooms = {
  1: {
    id: 1,
    name: 'Single Room',
    description: 'Perfect for solo travelers, our single rooms offer comfort and convenience.',
    longDescription: 'Experience comfort and convenience in our thoughtfully designed single rooms. Each room features modern amenities, stylish furnishings, and everything you need for a pleasant stay. The rooms are perfect for business travelers or solo adventurers looking for a cozy space to relax after exploring the city.',
    price: 50,
    image: '/single.jpg',
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'TV', 'Private Bathroom', 'Work Desk', 'Daily Housekeeping', 'Room Service', '24/7 Reception'],
    size: '20m²',
    bed: '1 Single Bed',
    occupancy: '1 Person',
    features: ['City View', 'Soundproof Windows', 'Blackout Curtains']
  },
  2: {
    id: 2,
    name: 'Double Room',
    description: 'Spacious and comfortable, ideal for couples or business travelers.',
    longDescription: 'Our double rooms provide the perfect blend of comfort and style. With more space and additional amenities, these rooms are ideal for couples or business travelers who appreciate extra comfort. Enjoy the modern décor, comfortable seating area, and all the conveniences you need for a memorable stay.',
    price: 75,
    image: '/double.jpg',
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'TV', 'Private Bathroom', 'Mini Fridge', 'Coffee Maker', 'Work Desk', 'Daily Housekeeping', 'Room Service', '24/7 Reception'],
    size: '25m²',
    bed: '1 Queen Bed',
    occupancy: '2 People',
    features: ['City View', 'Sitting Area', 'Soundproof Windows', 'Blackout Curtains']
  },
  3: {
    id: 3,
    name: 'Family Room',
    description: 'Perfect for families, featuring extra space and amenities for everyone.',
    longDescription: 'Welcome to our spacious family rooms - your home away from home. These thoughtfully designed accommodations offer generous space for the whole family to unwind and create lasting memories. Featuring multiple beds and family-oriented amenities, our rooms ensure everyone enjoys a comfortable and memorable stay.',
    price: 150,
    image: '/family.jpg',
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'TV', 'Private Bathroom', 'Mini Fridge', 'Coffee Maker', 'Extra Beds', 'Daily Housekeeping', 'Room Service', '24/7 Reception'],
    size: '35m²',
    bed: '1 King Bed + 2 Single Beds',
    occupancy: '4 People',
    features: ['Garden View', 'Sitting Area', 'Soundproof Windows', 'Blackout Curtains', 'Extra Storage']
  }
}

export default function RoomDetail() {
  const { id } = useParams()
  const room = rooms[id]

  if (!room) return <div>Room not found</div>

  return (
    <>
      <NavBar/>
      <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src={room.image}
              alt={room.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{room.name}</h1>
            <p className="text-xl text-muted-foreground">{room.longDescription}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p><strong>Size:</strong> {room.size}</p>
                <p><strong>Bed:</strong> {room.bed}</p>
                <p><strong>Occupancy:</strong> {room.occupancy}</p>
              </div>
              <div className="space-y-2">
                <p><strong>Price:</strong> ${room.price}/night</p>
                <button className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">
                  Book Now
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Room Features</h2>
              <ul className="grid grid-cols-2 gap-2">
                {room.features.map((feature) => (
                  <li key={feature} className="flex items-center space-x-2">
                    <span>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Amenities</h2>
              <ul className="grid grid-cols-2 gap-2">
                {room.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center space-x-2">
                    <span>✓</span>
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
      <FooterSection/>
    </>
    
  )
}