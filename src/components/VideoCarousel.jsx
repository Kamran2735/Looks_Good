'use client'

import { useState, useEffect, useRef } from 'react'
import AudioVisualizer from './AudioResponsiveWaves'
import MusicInfoDisplay from './MusicInfoDisplay'


export default function UnifiedCarousel() {
  const [isPaused, setIsPaused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [dimensions, setDimensions] = useState({
    thumbnailItemWidth: 0,
    thumbnailSetWidth: 0,
    brandItemWidth: 0,
    brandSetWidth: 0
  })
  // Audio visualizer states
  const [isVisualizerActive, setIsVisualizerActive] = useState(false)
  
  const thumbnailCarouselRef = useRef(null)
  const brandCarouselRef = useRef(null)
  // Audio related refs
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceNodeRef = useRef(null)

  const content = [
    {
      thumbnail: '/Thumbnails/1.svg',
      video: '/Videos/1.mp4',
      brand: {
        name: 'Brand 1',
        logo: '/Brands/1.svg',
        color: '#000000',
        title: 'Introducing the Groove Series',
        description: 'Brand 1 is known for redefining sound design with immersive sonic textures.'
      }
    },
    {
      thumbnail: '/Thumbnails/2.svg',
      video: '/Videos/2.mp4',
      brand: {
        name: 'Brand 2',
        logo: '/Brands/2.svg',
        color: '#000000',
        title: 'Future Beats Collection',
        description: 'Brand 2 curates the finest future bass tracks for the next-gen listener.'
      }
    },
    {
      thumbnail: '/Thumbnails/3.svg',
      video: '/Videos/3.mp4',
      brand: {
        name: 'Brand 3',
        logo: '/Brands/3.svg',
        color: '#000000',
        title: 'Retro Rhythms',
        description: 'Bringing back the 80s funk in high-fidelity – that’s the Brand 3 promise.'
      }
    },
    {
      thumbnail: '/Thumbnails/4.svg',
      video: '/Videos/4.mp4',
      brand: {
        name: 'Brand 4',
        logo: '/Brands/4.svg',
        color: '#000000',
        title: 'Bassline Revolution',
        description: 'A bold brand that builds booming basslines for dancefloor dominance.'
      }
    },
    {
      thumbnail: '/Thumbnails/5.svg',
      video: '/Videos/5.mp4',
      brand: {
        name: 'Brand 5',
        logo: '/Brands/5.svg',
        color: '#000000',
        title: 'Synthwave Dreams',
        description: 'Brand 5 layers neon melodies with dreamy soundscapes for chill nights.'
      }
    },
    {
      thumbnail: '/Thumbnails/6.svg',
      video: '/Videos/6.mp4',
      brand: {
        name: 'Brand 6',
        logo: '/Brands/6.svg',
        color: '#000000',
        title: 'Drum Machine Dynasty',
        description: 'Precision percussion. Timeless beats. Brand 6 leads the rhythm renaissance.'
      }
    }
  ]
  

  const repeatedContent = [...Array(4)].flatMap(() => content)
  const baseAnimationDuration = 120

  useEffect(() => {
    const calculateDimensions = () => {
      const thumbnailItemWidth = 168
      const thumbnailSetWidth = content.length * thumbnailItemWidth
      const brandItemWidth = 88
      const brandSetWidth = content.length * brandItemWidth
      setDimensions({ thumbnailItemWidth, thumbnailSetWidth, brandItemWidth, brandSetWidth })
    }

    calculateDimensions()
    window.addEventListener('resize', calculateDimensions)
    return () => window.removeEventListener('resize', calculateDimensions)
  }, [content.length])

  // Initialize Web Audio API once
  useEffect(() => {
    // Create audio context
    const initializeAudio = () => {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      audioContextRef.current = new AudioContext()
      
      const analyserNode = audioContextRef.current.createAnalyser()
      analyserNode.fftSize = 256
      analyserNode.smoothingTimeConstant = 0.8
      analyserRef.current = analyserNode
    }

    initializeAudio()
    
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Connect video audio to visualizer when video changes
  useEffect(() => {
    const connectAudioSource = async () => {
      if (!audioContextRef.current || !analyserRef.current) return
      
      // Resume audio context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }
      
      const videoElement = document.querySelector('video[controls]')
      if (!videoElement) return
      
      try {
        // Disconnect previous source if exists
        if (sourceNodeRef.current) {
          sourceNodeRef.current.disconnect()
        }
        
        // Create new source
        sourceNodeRef.current = audioContextRef.current.createMediaElementSource(videoElement)
        sourceNodeRef.current.connect(analyserRef.current)
        analyserRef.current.connect(audioContextRef.current.destination)
        
        setIsVisualizerActive(true)
      } catch (error) {
        console.error("Error connecting audio source:", error)
        // If we get the "already connected" error, try to proceed with visualization anyway
        if (error.name === 'InvalidStateError') {
          setIsVisualizerActive(true)
        }
      }
    }
    
    // When a video is selected and played
    if (selectedIndex !== -1) {
      // Small delay to ensure video element is properly loaded
      const timer = setTimeout(() => {
        connectAudioSource()
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setIsVisualizerActive(false)
    }
  }, [selectedIndex])

  // Update visualizer active state when video plays/pauses
  useEffect(() => {
    setIsVisualizerActive(isVideoPlaying && selectedIndex !== -1)
  }, [isVideoPlaying, selectedIndex])

  const handleMouseEnter = (index) => {
    if (selectedIndex === -1) {
      setIsPaused(true)
      setActiveIndex(index % content.length)
    }
  }

  const handleMouseLeave = () => {
    if (selectedIndex === -1) {
      setIsPaused(false)
      setActiveIndex(-1)
    }
  }

  const handleThumbnailClick = (index) => {
    const normalized = index % content.length
    if (selectedIndex === normalized) {
      setSelectedIndex(-1)
      setIsPaused(false)
      setActiveIndex(-1)
      setIsVisualizerActive(false)
    } else {
      setSelectedIndex(normalized)
      setIsPaused(true)
      setActiveIndex(-1)
    }
  }

  const findActiveItemIndex = (baseIndex) => {
    if (baseIndex === -1) return -1
    return baseIndex % content.length
  }

  return (
    <div className="h-screen w-full flex flex-col justify-between overflow-hidden relative">
      <video autoPlay muted loop playsInline className="absolute w-full h-full object-cover">
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      {/* Audio Visualizer Component with Logo */}
      <AudioVisualizer 
        isActive={isVisualizerActive} 
        analyser={analyserRef.current}
        isVideoPlaying={isVideoPlaying}
        isVideoSelected={selectedIndex !== -1}
        intensity={1.5}
      />

      {/* Top Thumbnail Carousel */}
      <div className="h-[30%] w-full overflow-hidden pt-4 relative z-10">
        <div className="relative" ref={thumbnailCarouselRef}>
          <div
            className="thumbnail-track inline-flex"
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
              animationDuration: `${baseAnimationDuration}s`
            }}
          >
            {repeatedContent.map((item, index) => {
              const normalized = index % content.length
              const isDimmed = selectedIndex !== -1 && normalized !== selectedIndex
              return (
                <div
                  key={`thumbnail-${index}`}
                  className={`flex-shrink-0 px-2 transition-opacity duration-300 ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={item.thumbnail}
                    alt={`Thumbnail ${normalized + 1}`}
                    className="rounded-lg w-40 h-24 hover:scale-105 transition-transform object-cover"
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Overlay Video Player */}
        {selectedIndex !== -1 && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-30 w-[400px] h-[225px]">
            <div className="relative w-full h-full">
              <button
                onClick={() => {
                  setSelectedIndex(-1)
                  setIsPaused(false)
                  setActiveIndex(-1)
                  setIsVisualizerActive(false)
                }}
                className="absolute top-2 right-2 bg-white/20 text-white text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/40 transition cursor-pointer z-40"
              >
                ×
              </button>

              <video
                key={selectedIndex}
                controls
                autoPlay
                src={content[selectedIndex].video}
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
                className="rounded-xl shadow-2xl w-full h-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Brand Carousel */}
      <div className="h-[10%] w-full mb-4 relative z-10">
        <div className="relative" ref={brandCarouselRef}>
          <div
            className="brand-track inline-flex items-center justify-start"
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
              animationDuration: `${baseAnimationDuration}s`
            }}
          >
            {repeatedContent.map((item, index) => {
              const normalized = index % content.length
              const isHovered = selectedIndex === -1 && findActiveItemIndex(activeIndex) === normalized
              const isSelected = selectedIndex === normalized
              const shouldHighlight = isSelected || isHovered
              const isDimmed = selectedIndex !== -1 && normalized !== selectedIndex

              return (
                <div
                  key={`brand-${index}`}
                  className={`flex-shrink-0 mx-2 transition-all duration-300 ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
                >
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                      shouldHighlight ? 'ring-4 ring-white shadow-lg scale-125 animate-glow' : 'scale-100'
                    }`}
                    style={{ backgroundColor: item.brand.color }}
                  >
                    <img src={item.brand.logo} alt={item.brand.name} className="w-16 h-16 object-contain" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {/* Dynamic Brand Info Display */}
      {selectedIndex !== -1 && isVideoPlaying && (
  <div className="absolute bottom-44 left-1/2 transform -translate-x-1/2 z-40">
    <MusicInfoDisplay
      key={selectedIndex} // 👈 force remount when selectedIndex changes
      title={content[selectedIndex].brand.title}
      brandName={content[selectedIndex].brand.name}
      brandDescription={content[selectedIndex].brand.description}
    />
  </div>
)}



      {/* Animation styles */}
      <style jsx>{`
        .thumbnail-track {
          animation: thumbnail-carousel ${baseAnimationDuration}s linear infinite;
        }

        .brand-track {
          animation: brand-carousel ${baseAnimationDuration}s linear infinite;
        }

@keyframes thumbnail-carousel {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${dimensions.thumbnailSetWidth}px);
          }
        }

        @keyframes brand-carousel {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${dimensions.brandSetWidth}px);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 8px white;
          }
          50% {
            box-shadow: 0 0 16px white;
          }
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}