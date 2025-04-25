'use client'

import { useEffect, useRef } from 'react'

export default function AudioVisualizer({ isActive, analyser }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  // Setup canvas for visualizer
  useEffect(() => {
    const setupCanvas = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      
      // Set canvas to cover full height including top and bottom sections for seamless appearance
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
      // Resize handler
      const handleResize = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
      
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
    
    const cleanup = setupCanvas()
    return cleanup
  }, [])

  // Audio visualization render loop
  useEffect(() => {
    if (!analyser || !canvasRef.current || !isActive) return
    
    const canvas = canvasRef.current
    const canvasCtx = canvas.getContext('2d')
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)
      
      analyser.getByteFrequencyData(dataArray)
      
      // Clear canvas
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Semi-transparent overall background to create unified look
      canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Calculate average audio level for opacity reactivity
      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i]
      }
      const averageLevel = sum / bufferLength / 255 // Normalized 0-1
      
      // Track the current time for animation
      const currentTime = Date.now() / 1000
      
      // Position waves from the bottom of the screen
      // Start positions are now measured from the bottom
      const bottomOfScreen = canvas.height;
      
      // Draw waves starting from bottom with smaller heights
      // Reduced wave heights by using smaller vertical spacing between waves
      drawWave(dataArray, bufferLength, '#06ae78', 0.8, currentTime * 0.3, 0, bottomOfScreen - canvas.height * 0.10, averageLevel) // Bottom wave
      drawWave(dataArray, bufferLength, '#06ae78', 0.6, currentTime * 0.2, 0.33, bottomOfScreen - canvas.height * 0.18, averageLevel) // Second wave
      drawWave(dataArray, bufferLength, '#06ae78', 0.4, currentTime * 0.15, 0.66, bottomOfScreen - canvas.height * 0.26, averageLevel) // Third wave
      drawWave(dataArray, bufferLength, '#06ae78', 0.2, currentTime * 0.1, 0.5, bottomOfScreen - canvas.height * 0.34, averageLevel) // Top wave
    }
    
    const drawWave = (dataArray, bufferLength, color, scale, timeOffset, phaseOffset, baseYPosition, audioLevel) => {
      const canvas = canvasRef.current
      const canvasCtx = canvas.getContext('2d')
      
      // Begin wave path
      canvasCtx.beginPath()
      canvasCtx.moveTo(0, baseYPosition)
      
      // Reduce ripple effect by lowering amplitude multipliers
      const rippleIntensity = 10; // Reduced from 20
      const audioAmplitudeFactor = 8; // Reduced from default value (was implicitly higher)
      
      for (let i = 0; i < bufferLength; i++) {
        const x = i * (canvas.width / bufferLength)
        
        // Create natural wave effect with phase offset to create horizontal variation
        // Reduced frequency for gentler ripples
        const time = Date.now() / 1000
        const frequency = 1.5 // Reduced from 2 for gentler ripples
        const horizontalOffset = Math.PI * 2 * phaseOffset
        const naturalWave = Math.sin((x * 0.008 + time * frequency) + horizontalOffset) * rippleIntensity
        
        // Add audio reactivity with reduced intensity
        const value = dataArray[i] * scale
        const amplitude = (value / 256) * canvas.height / audioAmplitudeFactor
        
        // Combine natural wave with audio reactivity
        const y = baseYPosition + naturalWave + (amplitude * Math.sin(x * 0.008 + timeOffset + horizontalOffset))
        
        canvasCtx.lineTo(x, y)
      }
      
      // Complete the wave path to fill to the bottom of the screen
      canvasCtx.lineTo(canvas.width, baseYPosition)
      canvasCtx.lineTo(canvas.width, canvas.height) // Go all the way to bottom
      canvasCtx.lineTo(0, canvas.height) // Continue along bottom
      canvasCtx.closePath()
      
      // Create gradient fill with wave opacity reacting to audio level
      // Base opacity is influenced by audio level (higher sound = more opaque)
      const opacityBoost = 0.2 + (audioLevel * 0.6) // Reduced opacity range (0.2-0.8)
      
      const gradient = canvasCtx.createLinearGradient(0, baseYPosition, 0, canvas.height)
      gradient.addColorStop(0, `rgba(6, 174, 120, ${opacityBoost})`) // More opaque at top, audio reactive
      gradient.addColorStop(0.3, `rgba(6, 174, 120, ${opacityBoost * 0.7})`) // 70% opacity of top
      gradient.addColorStop(0.6, `rgba(6, 174, 120, ${opacityBoost * 0.4})`) // 40% opacity of top
      gradient.addColorStop(1, `rgba(6, 174, 120, ${opacityBoost * 0.1})`) // Very faint at bottom
      
      canvasCtx.fillStyle = gradient
      canvasCtx.fill()
      
      // Add subtle line on top of the wave for shine effect - also audio reactive
      canvasCtx.beginPath()
      canvasCtx.moveTo(0, baseYPosition)
      
      for (let i = 0; i < bufferLength; i++) {
        const x = i * (canvas.width / bufferLength)
        
        const time = Date.now() / 1000
        const frequency = 1.5 // Reduced from 2 for gentler ripples
        const horizontalOffset = Math.PI * 2 * phaseOffset
        const naturalWave = Math.sin((x * 0.008 + time * frequency) + horizontalOffset) * rippleIntensity
        
        const value = dataArray[i] * scale
        const amplitude = (value / 256) * canvas.height / audioAmplitudeFactor
        
        const y = baseYPosition + naturalWave + (amplitude * Math.sin(x * 0.008 + timeOffset + horizontalOffset))
        
        canvasCtx.lineTo(x, y)
      }
      
      canvasCtx.lineTo(canvas.width, baseYPosition)
      canvasCtx.strokeStyle = `rgba(255, 255, 255, ${0.2 + (audioLevel * 0.3)})` // Reduced shine effect (0.2-0.5)
      canvasCtx.lineWidth = 1
      canvasCtx.stroke()
    }
    
    draw()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [analyser, isActive])

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
      style={{ zIndex: 5, pointerEvents: 'none' }} 
    />
  )
}