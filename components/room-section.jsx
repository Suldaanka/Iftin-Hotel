import { Button } from "@/components/ui/button"
import { Image } from "lucide-react"
import Link from "next/link"

export default function Rooms() {
  const rooms = [
    {
      id: 1,
      title: "Single Room",
      image: "/single.jpg", // Updated image path
      description: "Spacious and elegant accommodations with premium amenities.",
    },
    {
      id: 2,
      title: "Double Room", 
      image: "/double.jpg", // Updated image path
      description: "Modern comfort with a touch of sophistication for business travelers.",
    },
    {
      id: 3,
      title: "Family Suite",
      image: "/family.jpg", // Updated image path
      description: "Perfect for family getaways with separate living areas.",
    },
  ]

  return (
    <section className="py-20 bg-muted" id="rooms">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-block rounded-lg bg-muted-foreground/10 px-3 py-1 text-sm mb-4">15+ Room</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Exceptional Accommodations for Every Need</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From cozy rooms to luxurious suites, we offer a variety of accommodations to make your stay perfect, no
            matter the occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg">
              <img
                src={room.image || "/placeholder.svg"}
                alt={room.title}
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-2">{room.title}</h3>
                <p className="text-white/80 mb-4 text-sm">{room.description}</p>
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-black w-full"
                >
                 <Link href={`/rooms/${room.id}`}>
                  View Details
                 </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Explore All Rooms
          </Button>
        </div>
      </div>
    </section>
  )
}
