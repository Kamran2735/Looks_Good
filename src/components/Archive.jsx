'use client'

import React, { useState, useEffect } from 'react';
import { Poppins, Dancing_Script } from 'next/font/google';
import { 
  RiSearchLine, 
  RiFilter3Line, 
  RiSortAsc, 
  RiCloseLine,
  RiPlayFill,
  RiExternalLinkLine,
  RiInformationLine
} from 'react-icons/ri';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400'],
});

// Theme colors
const themeColors = {
  primary: '#0c4000',
  secondary: '#1a8c00', 
  accent: '#43e794',
  light: '#cdf1d8',
  dark: '#072500',
  white: '#ffffff',
};

// Sample archive data - replace with your actual data
const archiveData = [
  {
    id: 1,
    client: 'Spotify',
    project: 'Brand Sound Identity',
    editor: 'Roman Richard',
    date: '2024-03-12',
    category: 'Branding',
    description: 'Custom sound identity design incorporating brand values through strategic audio elements.',
  },
  {
    id: 2,
    client: 'Netflix',
    project: 'Documentary Series',
    editor: 'Josh Buttler',
    date: '2024-02-21',
    category: 'Production',
    description: 'Full audio production for a 6-part documentary series exploring urban soundscapes.',
  },
  {
    id: 3,
    client: 'Toyota',
    project: 'EV Launch Campaign',
    editor: 'Janny Cotller',
    date: '2024-01-15',
    category: 'Commercial',
    description: 'Immersive 3D audio design for electric vehicle launch, emphasizing sustainability through sound.',
  },
  {
    id: 4,
    client: 'Adidas',
    project: 'Retail Sound Environment',
    editor: 'Roman Richard',
    date: '2023-12-05',
    category: 'Spatial Audio',
    description: 'Designed custom in-store audio experience to enhance brand perception and customer dwell time.',
  },
  {
    id: 5,
    client: 'HBO',
    project: 'Series Theme',
    editor: 'Alex Maxwel',
    date: '2023-11-22',
    category: 'Composition',
    description: 'Original composition and sound design for premium television series opening sequence.',
  },
  {
    id: 6,
    client: 'Airbnb',
    project: 'App Notification Suite',
    editor: 'Janny Cotller',
    date: '2023-10-18',
    category: 'UX Audio',
    description: 'Complete notification and UI sound package for improved user experience and brand recognition.',
  },
  {
    id: 7,
    client: 'Google',
    project: 'Product Launch Event',
    editor: 'Josh Buttler',
    date: '2023-09-30',
    category: 'Live Event',
    description: 'Audio direction and sound design for major product reveal, including spatial audio installation.',
  },
  {
    id: 8,
    client: 'BMW',
    project: 'EV Sound Design',
    editor: 'Roman Richard',
    date: '2023-08-15',
    category: 'Product Audio',
    description: 'Crafted distinctive electric vehicle sound profile balancing safety requirements with brand identity.',
  },
  {
    id: 9,
    client: 'Nike',
    project: 'Training App Sounds',
    editor: 'Alex Maxwel',
    date: '2023-07-22',
    category: 'UX Audio',
    description: 'Motivational feedback and UI sound design for fitness training application.',
  },
  {
    id: 10,
    client: 'Electronic Arts',
    project: 'Game Sound Effects',
    editor: 'Josh Buttler',
    date: '2023-06-10',
    category: 'Gaming',
    description: 'Created immersive sound effects library for AAA game title, focusing on environmental audio.',
  },
  {
    id: 11,
    client: 'Coca Cola',
    project: 'Holiday Campaign',
    editor: 'Roman Richard',
    date: '2023-05-18',
    category: 'Commercial',
    description: 'Signature sound design and music production for global holiday advertising campaign.',
  },
  {
    id: 12,
    client: 'Sony',
    project: 'Product Sound Identity',
    editor: 'Janny Cotller',
    date: '2023-04-05',
    category: 'Product Audio',
    description: 'Unified audio branding across consumer electronics product line for consistent brand experience.',
  }
];

// Sound wave animation component
const SoundWaveAnimation = ({ isActive }) => {
  return (
    <div className="flex items-center h-4 space-x-0.5">
      {[...Array(3)].map((_, i) => (
        <div 
          key={i}
          className="bg-green-500 rounded-full"
          style={{ 
            width: '2px',
            height: isActive ? '12px' : '4px',
            animation: isActive ? `barPulse 1.2s ease-in-out infinite` : 'none',
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  );
};

// Archive table row component
const ArchiveRow = ({ item, index, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <tr 
      className={`border-b border-green-900/20 transition-all duration-300 ${
        isHovered ? 'bg-green-50' : (index % 2 === 0 ? 'bg-white' : 'bg-green-50/30')
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`mr-3 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            <SoundWaveAnimation isActive={isHovered} />
          </div>
          <div>
            <div className="font-medium text-gray-900">{item.client}</div>
            <div className="text-xs text-gray-500">{item.category}</div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900">{item.project}</div>
        <div className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-3 py-1 text-xs font-medium rounded-full"
          style={{ 
            background: isHovered 
              ? `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.accent} 100%)` 
              : `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.secondary} 100%)`,
            color: themeColors.white
          }}
        >
          {item.editor}
        </span>
      </td>
      
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => onSelect(item)}
          className={`text-sm px-3 py-1.5 rounded-lg transition-all duration-300 ${
            isHovered ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'
          } hover:bg-green-700 hover:text-white flex items-center`}
        >
          <RiInformationLine className="mr-1" />
          Details
        </button>
      </td>
    </tr>
  );
};

// Project Details Modal
const ProjectDetailsModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 overflow-hidden shadow-xl">
        <div className="relative" style={{ backgroundColor: themeColors.primary }}>
          {/* Sound wave background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute bg-white/10 rounded-full"
                style={{ 
                  height: `${Math.random() * 100}%`,
                  width: '3px',
                  left: `${(i / 20) * 100}%`,
                  bottom: 0,
                  opacity: 0.1 + (Math.random() / 5),
                }}
              />
            ))}
          </div>

          <div className="relative z-10 p-6 text-white">
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
            >
              <RiCloseLine size={24} />
            </button>
            <div className="flex items-center mb-2">
              <SoundWaveAnimation isActive={true} />
              <span className="ml-2 text-green-300 text-sm font-medium">{project.category}</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{project.project}</h3>
            <p className="text-white/80">Client: {project.client}</p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm text-gray-500">Edited by</span>
              <div className="font-medium">{project.editor}</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Completed</span>
              <div className="font-medium">
                {new Date(project.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-6">{project.description}</p>

          <div className="flex justify-between">
            <button 
              className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors flex items-center"
              onClick={onClose}
            >
              <RiCloseLine className="mr-2" />
              Close
            </button>

            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg flex items-center text-green-800 bg-green-100 hover:bg-green-200 transition-colors">
                <RiPlayFill className="mr-2" />
                Preview
              </button>
              <button 
                className="px-4 py-2 text-white rounded-lg flex items-center"
                style={{ backgroundColor: themeColors.secondary }}
              >
                <RiExternalLinkLine className="mr-2" />
                View Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Archive Section Component
const ArchiveSection = () => {
  const [filter, setFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [visibleData, setVisibleData] = useState([]);
  const [frequencyBars, setFrequencyBars] = useState(Array(40).fill(0).map((_, i) => {
    return Math.sin((i/40) * Math.PI) * 50 + (Math.random() * 30) * 1.5 ;
  }));
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;
  
  // Extract unique categories for filter dropdown
  const categories = ['All', ...new Set(archiveData.map(item => item.category))];
  
  // Filter and sort data
  useEffect(() => {
    let data = [...archiveData];
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      data = data.filter(item => item.category === selectedCategory);
    }
    
    // Apply search filter
    if (filter) {
      const searchTerm = filter.toLowerCase();
      data = data.filter(
        item => 
          item.client.toLowerCase().includes(searchTerm) ||
          item.project.toLowerCase().includes(searchTerm) ||
          item.editor.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply sorting
    data.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      
      // Convert strings to lowercase for string comparison
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
      }
      
      if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    setVisibleData(data);
    
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [filter, selectedCategory, sortField, sortOrder]);
  
  // Get current page items
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = visibleData.slice(indexOfFirstProject, indexOfLastProject);
  
  // Calculate page numbers
  const totalPages = Math.max(1, Math.ceil(visibleData.length / projectsPerPage));
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Animate frequency bars
  useEffect(() => {
    const interval = setInterval(() => {
      setFrequencyBars(bars => 
        bars.map((_, index) => {
          const baseHeight = Math.sin((index/bars.length) * Math.PI) * 50;
          return baseHeight + (Math.random() * 30);
        })
      );
    }, 500);
    return () => clearInterval(interval);
  }, []);
  
  // Toggle sort order
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  return (
    <section 
      className={`py-16 md:pt-20 md:pb-24 relative  ${poppins.className}`}
   >
      {/* New audio frequency spectrum background */}
      <div className="absolute -bottom-20 inset-0 z-0 ovefrlow-visible">
        <div className="w-full h-full  opacity-20">
          {frequencyBars.map((height, i) => (
            <div 
              key={i}
              className="absolute bottom-0 bg-white rounded-t-lg"
              style={{ 
                height: `${height}%`,
                width: '8px',
                left: `${(i / frequencyBars.length) * 100}%`,
                opacity: 0.1 + (height / 400),
                transition: 'height 0.8s ease',
                transform: 'scaleY(1.03)',
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title with sound-themed styling */}
        <div className="relative text-center mb-12">
          {/* Background Word */}
          <h1
            className={`absolute inset-0 top-0 md:-top-4 text-[6rem] md:text-[10rem] text-white/10 pointer-events-none select-none z-0 leading-none ${dancingScript.className}`}
          >
            Projects
          </h1>
          
          <div className="relative z-10">
            <p className="inline-block text-lg text-white bg-green-600 px-4 py-1 rounded-full mb-2">
              Our Archive
            </p>
            
            {/* Foreground Title */}
            <h2 className={`text-4xl md:text-6xl font-extrabold z-10 mb-6 ${poppins.className}`}>
              <span className="text-white">Sound Projects,</span><br />
              <span className="text-green-300">From Concept to Creation.</span>
            </h2>
            
            <p className="text-green-100 max-w-2xl mx-auto mb-8">
              Browse our comprehensive archive of audio projects spanning various industries, 
              showcasing our expertise in creating impactful sound experiences.
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white p-4 rounded-lg shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiSearchLine className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Search by client, project or editor..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              {/* Filter toggle button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-lg flex items-center transition-all duration-300 ${
                  showFilters ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <RiFilter3Line className="mr-2" />
                Filters
              </button>
              
              {/* Sort button */}
              <div className="relative group">
                <button
                  onClick={() => handleSort('date')}
                  className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors flex items-center"
                >
                  <RiSortAsc className="mr-2" />
                  Sort
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20">
                  <div className="py-1">
                    <button
                      onClick={() => handleSort('client')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                    >
                      Sort by Client
                    </button>
                    <button
                      onClick={() => handleSort('project')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                    >
                      Sort by Project
                    </button>
                    <button
                      onClick={() => handleSort('date')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                    >
                      Sort by Date
                    </button>
                    <button
                      onClick={() => handleSort('editor')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                    >
                      Sort by Editor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Expandable filters */}
          <div 
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden transition-all duration-300 ${
              showFilters ? 'max-h-24 mt-4 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {/* Category filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Time period filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
              <select
                className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option>All Time</option>
                <option>Last 6 Months</option>
                <option>Last Year</option>
                <option>2023</option>
                <option>2022</option>
              </select>
            </div>
         </div>
        </div>
        
        {/* Archive Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-green-900/10">
              <thead style={{ backgroundColor: themeColors.primary }}>
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3.5 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('client')}
                  >
                    <div className="flex items-center">
                      Client
                      {sortField === 'client' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3.5 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('project')}
                  >
                    <div className="flex items-center">
                      Project
                      {sortField === 'project' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3.5 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('editor')}
                  >
                    <div className="flex items-center">
                      Editor
                      {sortField === 'editor' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-start text-xs font-medium text-white uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-green-900/10">
                {currentProjects.length > 0 ? (
                  currentProjects.map((item, index) => (
                    <ArchiveRow 
                      key={item.id} 
                      item={item} 
                      index={index}
                      onSelect={(project) => setSelectedProject(project)}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                      No projects found matching your criteria. Try adjusting your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Updated Pagination */}
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{visibleData.length > 0 ? indexOfFirstProject + 1 : 0}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastProject, visibleData.length)}
                  </span> of{" "}
                  <span className="font-medium">{visibleData.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {pageNumbers.map(number => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === number 
                          ? 'border-transparent text-white bg-green-600' 
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
      
      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
       
        @keyframes barPulse {
          0%, 100% {
            height: 4px;
          }
          50% {
            height: 12px;
          }
        }
      `}</style>
    </section>
  );
};
export default ArchiveSection;