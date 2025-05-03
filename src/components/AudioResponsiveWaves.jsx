// 'use client'

// import { useEffect, useRef, useState } from 'react'

// export default function MultiLayerAudioWaves({ isActive, analyser, logoSrc = '/logo-nobg.png' }) {
//   // Original flat wave reference
//   const flatWaveRef = useRef(null)
//   const reactiveOutlineRef = useRef(null)
  
//   // References for the additional waves
//   const waveRef1 = useRef(null)
//   const waveRef2 = useRef(null)
//   const waveRef3 = useRef(null)
  
//   // References for wave outlines
//   const waveOutline1 = useRef(null)
//   const waveOutline2 = useRef(null)
//   const waveOutline3 = useRef(null)
  
//   const logoRef = useRef(null)
//   const [logoPosition, setLogoPosition] = useState({ x: 600, y: 250 })
//   const springRef = useRef({ velocity: 0, target: 250, position: 250 })

//   const audioDataRef = useRef({
//     bass: { value: 0, smooth: 0 },
//     mid: { value: 0, smooth: 0 },
//     treble: { value: 0, smooth: 0 },
//     history: Array(20).fill(0),
//     time: 0
//   })

//   useEffect(() => {
//     // Function to draw the initial flat wave (unchanged from original)
//     const drawInitialFlatWave = () => {
//       const baseLift = 10
//       const d = `
//         M0,${150 - baseLift}
//         C220,${140 + baseLift},440,${140 - baseLift},660,${150 + baseLift}
//         C880,${160 - baseLift},1100,${160 + baseLift},1320,${150 - baseLift}
//         L1320 550
//         L0 550
//       `
//       if (flatWaveRef.current) flatWaveRef.current.setAttribute('d', d)
//       if (reactiveOutlineRef.current) {
//         const outlineD = `
//           M0,${150 - baseLift}
//           C220,${140 + baseLift},440,${140 - baseLift},660,${150 + baseLift}
//           C880,${160 - baseLift},1100,${160 + baseLift},1320,${150 - baseLift}
//         `
//         reactiveOutlineRef.current.setAttribute('d', outlineD)
//       }
      
//       // Initial positions for additional waves
//       if (waveRef1.current) {
//         const wave1D = `
//           M0,${220}
//           C220,${215},440,${225},660,${220}
//           C880,${215},1100,${225},1320,${220}
//           L1320 550
//           L0 550
//         `
//         waveRef1.current.setAttribute('d', wave1D)
//       }
      
//       if (waveRef2.current) {
//         const wave2D = `
//           M0,${290}
//           C220,${285},440,${295},660,${290}
//           C880,${285},1100,${295},1320,${290}
//           L1320 550
//           L0 550
//         `
//         waveRef2.current.setAttribute('d', wave2D)
//       }
      
//       if (waveRef3.current) {
//         const wave3D = `
//           M0,${360}
//           C220,${355},440,${365},660,${360}
//           C880,${355},1100,${365},1320,${360}
//           L1320 550
//           L0 550
//         `
//         waveRef3.current.setAttribute('d', wave3D)
//       }
      
//       springRef.current.position = 90
//       springRef.current.target = 90
//       setLogoPosition({ x: 600, y: 90 })
//     }

//     drawInitialFlatWave()

//     const bufferLength = analyser?.frequencyBinCount || 0
//     const dataArray = bufferLength ? new Uint8Array(bufferLength) : []

//     let lastTime = Date.now()
//     const samplePoints = [550, 570, 590, 610, 630, 650]

//     const animateWaves = () => {
//       const currentTime = Date.now()
//       const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1)
//       lastTime = currentTime

//       audioDataRef.current.time += deltaTime

//       let audioData = {
//         bass: 0,
//         mid: 0,
//         treble: 0,
//         transients: 0,
//         overall: 0
//       }

//       if (isActive && analyser) {
//         analyser.getByteFrequencyData(dataArray)
//         const bassEnd = Math.floor(bufferLength * 0.1)
//         const midEnd = Math.floor(bufferLength * 0.5)
//         const trebleStart = Math.floor(bufferLength * 0.5)

//         let bassSum = 0, midSum = 0, trebleSum = 0
//         for (let i = 0; i < bassEnd; i++) bassSum += dataArray[i]
//         for (let i = bassEnd; i < midEnd; i++) midSum += dataArray[i]
//         for (let i = trebleStart; i < bufferLength; i++) trebleSum += dataArray[i]

//         const bass = bassSum / (bassEnd * 255)
//         const mid = midSum / ((midEnd - bassEnd) * 255)
//         const treble = trebleSum / ((bufferLength - trebleStart) * 255)
//         const overall = (bassSum + midSum + trebleSum) / (bufferLength * 255)

//         audioDataRef.current.bass.value = bass
//         audioDataRef.current.bass.smooth += (bass - audioDataRef.current.bass.smooth) * 0.2
//         audioDataRef.current.mid.value = mid
//         audioDataRef.current.mid.smooth += (mid - audioDataRef.current.mid.smooth) * 0.15
//         audioDataRef.current.treble.value = treble
//         audioDataRef.current.treble.smooth += (treble - audioDataRef.current.treble.smooth) * 0.3

//         audioDataRef.current.history.push(overall)
//         if (audioDataRef.current.history.length > 20) {
//           audioDataRef.current.history.shift()
//         }

//         const historyAvg = audioDataRef.current.history.slice(0, -3).reduce((a, b) => a + b, 0) /
//           (audioDataRef.current.history.length - 3)
//         const currentAvg = audioDataRef.current.history.slice(-3).reduce((a, b) => a + b, 0) / 3
//         const transients = Math.max(0, currentAvg - historyAvg) * 3

//         audioData = {
//           bass: audioDataRef.current.bass.smooth,
//           mid: audioDataRef.current.mid.smooth,
//           treble: audioDataRef.current.treble.smooth,
//           transients,
//           overall
//         }
//       }

//       // Original top wave (unchanged)
//       const controlPoints = generateRippleWave(audioData, audioDataRef.current.time)

//       const d = `
//         M${controlPoints[0].x},${controlPoints[0].y}
//         C${controlPoints[1].x},${controlPoints[1].y},${controlPoints[2].x},${controlPoints[2].y},${controlPoints[3].x},${controlPoints[3].y}
//         C${controlPoints[4].x},${controlPoints[4].y},${controlPoints[5].x},${controlPoints[5].y},${controlPoints[6].x},${controlPoints[6].y}
//         L1320 550
//         L0 550
//       `
//       if (flatWaveRef.current) flatWaveRef.current.setAttribute('d', d)

//       const outlineD = `
//         M${controlPoints[0].x},${controlPoints[0].y}
//         C${controlPoints[1].x},${controlPoints[1].y},${controlPoints[2].x},${controlPoints[2].y},${controlPoints[3].x},${controlPoints[3].y}
//         C${controlPoints[4].x},${controlPoints[4].y},${controlPoints[5].x},${controlPoints[5].y},${controlPoints[6].x},${controlPoints[6].y}
//       `
//       if (reactiveOutlineRef.current) reactiveOutlineRef.current.setAttribute('d', outlineD)

//       // Generate and update additional waves
//       // Wave 1 - Bass responsive, more wavy
// // Wave 1 - Bass responsive, much calmer movement
// const wave1Points = generateFluidWave(
//   audioData, 
//   audioDataRef.current.time * 0.6, // Slower time scale for calmer movement
//   220, // Base Y position 
//   audioData.bass * 0.5 + 0.1, // Significantly reduced responsiveness
//   0.8, // Slower speed for gentler waves
//   2 + audioData.bass * 7 // Much smaller amplitude for calmer waves
// )
      
//       const wave1Path = `
//         M${wave1Points[0].x},${wave1Points[0].y}
//         C${wave1Points[1].x},${wave1Points[1].y},${wave1Points[2].x},${wave1Points[2].y},${wave1Points[3].x},${wave1Points[3].y}
//         C${wave1Points[4].x},${wave1Points[4].y},${wave1Points[5].x},${wave1Points[5].y},${wave1Points[6].x},${wave1Points[6].y}
//         L1320 550
//         L0 550
//       `
      
//       const wave1OutlinePath = `
//         M${wave1Points[0].x},${wave1Points[0].y}
//         C${wave1Points[1].x},${wave1Points[1].y},${wave1Points[2].x},${wave1Points[2].y},${wave1Points[3].x},${wave1Points[3].y}
//         C${wave1Points[4].x},${wave1Points[4].y},${wave1Points[5].x},${wave1Points[5].y},${wave1Points[6].x},${wave1Points[6].y}
//       `
      
//       if (waveRef1.current) waveRef1.current.setAttribute('d', wave1Path)
//       if (waveOutline1.current) waveOutline1.current.setAttribute('d', wave1OutlinePath)
      
//       // Wave 2 - Mid responsive, medium waviness
//       const wave2Points = generateFluidWave(
//         audioData, 
//         audioDataRef.current.time * 0.8, // Different time scale
//         290, // Base Y position
//         audioData.mid * 1 + 0.1, // Mid-focused responsiveness
//         1, // Speed modifier
//         2 + audioData.mid * 8 // Amplitude
//       )
      
//       const wave2Path = `
//         M${wave2Points[0].x},${wave2Points[0].y}
//         C${wave2Points[1].x},${wave2Points[1].y},${wave2Points[2].x},${wave2Points[2].y},${wave2Points[3].x},${wave2Points[3].y}
//         C${wave2Points[4].x},${wave2Points[4].y},${wave2Points[5].x},${wave2Points[5].y},${wave2Points[6].x},${wave2Points[6].y}
//         L1320 550
//         L0 550
//       `
      
//       const wave2OutlinePath = `
//         M${wave2Points[0].x},${wave2Points[0].y}
//         C${wave2Points[1].x},${wave2Points[1].y},${wave2Points[2].x},${wave2Points[2].y},${wave2Points[3].x},${wave2Points[3].y}
//         C${wave2Points[4].x},${wave2Points[4].y},${wave2Points[5].x},${wave2Points[5].y},${wave2Points[6].x},${wave2Points[6].y}
//       `
      
//       if (waveRef2.current) waveRef2.current.setAttribute('d', wave2Path)
//       if (waveOutline2.current) waveOutline2.current.setAttribute('d', wave2OutlinePath)
      
//       // Wave 3 - Treble responsive, high frequency waviness
//       const wave3Points = generateFluidWave(
//         audioData, 
//         audioDataRef.current.time * 1.5, // Faster time scale
//         360, // Base Y position
//         audioData.treble * 1.2 + 0.05, // Treble-focused responsiveness
//         1.5, // Speed modifier
//         1.5 + audioData.treble * 6 // Amplitude
//       )
      
//       const wave3Path = `
//         M${wave3Points[0].x},${wave3Points[0].y}
//         C${wave3Points[1].x},${wave3Points[1].y},${wave3Points[2].x},${wave3Points[2].y},${wave3Points[3].x},${wave3Points[3].y}
//         C${wave3Points[4].x},${wave3Points[4].y},${wave3Points[5].x},${wave3Points[5].y},${wave3Points[6].x},${wave3Points[6].y}
//         L1320 550
//         L0 550
//       `
      
//       const wave3OutlinePath = `
//         M${wave3Points[0].x},${wave3Points[0].y}
//         C${wave3Points[1].x},${wave3Points[1].y},${wave3Points[2].x},${wave3Points[2].y},${wave3Points[3].x},${wave3Points[3].y}
//         C${wave3Points[4].x},${wave3Points[4].y},${wave3Points[5].x},${wave3Points[5].y},${wave3Points[6].x},${wave3Points[6].y}
//       `
      
//       if (waveRef3.current) waveRef3.current.setAttribute('d', wave3Path)
//       if (waveOutline3.current) waveOutline3.current.setAttribute('d', wave3OutlinePath)

//       // Update dynamic gradient animations based on audio data
//       updateDynamicGradients(audioData)

//       // Original logo animation logic
//       const sampleHeights = samplePoints.map(x => {
//         const segment = x < 660
//           ? [controlPoints[0], controlPoints[1], controlPoints[2], controlPoints[3]]
//           : [controlPoints[3], controlPoints[4], controlPoints[5], controlPoints[6]]

//         const x1 = segment[0].x
//         const x4 = segment[3].x
//         const t = (x - x1) / (x4 - x1)
//         return bezierPoint(segment[0].y, segment[1].y, segment[2].y, segment[3].y, t)
//       })

//       const avgWaveHeight = sampleHeights.reduce((sum, h) => sum + h, 0) / sampleHeights.length

//       const spring = springRef.current
//       spring.target = avgWaveHeight - 50
//       const springForce = (spring.target - spring.position) * 0.06
//       const dampingForce = spring.velocity * 0.25
//       const acceleration = (springForce - dampingForce) / 1.5

//       spring.velocity += acceleration * deltaTime * 60
//       spring.position += spring.velocity * deltaTime * 60

//       setLogoPosition({ x: 600, y: spring.position })
//       requestAnimationFrame(animateWaves)
//     }

//     animateWaves()

//     function bezierPoint(y1, y2, y3, y4, t) {
//       const t2 = t * t
//       const t3 = t2 * t
//       const mt = 1 - t
//       const mt2 = mt * mt
//       const mt3 = mt2 * mt
//       return y1 * mt3 + 3 * y2 * mt2 * t + 3 * y3 * mt * t2 + y4 * t3
//     }

//     // Original ripple wave function (unchanged)
//     function generateRippleWave(audioData, time) {
//       const baseY = 150
//       const amplitude = 5 + audioData.overall * 15
//       const wavelength = 200
//       const speed = 0.5 + audioData.overall * 1
//       const phase = time * speed / 4

//       const getY = (x) => {
//         return baseY
//           + Math.sin((x / wavelength) + phase) * amplitude
//           + Math.sin((x / (wavelength / 2)) + phase * 1.5) * (amplitude * 0.3)
//       }

//       return [0, 220, 440, 660, 880, 1100, 1320].map(x => ({ x, y: getY(x) }))
//     }
    
//     // New function for generating more fluid waves
//     function generateFluidWave(audioData, time, baseY, intensityFactor, speedFactor, amplitude) {
//       const controlPoints = [0, 220, 440, 660, 880, 1100, 1320]
      
//       // Create multiple wave components with different frequencies
//       return controlPoints.map(x => {
//         const normalizedX = x / 1320
        
//         // Three wave components with different frequencies, phases, and amplitudes
//         const wave1 = Math.sin((normalizedX * 3 + time * speedFactor * 0.8)) * amplitude
//         const wave2 = Math.sin((normalizedX * 6 + time * speedFactor * 1.3)) * (amplitude * 0.4)
//         const wave3 = Math.sin((normalizedX * 10 + time * speedFactor * 2)) * (amplitude * 0.2)
        
//         // Each point gets influenced by audio differently
//         const pointReactivity = 1 + Math.sin(normalizedX * Math.PI * 2 + time) * 0.5
//         const audioInfluence = (wave1 + wave2 + wave3) * intensityFactor * pointReactivity
        
//         return {
//           x: x,
//           y: baseY + audioInfluence
//         }
//       })
//     }
    
//     // New function to update dynamic gradients based on audio data
//     function updateDynamicGradients(audioData) {
//       // Get all animated gradient stops
//       const gradientStops = document.querySelectorAll('.animated-stop')
      
//       // Calculate gradient animation parameters based on audio
//       const bassOffset = audioData.bass * 30
//       const midOffset = audioData.mid * 20
//       const trebleOffset = audioData.treble * 10
//       const transientBoost = audioData.transients * 0.5
      
//       // Update each gradient's position, opacity and other properties
//       gradientStops.forEach((stop, index) => {
//         const gradientType = stop.getAttribute('data-wave-type')
        
//         if (gradientType === 'main') {
//           // Main wave (top one) - animate based on overall and transients
//           const animationSpeed = 0.5 + audioData.overall * 2 + audioData.transients
//           const newOffset = (audioDataRef.current.time * animationSpeed * 10) % 200
//           const newOpacity = 0.7 + audioData.overall * 0.3 + audioData.transients * 0.5
          
//           // Update gradient stop properties
//           stop.setAttribute('offset', `${(index * 20 + newOffset) % 100}%`)
//           stop.setAttribute('stop-opacity', Math.min(1, newOpacity))
//         }
//         else if (gradientType === 'bass') {
//           // Bass wave - more influenced by bass frequencies
//           const animationSpeed = 0.3 + audioData.bass * 1.5
//           const newOffset = (audioDataRef.current.time * animationSpeed * 8) % 200
//           const newOpacity = 0.5 + audioData.bass * 0.5
          
//           stop.setAttribute('offset', `${(index * 25 + newOffset + bassOffset) % 100}%`)
//           stop.setAttribute('stop-opacity', Math.min(1, newOpacity))
//         }
//         else if (gradientType === 'mid') {
//           // Mid wave - more influenced by mid frequencies
//           const animationSpeed = 0.4 + audioData.mid * 1.3
//           const newOffset = (audioDataRef.current.time * animationSpeed * 12) % 200
//           const newOpacity = 0.4 + audioData.mid * 0.6
          
//           stop.setAttribute('offset', `${(index * 15 + newOffset + midOffset) % 100}%`)
//           stop.setAttribute('stop-opacity', Math.min(1, newOpacity))
//         }
//         else if (gradientType === 'treble') {
//           // Treble wave - more influenced by treble frequencies
//           const animationSpeed = 0.6 + audioData.treble * 2
//           const newOffset = (audioDataRef.current.time * animationSpeed * 15) % 200
//           const newOpacity = 0.3 + audioData.treble * 0.7
          
//           stop.setAttribute('offset', `${(index * 10 + newOffset + trebleOffset) % 100}%`)
//           stop.setAttribute('stop-opacity', Math.min(1, newOpacity))
//         }
//       })
//     }
//   }, [analyser, isActive])

//   return (
//     <div className="absolute bottom-0 left-0 w-full h-[550px] overflow-hidden z-0">
//       <svg
//         className="w-full h-full"
//         viewBox="0 0 1320 450"
//         preserveAspectRatio="xMidYMid slice"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         {/* Define dynamic gradient effects for all waves */}
//         <defs>
//           {/* Dynamic animated gradient for main wave */}
//           <linearGradient id="mainWaveGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1320" y2="0">
//             <stop className="animated-stop" data-wave-type="main" offset="0%" stopColor="#0c4000" stopOpacity="0.8" />
//             <stop className="animated-stop" data-wave-type="main" offset="20%" stopColor="#0c4000" stopOpacity="1" />
//             <stop className="animated-stop" data-wave-type="main" offset="40%" stopColor="#0c4000" stopOpacity="0.6" />
//             <stop className="animated-stop" data-wave-type="main" offset="60%" stopColor="#0c4000" stopOpacity="0.9" />
//             <stop className="animated-stop" data-wave-type="main" offset="80%" stopColor="#0c4000" stopOpacity="0.7" />
//             <stop className="animated-stop" data-wave-type="main" offset="100%" stopColor="#0c4000" stopOpacity="1" />
//           </linearGradient>
          
//           {/* Main wave glow effect */}
//           <filter id="glow1" x="-20%" y="-20%" width="140%" height="140%">
//             <feGaussianBlur stdDeviation="4" result="blur" />
//             <feComposite in="SourceGraphic" in2="blur" operator="over" />
//           </filter>
          
//           {/* Dynamic animated gradient for bass wave */}
//           <linearGradient id="bassWaveGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1320" y2="0">
//             <stop className="animated-stop" data-wave-type="bass" offset="0%" stopColor="#000000" stopOpacity="0.7" />
//             <stop className="animated-stop" data-wave-type="bass" offset="25%" stopColor="#000000" stopOpacity="0.9" />
//             <stop className="animated-stop" data-wave-type="bass" offset="50%" stopColor="#000000" stopOpacity="0.5" />
//             <stop className="animated-stop" data-wave-type="bass" offset="75%" stopColor="#000000" stopOpacity="0.8" />
//             <stop className="animated-stop" data-wave-type="bass" offset="100%" stopColor="#000000" stopOpacity="0.7" />
//           </linearGradient>
          
//           {/* Bass wave glow effect */}
//           <filter id="glowBass" x="-20%" y="-20%" width="140%" height="140%">
//             <feGaussianBlur stdDeviation="3" result="blur" />
//             <feComposite in="SourceGraphic" in2="blur" operator="over" />
//           </filter>
          
//           {/* Dynamic animated gradient for mid wave */}
//           <linearGradient id="midWaveGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1320" y2="0">
//             <stop className="animated-stop" data-wave-type="mid" offset="0%" stopColor="#0c4000" stopOpacity="0.6" />
//             <stop className="animated-stop" data-wave-type="mid" offset="20%" stopColor="#0c4000" stopOpacity="0.8" />
//             <stop className="animated-stop" data-wave-type="mid" offset="40%" stopColor="#0c4000" stopOpacity="0.4" />
//             <stop className="animated-stop" data-wave-type="mid" offset="60%" stopColor="#0c4000" stopOpacity="0.7" />
//             <stop className="animated-stop" data-wave-type="mid" offset="80%" stopColor="#0c4000" stopOpacity="0.5" />
//             <stop className="animated-stop" data-wave-type="mid" offset="100%" stopColor="#0c4000" stopOpacity="0.8" />
//           </linearGradient>
          
//           {/* Mid wave glow effect */}
//           <filter id="glowMid" x="-20%" y="-20%" width="140%" height="140%">
//             <feGaussianBlur stdDeviation="3" result="blur" />
//             <feComposite in="SourceGraphic" in2="blur" operator="over" />
//           </filter>
          
//           {/* Dynamic animated gradient for treble wave */}
//           <linearGradient id="trebleWaveGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1320" y2="0">
//             <stop className="animated-stop" data-wave-type="treble" offset="0%" stopColor="#000000" stopOpacity="0.5" />
//             <stop className="animated-stop" data-wave-type="treble" offset="16%" stopColor="#000000" stopOpacity="0.7" />
//             <stop className="animated-stop" data-wave-type="treble" offset="33%" stopColor="#000000" stopOpacity="0.3" />
//             <stop className="animated-stop" data-wave-type="treble" offset="50%" stopColor="#000000" stopOpacity="0.6" />
//             <stop className="animated-stop" data-wave-type="treble" offset="66%" stopColor="#000000" stopOpacity="0.4" />
//             <stop className="animated-stop" data-wave-type="treble" offset="83%" stopColor="#000000" stopOpacity="0.7" />
//             <stop className="animated-stop" data-wave-type="treble" offset="100%" stopColor="#000000" stopOpacity="0.5" />
//           </linearGradient>
          
//           {/* Treble wave glow effect */}
//           <filter id="glowTreble" x="-20%" y="-20%" width="140%" height="140%">
//             <feGaussianBlur stdDeviation="2" result="blur" />
//             <feComposite in="SourceGraphic" in2="blur" operator="over" />
//           </filter>
//         </defs>
        
//         {/* Original wave with its outline - now using dynamic gradient */}
//         <path ref={flatWaveRef} fill="#0c4000" opacity="1" />
//         <path 
//           ref={reactiveOutlineRef} 
//           fill="none" 
//           stroke="url(#mainWaveGradient)" 
//           strokeWidth="1.5" 
//           filter="url(#glow1)" 
//         />

//         {/* Aurora-inspired waves with dynamic gradients */}
//         <path ref={waveRef1} fill="#000000" opacity="1" />
//         <path 
//           ref={waveOutline1} 
//           fill="none" 
//           stroke="url(#bassWaveGradient)" 
//           strokeWidth="1.5" 
//           filter="url(#glowBass)" 
//         />

//         <path ref={waveRef2} fill="#0c4000" opacity="1" />
//         <path 
//           ref={waveOutline2} 
//           fill="none" 
//           stroke="url(#midWaveGradient)" 
//           strokeWidth="1.5" 
//           filter="url(#glowMid)" 
//         />

//         <path ref={waveRef3} fill="#ffffff" opacity="1" />
//         <path 
//           ref={waveOutline3} 
//           fill="none" 
//           stroke="url(#trebleWaveGradient)" 
//           strokeWidth="1.5" 
//           filter="url(#glowTreble)" 
//         />
        
//         {/* Logo */}
//         <image
//           ref={logoRef}
//           href={logoSrc}
//           x={logoPosition.x}
//           y={logoPosition.y}
//           width="100"
//           height="100"
//           style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.3))' }}
//           preserveAspectRatio="xMidYMid meet"
//         />
//       </svg>
//     </div>
//   )
// }


// 'use client'
 
// import { useEffect, useRef } from 'react'
 
// export default function AudioVisualizer({ isActive, analyser }) {
//   const canvasRef = useRef(null)
//   const animationRef = useRef(null)
//   const bumpHistoryRef = useRef([])
//   const lastTimeRef = useRef(Date.now())
  
//   // Setup canvas for visualizer
//   useEffect(() => {
//     const setupCanvas = () => {
//       const canvas = canvasRef.current
//       if (!canvas) return
      
//       // Set canvas to cover full height
//       canvas.width = window.innerWidth
//       canvas.height = window.innerHeight
      
//       // Resize handler
//       const handleResize = () => {
//         canvas.width = window.innerWidth
//         canvas.height = window.innerHeight
//       }
      
//       window.addEventListener('resize', handleResize)
//       return () => window.removeEventListener('resize', handleResize)
//     }
    
//     const cleanup = setupCanvas()
//     return cleanup
//   }, [])

//   // Initialize bump history once
//   useEffect(() => {
//     if (bumpHistoryRef.current.length === 0) {
//       // Create bump patterns across the width
//       const numBumps = 12 // Increased number of bumps
      
//       for (let i = 0; i < numBumps; i++) {
//         // Randomize bump positions but keep them in order
//         const position = (i / numBumps) + (Math.random() * 0.05 - 0.025) // position (0-1) with slight variation
//         const width = 0.02 + (Math.random() * 0.04) // varying bump widths
        
//         bumpHistoryRef.current.push({
//           position,
//           width,
//           height: Math.random() * 5, // Start with some small random height
//           targetHeight: Math.random() * 5,
//           velocity: Math.random() * 0.2 - 0.1, // Initial slight movement
//           phase: Math.random() * Math.PI * 2 // Random phase for ambient movement
//         })
//       }
//     }
//   }, [])

//   // Audio visualization render loop
//   useEffect(() => {
//     if (!canvasRef.current) return
    
//     const canvas = canvasRef.current
//     const canvasCtx = canvas.getContext('2d')
    
//     // Create a dummy data array for when analyser isn't available
//     const bufferLength = analyser ? analyser.frequencyBinCount : 32
//     const dataArray = new Uint8Array(bufferLength)
    
//     // Previous average level for beat detection
//     let prevAverageLevel = 0
    
//     // Generate ambient bump activity when no audio
//     const generateAmbientActivity = (deltaTime) => {
//       // Create gentle, natural water movement
//       const time = Date.now() / 1000
      
//       bumpHistoryRef.current.forEach((bump, index) => {
//         // Ambient gentle movement based on time
//         const ambientBase = Math.sin(time * 0.3 + bump.phase) * 2
        
//         // Occasional random waves (about every 3-5 seconds)
//         if (Math.random() < 0.005 * deltaTime) {
//           bump.targetHeight = 10 + Math.random() * 15
//           bump.velocity += Math.random() * 0.5
//         }
        
//         // Add ambient movement
//         bump.targetHeight += ambientBase * 0.03
//       })
//     }
    
//     const draw = () => {
//       animationRef.current = requestAnimationFrame(draw)
      
//       const currentTime = Date.now()
//       const deltaTime = (currentTime - lastTimeRef.current) / 16.67 // Normalize to ~60fps
//       lastTimeRef.current = currentTime
      
//       // Get audio data if available
//       let averageLevel = 0
//       if (analyser && isActive) {
//         analyser.getByteFrequencyData(dataArray)
        
//         // Calculate average audio level
//         let sum = 0
//         for (let i = 0; i < dataArray.length; i++) {
//           sum += dataArray[i]
//         }
//         averageLevel = sum / dataArray.length / 255 // Normalized 0-1
        
//         // Beat detection - check if there's a significant increase
//         const beatThreshold = 0.025  // Lower to catch more beats
//         const isBeat = averageLevel - prevAverageLevel > beatThreshold
//         prevAverageLevel = averageLevel // Reset baseline immediately
        

        
//         // Update previous level for next frame
//         prevAverageLevel = averageLevel * 0.8 + prevAverageLevel * 0.2 // Smooth transitions
        
//         // If a beat is detected, trigger random bumps to grow
//         if (isBeat) {
//           // Choose 3-5 random bumps to grow on beat (increased)
//           const numBumpsToActivate = 3 + Math.floor(Math.random() * 3)
          
//           for (let i = 0; i < numBumpsToActivate; i++) {
//             const randomIndex = Math.floor(Math.random() * bumpHistoryRef.current.length)
//             const bumpStrength = 0.7 + (averageLevel * 0.8) // Increased strength
            
//             bumpHistoryRef.current[randomIndex].targetHeight = 25 * bumpStrength // Increased height
//             bumpHistoryRef.current[randomIndex].velocity = 2 + (bumpStrength * 3) // Increased velocity
//           }
//         }
//       } else {
//         // When no audio or not active, generate ambient water movement
//         generateAmbientActivity(deltaTime)
        
//         // Set a small background amplitude
//         averageLevel = 0.1 + (Math.sin(Date.now() / 5000) * 0.05)
//       }
      
//       // Clear canvas
//       canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
      
//       // Semi-transparent overall background
//       canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.1)'
//       canvasCtx.fillRect(0, 0, canvas.width, canvas.height)
      
//       // Update all bump heights using spring physics
//       for (let i = 0; i < bumpHistoryRef.current.length; i++) {
//         const bump = bumpHistoryRef.current[i]
        
//         // Spring physics for natural movement
//         const spring = 0.12 // Increased spring constant for more responsive movement
//         const damping = 0.75 // Lowered damping for more oscillation
        
//         // Calculate spring force towards target height
//         const displacement = bump.targetHeight - bump.height
//         const springForce = displacement * spring
        
//         // Update velocity with spring force and damping
//         bump.velocity += springForce
//         bump.velocity *= damping
        
//         // Update height
//         bump.height += bump.velocity
        
//         // Decay target height over time
//         bump.targetHeight *= 0.97 // Slower decay for longer lasting effect
        
//         // Ensure height doesn't go negative
//         if (bump.height < 0) {
//           bump.height = 0
//           bump.velocity = 0
//         }
//       }
      
//       // Draw multiple waves with different patterns
//       const numWaves = 4
//       const bottomOfScreen = canvas.height
      
//       for (let waveIndex = 0; waveIndex < numWaves; waveIndex++) {
//         // Calculate wave parameters based on index - make each wave unique
//         const waveHeight = bottomOfScreen - canvas.height * (0.1 + (waveIndex * 0.08))
//         const waveOpacity = 0.8 - (waveIndex * 0.15)
        
//         // Different time offsets for each wave
//         const waveTimeOffset = Date.now() / 1000 * (0.1 + (waveIndex * 0.05))
        
//         // Different frequencies for each wave
//         const waveFrequency = 2 + (waveIndex * 0.7)
        
//         // Different amplitudes
//         const waveAmplitude = 1 + (waveIndex * 0.5)
        
//         // Different ripple frequencies
//         const rippleFrequency = 15 + (waveIndex * 5)
        
//         // Different ripple speeds
//         const rippleSpeed = 1.5 + (waveIndex * 0.5)
        
//         drawWave(
//           waveIndex,
//           waveHeight,
//           waveOpacity, 
//           waveTimeOffset,
//           averageLevel,
//           waveFrequency,
//           waveAmplitude,
//           rippleFrequency,
//           rippleSpeed
//         )
//       }
//     }
    
//     const drawWave = (
//       waveIndex, 
//       baseYPosition, 
//       opacity, 
//       timeOffset, 
//       audioLevel, 
//       waveFrequency, 
//       waveAmplitude,
//       rippleFrequency,
//       rippleSpeed
//     ) => {
//       const canvas = canvasRef.current
//       const canvasCtx = canvas.getContext('2d')
      
//       // Use high-resolution points for smooth drawing
//       const numPoints = 200
//       const pointSpacing = canvas.width / numPoints
      
//       // Calculate wave points
//       const points = []
      
//       // Generate base wave with natural water movement
//       for (let i = 0; i <= numPoints; i++) {
//         const x = i * pointSpacing
//         const normalizedX = i / numPoints // 0-1 position across wave
        
//         // Create gentle base wave with time-based animation
//         const time = Date.now() / 1000
        
//         // Each wave has a different frequency and phase
//         const baseWave = Math.sin(normalizedX * waveFrequency + time * 0.2 + waveIndex) * waveAmplitude
        
//         // Start with base height
//         let y = baseYPosition
        
//         // Add base wave
//         y += baseWave
        
//         // Add each bump's contribution to this point
//         bumpHistoryRef.current.forEach((bump, bumpIndex) => {
//           // Weight bumps differently for each wave
//           const bumpWeight = 1 - (waveIndex * 0.1) + (bumpIndex % 2 * 0.1)
          
//           // For each bump, calculate how much it affects this point
//           // using a bell curve function centered at the bump position
//           const distFromBump = Math.abs(normalizedX - bump.position)
//           const bumpWidth = bump.width * (1 + waveIndex * 0.1) // Slightly different width per wave
          
//           // Only affect points within the bump's width
//           if (distFromBump < bumpWidth * 3) {
//             // Bell curve formula to smoothly blend the bump
//             const bumpContribution = bump.height * bumpWeight * 
//               Math.exp(-(distFromBump * distFromBump) / (2 * bumpWidth * bumpWidth))
            
//             // Subtract from y to create a bump going upward
//             y -= bumpContribution
//           }
//         })
        
//         // Add tiny ripples with different frequencies per wave
//         const ripple = Math.sin(normalizedX * rippleFrequency + time * rippleSpeed + waveIndex * 2) * 
//                        (0.8 + (audioLevel * 1.2)) // Increased ripple amplitude
//         y += ripple
        
//         points.push({ x, y })
//       }
      
//       // Begin wave path
//       canvasCtx.beginPath()
      
//       // Draw using bezier curves for smoothness
//       canvasCtx.moveTo(points[0].x, points[0].y)
      
//       // Draw smooth curve connecting all points
//       for (let i = 0; i < points.length - 1; i++) {
//         const currentPoint = points[i]
//         const nextPoint = points[i + 1]
        
//         // Control points for bezier curve - use midpoint for smoothness
//         const controlX = (currentPoint.x + nextPoint.x) / 2
        
//         canvasCtx.quadraticCurveTo(
//           controlX, currentPoint.y,
//           nextPoint.x, nextPoint.y
//         )
//       }
      
//       // Complete the wave path to fill to the bottom of screen
//       canvasCtx.lineTo(canvas.width, canvas.height)
//       canvasCtx.lineTo(0, canvas.height)
//       canvasCtx.closePath()
      
//       // Create gradient fill with wave opacity 
//       const baseOpacity = 0.15 + (opacity * audioLevel * 0.7)
      
//       // Different colors for each wave
// // Better gradient colors for white backgrounds
// let waveColor
// switch (waveIndex) {
//   case 0:
//     waveColor = `rgba(0, 122, 255, ${baseOpacity})` // bright blue
//     break
//   case 1:
//     waveColor = `rgba(88, 86, 214, ${baseOpacity})` // purple
//     break
//   case 2:
//     waveColor = `rgba(52, 199, 89, ${baseOpacity})` // neon green
//     break
//   case 3:
//     waveColor = `rgba(255, 45, 85, ${baseOpacity})` // pink
//     break
// }

      
//       const gradient = canvasCtx.createLinearGradient(0, baseYPosition - 20, 0, baseYPosition + 50)
//       gradient.addColorStop(0, waveColor)
//       gradient.addColorStop(1, `rgba(6, 174, 120, ${baseOpacity * 0.2})`)
      
//       canvasCtx.fillStyle = gradient
//       canvasCtx.fill()
      
//       // Add subtle highlight on top of the wave
//       canvasCtx.beginPath()
//       canvasCtx.moveTo(points[0].x, points[0].y)
      
//       // Draw the top edge with the same smooth bezier curves
//       for (let i = 0; i < points.length - 1; i++) {
//         const currentPoint = points[i]
//         const nextPoint = points[i + 1]
//         const controlX = (currentPoint.x + nextPoint.x) / 2
        
//         canvasCtx.quadraticCurveTo(
//           controlX, currentPoint.y,
//           nextPoint.x, nextPoint.y
//         )
//       }
      
//       canvasCtx.strokeStyle = `rgba(0, 0, 0, ${0.08 + (audioLevel * 0.25)})` // soft dark outline
//       canvasCtx.lineWidth = 1.5 - (waveIndex * 0.3) // Different line width per wave
//       canvasCtx.stroke()
//     }
    
//     draw()
    
//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current)
//       }
//     }
//   }, [analyser, isActive])

//   return (
//     <canvas 
//       ref={canvasRef} 
//       className="absolute top-0 left-0 w-full h-full"
//       style={{ zIndex: 5, pointerEvents: 'none' }} 
//     />
//   )
// }

'use client'

import { useEffect, useRef } from 'react'

export default function AudioVisualizer({ isActive, analyser }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const bufferLength = analyser?.frequencyBinCount || 64
    const dataArray = new Uint8Array(bufferLength)

    const layers = [
      { yPercent: 0.40, color: '#0c4000', intensity: 700 },
      { yPercent: 0.48, color: '#000000', intensity: 600 },
      { yPercent: 0.56, color: '#0c4000', intensity: 500 },
      { yPercent: 0.64, color: '#000000', intensity: 400 }
    ]
    
    
    

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)

      if (analyser && isActive) {
        analyser.getByteFrequencyData(dataArray)
      } else {
        // Simple default animation when no audio is active
        const t = Date.now() / 800
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = 64 + Math.sin(i * 0.4 + t) * 10
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      layers.forEach(({ yPercent, color, intensity }) => {
        const baseY = canvas.height * yPercent
        const spacing = canvas.width / (bufferLength - 1)

        ctx.beginPath()
        ctx.moveTo(0, baseY)

        for (let i = 0; i < bufferLength; i++) {
          const x = i * spacing
          const level = dataArray[i] / 255
          
          // Instead of adding a wave pattern, just make it react to audio levels
          const displacement = level * intensity
          const y = baseY - displacement * 0.2
          
          
          ctx.lineTo(x, y)
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()

        ctx.fillStyle = color
        ctx.fill()
      })
    }

    draw()

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [analyser, isActive])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 -left-[10%] w-[180%] h-full"
      style={{ zIndex: 5, pointerEvents: 'none' }}
    />
  )
}




// 'use client'

// import { useEffect, useRef, useState } from 'react'

// export default function AudioVisualizer({ isActive, analyser }) {
//   const canvasRef = useRef(null)
//   const animationRef = useRef(null)
//   const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
//   const initializedRef = useRef(false)

//   // Initialise canvas to cover full viewport
//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     const scale = 1.1

//     const handleResize = () => {
//       const width = window.innerWidth * scale
//       const height = window.innerHeight
//       canvas.width = width
//       canvas.height = height
//       canvas.style.width = '110%'
//       canvas.style.height = '100%'
//       setDimensions({ width, height })
//     }

//     handleResize() // Set up once immediately
//     initializedRef.current = true

//     window.addEventListener('resize', handleResize)

//     return () => {
//       window.removeEventListener('resize', handleResize)
//     }
//   }, [])

//   // Separate useEffect for initial idle wave drawing
//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas || !dimensions.width) return

//     const ctx = canvas.getContext('2d')
    
//     // Draw flat idle waves immediately
//     drawIdleWaves(ctx, canvas.width, canvas.height)

//     // This ensures the initial wave is drawn once the canvas is sized properly
//     function drawIdleWaves(ctx, width, height) {
//       // Utility function for darkening colors
//       function darkenColor(color, factor) {
//         // Convert hex to RGB
//         let r, g, b
//         if (color.startsWith('#')) {
//           r = parseInt(color.slice(1, 3), 16)
//           g = parseInt(color.slice(3, 5), 16)
//           b = parseInt(color.slice(5, 7), 16)
//         } else if (color.startsWith('rgb')) {
//           const match = color.match(/\d+/g)
//           r = parseInt(match[0])
//           g = parseInt(match[1])
//           b = parseInt(match[2])
//         } else {
//           return color
//         }
        
//         // Darken
//         r = Math.max(0, Math.floor(r * factor))
//         g = Math.max(0, Math.floor(g * factor))
//         b = Math.max(0, Math.floor(b * factor))
        
//         return `rgb(${r}, ${g}, ${b})`
//       }
      
//       const waveCount = 4
//       // Use only 40% of canvas height from the bottom
//       const totalWaveHeight = height * 0.4
//       const waveHeight = totalWaveHeight / waveCount
//       // Start Y position (60% from top)
//       const wavesStartY = height * 0.6
      
//       const waveColors = [
//         '#0A2463', // Dark blue
//         '#247BA0', // Medium blue
//         '#3993DD', // Light blue
//         '#8CD6FF'  // Very light blue
//       ]
      
//       // Draw each wave layer as flat with ripples
//       for (let i = 0; i < waveCount; i++) {
//         const startY = wavesStartY + (i * waveHeight)
        
//         // Draw a flat wave layer with distinct ripples
//         ctx.beginPath()
        
//         // Add distinct ripples that disperse throughout the wave
//         const rippleCount = 5; // Number of distinct ripples
//         const points = [];
        
//         // Starting point
//         points.push({ x: 0, y: startY });
        
//         // Generate points with ripples
//         for (let j = 0; j <= width; j += width / 100) {
//           let y = startY;
          
//           // Add distinct ripples
//           for (let r = 0; r < rippleCount; r++) {
//             const rippleCenter = width * (r + 0.5) / rippleCount;
//             const distance = Math.abs(j - rippleCenter);
//             const rippleWidth = width * 0.15; // Width of ripple effect
            
//             if (distance < rippleWidth) {
//               // Create a distinct ripple effect
//               const rippleHeight = waveHeight * 1000; // Increase amplitude of the ripple
//               const normalizedDistance = distance / rippleWidth;
//               // Use a bell curve for more distinct ripples
//               const rippleEffect = rippleHeight * Math.exp(-10 * normalizedDistance * normalizedDistance);
//               y -= rippleEffect;
//             }
//           }
          
//           points.push({ x: j, y });
//         }
        
//         // Final point
//         points.push({ x: width, y: startY });
        
//         // Draw the wave path
//         ctx.moveTo(points[0].x, points[0].y);
        
//         for (let k = 0; k < points.length - 1; k++) {
//           const curr = points[k];
//           const next = points[k + 1];
//           ctx.lineTo(next.x, next.y);
//         }
        
//         // Complete the shape
//         ctx.lineTo(width, startY + waveHeight);
//         ctx.lineTo(0, startY + waveHeight);
//         ctx.closePath();
        
//         // Fill with gradient for depth
//         const gradient = ctx.createLinearGradient(0, startY, 0, startY + waveHeight);
//         gradient.addColorStop(0, waveColors[i]);
//         gradient.addColorStop(1, darkenColor(waveColors[i], 0.7));
//         ctx.fillStyle = gradient;
//         ctx.fill();
//       }
//     }
//   }, [dimensions])

//   // Handle audio visualization animation
//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas || !dimensions.width) return

//     const ctx = canvas.getContext('2d')
    
//     // Utility functions for color manipulation
//     function darkenColor(color, factor) {
//       // Convert hex to RGB
//       let r, g, b
//       if (color.startsWith('#')) {
//         r = parseInt(color.slice(1, 3), 16)
//         g = parseInt(color.slice(3, 5), 16)
//         b = parseInt(color.slice(5, 7), 16)
//       } else if (color.startsWith('rgb')) {
//         const match = color.match(/\d+/g)
//         r = parseInt(match[0])
//         g = parseInt(match[1])
//         b = parseInt(match[2])
//       } else {
//         return color
//       }
      
//       // Darken
//       r = Math.max(0, Math.floor(r * factor))
//       g = Math.max(0, Math.floor(g * factor))
//       b = Math.max(0, Math.floor(b * factor))
      
//       return `rgb(${r}, ${g}, ${b})`
//     }
    
//     // Draw a flat wave layer with distinct ripples
//     const drawFlatWave = (startY, height, color) => {
//       ctx.beginPath()
      
//       // Add distinct ripples that disperse throughout the wave
//       const rippleCount = 5; // Number of distinct ripples
//       const points = [];
      
//       // Starting point
//       points.push({ x: 0, y: startY });
      
//       // Generate points with ripples
//       for (let i = 0; i <= canvas.width; i += canvas.width / 100) {
//         let y = startY;
        
//         // Add distinct ripples
//         for (let r = 0; r < rippleCount; r++) {
//           const rippleCenter = canvas.width * (r + 0.5) / rippleCount;
//           const distance = Math.abs(i - rippleCenter);
//           const rippleWidth = canvas.width * 0.15; // Width of ripple effect
          
//           if (distance < rippleWidth) {
//             // Create a distinct ripple effect
//             const rippleHeight = height * 1000; // Increase amplitude of the ripple
//             const normalizedDistance = distance / rippleWidth;
//             // Use a bell curve for more distinct ripples
//             const rippleEffect = rippleHeight * Math.exp(-10 * normalizedDistance * normalizedDistance);
//             y -= rippleEffect;
//           }
//         }
        
//         points.push({ x: i, y });
//       }
      
//       // Final point
//       points.push({ x: canvas.width, y: startY });
      
//       // Draw the wave path
//       ctx.moveTo(points[0].x, points[0].y);
      
//       for (let i = 0; i < points.length - 1; i++) {
//         const curr = points[i];
//         const next = points[i + 1];
//         ctx.lineTo(next.x, next.y);
//       }
      
//       // Complete the shape
//       ctx.lineTo(canvas.width, startY + height);
//       ctx.lineTo(0, startY + height);
//       ctx.closePath();
      
//       // Fill with gradient for depth
//       const gradient = ctx.createLinearGradient(0, startY, 0, startY + height);
//       gradient.addColorStop(0, color);
//       gradient.addColorStop(1, darkenColor(color, 0.7));
//       ctx.fillStyle = gradient;
//       ctx.fill();
//     }
    
//     // Draw audio-reactive waves
//     const drawAudioWaves = (dataArray, bufferLength) => {
//       const cutoffRatio = 0.75
//       const effectiveBins = Math.floor(bufferLength * cutoffRatio)
//       const waveColors = [
//         'black',     // 1st
//         '#0c4000',   // 2nd
//         'black',     // 3rd
//         '#0c4000'    // 4th
//       ]
      
//       const waveCount = waveColors.length
//       // Use only 40% of canvas height from the bottom
//       const totalHeight = canvas.height * 0.4 // Keep the same total 40% of canvas
//       const waveHeights = [0.25, 0.15, 0.25, 0.35].map(p => totalHeight * p)
      
//       // Start Y position (60% from top)
//       const baseY = canvas.height * 0.6
      
//       for (let waveIndex = 0; waveIndex < waveCount; waveIndex++) {
//         const color = waveColors[waveIndex]
//         const startY = baseY + waveHeights.slice(0, waveIndex).reduce((a, b) => a + b, 0)
//         const waveHeight = waveHeights[waveIndex]
        
//         // Create points based on audio data
//         ctx.beginPath()
//         ctx.moveTo(0, startY)
        
//         const step = 5
//         const points = []
        
//         for (let j = 0; j < effectiveBins; j += step) {
//           const x = (j / (effectiveBins - step)) * canvas.width
        
//           const dataBin = dataArray[j]
//           const normalizedValue = dataBin / 255
//           const factor = waveIndex === 0 ? 0.5 : 1.0 - (waveIndex * 0.15)
        
//           let audioAmplitude = waveHeight * factor * normalizedValue
        
//           // Boost spikes **only after 10% of canvas width**
//           if (normalizedValue > 0.4) {
//             const spikeBoost = (normalizedValue - 0.4)
//             const boostMultiplier = x < canvas.width * 0.2 ? 0.9 : 2.5 // Half boost in first 20%
//             audioAmplitude += waveHeight * spikeBoost * boostMultiplier
//           }
          
//           const y = startY - audioAmplitude
//           points.push({ x, y })
//         }
        
//         // Draw the wave
//         for (let i = 0; i < points.length - 1; i++) {
//           const curr = points[i]
//           const next = points[i + 1]
//           const cx = (curr.x + next.x) / 2
//           const cy = (curr.y + next.y) / 2
//           ctx.quadraticCurveTo(curr.x, curr.y, cx, cy)
//         }
        
//         // Complete the wave shape
//         ctx.lineTo(canvas.width, canvas.height)
//         ctx.lineTo(0, canvas.height)
//         ctx.closePath()
        
//         // Fill with gradient for depth
//         const gradient = ctx.createLinearGradient(0, startY, 0, startY + waveHeight)
//         gradient.addColorStop(0, color)
//         gradient.addColorStop(1, color) // flat fill, no shadow effect

//         ctx.fillStyle = gradient
//         ctx.fill()
//       }
//     }
    
//     // Draw flat idle waves
//     const drawIdleWaves = () => {
//       const waveCount = 4
//       // Use only 40% of canvas height from the bottom
//       const totalWaveHeight = canvas.height * 0.4
//       const waveHeight = totalWaveHeight / waveCount
//       // Start Y position (60% from top)
//       const wavesStartY = canvas.height * 0.6
      
//       const waveColors = [
//         '#0A2463', // Dark blue
//         '#247BA0', // Medium blue
//         '#3993DD', // Light blue
//         '#8CD6FF'  // Very light blue
//       ]
      
//       // Draw each wave layer as flat
//       for (let i = 0; i < waveCount; i++) {
//         const startY = wavesStartY + (i * waveHeight)
//         drawFlatWave(startY, waveHeight, waveColors[i])
//       }
//     }
    
//     // Main animation function
//     const animateWaves = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height)
      
//       if (!isActive || !analyser) {
//         // Draw flat waves when audio is not active
//         drawIdleWaves()
//       } else {
//         // Draw audio-reactive waves when audio is active
//         const bufferLength = analyser.frequencyBinCount
//         const dataArray = new Uint8Array(bufferLength)
//         analyser.getByteFrequencyData(dataArray)
        
//         drawAudioWaves(dataArray, bufferLength)
//       }
      
//       animationRef.current = requestAnimationFrame(animateWaves)
//     }
    
//     // Start the animation loop
//     animationRef.current = requestAnimationFrame(animateWaves)
    
//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current)
//       }
//     }
//   }, [dimensions, analyser, isActive])

//   return (
//     <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
//       <canvas
//         ref={canvasRef}
//         className="w-[110%] h-full"
//         style={{ background: 'transparent' }}
//       />
//     </div>
//   )
// }