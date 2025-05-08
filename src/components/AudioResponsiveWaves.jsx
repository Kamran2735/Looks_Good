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
      { yPercent: 0.60, color: '#0c4000', intensity: 1000 },  // Top wave moved down
      { yPercent: 0.70, color: '#000000', intensity: 900 },
      { yPercent: 0.75, color: '#0c4000', intensity: 800 },
      { yPercent: 0.85, color: '#000000', intensity: 700 }   // Bottom wave moved further down
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

let prevX = 0
let prevY = baseY

for (let i = 0; i < bufferLength; i++) {
  const x = i * spacing
  const level = dataArray[i] / 255

  let displacement = level * intensity
  let y

  if (yPercent === 0.45) {
    y = baseY - displacement * 0.05
  } else {
    y = baseY - displacement * 0.075
  }

  const midX = (prevX + x) / 2
  const midY = (prevY + y) / 2

  if (i === 0) {
    ctx.moveTo(x, y)
  } else {
    ctx.quadraticCurveTo(prevX, prevY, midX, midY)
  }

  prevX = x
  prevY = y
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
      className="absolute top-0 -left-[10%] w-[180%] h-full "
      style={{ zIndex: 5, pointerEvents: 'none' }}
    />
  )
}