'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function CustomArc() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`fixed top-0 left-0 w-full z-50 flex justify-center  pointer-events-none`}>
      <div
        className={`
          relative w-[400px] transition-transform duration-500  ease-in-out
          ${isOpen ? 'translate-y-0' : '-translate-y-[85%]'}
          pointer-events-auto
        `}
      >
        {/* Navigation Links */}
        <div className="absolute top-0 left-0 w-full h-16 flex justify-between px-8 pt-2 z-10 ">
          {/* Left links */}
          <div className="flex gap-6 text-white">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
          </div>
          {/* Right links */}
          <div className="flex gap-6 text-white">
            <Link href="/archive">Archive</Link>
            <Link href="/team">Team</Link>
          </div>
        </div>

        {/* SVG Arc */}
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-15">
          <path d="M0,0 L100,0 L100,10 Q50,25 0,10 Z" fill="#212121" />
        </svg>

        {/* Center hanging logo - fully clickable */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 top-6 cursor-pointer z-20"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="bg-[#212121] rounded-full h-12 w-12 relative overflow-hidden shadow-lg ">
            <Image
              src="/logo-nobg.png"
              alt="Logo"
              fill
              className="object-cover pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
    