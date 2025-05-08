'use client'

import { useState, useEffect } from 'react'
import { Poppins, Dancing_Script } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400'],
})

// Define color schemes for each card
const cardColors = [
  { base: '#0c4000', accent: '#1a8c00', highlight: '#90ee90' }, // Green theme
  { base: '#00308f', accent: '#0066cc', highlight: '#add8e6' }, // Blue theme
  { base: '#8b0000', accent: '#dc143c', highlight: '#ffb6c1' }, // Red theme
  { base: '#4b0082', accent: '#9932cc', highlight: '#e6e6fa' }, // Purple theme
];

// Define color transition array for smooth animations when CTA is hovered
const transitionColors = [
  // Each card has its own color sequence to cycle through
  [
    { base: '#0c4000', accent: '#1a8c00', highlight: '#90ee90' }, // Green
    { base: '#006400', accent: '#32cd32', highlight: '#98fb98' }, // Different green
    { base: '#228b22', accent: '#3cb371', highlight: '#7cfc00' }, // Forest green
    { base: '#2e8b57', accent: '#00fa9a', highlight: '#7fff00' }, // Sea green
    { base: '#0c4000', accent: '#1a8c00', highlight: '#90ee90' }, // Back to original
  ],
  [
    { base: '#00308f', accent: '#0066cc', highlight: '#add8e6' }, // Blue
    { base: '#000080', accent: '#1e90ff', highlight: '#87ceeb' }, // Navy
    { base: '#4169e1', accent: '#6495ed', highlight: '#b0e0e6' }, // Royal blue
    { base: '#0000cd', accent: '#4682b4', highlight: '#afeeee' }, // Medium blue
    { base: '#00308f', accent: '#0066cc', highlight: '#add8e6' }, // Back to original
  ],
  [
    { base: '#8b0000', accent: '#dc143c', highlight: '#ffb6c1' }, // Red
    { base: '#b22222', accent: '#ff4500', highlight: '#ffa07a' }, // Firebrick
    { base: '#c71585', accent: '#ff1493', highlight: '#ffc0cb' }, // Pink-red
    { base: '#cd5c5c', accent: '#ff6347', highlight: '#fa8072' }, // Indian red
    { base: '#8b0000', accent: '#dc143c', highlight: '#ffb6c1' }, // Back to original
  ],
  [
    { base: '#4b0082', accent: '#9932cc', highlight: '#e6e6fa' }, // Purple
    { base: '#800080', accent: '#ba55d3', highlight: '#d8bfd8' }, // Purple
    { base: '#8a2be2', accent: '#9370db', highlight: '#dda0dd' }, // Blue-violet
    { base: '#9400d3', accent: '#da70d6', highlight: '#ee82ee' }, // Violet
    { base: '#4b0082', accent: '#9932cc', highlight: '#e6e6fa' }, // Back to original
  ]
];

export default function WorkWithUs() {
  const [isHovered, setIsHovered] = useState(false)
  const [ripples, setRipples] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null)
  const [pulseStates, setPulseStates] = useState([false, false, false, false])
  const [ctaHovered, setCtaHovered] = useState(false)
  const [colorTransition, setColorTransition] = useState([0, 0, 0, 0]) // Color transition progress for each card

  // Audio visualizer animation
  useEffect(() => {
    let interval
    if (isHovered) {
      interval = setInterval(() => {
        setIsAnimating(prev => !prev)
      }, 300)
    }
    return () => clearInterval(interval)
  }, [isHovered])

  // Setup pulse animation for cards
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseStates(prev => {
        const newStates = [...prev];
        // Randomly decide which card to pulse
        const randomIndex = Math.floor(Math.random() * 4);
        newStates[randomIndex] = !newStates[randomIndex];
        return newStates;
      });
    }, 1500); // Change every 1.5 seconds

    return () => clearInterval(interval);
  }, []);
  
  // Setup color transition animations when CTA is hovered
  useEffect(() => {
    let interval;
    if (ctaHovered) {
      interval = setInterval(() => {
        setColorTransition(prev => {
          const newProgress = [...prev];
          for (let i = 0; i < 4; i++) {
            // Different speeds for each card for more dynamic effect
            newProgress[i] = (newProgress[i] + (0.01 + i * 0.005)) % 1;
          }
          return newProgress;
        });
      }, 50); // Update every 50ms for smooth animation
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [ctaHovered]);
  
  return (
    <section className={`py-24 px-4 relative overflow-hidden ${poppins.className}`}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-100 z-0"></div>
      
      {/* Sound wave background decoration */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 z-0">
        <div className="w-full max-w-4xl flex justify-between items-center h-32 ml-40">
          {[...Array(40)].map((_, i) => (
            <div 
              key={i} 
              className="bg-[#0c4000] w-2 rounded-full transition-all duration-700 ease-in-out"
              style={{ 
                height: `${Math.sin(i * 0.3) * 50 + 60}%`,
                opacity: 0.3 + Math.sin(i * 0.5) * 0.7,
                transform: isAnimating ? 'scaleY(1.2)' : 'scaleY(1)'
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`relative text-center mb-12`}>
          {/* Background Word */}
          <h1
            className={`absolute inset-0 top-0 md:-top-12 text-[6rem] md:text-[11rem] text-[#0c4000]/10 pointer-events-none select-none z-0 leading-none ${dancingScript.className}`}
          >
            Collaborate
          </h1>

          {/* Main Heading */}
          <h2 className="relative text-4xl md:text-6xl font-extrabold z-10 mb-6">
            <span className="text-[#0c4000]">Create More Than Sound, <br/></span>
            <span className="text-black">Make an Impact.</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-12">
            Ready to give your brand the perfect sound? Our team of audio experts will craft custom sound experiences that resonate with your audience.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button 
              className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white bg-[#0c4000] rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-out hover:shadow-xl min-w-64"
              onMouseEnter={() => {
                setIsHovered(true);
                setCtaHovered(true);
              }}
              onMouseLeave={() => {
                setIsHovered(false);
                setCtaHovered(false);
              }}
              onClick={(e) => {
                const button = e.currentTarget
                const rect = button.getBoundingClientRect()
              
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
              
                const newRipple = {
                  id: Date.now(),
                  x,
                  y,
                }
              
                setRipples(prev => [...prev, newRipple])
              
                // Remove ripple after animation completes
                setTimeout(() => {
                  setRipples(prev => prev.filter(r => r.id !== newRipple.id))
                }, 1000)
              
                // Redirect to email
                window.location.href = 'mailto:contact@looksgood';
              }}
            >
              {/* Audio visualizer */}
              <div className="relative flex items-center space-x-0.5 pr-4">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i}
                    className="h-4 w-1 bg-white rounded-full transition-all duration-300"
                    style={{ 
                      height: isHovered ? `${Math.random() * 16 + 8}px` : '8px',
                      transition: `height ${300 + i * 50}ms ease-in-out`
                    }}
                  />
                ))}
              </div>
              
              <span className="relative z-10 flex items-center">
                <span>Work With Us</span>
                <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </span>
              
              {/* Ripple effect container */}
              {ripples.map(ripple => (
                <span 
                  key={ripple.id}
                  className="absolute bg-white/30 rounded-full animate-ripple"
                  style={{
                    top: ripple.y,
                    left: ripple.x,
                    width: '5px',
                    height: '5px',
                    transform: 'scale(0)',
                    animation: 'ripple 1s linear'
                  }}
                />
              ))}
            </button>
          </div>
        </div>
        
        {/* Sound-related decorative elements with dynamic hover effects */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {['Studio Recording', 'Sound Design', 'Music Production', 'Audio Branding'].map((item, index) => {
            // Calculate current color based on transition progress
            let currentColor = cardColors[index];
            
            if (ctaHovered) {
              // When CTA is hovered, animate through color transitions
              const colorSet = transitionColors[index];
              const progress = colorTransition[index];
              const totalColors = colorSet.length - 1;
              
              // Find which segment of the transition we're in
              const segment = Math.floor(progress * totalColors);
              const segmentProgress = (progress * totalColors) % 1;
              
              // Get colors for interpolation
              const color1 = colorSet[segment];
              const color2 = colorSet[(segment + 1) % colorSet.length];
              
              // Interpolate between colors for smooth transition
              const interpolateColor = (c1, c2, progress) => {
                // Convert hex to RGB for interpolation
                const hexToRgb = hex => {
                  const r = parseInt(hex.slice(1, 3), 16);
                  const g = parseInt(hex.slice(3, 5), 16);
                  const b = parseInt(hex.slice(5, 7), 16);
                  return [r, g, b];
                };
                
                // Convert RGB to hex
                const rgbToHex = (r, g, b) => 
                  '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
                
                const rgb1 = hexToRgb(c1);
                const rgb2 = hexToRgb(c2);
                
                const r = rgb1[0] + (rgb2[0] - rgb1[0]) * progress;
                const g = rgb1[1] + (rgb2[1] - rgb1[1]) * progress;
                const b = rgb1[2] + (rgb2[2] - rgb1[2]) * progress;
                
                return rgbToHex(r, g, b);
              };
              
              // Create interpolated color
              currentColor = {
                base: interpolateColor(color1.base, color2.base, segmentProgress),
                accent: interpolateColor(color1.accent, color2.accent, segmentProgress),
                highlight: interpolateColor(color1.highlight, color2.highlight, segmentProgress)
              };
            }
            
            return (
              <div 
                key={index} 
                className="relative bg-white/80 backdrop-blur-sm p-4 rounded-lg text-center border border-gray-200 transform transition-all duration-500 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                style={{
                  borderColor: ctaHovered ? currentColor.accent : 
                              (hoveredCardIndex === index ? cardColors[index].accent : 'rgb(229, 231, 235)'),
                  boxShadow: ctaHovered ? 
                            `0 10px 15px -3px ${currentColor.base}30, 0 4px 6px -4px ${currentColor.base}50` :
                            (hoveredCardIndex === index || pulseStates[index]) ? 
                            `0 10px 15px -3px ${cardColors[index].base}20, 0 4px 6px -4px ${cardColors[index].base}40` : '',
                  transition: ctaHovered ? 'transform 0.5s ease, box-shadow 0.5s ease' : 'all 0.5s ease'
                }}
                onMouseEnter={() => setHoveredCardIndex(index)}
                onMouseLeave={() => setHoveredCardIndex(null)}
              >
                {/* Animated top border */}
                <div 
                  className="w-full h-1 absolute top-0 left-0 rounded-t-lg"
                  style={{ 
                    backgroundImage: ctaHovered ?
                      `linear-gradient(90deg, ${currentColor.base}40 0%, ${currentColor.accent} 50%, ${currentColor.base}40 100%)` :
                      hoveredCardIndex === index ? 
                      `linear-gradient(90deg, ${cardColors[index].base}40 0%, ${cardColors[index].accent} 50%, ${cardColors[index].base}40 100%)` : 
                      pulseStates[index] ?
                      `linear-gradient(90deg, ${cardColors[index].base}20 0%, ${cardColors[index].base} 50%, ${cardColors[index].base}20 100%)` :
                      `linear-gradient(90deg, ${cardColors[index].base}20 0%, ${cardColors[index].base} 50%, ${cardColors[index].base}20 100%)`,
                    backgroundSize: '200% 100%',
                    animation: (ctaHovered || hoveredCardIndex === index || pulseStates[index]) ? 'shimmer 1.5s infinite' : 'none'
                  }}
                />

                {/* Content with color change */}
                <p 
                  className="font-medium transition-colors duration-300"
                  style={{ 
                    color: ctaHovered ? currentColor.accent :
                           hoveredCardIndex === index ? cardColors[index].accent : 
                           pulseStates[index] ? cardColors[index].base : 'rgb(31, 41, 55)'
                  }}
                >
                  {item}
                </p>

                {/* Subtle pulse effect */}
                <div 
                  className="absolute inset-0 rounded-lg transition-opacity duration-700"
                  style={{
                    backgroundImage: ctaHovered ? 
                              `radial-gradient(circle, ${currentColor.highlight}40 0%, transparent 70%)` :
                              `radial-gradient(circle, ${cardColors[index].highlight}40 0%, transparent 70%)`,
                    opacity: ctaHovered ? 0.7 : (pulseStates[index] ? 0.6 : 0),
                    animation: ctaHovered ? 'colorPulse 2s infinite' : (pulseStates[index] ? 'pulse 2s infinite' : 'none')
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes ripple {
          to {
            transform: scale(100);
            opacity: 0;
          }
        }
        
        .animate-ripple {
          animation: ripple 1s linear;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
            opacity: 0.7;
          }
          50% {
            transform: scale(1);
            opacity: 0.4;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.7;
          }
        }
        
        @keyframes colorPulse {
          0% {
            transform: scale(0.95);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.4;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.7;
          }
        }
      `}</style>
    </section>
  )
}