'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Poppins, Dancing_Script } from 'next/font/google'
import { Award, Star, TrendingUp, ThumbsUp } from 'lucide-react'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400'],
})

export default function Awards() {
  const [animatedStats, setAnimatedStats] = useState({
    awards: 0,
    nominations: 0,
    countries: 0,
    industries: 0
  })
  
  const statsRef = useRef(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateStats()
          observer.unobserve(entries[0].target)
        }
      },
      { threshold: 0.2 }
    )
    
    if (statsRef.current) {
      observer.observe(statsRef.current)
    }
    
    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [])
  
  const animateStats = () => {
    // Final values
    const finalValues = {
      awards: 7,
      nominations: 12,
      countries: 5,
      industries: 3
    }
    
    // Duration in ms
    const duration = 500
    const frameRate = 32
    const steps = duration / frameRate
    
    let currentStep = 0
    
    const timer = setInterval(() => {
      currentStep++
      
      if (currentStep <= steps) {
        const progress = currentStep / steps
        
        setAnimatedStats({
          awards: Math.ceil(finalValues.awards * progress),
          nominations: Math.ceil(finalValues.nominations * progress),
          countries: Math.ceil(finalValues.countries * progress),
          industries: Math.ceil(finalValues.industries * progress)
        })
      } else {
        clearInterval(timer)
      }
    }, frameRate)
  }

  const awards = [
    {
      id: 1,
      title: "Emmy Award",
      description: "Best Commercial Media 2023",
      icon: "/awards/Emmys.png",
      color: "#0c4000",
      size: 50 
    },
    {
      id: 2,
      title: "BET Award",
      description: "Music Video of the Year 2024",
      icon: "/awards/BET.png", 
      color: "#4B0082",
      size: 64
    },
    {
      id: 3,
      title: "FilmQuest",
      description: "Best Sound for Feature Film 2024",
      icon: "/awards/Filmquest.png",
      color: "#8B0000",
      size: 64
    },
    {
      id: 4,
      title: "Clio Awards",
      description: "Best Branded Athletic Content 2023 Gold",
      icon: "/awards/Clios.png",
      color: "#DAA520",
      size: 64
    },
    {
      id: 5,
      title: "Clio Awards",
      description: "Best Branded Athletic Content 2022 Bronze",
      icon: "/awards/Clios_b.png",
      color: "#CD7F32",
      size: 64
    },
    {
      id: 6,
      title: "2x NFTTY",
      description: "Best Sound Design & Mix 2020",
      icon: "/awards/NFTTY.png",
      color: "#1E90FF",
      size: 64
    },
    {
      id: 7,
      title: "Melbourne Documentary Film Festival",
      description: "Best Documentary 2023",
      icon: "/awards/Melbourne.png",
      color: "#9932CC",
      size: 64
    }
  ]

  return (
    <section className="relative py-10 bg-gradient-to-b from-white via-[#f6f8f6] to-[#ecf3ec] overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Floating Award Icons */}
        <div className="absolute top-1/4 right-10 opacity-60">
          <Award size={48} className="text-[#0c4000]" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-60">
          <Star size={32} className="text-[#0c4000]" />
        </div>
        <div className="absolute top-40 right-1/4 opacity-60">
          <ThumbsUp size={36} className="text-[#0c4000]" />
        </div>
        <div className="absolute bottom-40 right-1/4 opacity-60">
          <TrendingUp size={40} className="text-[#0c4000]" />
        </div>
      </div>

      {/* Heading */}
      <div className={`relative text-center mb-20 ${poppins.className}`}>
        {/* Background Word */}
        <h1
          className={`absolute inset-0 top-0 md:top-4 text-[6rem] md:text-[11rem] text-[#0c4000]/10 pointer-events-none select-none z-0 leading-none ${dancingScript.className}`}
        >
          Awards
        </h1>

        {/* Subtitle */}
        <p className="relative text-lg text-gray-600 z-10 mb-4">
          Awards & Recognitions
        </p>

        {/* Main Heading */}
        <h2 className="relative text-4xl md:text-6xl font-extrabold z-10">
          <span className="text-[#0c4000]">Awards That Speak,</span>
          <br />
          <span className="text-black">Louder Than Words.</span>
        </h2>
      </div>

      {/* Awards Stats */}
      <div className="max-w-5xl mx-auto mb-16 px-4" ref={statsRef}>
        <div className="bg-[#0c4000] text-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 flex flex-wrap">
          <div className="text-center w-1/2 md:w-1/4 mb-4 md:mb-0">
            <p className="text-4xl font-bold transition-all duration-300">
              {animatedStats.awards}+ 
            </p>
            <p>Major Awards</p>
          </div>
          <div className="text-center w-1/2 md:w-1/4 mb-4 md:mb-0">
            <p className="text-4xl font-bold transition-all duration-300">
              {animatedStats.nominations}+ 
            </p>
            <p>Nominations</p>
          </div>
          <div className="text-center w-1/2 md:w-1/4">
            <p className="text-4xl font-bold transition-all duration-300">
              {animatedStats.countries}+ 
            </p>
            <p>Countries</p>
          </div>
          <div className="text-center w-1/2 md:w-1/4">
            <p className="text-4xl font-bold transition-all duration-300">
              {animatedStats.industries}+ 
            </p>
            <p>Industries</p>
          </div>
        </div>
      </div>

      {/* Awards Showcase */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 md:gap-4">
          {awards.map((award) => (
            <div 
              key={award.id}
              className="group relative bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-500 shadow-lg hover:shadow-2xl p-0 mb-2 w-full sm:w-[calc(50%-1rem)] md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.25rem)] xl:w-[calc(33.333%-1.25rem)] 2xl:w-[calc(25%-1.25rem)]"
            >
              <div className="h-full">
                {/* Award Header */}
                <div 
                  className="h-6 w-full pt-15 transition-all duration-500"
                  style={{ backgroundColor: award.color }}
                ></div>
                
                {/* Award Content */}
                <div className="p-8 pt-16 relative">
                  {/* Icon Circle */}
                  <div 
                    className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full flex items-center justify-center border-4 border-white transition-all duration-500"
                    style={{ backgroundColor: award.color }}
                  >
                    <div className="flex items-center justify-center w-16 h-16">
                      <Image 
                        src={award.icon} 
                        alt={award.title} 
                        width={award.size} 
                        height={award.size} 
                        className="object-contain"
                      />
                    </div>
                  </div>
                  
                  {/* Award Text */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2" style={{ color: award.color }}>
                      {award.title}
                    </h3>
                    <p className="text-gray-600">{award.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}