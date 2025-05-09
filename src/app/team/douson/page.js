'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  RiFacebookFill,
  RiInstagramLine,
  RiTwitterXFill,
  RiLinkedinFill,
  RiSpotifyFill,
  RiSoundcloudFill,
} from 'react-icons/ri';

import Marquee from '@/components/Marquee';

// Theme colors from your TeamSection component
const themeColors = {
  primary: '#0c4000',
  secondary: '#1a8c00', 
  accent: '#43e794',
  light: '#cdf1d8',
  dark: '#072500',
  white: '#ffffff',
};

const ProgressBar = ({ label, percent }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < percent) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 30);
      
      return () => clearInterval(interval);
    }, 500); // Small delay before animation starts
    
    return () => clearTimeout(timer);
  }, [percent]);
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="text-lg font-medium text-gray-800">{label}</div>
        <div className="text-lg font-medium text-gray-800">{progress}%</div>
      </div>
      <div className="w-full h-[10px] bg-gray-100 rounded-full relative overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-out"
          style={{ 
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${themeColors.primary} 0%, ${themeColors.accent} 100%)`
          }}
        />
      </div>
    </div>
  );
};

const SocialIcon = ({ Icon }) => {
  return (
    <a 
      href="#" 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-10 h-10 flex items-center justify-center rounded-full shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ 
        background: themeColors.primary,
        color: themeColors.white
      }}
    >
      <Icon size={20} />
    </a>
  );
};

const TeamProfile = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const socialIcons = [
    RiFacebookFill, 
    RiInstagramLine, 
    RiTwitterXFill, 
    RiLinkedinFill,
    RiSpotifyFill,
    RiSoundcloudFill
  ];

  const skills = [
    ['Sound Design', 95],
    ['Audio Mixing & Mastering', 88],
    ['Voiceover Engineering', 82],
    ['Brand Sound Identity', 90],
    ['Creative Direction', 76]
  ];

  const personalInfo = [
    ['Company', 'Looks Good'],
    ['Responsibility', 'Brand Development, Brand Integration'],
    ['Experience', '12+ years'],
    ['Email', 'roman@looksgood.cc'],
    ['Phone', '+123456789']
  ];

  return (
    <>
    <Marquee />
    <div className="py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50" style={{ fontFamily: 'Poppins, sans-serif' }}>

      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div 
          className={`flex flex-wrap items-center transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {/* Social Icons */}
          <div className="w-full lg:w-1/12 flex lg:flex-col justify-center items-center gap-3 mb-6 lg:mb-0">
            {socialIcons.slice(0, 4).map((Icon, idx) => (
              <SocialIcon key={idx} Icon={Icon} />
            ))}
          </div>

          {/* Image */}
          <div className="w-full lg:w-4/12 px-4 mb-8 lg:mb-0">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-lg border-2" style={{ borderColor: themeColors.light }}>
                <div className="relative">
                  <img src="/Teams/Roman.jpg" alt="Roman Richards" className="w-full" />
                  <div className="absolute inset-0" style={{ 
                    background: `linear-gradient(to top, ${themeColors.primary}80 0%, transparent 100%)`,
                    opacity: 0.2
                  }}></div>
                </div>
              </div>
              <div 
                className="absolute -bottom-4 right-8 bg-white p-2 rounded-full shadow-lg" 
                style={{ borderColor: themeColors.accent }}
              >
                <div className="flex items-center space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className="rounded-full"
                      style={{ 
                        width: '3px',
                        height: '12px',
                        background: themeColors.secondary,
                        animation: 'barPulse 1.2s ease-in-out infinite',
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="w-full lg:w-7/12 px-4">
            <div className="p-4 md:p-6 lg:p-8 rounded-2xl" style={{ background: 'rgba(205, 241, 216, 0.2)' }}>
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-1" style={{ color: themeColors.primary }}>Douson Yuan</h1>
                <p className="text-xl mb-4" style={{ color: themeColors.secondary }}>Supervising Sound Designer</p>
                <div className="h-1 w-24 mb-6 rounded-full" style={{ background: themeColors.accent }}></div>
              </div>
              
              <ul className="space-y-4">
                {personalInfo.map(([label, value], idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <div className="w-[140px] font-semibold">{label}</div>
                    <div className="pl-4 relative flex-1">
                      <span className="absolute left-0 -translate-y-1/2 top-1/2 text-gray-400">:</span>
                      <p className="ml-4">
                        {label === 'Email' ? (
                          <a href={`mailto:${value}`} className="hover:text-green-700 transition-colors duration-300">{value}</a>
                        ) : label === 'Phone' ? (
                          <a href={`tel:${value}`} className="hover:text-green-700 transition-colors duration-300">{value}</a>
                        ) : (
                          value
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Personal Info & Skills */}
        <div className="flex flex-wrap mt-12 gap-y-12">
          <div 
            className={`w-full lg:w-1/2 px-4 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6" style={{ color: themeColors.primary }}>Personal Information</h2>
              <div className="h-1 w-16 mb-6 rounded-full" style={{ background: themeColors.accent }}></div>
              <p className="text-gray-700 leading-relaxed">
              Douson, a sound designer from Sydney, Australia, has made a significant mark in the music industry through his innovative soundscapes and collaborations with prominent artists (Lil Uzi, Juice Wrld, J Cole). His exceptional talent and creativity have earned him prestigious accolades, including a Video Music Award (VMA) and a BET award for Music Video of the Year. Renowned for his ability to enhance narratives, Douson continues to push the boundaries of sound design.              </p>
            </div>
          </div>

          <div 
            className={`w-full lg:w-1/2 px-4 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6" style={{ color: themeColors.primary }}>Professional Skills</h2>
              <div className="h-1 w-16 mb-6 rounded-full" style={{ background: themeColors.accent }}></div>
              <div className="space-y-4">
                {skills.map(([label, percent], idx) => (
                  <ProgressBar key={idx} label={label} percent={percent} />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Portfolio Highlight */}
        <div 
          className={`w-full mt-16 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: themeColors.primary }}>Featured Projects</h2>
            <div className="h-1 w-24 mx-auto mb-4 rounded-full" style={{ background: themeColors.accent }}></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Explore some of Douson's most impactful audio work, showcasing his versatility across brands and platforms.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Nike Running Campaign', 'Mercedes-Benz Brand Sound', 'Red Bull Live Event'].map((project, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center shadow-md">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-green-700 border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: themeColors.primary }}>{project}</h3>
                  <p className="text-gray-600 mb-4">Sound design and audio branding that elevates the user experience.</p>
                  <a 
                    href="#" 
                    className="inline-flex items-center text-sm font-medium transition-colors duration-300"
                    style={{ color: themeColors.secondary }}
                  >
                    Listen to Sample
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Animation styles */}
      <style jsx global>{`
        @keyframes barPulse {
          0%, 100% {
            height: 10px;
          }
          50% {
            height: 18px;
          }
        }
      `}</style>
    </div>
    </>
  );
};

export default TeamProfile;