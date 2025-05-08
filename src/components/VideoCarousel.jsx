'use client'

import { useState, useEffect, useRef } from 'react'
import AudioVisualizer from './AudioResponsiveWaves'

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
  
  // Slot machine states
  const [isSpinning, setIsSpinning] = useState(false)
  const [slotPosition, setSlotPosition] = useState(0)
  const slotReelRef = useRef(null)
  
  const thumbnailCarouselRef = useRef(null)
  const brandCarouselRef = useRef(null)
  // Audio related refs
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceNodeRef = useRef(null)

  const content = [
    {
      thumbnail: '/Thumbnails/100TXGucci.png',
      video: '/Videos/100TXGucci.mp4',
      brand: {
        name: 'Brand 1',
        logo: '/Brands/1.svg',
        color: '#000000',
        title: 'Introducing the Groove Series',
        description: 'Brand 1 is known for redefining sound design with immersive sonic textures.'
      }
    },
    {
      thumbnail: '/Thumbnails/ALO_Paris.png',
      video: '/Videos/ALO_Paris.mp4',
      brand: {
        name: 'Brand 2',
        logo: '/Brands/2.svg',
        color: '#000000',
        title: 'Future Beats Collection',
        description: 'Brand 2 curates the finest future bass tracks for the next-gen listener.'
      }
    },
    {
      thumbnail: '/Thumbnails/Bricks_&_Wood_x_New_Balance_Jungle_To_Jungle.png',
      video: '/Videos/Bricks_&_Wood_x_New_Balance_Jungle_To_Jungle.mp4',
      brand: {
        name: 'Brand 3',
        logo: '/Brands/3.svg',
        color: '#000000',
        title: 'Retro Rhythms',
        description: 'Bringing back the 80s funk in high-fidelity – thats the Brand 3 promise.'
      }
    },
    {
      thumbnail: '/Thumbnails/CMENT_Nike_SPS.png',
      video: '/Videos/CMENT_Nike_SPS.mp4',
      brand: {
        name: 'Brand 4',
        logo: '/Brands/4.svg',
        color: '#000000',
        title: 'Bassline Revolution',
        description: 'A bold brand that builds booming basslines for dancefloor dominance.'
      }
    },
    {
      thumbnail: '/Thumbnails/eBay_WatchHype.png',
      video: '/Videos/eBay_WatchHype.mp4',
      brand: {
        name: 'Brand 5',
        logo: '/Brands/5.svg',
        color: '#000000',
        title: 'Synthwave Dreams',
        description: 'Brand 5 layers neon melodies with dreamy soundscapes for chill nights.'
      }
    },
    {
      thumbnail: '/Thumbnails/Match_Me_If_You_Can.png',
      video: '/Videos/Match_Me_If_You_Can.mp4',
      brand: {
        name: 'Brand 6',
        logo: '/Brands/6.svg',
        color: '#000000',
        title: 'Drum Machine Dynasty',
        description: 'Precision percussion. Timeless beats. Brand 6 leads the rhythm renaissance.'
      }
    },
    {
      thumbnail: '/Thumbnails/MORRISON_MACKAGE.png',
      video: '/Videos/MORRISON_MACKAGE.mp4',
      brand: {
        name: 'Brand 4',
        logo: '/Brands/4.svg',
        color: '#000000',
        title: 'Bassline Revolution',
        description: 'A bold brand that builds booming basslines for dancefloor dominance.'
      }
    },
    {
      thumbnail: '/Thumbnails/MSI_Alien.png',
      video: '/Videos/MSI_Alien.mp4',
      brand: {
        name: 'Brand 5',
        logo: '/Brands/5.svg',
        color: '#000000',
        title: 'Synthwave Dreams',
        description: 'Brand 5 layers neon melodies with dreamy soundscapes for chill nights.'
      }
    },
    {
      thumbnail: '/Thumbnails/Nike_DiamondShine.png',
      video: '/Videos/Nike_DiamondShine.mp4',
      brand: {
        name: 'Brand 6',
        logo: '/Brands/6.svg',
        color: '#000000',
        title: 'Drum Machine Dynasty',
        description: 'Precision percussion. Timeless beats. Brand 6 leads the rhythm renaissance.'
      }
    },
    
  ]
  
  // Create a much longer array for slot machine effect
  const slotContent = [...Array(25)].flatMap(() => content)
  const repeatedContent = [...Array(4)].flatMap(() => content)
  
  // Calculate the exact center position for slot machine items
  const centerPositionItem = Math.floor(slotContent.length / 2)
  const baseAnimationDuration = 120
  // Define a constant for brand item width to ensure consistency
  const BRAND_ITEM_WIDTH = 88

  useEffect(() => {
    const handleKeyDown = (e) => {
      const videoElement = document.querySelector('video[controls]')
      if (!videoElement) return
  
      if (e.code === 'Space') {
        e.preventDefault() // Prevent page scrolling
        if (videoElement.paused) {
          videoElement.play()
        } else {
          videoElement.pause()
        }
      }
  
      if (e.code === 'Escape') {
        setSelectedIndex(-1)
        setIsPaused(false)
        setActiveIndex(-1)
        setIsVisualizerActive(false)
      }
    }
  
    if (selectedIndex !== -1) {
      window.addEventListener('keydown', handleKeyDown)
    }
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedIndex])
  
  useEffect(() => {
    const calculateDimensions = () => {
      const thumbnailItemWidth = 168
      const thumbnailSetWidth = content.length * thumbnailItemWidth
      const brandItemWidth = BRAND_ITEM_WIDTH
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

  // Slot machine effect when a video is selected
  useEffect(() => {
    if (selectedIndex !== -1 && !isSpinning) {
      // Start the slot machine
      startSlotMachine();
    }
  }, [selectedIndex]);


// Replace the startSlotMachine function with this improved version
const startSlotMachine = () => {
  if (isSpinning || selectedIndex === -1) return;
  
  setIsSpinning(true);
  
  // Speed up the animation by reducing these values
  const spinIterations = 2; // Reduced from 3
  const singleLoopDuration = 30; // Reduced from 300ms
  const slowdownDuration = 4000; // Reduced from 500ms
  
  // Total items to move through during the spinning animation
  const totalItems = content.length * spinIterations;
  
  // Use a more precise calculation to ensure perfect centering
  // Start with a large enough base offset
  const baseOffset = content.length * 12; 
  
  // Calculate target index that will be centered
  const targetIndex = baseOffset + selectedIndex; 
  
  // Start the spinning animation
  let startTime;
  let prevTimeStamp;
  let currentPosition = 0;
  
  const animate = (timeStamp) => {
    if (!startTime) {
      startTime = timeStamp;
      prevTimeStamp = timeStamp;
    }
    
    const elapsed = timeStamp - startTime;
    const totalDuration = (singleLoopDuration * totalItems) + slowdownDuration;
    
    if (elapsed < totalDuration) {
      // Calculate progress based on easing
      let progress;
      if (elapsed < singleLoopDuration * totalItems) {
        // Fast spinning phase
        progress = elapsed / (singleLoopDuration * totalItems);
        currentPosition = Math.floor(progress * totalItems);
      } else {
        // Slowdown and landing phase
        const slowdownProgress = (elapsed - singleLoopDuration * totalItems) / slowdownDuration;
        const easeOutProgress = 1 - Math.pow(1 - slowdownProgress, 3); // Cubic ease-out
        
        // Calculate the remaining distance to target
        const remainingDistance = targetIndex - Math.min(totalItems, currentPosition);
        
        // Apply easing to the remaining distance
        const easedRemaining = remainingDistance * easeOutProgress;
        currentPosition = Math.min(totalItems, currentPosition) + easedRemaining;
      }
      
      // Update position - make sure we use the exact width calculation
      if (slotReelRef.current) {
        slotReelRef.current.style.transform = `translateX(-${currentPosition * BRAND_ITEM_WIDTH}px)`;
      }
      
      requestAnimationFrame(animate);
    } else {
      // Ensure we end exactly at the target position
      if (slotReelRef.current) {
        slotReelRef.current.style.transform = `translateX(-${targetIndex * BRAND_ITEM_WIDTH}px)`;
      }
      
      // End spinning
      setIsSpinning(false);
      setSlotPosition(targetIndex);
    }
  };
  
  requestAnimationFrame(animate);
};
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
    <div className="h-screen w-full bg-[#dcdcdc] flex flex-col justify-between overflow-hidden relative">

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
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <h2>
        <span className="text-[80px] md:text-[100px] 2xl:text-[150px] font-bold text-black custom-outline">
  LOOKS GOOD
</span>


        </h2>
        </div>

      {/* Brand Carousel with Slot Machine Effect - Fixed height container */}
      <div className="h-[10%] w-full mb-3 relative z-10 flex items-center justify-center">
        {/* Normal carousel display - always maintain same height */}
        <div className="h-32 w-full flex items-center justify-center">
          {selectedIndex === -1 ? (
            <div className="relative w-full" ref={brandCarouselRef}>
              <div
                className="brand-track inline-flex items-center"
                style={{
                  animationPlayState: isPaused ? 'paused' : 'running',
                  animationDuration: `${baseAnimationDuration}s`
                }}
              >
                {repeatedContent.map((item, index) => {
                  const normalized = index % content.length
                  const isHovered = findActiveItemIndex(activeIndex) === normalized
                  
                  return (
                    <div
                      key={`brand-normal-${index}`}
                      className="flex-shrink-0 mx-2"
                    >
                      <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isHovered ? 'ring-4 ring-white shadow-lg scale-125 animate-glow' : 'scale-100'
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
          ) : (
            /* Slot Machine Reel with fixed positioning */
            <div className="slot-machine-container w-full flex justify-center items-center overflow-hidden h-32">
  {/* Center marker removed */}
  
  {/* Center alignment container with fixed height */}
  <div className="relative w-full flex justify-center items-center overflow-hidden h-32">
    {/* Fixed positioning container for the reel */}
    <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
    <div className="absolute z-10 ml-1 w-[85px] h-[85px] rounded-full border-[5px] border-[#02A170] animate-ring-glow ring-overlay" />

      {/* Moving reel with perfect centering */}
      <div 
  ref={slotReelRef}
  className={`slot-reel inline-flex items-center transition-transform ${isSpinning ? '' : 'slot-transition-smooth'}`}

        style={{
          willChange: 'transform',
          // Perfect centering calculation
          position: 'absolute',
          left: '50%',
          // This is the key change - ensure the center of the item is at the center of the screen
          marginLeft: `-${BRAND_ITEM_WIDTH/2}px`
        }}
      >
        {slotContent.map((item, index) => {
          const normalized = index % content.length;
          const isSelected = normalized === selectedIndex && !isSpinning;
          
          return (
            <div
              key={`brand-slot-${index}`}
              className="flex-shrink-0 mx-2"
              style={{
                // Set exact width to ensure proper positioning
                width: `${BRAND_ITEM_WIDTH - 16}px`, // Account for mx-2 (8px on each side)
              }}
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isSpinning ? 'slot-item-spinning' : 
                  isSelected ? '' : 'opacity-30 scale-75'
                }`}
                style={{ backgroundColor: item.brand.color }}
              >
                <img 
                  src={item.brand.logo} 
                  alt={item.brand.name} 
                  className="w-16 h-16 object-contain" 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
  
  {isSpinning && (
    <div className="absolute inset-0 z-20 flex justify-center items-center pointer-events-none">
      <div className="slot-light-flicker absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"></div>
    </div>
  )}
</div>
          )}
        </div>
      </div>

      {/* Dynamic Brand Info Display */}
      {selectedIndex !== -1 && isVideoPlaying && !isSpinning && (
        <div className="absolute bottom-30 left-1/2 transform -translate-x-1/2 z-8 fade-in-text">
          {/* <MusicInfoDisplay
            key={selectedIndex}
            title={content[selectedIndex].brand.title}
            brandName={content[selectedIndex].brand.name}
            brandDescription={content[selectedIndex].brand.description}
          /> */}
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

        /* Slot Machine Animations */
        .slot-item-spinning {
          transform: scale(0.9);
          filter: blur(1px);
        }
        .slot-transition-smooth {
  transition: transform 0.7s cubic-bezier(0.23, 1, 0.32, 1); /* Smooth ease-out */
}

        .slot-light-flicker {
          animation: slot-flicker 0.3s ease-in-out infinite alternate;
        }
.ring-overlay {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 10;
}

.animate-ring-glow {
  animation: ring-glow 1.6s infinite ease-in-out;
  box-shadow: 0 0 4px #02A170, 0 0 10px #02A170, 0 0 20px #02A17066;
}

@keyframes ring-glow {
  0%, 100% {
    box-shadow: 0 0 4px #02A170, 0 0 10px #02A170, 0 0 20px #02A17066;
  }
  50% {
    box-shadow: 0 0 6px #02A170, 0 0 16px #02A170aa, 0 0 28px #02A17088;
  }
}


.slot-machine-container .absolute.z-10 {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

        @keyframes slot-flicker {
          0% {
            opacity: 0.05;
          }
          100% {
            opacity: 0.2;
          }
        }
        
        .fade-in-text {
          animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}