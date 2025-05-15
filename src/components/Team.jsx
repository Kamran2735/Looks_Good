// 'use client'

// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import {
//   RiFacebookFill,
//   RiInstagramLine,
//   RiTwitterXFill,
//   RiLinkedinFill,
//   RiSpotifyFill,
// } from 'react-icons/ri';
// import { Poppins, Dancing_Script } from 'next/font/google';

// const poppins = Poppins({
//   subsets: ['latin'],
//   weight: ['400', '600', '700'],
// });

// const dancingScript = Dancing_Script({
//   subsets: ['latin'],
//   weight: ['400'],
// });

// // Primary theme colors from WorkWithUs component
// const themeColors = {
//   primary: '#0c4000',
//   secondary: '#1a8c00', 
//   accent: '#43e794',
//   light: '#cdf1d8',
//   dark: '#072500',
//   white: '#ffffff',
// };

// // Team Member Component with enhanced animations and interactions
// const TeamMember = ({ name, position, image, description, index,link }) => {
//   const [isHovered, setIsHovered] = useState(false);
  
//   // Social icons customized for audio professionals
//   const socialLinks = [
//     { href: 'https://www.facebook.com', icon: <RiFacebookFill />, delay: '0ms' },
//     { href: 'https://www.instagram.com', icon: <RiInstagramLine />, delay: '100ms' },
//     { href: 'https://www.twitter.com', icon: <RiTwitterXFill />, delay: '200ms' },
//     { href: 'https://www.linkedin.com', icon: <RiLinkedinFill />, delay: '300ms' },
//     { href: 'https://www.spotify.com', icon: <RiSpotifyFill />, delay: '400ms' },
//   ];

//   return (
//     <div 
//       className={`bg-white pt-9 pb-9 transition-all duration-500 text-center rounded-lg border border-transparent ${
//         isHovered ? 'shadow-xl border-green-200' : ''
//       }`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       style={{
//         transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
//       }}
//     >
//       <div className="relative px-9 z-10">
//         {/* Sound wave ring animation around image */}
//         <div className="relative z-10 mb-4">
//           <div 
//             className="absolute inset-0 rounded-full opacity-0"
//             style={{
//               background: `radial-gradient(circle, ${themeColors.light} 0%, transparent 70%)`,
//               animation: isHovered ? 'soundWave 2s infinite' : 'none',
//               opacity: isHovered ? 0.7 : 0
//             }}
//           />
          
//           {/* Animated horizontal line */}
//           <div className="relative z-10 before:content-[''] before:absolute before:bg-gray-100 before:h-2 before:w-full before:left-0 before:top-1/2 before:z-[-1] before:transition-all before:duration-500 hover:before:h-0">
//             <div className="inline-block">
//               <div className="relative">
//                 <Image 
//                   src={image} 
//                   alt={name}
//                   width={125}
//                   height={125}
//                   className={`rounded-full border-3 transition-all duration-500 ${
//                     isHovered ? 'border-4 border-green-300 scale-105' : 'border-3 border-green-200'
//                   }`}
//                 />
                
//                 {/* Sound wave indicator with wave-like animation */}
//                 {isHovered && (
//                   <div className="absolute -right-2 -top-2 bg-white p-1 rounded-full shadow-md">
//                     <div className="flex items-center space-x-0.5">
//                       {[...Array(3)].map((_, i) => (
//                         <div 
//   key={i}
//   className="bg-green-500 rounded-full"
//   style={{ 
//     width: '3px',
//     height: '8px',
//     animation: 'barPulse 1.2s ease-in-out infinite',
//     animationDelay: `${i * 0.2}s`
//   }}
// />

//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="px-9">
//         {/* Info container with gradient matching theme */}
//         <div 
//           className={`rounded-[75px] mx-2.5 py-2.5 px-4 transition-all duration-500 ${
//             isHovered ? 'rounded-lg mx-0' : ''
//           }`}
//           style={{
//             background: isHovered 
//               ? `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.accent} 100%)`
//               : `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.secondary} 100%)`
//           }}
//         >
//           <a href={link} className="block text-2xl font-semibold capitalize text-white transition-all duration-300">
//             {name}
//           </a>
//           <span className="text-base font-normal text-white">{position}</span>
//         </div>

//         {/* Social icons with staggered animation */}
//         <ul className="flex gap-4 mt-5 mb-4 p-0 items-center justify-center">
//           {socialLinks.map((social, idx) => (
//             <li 
//               key={idx} 
//               className="transform translate-y-0 hover:-translate-y-2"
//               style={{
//                 transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
//                 transitionDelay: isHovered ? social.delay : '0ms'
//               }}
//             >
//               <a 
//                 href={social.href} 
//                 target="_blank" 
//                 rel="noreferrer"
//                 className="w-8 h-8 text-sm bg-white rounded-full flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
//                 style={{
//                   color: isHovered ? themeColors.accent : themeColors.primary,
//                   transform: isHovered ? 'scale(1.1)' : 'scale(1)'
//                 }}
//               >
//                 {social.icon}
//               </a>
//             </li>
//           ))}
//         </ul>

//         {/* Description with simple background, no pulse animation */}
//         <div 
//           className="relative p-3 rounded-lg mt-2 overflow-hidden"
//           style={{
//             background: isHovered ? 'rgba(205, 241, 216, 0.2)' : 'transparent',
//             transition: 'all 0.5s ease'
//           }}
//         >
//           <p className="m-0 p-0 text-gray-700 transition-all duration-300">
//             {description}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main Team Section with audio theme
// const TeamSection = () => {
//   const [activeFilter, setActiveFilter] = useState('all');
//   const [visibleMembers, setVisibleMembers] = useState([]);
//   const [isHovering, setIsHovering] = useState(false);
//   const [soundWaves, setSoundWaves] = useState(Array(20).fill(0));

//   const teamMembers = [
//     {
//       id: 1,
//       name: 'Roman Richard',
//       position: 'CEO & Founder',
//       category: 'leadership',
//       description: 'Emmy-winning sound designer blending musical artistry with cutting-edge audio for global brands and live events.',
//       image: '/Teams/Roman.jpg',
//       link: '/team/roman',
//     },
//     {
//       id: 2,
//       name: 'Douson Yuan',
//       position: 'Marketing Manager',
//       category: 'marketing',
//       description: 'Strategic marketing expert specializing in audio brand development and sonic identity campaigns.',
//       image: '/placeholders/team2.jpg',
//       link: '/team/douson',
//     },
//     {
//       id: 3,
//       name: 'Andrew Richards',
//       position: 'Web Developer',
//       category: 'technical',
//       description: 'Full-stack developer creating interactive audio experiences and digital platforms for sound professionals.',
//       image: '/placeholders/team3.jpg',
//       link: '/team/andrew',
//     },
//     {
//       id: 4,
//       name: 'Josh Buttler',
//       position: 'Sound Engineer',
//       category: 'production',
//       description: 'Award-winning sound engineer with expertise in spatial audio and immersive sound environments.',
//       image: '/placeholders/team4.jpg',
//     },
//     {
//       id: 5,
//       name: 'Alex Maxwel',
//       position: 'Marketing Specialist',
//       category: 'marketing',
//       description: 'Digital marketing strategist focused on audio branding and sound-driven customer experiences.',
//       image: '/placeholders/team5.jpg',
//     },
//     {
//       id: 6,
//       name: 'Janny Cotller',
//       position: 'Audio Programmer',
//       category: 'technical',
//       description: 'Innovative audio programmer merging creative sound design with cutting-edge development technologies.',
//       image: '/placeholders/team1.jpg',
//     }
//   ];

//   // Set all members visible by default
//   useEffect(() => {
//     filterMembers(activeFilter);
//   }, [activeFilter]);

//   // Animate sound waves
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setSoundWaves(waves => 
//         waves.map(() => Math.random() * 100)
//       );
//     }, 200);
//     return () => clearInterval(interval);
//   }, []);

//   // Filter members by category
//   const filterMembers = (category) => {
//     if (category === 'all') {
//       setVisibleMembers(teamMembers);
//     } else {
//       setVisibleMembers(teamMembers.filter(member => member.category === category));
//     }
//   };

//   // Filter categories
//   const filters = [
//     { id: 'all', label: 'All Team' },
//     { id: 'leadership', label: 'Leadership' },
//     { id: 'production', label: 'Production' },
//     { id: 'technical', label: 'Technical' },
//     { id: 'marketing', label: 'Marketing' },
//   ];

//   return (
//     <section 
//       className={`py-16 md:pt-20 md:pb-24 relative overflow-hidden ${poppins.className}`}
//       style={{ background: themeColors.primary }}
//       onMouseEnter={() => setIsHovering(true)}
//       onMouseLeave={() => setIsHovering(false)}
//     >
//       {/* Animated sound wave background */}
//       <div className="absolute inset-0 z-0">
//         <div className="w-full h-full opacity-10">
//           {soundWaves.map((height, i) => (
//             <div 
//               key={i}
//               className="absolute bottom-0 bg-white rounded-full"
//               style={{ 
//                 height: `${height}%`,
//                 width: '3px',
//                 left: `${(i / soundWaves.length) * 100}%`,
//                 opacity: 0.1 + (height / 200),
//                 transition: 'height 0.5s ease'
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       <div className="container mx-auto px-4 relative z-10">
//         {/* Section Title with sound-themed styling */}
//         <div className="relative text-center mb-16">
//           {/* Background Word */}
//           <h1
//             className={`absolute inset-0 top-0 md:-top-4 text-[6rem] md:text-[10rem] text-white/10 pointer-events-none select-none z-0 leading-none ${dancingScript.className}`}
//           >
//             Sound Makers
//           </h1>
          
//           <div className="relative z-10">
//             <p className="inline-block text-lg text-white bg-green-600 px-4 py-1 rounded-full mb-2">
//               Our Team
//             </p>
            
//             {/* Foreground Title */}
//             <h2 className={`text-4xl md:text-6xl font-extrabold z-10 mb-6 ${poppins.className}`}>
//               <span className="text-white">Built By Sound,</span><br />
//               <span className="text-green-300">Driven By Passion.</span>
//             </h2>
            
//             <p className="text-green-100 max-w-2xl mx-auto mb-12">
//               Our team of audio experts combines technical excellence with creative artistry to craft sonic experiences that resonate with audiences worldwide.
//             </p>
//           </div>
          
//           {/* Category filter buttons */}
//           <div className="flex flex-wrap justify-center gap-2 mb-12">
//             {filters.map(filter => (
//               <button
//                 key={filter.id}
//                 onClick={() => setActiveFilter(filter.id)}
//                 className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
//                   activeFilter === filter.id 
//                     ? 'bg-white text-green-800 shadow-lg' 
//                     : 'bg-green-800/40 text-white hover:bg-green-800/70'
//                 }`}
//               >
//                 {filter.label}
//               </button>
//             ))}
//           </div>
//         </div>
        
//         {/* Team Grid with animation */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {visibleMembers.map((member, index) => (
//             <div 
//               key={member.id} 
//               className="transform transition-all duration-500"
//               style={{
//                 opacity: 1,
//                 transform: 'translateY(0)',
//                 animation: 'fadeInUp 0.6s ease forwards',
//                 animationDelay: `${index * 0.1}s`
//               }}
//             >
//               <TeamMember
//                 name={member.name}
//                 position={member.position}
//                 description={member.description}
//                 image={member.image}
//                 index={index}
//                 link={member.link}
//               />
//             </div>
//           ))}
//         </div>
        
        
//         {/* Audio-themed CTA */}
//         {/* <div className="mt-16 text-center">
//           <a 
//             href="#contact" 
//             className="inline-flex items-center px-8 py-3 bg-white text-green-800 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:bg-green-100 group"
//           >
//             <span className="flex items-center mr-2 space-x-0.5">
//               {[...Array(3)].map((_, i) => (
//                 <span 
//                   key={i}
//                   className="inline-block bg-green-600 rounded-full transition-all duration-300"
//                   style={{ 
//                     height: `${6 + i * 2}px`,
//                     width: '3px',
//                     animation: 'soundCTABars 1.2s infinite',
//                     animationDelay: `${i * 0.2}s`
//                   }}
//                 />
//               ))}
//             </span>
//             Join Our Sound Team
//             <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
//             </svg>
//           </a>
//         </div> */}


        
//       </div>
      
//       {/* Animation keyframes */}
//       <style jsx global>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes soundWave {
//           0% {
//             transform: scale(1);
//             opacity: 0.7;
//           }
//           100% {
//             transform: scale(1.5);
//             opacity: 0;
//           }
//         }
        
// @keyframes barPulse {
//   0%, 100% {
//     height: 8px;
//   }
//   50% {
//     height: 16px;
//   }
// }


//         @keyframes soundCTABars {
//           0% {
//             height: 5px;
//           }
//           50% {
//             height: 15px;
//           }
//           100% {
//             height: 5px;
//           }
//         }
//       `}</style>
//     </section>
//   );
// };

// export default TeamSection;

'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  RiFacebookFill,
  RiInstagramLine,
  RiTwitterXFill,
  RiLinkedinFill,
  RiSpotifyFill,
} from 'react-icons/ri';
import { Poppins, Dancing_Script } from 'next/font/google';


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400'],
});

// Primary theme colors from WorkWithUs component
const themeColors = {
  primary: '#0c4000',
  secondary: '#1a8c00', 
  accent: '#43e794',
  light: '#cdf1d8',
  dark: '#072500',
  white: '#ffffff',
};

// Team Member Component with enhanced animations and interactions
const TeamMember = ({ member, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Use social links from member data
  const getSocialIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'facebook': return <RiFacebookFill />;
      case 'instagram': return <RiInstagramLine />;
      case 'twitter': return <RiTwitterXFill />;
      case 'linkedin': return <RiLinkedinFill />;
      case 'spotify': return <RiSpotifyFill />;
      default: return <RiFacebookFill />;
    }
  };

  return (
    <div 
      className={`bg-white pt-9 pb-9 transition-all duration-500 text-center rounded-lg border border-transparent ${
        isHovered ? 'shadow-xl border-green-200' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
    >
      <div className="relative px-9 z-10">
        {/* Sound wave ring animation around image */}
        <div className="relative z-10 mb-4">
          <div 
            className="absolute inset-0 rounded-full opacity-0"
            style={{
              background: `radial-gradient(circle, ${themeColors.light} 0%, transparent 70%)`,
              animation: isHovered ? 'soundWave 2s infinite' : 'none',
              opacity: isHovered ? 0.7 : 0
            }}
          />
          
          {/* Animated horizontal line */}
          <div className="relative z-10 before:content-[''] before:absolute before:bg-gray-100 before:h-2 before:w-full before:left-0 before:top-1/2 before:z-[-1] before:transition-all before:duration-500 hover:before:h-0">
            <div className="inline-block">
              <div className="relative">
                <Image 
                  src={member.image} 
                  alt={member.name}
                  width={125}
                  height={125}
                  className={`rounded-full border-3 transition-all duration-500 ${
                    isHovered ? 'border-4 border-green-300 scale-105' : 'border-3 border-green-200'
                  }`}
                />
                
                {/* Sound wave indicator with wave-like animation */}
                {isHovered && (
                  <div className="absolute -right-2 -top-2 bg-white p-1 rounded-full shadow-md">
                    <div className="flex items-center space-x-0.5">
                      {[...Array(3)].map((_, i) => (
                        <div 
                          key={i}
                          className="bg-green-500 rounded-full"
                          style={{ 
                            width: '3px',
                            height: '8px',
                            animation: 'barPulse 1.2s ease-in-out infinite',
                            animationDelay: `${i * 0.2}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-9">
        {/* Info container with gradient matching theme */}
        <div 
          className={`rounded-[75px] mx-2.5 py-2.5 px-4 transition-all duration-500 ${
            isHovered ? 'rounded-lg mx-0' : ''
          }`}
          style={{
            background: isHovered 
              ? `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.accent} 100%)`
              : `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.secondary} 100%)`
          }}
        >
          <a href={member.link} className="block text-2xl font-semibold capitalize text-white transition-all duration-300">
            {member.name}
          </a>
          <span className="text-base font-normal text-white">{member.role}</span>
        </div>

        {/* Social icons with staggered animation - Using data from DB */}
        <ul className="flex gap-4 mt-5 mb-4 p-0 items-center justify-center">
          {member.social && Object.entries(member.social).map(([platform, url], idx) => {
            if (!url) return null;
            return (
              <li 
                key={idx} 
                className="transform translate-y-0 hover:-translate-y-2"
                style={{
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  transitionDelay: isHovered ? `${idx * 100}ms` : '0ms'
                }}
              >
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-8 h-8 text-sm bg-white rounded-full flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
                  style={{
                    color: isHovered ? themeColors.accent : themeColors.primary,
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  {getSocialIcon(platform)}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Description with simple background, no pulse animation */}
        <div 
          className="relative p-3 rounded-lg mt-2 overflow-hidden"
          style={{
            background: isHovered ? 'rgba(205, 241, 216, 0.2)' : 'transparent',
            transition: 'all 0.5s ease'
          }}
        >
          <p className="m-0 p-0 text-gray-700 transition-all duration-300">
            {member.short_info}
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Team Section with audio theme
const TeamSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [visibleMembers, setVisibleMembers] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const [soundWaves, setSoundWaves] = useState(Array(20).fill(0));
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch team members from database
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/team');
        if (!res.ok) {
          throw new Error('Failed to fetch team data');
        }
        const json = await res.json();
        if (json.success) {
          setAllMembers(json.data);
          setVisibleMembers(json.data);
        } else {
          throw new Error(json.message || 'Failed to load team data');
        }
      } catch (err) {
        console.error('Error fetching team data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeam();
  }, []);

  // Set visible members based on filter
  useEffect(() => {
    filterMembers(activeFilter);
  }, [activeFilter, allMembers]);

  // Animate sound waves
  useEffect(() => {
    const interval = setInterval(() => {
      setSoundWaves(waves => 
        waves.map(() => Math.random() * 100)
      );
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Filter members by category
  const filterMembers = (category) => {
    if (category === 'all') {
      setVisibleMembers(allMembers);
    } else {
      setVisibleMembers(allMembers.filter(member => 
        (member.category && member.category.toLowerCase() === category.toLowerCase())
      ));
    }
  };

  // Filter categories
  const filters = [
    { id: 'all', label: 'All Team' },
    { id: 'leader', label: 'Leadership' },
    { id: 'production', label: 'Production' },
    { id: 'technical', label: 'Technical' },
    { id: 'marketing', label: 'Marketing' },
  ];

  // Show loading state
  if (loading) {
    return (
      <section 
        className={`py-16 md:pt-20 md:pb-24 relative overflow-hidden ${poppins.className}`}
        style={{ background: themeColors.primary }}
      >
        <div className="container mx-auto px-4 relative z-10 text-center">
          <p className="text-white text-xl">Loading team members...</p>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section 
        className={`py-16 md:pt-20 md:pb-24 relative overflow-hidden ${poppins.className}`}
        style={{ background: themeColors.primary }}
      >
        <div className="container mx-auto px-4 relative z-10 text-center">
          <p className="text-white text-xl">Error loading team: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      className={`py-16 md:pt-20 md:pb-24 relative overflow-hidden ${poppins.className}`}
      style={{ background: themeColors.primary }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Animated sound wave background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full opacity-10">
          {soundWaves.map((height, i) => (
            <div 
              key={i}
              className="absolute bottom-0 bg-white rounded-full"
              style={{ 
                height: `${height}%`,
                width: '3px',
                left: `${(i / soundWaves.length) * 100}%`,
                opacity: 0.1 + (height / 200),
                transition: 'height 0.5s ease'
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title with sound-themed styling */}
        <div className="relative text-center mb-16">
          {/* Background Word */}
          <h1
            className={`absolute inset-0 top-0 md:-top-4 text-[6rem] md:text-[10rem] text-white/10 pointer-events-none select-none z-0 leading-none ${dancingScript.className}`}
          >
            Sound Makers
          </h1>
          
          <div className="relative z-10">
            <p className="inline-block text-lg text-white bg-green-600 px-4 py-1 rounded-full mb-2">
              Our Team
            </p>
            
            {/* Foreground Title */}
            <h2 className={`text-4xl md:text-6xl font-extrabold z-10 mb-6 ${poppins.className}`}>
              <span className="text-white">Built By Sound,</span><br />
              <span className="text-green-300">Driven By Passion.</span>
            </h2>
            
            <p className="text-green-100 max-w-2xl mx-auto mb-12">
              Our team of audio experts combines technical excellence with creative artistry to craft sonic experiences that resonate with audiences worldwide.
            </p>
          </div>
          
          {/* Category filter buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter.id 
                    ? 'bg-white text-green-800 shadow-lg' 
                    : 'bg-green-800/40 text-white hover:bg-green-800/70'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Team Grid with animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleMembers.length > 0 ? (
            visibleMembers.map((member, index) => (
              <div 
                key={member.id || index} 
                className="transform transition-all duration-500"
                style={{
                  opacity: 1,
                  transform: 'translateY(0)',
                  animation: 'fadeInUp 0.6s ease forwards',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <TeamMember member={member} index={index} />
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-white text-xl">No team members found in this category.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes soundWave {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes barPulse {
          0%, 100% {
            height: 8px;
          }
          50% {
            height: 16px;
          }
        }

        @keyframes soundCTABars {
          0% {
            height: 5px;
          }
          50% {
            height: 15px;
          }
          100% {
            height: 5px;
          }
        }
      `}</style>
    </section>
  );
};

export default TeamSection;


