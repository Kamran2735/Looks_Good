'use client'

import { useEffect, useRef, useState } from 'react'

export default function MultiLayerAudioWaves({ isActive, analyser, logoSrc = '/logo-nobg.png' }) {
  // Original flat wave reference
  const flatWaveRef = useRef(null)
  const reactiveOutlineRef = useRef(null)
  
  // References for the additional waves
  const waveRef1 = useRef(null)
  const waveRef2 = useRef(null)
  const waveRef3 = useRef(null)
  
  // References for wave outlines
  const waveOutline1 = useRef(null)
  const waveOutline2 = useRef(null)
  const waveOutline3 = useRef(null)
  
  const logoRef = useRef(null)
  const [logoPosition, setLogoPosition] = useState({ x: 600, y: 250 })
  const springRef = useRef({ velocity: 0, target: 250, position: 250 })

  const audioDataRef = useRef({
    bass: { value: 0, smooth: 0 },
    mid: { value: 0, smooth: 0 },
    treble: { value: 0, smooth: 0 },
    history: Array(20).fill(0),
    time: 0
  })

  useEffect(() => {
    // Function to draw the initial flat wave (unchanged from original)
    const drawInitialFlatWave = () => {
      const baseLift = 10
      const d = `
        M0,${150 - baseLift}
        C220,${140 + baseLift},440,${140 - baseLift},660,${150 + baseLift}
        C880,${160 - baseLift},1100,${160 + baseLift},1320,${150 - baseLift}
        L1320 550
        L0 550
      `
      if (flatWaveRef.current) flatWaveRef.current.setAttribute('d', d)
      if (reactiveOutlineRef.current) {
        const outlineD = `
          M0,${150 - baseLift}
          C220,${140 + baseLift},440,${140 - baseLift},660,${150 + baseLift}
          C880,${160 - baseLift},1100,${160 + baseLift},1320,${150 - baseLift}
        `
        reactiveOutlineRef.current.setAttribute('d', outlineD)
      }
      
      // Initial positions for additional waves
      if (waveRef1.current) {
        const wave1D = `
          M0,${220}
          C220,${215},440,${225},660,${220}
          C880,${215},1100,${225},1320,${220}
          L1320 550
          L0 550
        `
        waveRef1.current.setAttribute('d', wave1D)
      }
      
      if (waveRef2.current) {
        const wave2D = `
          M0,${290}
          C220,${285},440,${295},660,${290}
          C880,${285},1100,${295},1320,${290}
          L1320 550
          L0 550
        `
        waveRef2.current.setAttribute('d', wave2D)
      }
      
      if (waveRef3.current) {
        const wave3D = `
          M0,${360}
          C220,${355},440,${365},660,${360}
          C880,${355},1100,${365},1320,${360}
          L1320 550
          L0 550
        `
        waveRef3.current.setAttribute('d', wave3D)
      }
      
      springRef.current.position = 90
      springRef.current.target = 90
      setLogoPosition({ x: 600, y: 90 })
    }

    drawInitialFlatWave()

    const bufferLength = analyser?.frequencyBinCount || 0
    const dataArray = bufferLength ? new Uint8Array(bufferLength) : []

    let lastTime = Date.now()
    const samplePoints = [550, 570, 590, 610, 630, 650]

    const animateWaves = () => {
      const currentTime = Date.now()
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1)
      lastTime = currentTime

      audioDataRef.current.time += deltaTime

      let audioData = {
        bass: 0,
        mid: 0,
        treble: 0,
        transients: 0,
        overall: 0
      }

      if (isActive && analyser) {
        analyser.getByteFrequencyData(dataArray)
        const bassEnd = Math.floor(bufferLength * 0.1)
        const midEnd = Math.floor(bufferLength * 0.5)
        const trebleStart = Math.floor(bufferLength * 0.5)

        let bassSum = 0, midSum = 0, trebleSum = 0
        for (let i = 0; i < bassEnd; i++) bassSum += dataArray[i]
        for (let i = bassEnd; i < midEnd; i++) midSum += dataArray[i]
        for (let i = trebleStart; i < bufferLength; i++) trebleSum += dataArray[i]

        const bass = bassSum / (bassEnd * 255)
        const mid = midSum / ((midEnd - bassEnd) * 255)
        const treble = trebleSum / ((bufferLength - trebleStart) * 255)
        const overall = (bassSum + midSum + trebleSum) / (bufferLength * 255)

        audioDataRef.current.bass.value = bass
        audioDataRef.current.bass.smooth += (bass - audioDataRef.current.bass.smooth) * 0.2
        audioDataRef.current.mid.value = mid
        audioDataRef.current.mid.smooth += (mid - audioDataRef.current.mid.smooth) * 0.15
        audioDataRef.current.treble.value = treble
        audioDataRef.current.treble.smooth += (treble - audioDataRef.current.treble.smooth) * 0.3

        audioDataRef.current.history.push(overall)
        if (audioDataRef.current.history.length > 20) {
          audioDataRef.current.history.shift()
        }

        const historyAvg = audioDataRef.current.history.slice(0, -3).reduce((a, b) => a + b, 0) /
          (audioDataRef.current.history.length - 3)
        const currentAvg = audioDataRef.current.history.slice(-3).reduce((a, b) => a + b, 0) / 3
        const transients = Math.max(0, currentAvg - historyAvg) * 3

        audioData = {
          bass: audioDataRef.current.bass.smooth,
          mid: audioDataRef.current.mid.smooth,
          treble: audioDataRef.current.treble.smooth,
          transients,
          overall
        }
      }

      // Original top wave (unchanged)
      const controlPoints = generateRippleWave(audioData, audioDataRef.current.time)

      const d = `
        M${controlPoints[0].x},${controlPoints[0].y}
        C${controlPoints[1].x},${controlPoints[1].y},${controlPoints[2].x},${controlPoints[2].y},${controlPoints[3].x},${controlPoints[3].y}
        C${controlPoints[4].x},${controlPoints[4].y},${controlPoints[5].x},${controlPoints[5].y},${controlPoints[6].x},${controlPoints[6].y}
        L1320 550
        L0 550
      `
      if (flatWaveRef.current) flatWaveRef.current.setAttribute('d', d)

      const outlineD = `
        M${controlPoints[0].x},${controlPoints[0].y}
        C${controlPoints[1].x},${controlPoints[1].y},${controlPoints[2].x},${controlPoints[2].y},${controlPoints[3].x},${controlPoints[3].y}
        C${controlPoints[4].x},${controlPoints[4].y},${controlPoints[5].x},${controlPoints[5].y},${controlPoints[6].x},${controlPoints[6].y}
      `
      if (reactiveOutlineRef.current) reactiveOutlineRef.current.setAttribute('d', outlineD)

      // Generate and update additional waves
      // Wave 1 - Bass responsive, more wavy
      const wave1Points = generateFluidWave(
        audioData, 
        audioDataRef.current.time, 
        220, // Base Y position
        audioData.bass * 1.4 + 0.2, // Bass-focused responsiveness
        0.7, // Speed modifier
        10 + audioData.bass * 30 // Amplitude
      )
      
      const wave1Path = `
        M${wave1Points[0].x},${wave1Points[0].y}
        C${wave1Points[1].x},${wave1Points[1].y},${wave1Points[2].x},${wave1Points[2].y},${wave1Points[3].x},${wave1Points[3].y}
        C${wave1Points[4].x},${wave1Points[4].y},${wave1Points[5].x},${wave1Points[5].y},${wave1Points[6].x},${wave1Points[6].y}
        L1320 550
        L0 550
      `
      
      const wave1OutlinePath = `
        M${wave1Points[0].x},${wave1Points[0].y}
        C${wave1Points[1].x},${wave1Points[1].y},${wave1Points[2].x},${wave1Points[2].y},${wave1Points[3].x},${wave1Points[3].y}
        C${wave1Points[4].x},${wave1Points[4].y},${wave1Points[5].x},${wave1Points[5].y},${wave1Points[6].x},${wave1Points[6].y}
      `
      
      if (waveRef1.current) waveRef1.current.setAttribute('d', wave1Path)
      if (waveOutline1.current) waveOutline1.current.setAttribute('d', wave1OutlinePath)
      
      // Wave 2 - Mid responsive, medium waviness
      const wave2Points = generateFluidWave(
        audioData, 
        audioDataRef.current.time * 0.8, // Different time scale
        290, // Base Y position
        audioData.mid * 1.3 + 0.1, // Mid-focused responsiveness
        1.2, // Speed modifier
        8 + audioData.mid * 25 // Amplitude
      )
      
      const wave2Path = `
        M${wave2Points[0].x},${wave2Points[0].y}
        C${wave2Points[1].x},${wave2Points[1].y},${wave2Points[2].x},${wave2Points[2].y},${wave2Points[3].x},${wave2Points[3].y}
        C${wave2Points[4].x},${wave2Points[4].y},${wave2Points[5].x},${wave2Points[5].y},${wave2Points[6].x},${wave2Points[6].y}
        L1320 550
        L0 550
      `
      
      const wave2OutlinePath = `
        M${wave2Points[0].x},${wave2Points[0].y}
        C${wave2Points[1].x},${wave2Points[1].y},${wave2Points[2].x},${wave2Points[2].y},${wave2Points[3].x},${wave2Points[3].y}
        C${wave2Points[4].x},${wave2Points[4].y},${wave2Points[5].x},${wave2Points[5].y},${wave2Points[6].x},${wave2Points[6].y}
      `
      
      if (waveRef2.current) waveRef2.current.setAttribute('d', wave2Path)
      if (waveOutline2.current) waveOutline2.current.setAttribute('d', wave2OutlinePath)
      
      // Wave 3 - Treble responsive, high frequency waviness
      const wave3Points = generateFluidWave(
        audioData, 
        audioDataRef.current.time * 1.5, // Faster time scale
        360, // Base Y position
        audioData.treble * 1.2 + 0.05, // Treble-focused responsiveness
        1.5, // Speed modifier
        5 + audioData.treble * 20 // Amplitude
      )
      
      const wave3Path = `
        M${wave3Points[0].x},${wave3Points[0].y}
        C${wave3Points[1].x},${wave3Points[1].y},${wave3Points[2].x},${wave3Points[2].y},${wave3Points[3].x},${wave3Points[3].y}
        C${wave3Points[4].x},${wave3Points[4].y},${wave3Points[5].x},${wave3Points[5].y},${wave3Points[6].x},${wave3Points[6].y}
        L1320 550
        L0 550
      `
      
      const wave3OutlinePath = `
        M${wave3Points[0].x},${wave3Points[0].y}
        C${wave3Points[1].x},${wave3Points[1].y},${wave3Points[2].x},${wave3Points[2].y},${wave3Points[3].x},${wave3Points[3].y}
        C${wave3Points[4].x},${wave3Points[4].y},${wave3Points[5].x},${wave3Points[5].y},${wave3Points[6].x},${wave3Points[6].y}
      `
      
      if (waveRef3.current) waveRef3.current.setAttribute('d', wave3Path)
      if (waveOutline3.current) waveOutline3.current.setAttribute('d', wave3OutlinePath)

      // Original logo animation logic
      const sampleHeights = samplePoints.map(x => {
        const segment = x < 660
          ? [controlPoints[0], controlPoints[1], controlPoints[2], controlPoints[3]]
          : [controlPoints[3], controlPoints[4], controlPoints[5], controlPoints[6]]

        const x1 = segment[0].x
        const x4 = segment[3].x
        const t = (x - x1) / (x4 - x1)
        return bezierPoint(segment[0].y, segment[1].y, segment[2].y, segment[3].y, t)
      })

      const avgWaveHeight = sampleHeights.reduce((sum, h) => sum + h, 0) / sampleHeights.length

      const spring = springRef.current
      spring.target = avgWaveHeight - 50
      const springForce = (spring.target - spring.position) * 0.06
      const dampingForce = spring.velocity * 0.25
      const acceleration = (springForce - dampingForce) / 1.5

      spring.velocity += acceleration * deltaTime * 60
      spring.position += spring.velocity * deltaTime * 60

      setLogoPosition({ x: 600, y: spring.position })
      requestAnimationFrame(animateWaves)
    }

    animateWaves()

    function bezierPoint(y1, y2, y3, y4, t) {
      const t2 = t * t
      const t3 = t2 * t
      const mt = 1 - t
      const mt2 = mt * mt
      const mt3 = mt2 * mt
      return y1 * mt3 + 3 * y2 * mt2 * t + 3 * y3 * mt * t2 + y4 * t3
    }

    // Original ripple wave function (unchanged)
    function generateRippleWave(audioData, time) {
      const baseY = 150
      const amplitude = 5 + audioData.overall * 15
      const wavelength = 200
      const speed = 0.5 + audioData.overall * 1
      const phase = time * speed / 4

      const getY = (x) => {
        return baseY
          + Math.sin((x / wavelength) + phase) * amplitude
          + Math.sin((x / (wavelength / 2)) + phase * 1.5) * (amplitude * 0.3)
      }

      return [0, 220, 440, 660, 880, 1100, 1320].map(x => ({ x, y: getY(x) }))
    }
    
    // New function for generating more fluid waves
    function generateFluidWave(audioData, time, baseY, intensityFactor, speedFactor, amplitude) {
      const controlPoints = [0, 220, 440, 660, 880, 1100, 1320]
      
      // Create multiple wave components with different frequencies
      return controlPoints.map(x => {
        const normalizedX = x / 1320
        
        // Three wave components with different frequencies, phases, and amplitudes
        const wave1 = Math.sin((normalizedX * 3 + time * speedFactor * 0.8)) * amplitude
        const wave2 = Math.sin((normalizedX * 6 + time * speedFactor * 1.3)) * (amplitude * 0.4)
        const wave3 = Math.sin((normalizedX * 10 + time * speedFactor * 2)) * (amplitude * 0.2)
        
        // Each point gets influenced by audio differently
        const pointReactivity = 1 + Math.sin(normalizedX * Math.PI * 2 + time) * 0.5
        const audioInfluence = (wave1 + wave2 + wave3) * intensityFactor * pointReactivity
        
        return {
          x: x,
          y: baseY + audioInfluence
        }
      })
    }
  }, [analyser, isActive])

  return (
    <div className="absolute bottom-0 left-0 w-full h-[550px] overflow-hidden z-0">
      <svg
        className="w-full h-full"
        viewBox="0 0 1320 550"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Define glowing effect for all waves */}
        <defs>
          <filter id="glow1" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow2" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="blackGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
{/* Original wave with its outline */}
<path ref={flatWaveRef} fill="#07c98a" opacity="0.2" />
<path ref={reactiveOutlineRef} fill="none" stroke="#07c98a" strokeWidth="1" opacity="0.6" filter="url(#glow1)" />

{/* Aurora-inspired waves (removed black/gray, replaced with teal & cyan gradients) */}
<path ref={waveRef1} fill="#3ae5c0" opacity="0.12" />
<path ref={waveOutline1} fill="none" stroke="#3ae5c0" strokeWidth="1" opacity="0.5" filter="url(#glow1)" />

<path ref={waveRef2} fill="#00ffe5" opacity="0.08" />
<path ref={waveOutline2} fill="none" stroke="#00ffe5" strokeWidth="1" opacity="0.4" filter="url(#glow1)" />

<path ref={waveRef3} fill="#65f5d5" opacity="0.08" />
<path ref={waveOutline3} fill="none" stroke="#65f5d5" strokeWidth="1" opacity="0.4" filter="url(#glow1)" />

        
        {/* Logo */}
        <image
          ref={logoRef}
          href={logoSrc}
          x={logoPosition.x}
          y={logoPosition.y}
          width="100"
          height="100"
          style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.3))' }}
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
    </div>
  )
}