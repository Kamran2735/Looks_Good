'use client'

import Marquee from '../../components/Marquee'
import Location from '../../components/Location'
import Partners from '../../components/Partners'
import Testimonials from '../../components/Testimonials'
import Awards from '../../components/Awards'
import Services from '../../components/Services'
import WorkWithUs from '../../components/WorkWithUs'


export default function AboutPage() {
  return (
    <div className="w-full overflow-hidden bg-white">
      <Marquee />

      {/* Hero Audio Tagline Section */}
      <section className="relative z-10 flex flex-col items-center justify-center h-[50vh] bg-white px-6 text-center pb-10">
        <h2 className="text-4xl md:text-6xl font-extrabold text-black leading-tight max-w-4xl">
          Handcrafting <span className="text-[#0c4000]">Immersive Audio</span>
          <br />
          in Every Frequency
        </h2>

        {/* Bottom Wave Divider */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-none rotate-180 scale-x-100">
          <svg
            className="w-full h-24"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C300,100 900,0 1200,100 L1200,0 L0,0 Z"
              fill="#0c4000"
            ></path>
          </svg>
        </div>
      </section>

      {/* About Page Content Below */}
{/* About Page Content Below */}
<div className="bg-[#0c4000] pt-12">
<div className="max-w-[90rem] mx-auto px-4">
    <Location />
      </div>
              {/* Bottom Wave Divider */}
              <div className="w-full overflow-hidden leading-none rotate-180 scale-x-100">
          <svg
            className="w-full h-24"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C300,100 900,0 1200,100 L1200,0 L0,0 Z"
              fill="#ffffff"
            ></path>
          </svg>
        </div>
</div>
<Partners />
<div className="w-full bg-gradient-to-b from-white via-[#f6f8f6] to-[#ecf3ec] overflow-hidden leading-none rotate-180 scale-x-100">
          <svg
            className="w-full h-24"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C300,100 900,0 1200,100 L1200,0 L0,0 Z"
              fill="#0c4000"
            ></path>
          </svg>
        </div>
      

      <div className="bg-[#0c4000] pt-12">
      <div className="max-w-[70rem] mx-auto px-4 py-0 bg-white rounded-xl shadow-md">

<Testimonials />
      </div>
              {/* Bottom Wave Divider */}
              <div className="w-full overflow-hidden leading-none rotate-180 scale-x-100">
          <svg
            className="w-full h-24"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C300,100 900,0 1200,100 L1200,0 L0,0 Z"
              fill="#ffffff"
            ></path>
          </svg>
        </div>

        <Awards />
        <div className="w-full bg-gradient-to-b from-white via-[#f6f8f6] to-[#ecf3ec] overflow-hidden leading-none rotate-180 scale-x-100">
          <svg
            className="w-full h-24"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C300,100 900,0 1200,100 L1200,0 L0,0 Z"
              fill="#0c4000"
            ></path>
          </svg>
        </div>     
        <Services/>
                      {/* Bottom Wave Divider */}
                      <div className="w-full overflow-hidden leading-none rotate-180 scale-x-100">
          <svg
            className="w-full h-24"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C300,100 900,0 1200,100 L1200,0 L0,0 Z"
              fill="#ffffff"
            ></path>
          </svg>
        </div>

        <WorkWithUs />
</div>

    </div>
  )
}
