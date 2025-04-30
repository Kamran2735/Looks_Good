'use client'

import { useState, useEffect } from 'react'
import { VT323 } from 'next/font/google'

// Load VT323 font
const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
})

export default function MusicInfoDisplay({ title, brandName, brandDescription }) {
  const [typedText, setTypedText] = useState('')
  const [step, setStep] = useState(0)

  useEffect(() => {
    const strings = [
      `Title: ${title}`,
      `Brand: ${brandName}`,
      `Description: ${brandDescription}`
    ]

    let currentText = ''
    let charIndex = 0
    let currentStep = 0
    let timeout

    const typeNextChar = () => {
      if (currentStep >= strings.length) {
        setStep(3)
        return
      }

      const currentString = strings[currentStep]

      if (charIndex < currentString.length) {
        currentText += currentString[charIndex]
        setTypedText(currentText)
        charIndex++
        timeout = setTimeout(typeNextChar, 45)
      } else {
        currentText += '\n' // Spacing between lines
        charIndex = 0
        currentStep++
        timeout = setTimeout(typeNextChar, 400)
      }
    }

    typeNextChar()

    return () => clearTimeout(timeout)
  }, [title, brandName, brandDescription])

  return (
<div
  className={`${vt323.className} bg-black/60 px-6 py-5 rounded-xl text-white text-xl sm:text-2xl max-w-2xl whitespace-pre-wrap text-left shadow-lg backdrop-blur-md border border-white/10`}
>

      {typedText}
      <span className="inline-block animate-blink">|</span>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </div>
  )
}
