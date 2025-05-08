'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Poppins, Dancing_Script } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400'],
})


const testimonials = [
  {
    logo: '/Partners/Apple.png',
    name: 'Sarah J.',
    role: 'Creative Director, Apple',
    quote: 'Evietek’s design instincts are unmatched. Working with them elevated our product experience tremendously.',
    avatar: '/avatar1.png',
  },
  {
    logo: '/Partners/Nike.png',
    name: 'Jason R.',
    role: 'Brand Lead, Nike',
    quote: 'Their team brought both creativity and discipline. Absolutely loved the collaboration!',
    avatar: '/avatar2.png',
  },
  {
    logo: '/Partners/SAMSUNG.png',
    name: 'Linda K.',
    role: 'Head of Innovation, Samsung',
    quote: 'Timely, reliable, and brilliant. Couldn’t ask for more in a tech partner.',
    avatar: '/avatar3.png',
  },
]

export default function Testimonials() {
  const [selected, setSelected] = useState(0)

  return (
    <section className="bg-white py-20 px-4 relative text-center">
<div className={`relative text-center mb-20 ${poppins.className}`}>
  {/* Background Word */}
  <h1
    className={`absolute inset-0 top-0 md:top-4 text-[6rem] md:text-[11rem] text-[#0c4000]/10 pointer-events-none select-none z-0 leading-none ${dancingScript.className}`}
  >
    Feedback
  </h1>

  {/* Subtitle */}
  <p className="relative text-lg text-gray-600 z-10 mb-4">
    Customer Testimonials
  </p>

  {/* Main Heading */}
  <h2 className="relative text-4xl md:text-6xl font-extrabold z-10">
    <span className="text-[#0c4000]">Trusted by Brands. <br/>  </span>
    <span className="text-black">Celebrated by Creators.</span>
  </h2>
</div>




      {/* Logo Switcher */}
      <div className="flex justify-center flex-wrap gap-8 mb-12 border-y border-gray-200 py-6">
  {testimonials.map((item, idx) => (
    <button
      key={idx}
      onClick={() => setSelected(idx)}
      className="group relative flex items-center justify-center p-1 transition-all duration-300"
    >
      {/* Logo Image */}
      <Image
        src={item.logo}
        alt={item.name}
        width={120}
        height={60}
        className={`object-contain w-30 h-15 transition duration-300 ${
          selected === idx ? 'grayscale-0 opacity-100' : 'grayscale opacity-60 group-hover:opacity-80'
        }`}
      />

      {/* Active Underline */}
      {selected === idx && (
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-[#0c4000] rounded-full" />
      )}
    </button>
  ))}
</div>


      {/* Testimonial Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto px-4"
        >
          <p className="text-xl md:text-2xl font-semibold text-gray-800 mb-8 italic">
            “{testimonials[selected].quote}”
          </p>
          <div className="flex flex-col items-center gap-2">
            <Image
              src={testimonials[selected].avatar}
              alt={testimonials[selected].name}
              width={64}
              height={64}
              className="rounded-full"
            />
            <h4 className="text-lg font-bold text-[#0c4000]">{testimonials[selected].name}</h4>
            <p className="text-sm text-gray-500">{testimonials[selected].role}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
