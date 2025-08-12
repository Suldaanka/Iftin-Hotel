"use client"

import Image from 'next/image'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

export default function Gallery() {
  const [showModal, setShowModal] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState('');

  const handleImageClick = (src) => {
    setSelectedImageSrc(src);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedImageSrc('');
  };

  return (
    <div>
      <section id="gallery" className="bg-muted py-16 px-4">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">Hotel Gallery</h2>
            <div className="mt-2 h-1 w-24 bg-blue-600 mx-auto"></div>
            <p className="mt-6 text-lg text-muted-foreground">
              Take a visual tour of our beautiful hotel and facilities.
            </p>
          </div>
          {/* Updated grid for responsive layout */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 auto-rows-[240px] gap-4 p-4">
            <div 
              className="relative col-span-1 md:col-span-1 row-span-1 md:row-span-2 overflow-hidden rounded-xl cursor-pointer"
              onClick={() => handleImageClick("/park.jpg")}
            >
              <Image
                src="/park.jpg"
                alt="Hotel lobby"
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
            <div 
              className="relative col-span-1 md:col-span-2 overflow-hidden rounded-xl cursor-pointer"
              onClick={() => handleImageClick("/rest.jpg")}
            >
              <Image
                src="/rest.jpg"
                alt="Hotel room"
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
            <div 
              className="relative col-span-1 md:col-span-1 overflow-hidden rounded-xl cursor-pointer"
              onClick={() => handleImageClick("/rest02.jpg")}
            >
              <Image
                src="/rest02.jpg"
                alt="Hotel restaurant"
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
            <div 
              className="relative col-span-1 md:col-span-2 overflow-hidden rounded-xl cursor-pointer"
              onClick={() => handleImageClick("/hall01.jpg")}
            >
              <Image
                src="/hall01.jpg"
                alt="Hotel Hall"
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
            <div 
              className="relative col-span-1 md:col-span-1 overflow-hidden rounded-xl cursor-pointer"
              onClick={() => handleImageClick("/hall02.jpg")}
            >
              <Image
                src="/hall02.jpg"
                alt="Hotel bar"
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
            <div 
              className="relative col-span-1 md:col-span-4 row-span-1 md:row-span-2 overflow-hidden rounded-xl cursor-pointer"
              onClick={() => handleImageClick("/restView.jpg")}
            >
              <Image
                src="/restView.jpg"
                alt="Hotel exterior"
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Image Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[800px] p-0 border-none">
          <DialogTitle className="sr-only">Enlarged Gallery Image</DialogTitle>
          {selectedImageSrc && (
            <Image
              src={selectedImageSrc}
              alt="Enlarged gallery image"
              width={800}
              height={800}
              className="object-contain w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
