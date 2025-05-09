'use client'

import Marquee from '../../components/Marquee'
import Team from '../../components/Team'
import WorkWithUs from '../../components/WorkWithUs'

export default function TeamPage() {
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

      <div className="bg-[#0c4000]">

      <Team/>
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
)}
