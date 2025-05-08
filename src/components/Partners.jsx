'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { Poppins, Dancing_Script } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400'],
})


export default function Partners() {
  const logos = [
    { label: 'Apple', src: '/Partners/Apple.png' },
    { label: 'Calvin Klein', src: '/Partners/Calvin_Klein.png' },
    { label: 'Nike', src: '/Partners/Nike.png' },
    { label: 'Puma', src: '/Partners/Puma.png' },
    { label: 'SAMSUNG', src: '/Partners/SAMSUNG.png' },
  ]

  const repeated = [...logos, ...logos, ...logos] // Repeated 3x for smoothness

  return (
    <section className="relative pb-20 pt-10 bg-gradient-to-b from-white via-[#f6f8f6] to-[#ecf3ec] overflow-hidden">
      {/* Heading */}
      
      <div className={`relative text-center mb-20 ${poppins.className}`}>
  {/* Background Word */}
  <h1
    className={`absolute inset-0 top-0 md:top-4 text-[6rem] md:text-[11rem] text-[#0c4000]/10 pointer-events-none select-none z-0 leading-none ${dancingScript.className}`}
  >
    Partners
  </h1>

  {/* Subtitle */}
  <p className="relative text-lg text-gray-600 z-10 mb-4">
    Trusted Partners
  </p>

  {/* Main Heading */}
  <h2 className="relative text-4xl md:text-6xl font-extrabold z-10">
    <span className="text-[#0c4000]">Brands That  </span>
    <span className="text-black">Vibe With Us.</span>
  </h2>
</div>

      {/* Blur Edges */}
      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white z-10" />
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white z-10" />

      {/* Carousel */}
      <div className="relative overflow-visible">
        <motion.div
          className="flex gap-20 animate-scroll whitespace-nowrap px-10"
          animate={{ x: ['0%', '-100%'] }}
          transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
        >
          {repeated.map(({ label, src }, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1 }}
              className="group relative flex-shrink-0 w-86 h-72 rounded-2xl bg-white shadow-lg backdrop-blur-md border border-[#cce6cc] transition-transform duration-300 ease-in-out hover:shadow-2xl flex items-center justify-center overflow-hidden"
            >
              {/* Logo */}
              <Image
                src={src}
                alt={label}
                width={200}
                height={100}
                className="object-contain w-4/5 h-4/5 grayscale group-hover:grayscale-0 transition duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const fallback = e.currentTarget.nextSibling
                  if (fallback) fallback.style.display = 'flex'
                }}
              />

              {/* Label Fallback (if image fails) */}
              <div className="hidden absolute text-[#0c4000] font-bold text-lg bg-[#eaf5eb] px-4 py-2 rounded-lg shadow-md uppercase tracking-wide">
                {label}
              </div>

              {/* Hover Tooltip */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-medium bg-[#0c4000] text-white px-3 py-1 rounded-full shadow-md pointer-events-none z-20">
                {label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </section>
  )
}
