'use client';

import { useState, useEffect } from 'react';
import {
  RiSearchLine,
  RiDeleteBinLine,
  RiRefreshLine,
  RiCloseLine,
  RiCheckLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiAlertLine,
  RiFilterLine,
} from 'react-icons/ri';

const themeColors = {
  primary: '#0c4000',
  secondary: '#1a8c00',
  accent: '#43e794',
  light: '#cdf1d8',
  dark: '#072500',
  white: '#ffffff',
};

const collectionMapping = {
  'archive': {
    display: 'Archive',
    deleted: 'archive_deleted',
    original: 'archive'
  },
  'team_members': {
    display: 'Team',
    deleted: 'team_members_deleted',
    original: 'team_members'
  },
};



export default function AdminTrash() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [selectedType, setSelectedType] = useState('all'); // 'all', 'archive_projects_deleted', 'team_members_deleted', etc.
  const [confirmDialog, setConfirmDialog] = useState({ show: false, type: '', itemId: null });
  const itemsPerPage = 8;

  useEffect(() => {
    fetchTrashItems();
  }, [selectedType]);
  
  const fetchTrashItems = async () => {
    try {
      setLoading(true);
      // In a real app, this would be a call to your API
      const res = await fetch(`/api/admin/trash?type=${selectedType}`);
      const json = await res.json();
      if (json.success) {
        setItems(json.data);
      } else {
        showNotification('error', json.message || 'Failed to load trash items.');
      }
    } catch (err) {
      showNotification('error', 'Failed to fetch trash items.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  const handleRestore = async (item) => {
    setConfirmDialog({ 
      show: true, 
      type: 'restore', 
      itemId: item.id, 
      collectionType: item.originalCollection 
    });
  };

  const handlePermanentDelete = async (item) => {
    setConfirmDialog({ 
      show: true, 
      type: 'delete', 
      itemId: item.id, 
      collectionType: item.originalCollection 
    });
  };

  const confirmAction = async () => {
    try {
      const { type, itemId, collectionType } = confirmDialog;
      // Using a single endpoint with an action parameter
      const res = await fetch('/api/admin/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: itemId, 
          collection: collectionType,
          action: type === 'restore' ? 'restore' : 'permanent-delete'
        }),
      });
      
      const json = await res.json();
      
      if (json.success) {
        showNotification(
          'success', 
          type === 'restore' ? 'Item restored successfully.' : 'Item permanently deleted.'
        );
        // Remove the item from the list
        setItems(prev => prev.filter(i => i.id !== itemId));
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      showNotification('error', `Failed to ${confirmDialog.type === 'restore' ? 'restore' : 'permanently delete'} item.`);
    } finally {
      setConfirmDialog({ show: false, type: '', itemId: null });
    }
  };

  const filteredItems = items.filter(item => {
    const searchIn = `${item.title || ''} ${item.name || ''} ${item.client || ''} ${item.project || ''} ${item.email || ''}`.toLowerCase();
    return searchIn.includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginated = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Get collection types from available collections for the filter dropdown
  const collectionTypes = [
    { value: 'all', display: 'All Items' },
    ...Object.entries(collectionMapping).map(([key, value]) => ({
      value: value.deleted,
      display: `${value.display} Items`
    }))
  ];

  // Format deletion date
  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    const d = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return `${d.getDate()} ${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()} at ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Get display fields based on item type
  const getDisplayFields = (item) => {
    const originalCollection = item.originalCollection || '';
    
    switch (originalCollection) {
      case 'archive':
        return { 
          title: item.project || 'Untitled Project', 
          subtitle: `${item.client || 'No Client'} • ${item.category || 'Uncategorized'}`,
          detail: item.editor || 'No Editor',
          collection: collectionMapping[originalCollection]?.display || originalCollection
        };
      case 'team_members':
        return { 
          title: item.name || 'Unnamed', 
          subtitle: item.email || 'No Email',
          detail: item.role || 'No Role',
          collection: collectionMapping[originalCollection]?.display || originalCollection
        };
      default:
        return { 
          title: item.title || item.name || 'Untitled', 
          subtitle: item.subtitle || '—',
          detail: '—',
          collection: originalCollection
        };
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-md flex items-center space-x-2 shadow-lg ${notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {notification.type === 'success' ? <RiCheckLine size={20} /> : <RiAlertLine size={20} />}
          <p>{notification.message}</p>
          <button onClick={() => setNotification({ show: false, type: '', message: '' })} className="ml-auto">
            <RiCloseLine size={18} />
          </button>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.primary }}>
              {confirmDialog.type === 'restore' ? 'Restore Item' : 'Permanent Delete'}
            </h3>
            <p className="text-gray-600 mb-4">
              {confirmDialog.type === 'restore' 
                ? 'Are you sure you want to restore this item? It will be moved back to its original collection.'
                : 'Are you sure you want to permanently delete this item? This action cannot be undone.'}
            </p>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setConfirmDialog({ show: false, type: '', itemId: null })}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAction}
                className={`px-4 py-2 rounded-md text-white ${
                  confirmDialog.type === 'restore' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {confirmDialog.type === 'restore' ? 'Restore' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold" style={{ color: themeColors.primary }}>Trash</h2>
        <div className="flex gap-2">
          <div className="relative">
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/30"
            >
              {collectionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.display}
                </option>
              ))}
            </select>
            <RiFilterLine className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/30" 
            />
            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: themeColors.secondary }}></div>
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-12 border rounded-lg border-dashed">
          <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-gray-100 mb-4">
            <RiDeleteBinLine size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No items in trash</h3>
          <p className="text-gray-500">
            {searchQuery ? 'No results found for your search.' : 'When you delete items, they will appear here.'}
          </p>
        </div>
      ) : (
        <>
          {/* Items Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginated.map(item => {
              const displayData = getDisplayFields(item);
              
              return (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow relative group">
                  <div className="absolute top-0 right-0 mt-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button 
                      onClick={() => handleRestore(item)} 
                      className="p-1.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100"
                      title="Restore"
                    >
                      <RiRefreshLine size={16} />
                    </button>
                    <button 
                      onClick={() => handlePermanentDelete(item)} 
                      className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                      title="Delete Permanently"
                    >
                      <RiDeleteBinLine size={16} />
                    </button>
                  </div>
                  
                  <div 
                    className="w-10 h-10 rounded-md mb-3 flex items-center justify-center"
                    style={{ backgroundColor: themeColors.light }}
                  >
                    <span style={{ color: themeColors.primary }}>{displayData.title.charAt(0).toUpperCase()}</span>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-1 pr-16" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {displayData.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-2">
                    {displayData.subtitle}
                  </p>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="px-2 py-1 rounded-full" style={{ backgroundColor: themeColors.light, color: themeColors.primary }}>
                      {displayData.collection}
                    </span>
                    <span className="text-gray-400">
                      {formatDate(item.dateDeleted)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length}
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1}
                  className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  <RiArrowLeftSLine />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button 
                      key={pageNum} 
                      onClick={() => setCurrentPage(pageNum)} 
                      className={`px-3 py-1 rounded ${pageNum === currentPage ? 'bg-green-700 text-white' : 'hover:bg-gray-100'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages}
                  className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  <RiArrowRightSLine />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}