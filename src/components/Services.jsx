'use client'

import { useState, useEffect, useRef } from 'react'
import { Poppins, Dancing_Script } from 'next/font/google'
import { Music, Headphones, Sliders } from 'lucide-react'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400'],
})

export default function Services() {
  const services = [
    {
      id: 1,
      title: "Sound Design",
      description: "The sound design at Looks Good goes beyond simple audio, where the listener is immersed into the world of sound through great attention to detail and builds on unique connection between visuals and noise.",
      icon: <Headphones size={32} className="text-[#0c4000]" />,
      bgColor: "bg-white",
      textColor: "text-[#0c4000]",
      descriptionColor: "text-gray-700",
      hasBorder: false,
      iconPosition: "left"
    },
    {
      id: 2,
      title: "Music Supervision",
      description: "Here at Looks Good, we make sure to work with composers best suited toward your project. With careful selection in mind, we use our strong sense of how music can enhance a visual medium to choose what is best for your work.",
      icon: <Music size={32} className="text-white" />,
      bgColor: "bg-[#0c4000]",
      textColor: "text-white",
      descriptionColor: "text-gray-200",
      hasBorder: true,
      iconPosition: "right"
    },
    {
      id: 3,
      title: "Re-recording Mix (5.1 Available)",
      description: "Combining our knowledge of music synchronization, licensing, and storytelling skills - our objective at Looks Good is to create a well-rounded sound. The process of balancing multiple audio tracks and adjusting the volume accordingly is another one of our specialties.",
      icon: <Sliders size={32} className="text-[#0c4000]" />,
      bgColor: "bg-white",
      textColor: "text-[#0c4000]",
      descriptionColor: "text-gray-700",
      hasBorder: false,
      iconPosition: "left"
    }
  ]

  return (
    <section className={`relative pt-10 pb-28 bg-[#0c4000] overflow-hidden ${poppins.className}`}>
      {/* Heading */}
      <div className="relative text-center mb-20">
        <h1 className={`absolute inset-0 top-0 md:top-4 text-[6rem] md:text-[11rem] text-[#B2EBF9]/15 pointer-events-none select-none z-0 leading-none ${dancingScript.className}`}>
          Services
        </h1>
        <p className="relative text-lg text-white z-10 mb-4">What We Offer</p>
        <h2 className="relative text-4xl md:text-6xl font-extrabold z-10">
          <span className="text-black">Professional Services</span><br />
          <span className="text-white">For Your Needs</span>
        </h2>
      </div>

      {/* Services Content */}
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex flex-col items-center space-y-24">
          {services.map((service, index) => (
            <div key={service.id} className="relative w-full">
              {/* Background div with conditional border */}
              <div 
                className={`absolute inset-0 ${service.bgColor} rounded-full ${service.hasBorder ? 'border-8 border-white' : ''}`}
                style={{ 
                  top: '-2rem', 
                  bottom: '-2rem',
                  left: service.iconPosition === 'right' ? '0' : '-2rem',
                  right: service.iconPosition === 'left' ? '0' : '-2rem',
                }}
              ></div>
              
              <div className="relative flex flex-col items-start gap-6 py-10 w-full">
                {/* Icon with positioning */}
                <div 
                  className={`absolute ${service.iconPosition === 'left' ? 'left-0' : 'right-0'} -top-8 w-16 h-16 rounded-full flex items-center justify-center ${index === 1 ? 'bg-[#0c4000] border-2 border-white' : 'bg-white'}`}
                >
                  {service.icon}
                </div>
                
                {/* Service content */}
                <div 
                  className={`absolute ${service.iconPosition === 'left' ? 'left-0' : 'right-0'} top-6  px-4`}
                >
                  <h3 className={`text-xl font-bold mb-3 ${service.textColor}`}>{service.title}</h3>
                  <p className={`${service.descriptionColor} mb-4`}>{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}