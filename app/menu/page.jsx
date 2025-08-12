import FooterSection from '@/components/footer-section'
import NavBar from '@/components/NavBar'
import RestaurantMenu from '@/components/RestaurantMenu'
import React from 'react'

export default function page() {
  return (
    <div>
        <NavBar/>
        <RestaurantMenu/>
        <FooterSection/>
    </div>
  )
}
