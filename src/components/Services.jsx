'use client'

import { Poppins, Dancing_Script } from 'next/font/google'
import { Music, Headphones, Sliders } from 'lucide-react'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400'],
})

export default function Services() {
  const services = [
    {
      id: 1,
      title: "Sound Design",
      description: "The sound design at Looks Good goes beyond simple audio, where the listener is immersed into the world of sound through great attention to detail and builds on unique connection between visuals and noise.",
      icon: <Headphones size={32} className="text-white" />,
      bg: "bg-white",
      text: "text-0c4000",
      descriptionColor: "text-gray-700",
      iconSide: "left"
    },
    {
      id: 2,
      title: "Music Supervision",
      description: "Here at Looks Good, we make sure to work with composers best suited toward your project. With careful selection in mind, we use our strong sense of how music can enhance a visual medium to choose what is best for your work.",
      icon: <Music size={32} className="text-white" />,
      bg: "bg-white",
      text: "text-0c4000",
      descriptionColor: "text-gray-700",
      iconSide: "right"
    },
    {
      id: 3,
      title: "Re-recording Mix (5.1 Available)",
      description: "Combining our knowledge of music synchronization, licensing, and storytelling skills - our objective at Looks Good is to create a well-rounded sound. The process of balancing multiple audio tracks and adjusting the volume accordingly is another one of our specialties.",
      icon: <Sliders size={32} className="text-white" />,
      bg: "bg-white",
      text: "text-0c4000",
      descriptionColor: "text-gray-700",
      iconSide: "left"
    }
  ]

  return (
    <section className={`relative pt-10 pb-0 bg-[#0c4000] overflow-hidden ${poppins.className}`}>
      {/* Heading */}
      <div className="relative text-center mb-16">
{/* Background Word */}
<h1
  className={`absolute inset-0 top-0 md:-top-4 text-[6rem] md:text-[10rem] text-white/10 pointer-events-none select-none z-0 leading-none ${dancingScript.className}`}
>
  Services
</h1>

<div className="relative z-10">
  <p className="inline-block text-lg text-white bg-green-600 px-4 py-1 rounded-full mb-2">
    Our Services
  </p>
  
  {/* Foreground Title */}
  <h2 className={`text-4xl md:text-6xl font-extrabold z-10 mb-6 ${poppins.className}`}>
    <span className="text-white">Services That Hit,</span><br />
    <span className="text-green-300">the Right Note.</span>
  </h2>
</div>

</div>

      {/* Services */}
      <div className="max-w-5xl mx-auto relative space-y-0">
        {services.map(service => {
          const isRight = service.iconSide === 'right'
          const iconWrapperBg = service.id === 2 ? 'bg-[#0c4000]' : 'bg-[#0c4000]'
          const iconBorder = service.id === 2 ? 'border-white' : 'border-white'
          
          // Determine background style based on service
          let backgroundStyle = {}
          if (isRight) {
            // For service 2 (right alignment): Extend to right edge, stop before left with rounded corners
            backgroundStyle = {
              right: '-30vw',
              left: '-30%',
              borderTopLeftRadius: '9999px',
              borderBottomLeftRadius: '9999px',
              border: service.id === 2 ? '8px solid #0c4000' : 'none'
            }
          } else {
            // For services 1 & 3 (left alignment): Extend to left edge, stop before right with rounded corners
            backgroundStyle = {
              left: '-50vw',
              right: '-30%',
              borderTopRightRadius: '9999px',
              borderBottomRightRadius: '9999px',
              border: service.id === 1||3 ? '8px solid #0c4000' : 'none'

            }
          }

          return (
            <div key={service.id} className="relative w-full py-8">
              {/* Asymmetrical background with inline styles */}
              <div 
                className={`absolute top-0 bottom-0 ${service.bg} z-0`}
                style={backgroundStyle}
              ></div>
              
              {/* Content container */}
              <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12">
                <div className={`flex items-center gap-6 flex-col md:flex-row ${isRight ? 'md:flex-row-reverse  text-right' : ''}`}>
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${iconWrapperBg} border-2 ${iconBorder === 'border-white' ? 'border-[#0c4000]' : 'border-[#0c4000]'}`}>
                    {service.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`text-2xl font-semibold mb-2 ${service.text}`}>{service.title}</h3>
                    <p className={`text-base ${service.descriptionColor}`}>{service.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}












