"use client"

import FooterSection from '@/components/footer-section'
import NavBar from '@/components/NavBar'
import OrdersCard from '@/components/OrdersCard'
import { useFetch } from '@/hooks/useFetch'
import { useAuthStore } from '@/store/authStote'
import { useRouter } from 'next/navigation'

export default function page() {
    const router = useRouter()
    const { user } = useAuthStore()
    const { data: orders, isloading } = useFetch("/api/orders", ["orders"])
    const userOrderData = orders?.orders.filter((order) => order.user.id === user.id)

    const handleOrderClick = (order) => {
        // Navigate to order details page
        router.push(`/orders/${order.id}`)
    }

    return (
        <div className="">
            <NavBar />
            <div className='w-[60%] container m-auto'>
                <h1 className='text-3xl font-bold mt-10'>Your Recent Orders</h1>
            </div>
            <div className='p-10'>
                <OrdersCard
                    data={userOrderData}
                    onOrderClick={handleOrderClick}
                    isLoading={isloading}
                />
            </div>
            <FooterSection />
        </div>
    )
}