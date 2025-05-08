'use client'

import { useEffect, useState } from 'react'
import { Poppins, Dancing_Script } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400'],
})


const locations = [
  { city: 'Los Angeles', lat: 34.0522, lng: -118.2437, timezone: 'America/Los_Angeles' },
  { city: 'New York', lat: 40.7128, lng: -74.006, timezone: 'America/New_York' },
  { city: 'Sydney', lat: -33.8688, lng: 151.2093, timezone: 'Australia/Sydney' },
  { city: 'Melbourne', lat: -37.8136, lng: 144.9631, timezone: 'Australia/Melbourne' },
]

function FlipDigit({ value }) {
  const [prev, setPrev] = useState(value)
  const [flip, setFlip] = useState(false)

  useEffect(() => {
    if (value !== prev) {
      setFlip(true)
      const timeout = setTimeout(() => {
        setFlip(false)
        setPrev(value)
      }, 400)
      return () => clearTimeout(timeout)
    }
  }, [value, prev])

  return (
    <div className="flip-digit">
      <div className={`flip-card ${flip ? 'flipping' : ''}`}>
        <div className="front">{prev}</div>
        <div className="back">{value}</div>
      </div>

      <style jsx>{`
        .flip-digit {
          width: 22px;
          height: 34px;
          margin: 0 1px;
          perspective: 600px;
        }

        .flip-card {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.4s ease;
        }

        .flipping {
          transform: rotateX(180deg);
        }

        .front,
        .back {
          position: absolute;
          width: 100%;
          height: 100%;
          font-family: monospace;
          font-size: 1rem;
          font-weight: bold;
          color: white;
          background-color: black;
          display: flex;
          align-items: center;
          justify-content: center;
          backface-visibility: hidden;
          border-radius: 3px;
        }

        .back {
          transform: rotateX(180deg);
        }
      `}</style>
    </div>
  )
}

function TimeDisplay({ timezone }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(time)

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(time)

  const chars = formattedTime.split('')

  return (
    <div className="flex flex-col items-center w-full">
      {/* Time Row */}
      <div className="flex justify-center items-center flex-wrap">
        {chars.map((char, index) =>
          char === ':' || char === ' ' ? (
            <span key={index} className="text-sm mx-[1px] text-[#0c4000]">
              {char}
            </span>
          ) : (
            <FlipDigit key={index} value={char} />
          )
        )}
      </div>
  
      {/* Date Row - now styled like a bottom bar */}
      <div className="w-full mt-2 pt-2 border-t border-[#e0e0e0] text-[1rem] text-gray-500 tracking-wide font-mono uppercase">
        {formattedDate}
      </div>
    </div>
  )
  
}

export default function Location() {
  return (
    <section className="bg-white py-12 px-2 text-center rounded-lg shadow-lg">
<div className={`relative text-center mb-20 ${poppins.className}`}>
  {/* Background Word */}
  <h1
    className={`absolute inset-0 top-0 md:top-4 text-[6rem] md:text-[11rem] text-[#0c4000]/10 pointer-events-none select-none z-0 leading-none ${dancingScript.className}`}
  >
    Location
  </h1>

  {/* Subtitle */}
  <p className="relative text-lg text-gray-600 z-10 mb-4">
    Our Location
  </p>

  {/* Main Heading */}
  <h2 className="relative text-4xl md:text-6xl font-extrabold z-10">
    <span className="text-[#0c4000]">Creative Energy, </span>
    <span className="text-black"> City to City</span>
  </h2>
</div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {locations.map((loc) => (
          <div
            key={loc.city}
            className="border border-[#0c4000] rounded-xl overflow-hidden shadow-sm h-[370px]"
            >
<iframe
  width="100%"
  height="220"
  className="grayscale"
  style={{ border: 'none' }}
  src={`https://maps.google.com/maps?q=${loc.lat},${loc.lng}&z=12&output=embed&pb=!1m18!1m12!1m3!1d0!2d${loc.lng}!3d${loc.lat}!2m3!1f0!2f0!3f0`}
  allowFullScreen
  loading="lazy"
/>


            <div className="bg-[#dcdfe4] py-1 flex items-center justify-center">
              <h3 className="text-md font-bold text-[#0c4000]">{loc.city}</h3>
            </div>

            <div className="py-4 px-2">
              <TimeDisplay timezone={loc.timezone} />
            </div>
          </div>
        ))}
      </div>

      </section>
      
  )
}
