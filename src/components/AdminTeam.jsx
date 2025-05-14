'use client';

import { useState, useEffect } from 'react';
import { 
  RiUserAddLine, 
  RiSearchLine, 
  RiEdit2Line, 
  RiDeleteBinLine,
  RiCloseLine,
  RiCheckLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiAlertLine
} from 'react-icons/ri';
import { 
  collection, 
  getDocs, 
  doc, 
  deleteDoc, 
  addDoc, 
  updateDoc,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Theme colors matching your dashboard
const themeColors = {
  primary: '#0c4000',
  secondary: '#1a8c00', 
  accent: '#43e794',
  light: '#cdf1d8',
  dark: '#072500',
  white: '#ffffff',
};

export default function TeamComponent() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    category: '',
    experience: '',
    short_info: '',
    bio: '',
    image: '',
    responsibility: '',
    link: '',
    social: {}, // map, not array
    stats: [{ label: '', level: '' }], // Changed from title/value to label/level
    _newPlatform: '',
    _newLink: '',
  });

  const itemsPerPage = 5;
  
  // Fetch team members from Firestore
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const teamCollectionRef = collection(db, 'team_members');
        const q = query(teamCollectionRef, orderBy('name'));
        const querySnapshot = await getDocs(q);
        
        const members = [];
        querySnapshot.forEach((doc) => {
          members.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setTeamMembers(members);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching team members: ", error);
        showNotification('error', 'Failed to load team members. Please try again.');
        setLoading(false);
      }
    };
    
    fetchTeamMembers();
  }, []);
  
  // Show notification helper
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  // Generate link from name
  const generateLinkFromName = (name) => {
    if (!name) return '';
    // Extract first part of name (before any space)
    const firstName = name.split(' ')[0];
    // Convert to lowercase and remove special characters
    return `/team/${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  };
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-generate link if name is changed
    if (name === 'name') {
      const generatedLink = generateLinkFromName(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        link: generatedLink
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
const validateForm = () => {
  const newErrors = {};
  let firstTabWithError = null;

  // Basic Info
  if (!formData.name.trim()) {
    newErrors.name = 'Name is required';
    firstTabWithError ||= 'basic';
  } else if (formData.name.length > 50) {
    newErrors.name = 'Name should be less than 50 characters';
    firstTabWithError ||= 'basic';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    newErrors.email = 'Email is required';
    firstTabWithError ||= 'basic';
  } else if (!emailRegex.test(formData.email)) {
    newErrors.email = 'Please enter a valid email address';
    firstTabWithError ||= 'basic';
  }

  const phoneRegex = /^[\d\s\+\-\(\)]{10,15}$/;
  if (formData.phone && !phoneRegex.test(formData.phone)) {
    newErrors.phone = 'Please enter a valid phone number';
    firstTabWithError ||= 'basic';
  }

  if (!formData.role.trim()) {
    newErrors.role = 'Role is required';
    firstTabWithError ||= 'basic';
  }

  // Additional Info
  if (formData.category && formData.category.length > 20) {
    newErrors.category = 'Category should be less than 20 characters';
    firstTabWithError ||= 'additional';
  }

  if (formData.experience) {
    const expValue = parseInt(formData.experience);
    if (isNaN(expValue)) {
      newErrors.experience = 'Experience must be a number';
      firstTabWithError ||= 'additional';
    }
  }

  if (formData.image && !formData.image.match(/^(\/Teams\/.*\.(jpg|jpeg|png|webp|svg))|(https?:\/\/.*\.(jpg|jpeg|png|webp|svg))$/i)) {
    newErrors.image = 'Image path should be in format "/Teams/name.jpg" or a valid URL';
    firstTabWithError ||= 'additional';
  }

  if (!formData.short_info.trim()) {
    newErrors.short_info = 'Short info is required';
    firstTabWithError ||= 'additional';
  } else if (formData.short_info.length > 100) {
    newErrors.short_info = 'Short info should be less than 100 characters';
    firstTabWithError ||= 'additional';
  }

  setErrors(newErrors);

  return {
    isValid: Object.keys(newErrors).length === 0,
    firstTabWithError
  };
};

  
  // Filter team members based on search query
  const filteredMembers = teamMembers.filter(member => {
    const searchLower = searchQuery.toLowerCase();
    return (
      member.name?.toLowerCase().includes(searchLower) ||
      member.email?.toLowerCase().includes(searchLower) ||
      member.role?.toLowerCase().includes(searchLower)
    );
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Open add modal
  const openAddModal = () => {
    // Reset form and errors
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      category: '',
      experience: '',
      short_info: '',
      bio: '',
      image: '',
      responsibility: '',
      link: '',
      social: {}, // map, not array
      stats: [{ label: '', level: '' }], // Changed from title/value to label/level
      _newPlatform: '',
      _newLink: '',
    });
    setErrors({});
    setModalMode('add');
    setIsModalOpen(true);
    setActiveTab('basic');
  };
  
  // Open edit modal
  const openEditModal = (member) => {
    setSelectedMember(member);
    setFormData({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      role: member.role || '',
      category: member.category || '',
      experience: member.experience || '',
      short_info: member.short_info || '',
      bio: member.bio || '',
      image: member.image || '',
      responsibility: member.responsibility || '',
      link: member.link || generateLinkFromName(member.name || ''),
      social: member.social || {}, 
      stats: member.stats || [{ label: '', level: '' }],
      _newPlatform: '',
      _newLink: '',
    });
    setErrors({});
    setModalMode('edit');
    setIsModalOpen(true);
    setActiveTab('basic');
  };
  
const handleSubmit = async (e) => {
  e.preventDefault();

  const { isValid, firstTabWithError } = validateForm();

  if (!isValid) {
    if (firstTabWithError) setActiveTab(firstTabWithError);
    return;
  }

  setLoading(true);
  const { _newPlatform, _newLink, ...dataToSave } = formData;

  try {
    let response;
    if (modalMode === 'add') {
      response = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });
    } else {
      response = await fetch(`/api/admin/team/${selectedMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });
    }

    const json = await response.json();
    if (json.success) {
      showNotification('success', `Team member ${formData.name} ${modalMode === 'add' ? 'added' : 'updated'} successfully.`);
      setIsModalOpen(false);
      const refetch = await fetch('/api/admin/team');
      const data = await refetch.json();
      setTeamMembers(data.data);
    } else {
      throw new Error(json.message);
    }
  } catch (error) {
    showNotification('error', `Failed to ${modalMode === 'add' ? 'add' : 'update'} team member.`);
  } finally {
    setLoading(false);
  }
};


  
  // Delete team member
  const handleDeleteMember = async (id) => {
  if (!confirm('Are you sure you want to delete this team member?')) return;

  try {
    setLoading(true);
    const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
    const json = await res.json();

    if (json.success) {
      setTeamMembers(prev => prev.filter(m => m.id !== id));
      showNotification('success', 'Team member deleted successfully.');
    } else {
      throw new Error(json.message);
    }
  } catch (error) {
    showNotification('error', `Failed to delete team member. ${error.message}`);
  } finally {
    setLoading(false);
  }
};


  // Add new social platform
  const handleAddSocialPlatform = () => {
    if (formData._newPlatform && formData._newLink) {
      setFormData((prev) => ({
        ...prev,
        social: {
          ...prev.social,
          [formData._newPlatform]: formData._newLink,
        },
        _newPlatform: '',
        _newLink: '',
      }));
    } else {
      showNotification('error', 'Both platform name and link are required.');
    }
  };

  // Add new stat
  const handleAddStat = () => {
    setFormData({
      ...formData,
      stats: [...formData.stats, { label: '', level: '' }]
    });
  };

  // Remove social platform
  const handleRemoveSocialPlatform = (platform) => {
    const updatedSocial = { ...formData.social };
    delete updatedSocial[platform];
    
    setFormData({
      ...formData,
      social: updatedSocial
    });
  };

  // Remove stat item
  const handleRemoveStat = (index) => {
    const updatedStats = [...formData.stats];
    updatedStats.splice(index, 1);
    
    setFormData({
      ...formData,
      stats: updatedStats.length ? updatedStats : [{ label: '', level: '' }]
    });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Notification */}
      {notification.show && (
        <div 
          className={`fixed top-6 right-6 z-50 p-4 rounded-md shadow-lg flex items-center space-x-2 ${
            notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
            notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          {notification.type === 'success' ? 
            <RiCheckLine size={20} className="text-green-500" /> : 
            <RiAlertLine size={20} className="text-red-500" />
          }
          <p>{notification.message}</p>
          <button 
            onClick={() => setNotification({ show: false, type: '', message: '' })}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            <RiCloseLine size={18} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-lg font-semibold mb-4 sm:mb-0" style={{ color: themeColors.primary }}>
          Team Management
        </h2>
        
        <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Search */}
          <div className="relative">
            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/30 w-full sm:w-60"
            />
          </div>
          
          {/* Add Member Button */}
          <button
            onClick={openAddModal}
            className="flex items-center justify-center px-4 py-2 rounded-md text-white transition-colors"
            style={{ backgroundColor: themeColors.secondary }}
          >
            <RiUserAddLine className="mr-2" />
            Add Member
          </button>
        </div>
      </div>
      
      {/* Team Members Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: themeColors.secondary }}></div>
        </div>
      ) : teamMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div 
            className="w-16 h-16 mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: themeColors.light }}
          >
            <RiUserAddLine size={24} style={{ color: themeColors.primary }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.primary }}>No Team Members Yet</h3>
          <p className="text-gray-500 mb-6 max-w-md">Your team list is empty. Add your first team member to get started.</p>
          <button
            onClick={openAddModal}
            className="flex items-center justify-center px-4 py-2 rounded-md text-white transition-colors"
            style={{ backgroundColor: themeColors.secondary }}
          >
            <RiUserAddLine className="mr-2" />
            Add First Member
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {[
                    'name', 'email', 'phone', 'role', 'category',
                    'experience', 'short_info', 'responsibility'
                  ].map((key) => (
                    <th key={key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {key.replace('_', ' ')}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    {[
                      'name', 'email', 'phone', 'role', 'category',
                      'experience', 'short_info', 'responsibility'
                    ].map((key) => (
                      <td key={key} className="px-4 py-4 text-sm text-gray-700 max-w-xs whitespace-nowrap truncate">
                        {member[key] || '-'}
                      </td>
                    ))}
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(member)}
                          className="p-1 rounded hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <RiEdit2Line size={18} style={{ color: themeColors.secondary }} />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="p-1 rounded hover:bg-gray-100 transition-colors"
                          title="Delete"
                        >
                          <RiDeleteBinLine size={18} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 px-4">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredMembers.length)} of {filteredMembers.length} members
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'
                  }`}
                >
                  <RiArrowLeftSLine size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === page 
                        ? 'text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    style={currentPage === page ? { backgroundColor: themeColors.secondary } : {}}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'
                  }`}
                >
                  <RiArrowRightSLine size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <RiCloseLine size={24} />
            </button>
            
            <h3 className="text-lg font-semibold mb-6" style={{ color: themeColors.primary }}>
              {modalMode === 'add' ? 'Add New Team Member' : 'Edit Team Member'}
            </h3>
            
           <form onSubmit={handleSubmit} className="space-y-6">
  {/* Tabs */}
  <div className="flex border-b border-gray-200">
    <button
      type="button"
      onClick={() => setActiveTab('basic')}
      className={`px-4 py-2 font-medium ${
        activeTab === 'basic' 
          ? 'border-b-2 text-green-600 border-green-600' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      Basic Info
    </button>
    <button
      type="button"
      onClick={() => setActiveTab('additional')}
      className={`px-4 py-2 font-medium ${
        activeTab === 'additional' 
          ? 'border-b-2 text-green-600 border-green-600' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      Details
    </button>
    <button
      type="button"
      onClick={() => setActiveTab('social')}
      className={`px-4 py-2 font-medium ${
        activeTab === 'social' 
          ? 'border-b-2 text-green-600 border-green-600' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      Social
    </button>
    <button
      type="button"
      onClick={() => setActiveTab('skills')}
      className={`px-4 py-2 font-medium ${
        activeTab === 'skills' 
          ? 'border-b-2 text-green-600 border-green-600' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      Skills
    </button>
  </div>
  
  {/* Basic Info Tab */}
  {activeTab === 'basic' && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/30`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/30`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/30`}
          placeholder="e.g. +1 (555) 123-4567"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border ${errors.role ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/30`}
          placeholder="e.g. Senior Developer"
        />
        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
      </div>
    </div>
  )}


{activeTab === 'additional' && (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            maxLength={20}
            className={`w-full px-3 py-2 border ${errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/30`}
            placeholder="Max 20 characters"
          />
          {errors.category ? (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">{formData.category.length}/20 characters</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            min="0"
            className={`w-full px-3 py-2 border ${errors.experience ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/30`}
            placeholder="e.g. 5"
          />
          {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image Path</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${errors.image ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/30`}
            placeholder="/Teams/name.jpg or URL"
          />
          {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Link (auto-generated)</label>
          <input
            type="text"
            name="link"
            value={formData.link}
            disabled
            className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-500">Auto-generated from name</p>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Short Info <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="short_info"
          value={formData.short_info}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border ${errors.short_info ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/30`}
          placeholder="Brief description (1 sentence)"
        />
        {errors.short_info && <p className="mt-1 text-sm text-red-600">{errors.short_info}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Responsibility</label>
        <input
          type="text"
          name="responsibility"
          value={formData.responsibility}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border ${errors.responsibility ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/30`}
          placeholder="Main responsibility areas"
        />
        {errors.responsibility && <p className="mt-1 text-sm text-red-600">{errors.responsibility}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows={5}
          className={`w-full px-3 py-2 border ${errors.bio ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/30`}
          placeholder="Detailed biography"
        ></textarea>
        {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
      </div>
    </div>
  )}
  
  {/* Social Media Tab */}
  {activeTab === 'social' && (
    <div className="space-y-6">
      {/* Existing Social Platforms */}
      {Object.keys(formData.social).length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Current Social Platforms</h4>
          <div className="space-y-2">
            {Object.entries(formData.social).map(([platform, link]) => (
              <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                <div>
                  <span className="font-medium">{platform}: </span>
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{link}</a>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSocialPlatform(platform)}
                  className="text-red-500 hover:text-red-700"
                >
                  <RiCloseLine size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Add New Social Platform */}
      <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Add Social Media</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <input
              type="text"
              placeholder="Platform (e.g. LinkedIn)"
              value={formData._newPlatform}
              onChange={(e) => setFormData({...formData, _newPlatform: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/30"
            />
          </div>
          <div className="md:col-span-1">
            <input
              type="text"
              placeholder="Link (e.g. https://linkedin.com/in/...)"
              value={formData._newLink}
              onChange={(e) => setFormData({...formData, _newLink: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/30"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={handleAddSocialPlatform}
              className="w-full px-3 py-2 rounded-md text-white transition-colors"
              style={{ backgroundColor: themeColors.secondary }}
            >
              Add Platform
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
  
  {/* Skills Tab */}
  {activeTab === 'skills' && (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium text-gray-700">Skills & Expertise</h4>
          <button
            type="button"
            onClick={handleAddStat}
            className="px-3 py-1 text-sm rounded-md text-white transition-colors"
            style={{ backgroundColor: themeColors.secondary }}
          >
            Add Skill
          </button>
        </div>
        
        {formData.stats.map((stat, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-md border border-gray-200 relative">
            {index > 0 && (
              <button
                type="button"
                onClick={() => handleRemoveStat(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <RiCloseLine size={18} />
              </button>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => {
                    const updatedStats = [...formData.stats];
                    updatedStats[index].label = e.target.value;
                    setFormData({...formData, stats: updatedStats});
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/30"
                  placeholder="e.g. React"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level (1-100)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={stat.level}
                  onChange={(e) => {
                    const updatedStats = [...formData.stats];
                    updatedStats[index].level = Math.min(100, Math.max(1, parseInt(e.target.value) || 1));
                    setFormData({...formData, stats: updatedStats});
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/30"
                  placeholder="1-100"
                />
                {stat.level && (
                  <div className="mt-2 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${stat.level}%`, 
                        backgroundColor: themeColors.secondary 
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Form Submit Buttons */}
  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
    <button
      type="button"
      onClick={() => setIsModalOpen(false)}
      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={loading}
      className="px-4 py-2 rounded-md text-white transition-colors flex items-center justify-center"
      style={{ backgroundColor: themeColors.secondary }}
    >
      {loading ? (
        <>
          <div className="mr-2 animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
          {modalMode === 'add' ? 'Adding...' : 'Updating...'}
        </>
      ) : (
        <>
          {modalMode === 'add' ? 'Add' : 'Update'} Team Member
        </>
      )}
    </button>
  </div>
</form>
          </div>
        </div>
      )}
    </div>
  );
}