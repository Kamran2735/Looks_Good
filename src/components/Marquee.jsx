'use client'

import React from 'react'

export default function Marquee() {
  return (
    <div className="relative w-full overflow-hidden bg-[#0c4000] py-6">
      <div className="marquee-track flex whitespace-nowrap">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center space-x-20 px-4">
            {[...Array(6)].map((_, j) => (
              <span
                key={j}
                className="text-white text-[50px] md:text-[70px] font-bold tracking-wide"
              >
                Looks Good Audio
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Gradient edges for aesthetic fade-out */}
      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#0c4000] to-transparent z-10" />
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#0c4000] to-transparent z-10" />

      <style jsx>{`
        @keyframes scrollMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-track {
          animation: scrollMarquee 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
