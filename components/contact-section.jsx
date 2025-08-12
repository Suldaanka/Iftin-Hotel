import { MapPin } from "lucide-react";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function Contact() {
  return (
    <div>
        <section id="contact" className="bg-gray-900 dark:bg-gray-950 py-16 px-4 text-white">
          <div className="container mx-auto">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h2 className="font-serif text-3xl font-bold tracking-tight">Contact Us</h2>
                <div className="mt-2 h-1 w-24 bg-blue-600"></div>
                <p className="mt-6 text-gray-300">
                  We’re here to answer any questions you may have about our hotel, services, or reservations.
                </p>
                <div className="mt-8 space-y-6">
                  <div className="flex items-start">
                    <MapPin className="mr-4 h-6 w-6 text-blue-500" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="mt-1 text-gray-300">Hobyo Galmudug, Somalai</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="mr-4 h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="mt-1 text-gray-300">+251-611-1159-99</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="mr-4 h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="mt-1 text-gray-300">info@iftinhotel.com</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <form className="space-y-4 rounded-lg bg-card p-6 text-foreground">
                  <h3 className="text-xl font-bold">Send us a message</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">First Name</label>
                      <Input className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Name</label>
                      <Input className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input type="tel" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <textarea
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      rows={4}
                    ></textarea>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Send Message</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
}
