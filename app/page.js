import AboutSection from "@/components/about-section";
import Amenities from "@/components/Amenities";
import Contact from "@/components/contact-section";
import FooterSection from "@/components/footer-section";
import Gallery from "@/components/Gallery";
import HeroSection from "@/components/Hero-section";
import NavBar from "@/components/NavBar";
import Rooms from "@/components/room-section";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <NavBar/>
     <HeroSection/>
     <AboutSection/>
     <Rooms/>
     <Amenities/>
     <Gallery/>
     <Contact/>
     <FooterSection/>
    </>
  );
}
