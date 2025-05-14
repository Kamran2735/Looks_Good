'use client';

import { useState, useEffect } from 'react';
import {
  RiSearchLine,
  RiAddLine,
  RiEdit2Line,
  RiDeleteBinLine,
  RiCloseLine,
  RiCheckLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiAlertLine,
} from 'react-icons/ri';

const themeColors = {
  primary: '#0c4000',
  secondary: '#1a8c00',
  accent: '#43e794',
  light: '#cdf1d8',
  dark: '#072500',
  white: '#ffffff',
};

export default function AdminArchive({ modalOpen = false, setModalOpen = () => {} }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState('add');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    category: '',
    client: '',
    date: '',
    description: '',
    editor: '',
    project: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/archive');
        const json = await res.json();
        if (json.success) {
          setItems(json.data);
        } else {
          showNotification('error', json.message || 'Failed to load archive items.');
        }
      } catch (err) {
        showNotification('error', 'Failed to fetch archive items.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  const openAddModal = () => {
    setFormData({ category: '', client: '', date: '', description: '', editor: '', project: '' });
    setModalMode('add');
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setFormData({ ...item });
    setSelectedItem(item);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeleteItem = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`/api/admin/archive/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setItems(prev => prev.filter(i => i.id !== id));
        showNotification('success', 'Item deleted.');
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      showNotification('error', 'Failed to delete item.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const url = modalMode === 'add' ? '/api/admin/archive' : `/api/admin/archive/${selectedItem.id}`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        showNotification('success', `Item ${modalMode === 'add' ? 'added' : 'updated'} successfully.`);
        setModalOpen(false);
        const refetch = await fetch('/api/admin/archive');
        const data = await refetch.json();
        setItems(data.data);
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      showNotification('error', `Failed to ${modalMode === 'add' ? 'add' : 'update'} item.`);
    }
  };

  const filteredItems = items.filter(item =>
    item.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.project?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.editor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginated = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-md flex items-center space-x-2 shadow-lg ${notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {notification.type === 'success' ? <RiCheckLine size={20} /> : <RiAlertLine size={20} />}
          <p>{notification.message}</p>
          <button onClick={() => setNotification({ show: false, type: '', message: '' })} className="ml-auto">
            <RiCloseLine size={18} />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold" style={{ color: themeColors.primary }}>Archive Management</h2>
        <div className="flex gap-2">
          <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/30" />
          <button onClick={openAddModal} className="px-4 py-2 rounded-md text-white" style={{ backgroundColor: themeColors.secondary }}>
            <RiAddLine className="inline-block mr-1" /> Add
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: themeColors.secondary }}></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {['Client', 'Category', 'Project', 'Editor', 'Date', 'Actions'].map(header => (
                  <th key={header} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{item.client}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2">{item.project}</td>
                  <td className="px-4 py-2">{item.editor}</td>
<td className="px-4 py-2">
  {item.date?.seconds
    ? (() => {
        const d = new Date(item.date.seconds * 1000);
        return `${d.getDate()} ${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()} at ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} UTC+5`;
      })()
    : '—'}
</td>

                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => openEditModal(item)} className="p-1 rounded hover:bg-gray-100 transition-colors" title="Edit">
                        <RiEdit2Line size={18} style={{ color: themeColors.secondary }} />
                      </button>
                      <button onClick={() => handleDeleteItem(item.id)} className="p-1 rounded hover:bg-gray-100 transition-colors" title="Delete">
                        <RiDeleteBinLine size={18} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length}</div>
          <div className="flex gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><RiArrowLeftSLine /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded ${page === currentPage ? 'bg-green-700 text-white' : 'hover:bg-gray-100'}`}>{page}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><RiArrowRightSLine /></button>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <RiCloseLine size={24} />
            </button>
            <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.primary }}>{modalMode === 'add' ? 'Add New Archive' : 'Edit Archive Item'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {['client', 'project', 'editor', 'category', 'date', 'description'].map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize mb-1">{field}</label>
                  {field === 'description' ? (
                    <textarea name={field} value={formData[field]} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
                  ) : (
                    <input type={field === 'date' ? 'date' : 'text'} name={field} value={formData[field]} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  )}
                </div>
              ))}
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md text-white" style={{ backgroundColor: themeColors.secondary }}>
                  {modalMode === 'add' ? 'Add' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}