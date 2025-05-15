// AdminSettings.jsx
'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { updatePassword,updateProfile } from 'firebase/auth';
export default function AdminSettings() {
  const user = auth.currentUser;
  const [menu, setMenu] = useState('general');

  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [sessionDuration, setSessionDuration] = useState('');
  const [loginTime] = useState(Date.now());

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      const seconds = Math.floor((Date.now() - loginTime) / 1000);
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      setSessionDuration(`${mins}m ${secs}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [loginTime]);

const handleSaveProfile = async () => {
  setMessage('');
  setError('');
  try {
    await updateProfile(user, { displayName });
    await user.reload(); // <- refresh data from Firebase
    setDisplayName(auth.currentUser.displayName); // <- update local state
    setMessage('Profile updated successfully.');
  } catch (err) {
    setError('Failed to update profile.');
  }
};


  const handleChangePassword = async () => {
    setMessage('');
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    try {
      await updatePassword(user, password);
      setMessage('Password updated successfully.');
    } catch (err) {
      setError('Failed to update password.');
    }
  };

  const sidebarOptions = [
    { id: 'general', label: 'General' },
    { id: 'password', label: 'Change Password' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="md:w-1/4 flex flex-col items-center">
        <img
          src={user?.photoURL || '/placeholder-avatar.png'}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-2 border"
        />
        <h2 className="text-lg font-medium text-gray-700 mb-1">
          {user?.displayName || 'Admin User'}
        </h2>
        <p className="text-sm text-gray-500 mb-4">{user?.email}</p>

        <ul className="w-full text-center">
          {sidebarOptions.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setMenu(item.id)}
                className={`w-full py-2 my-1 rounded text-sm font-medium transition-all ${
                  menu === item.id
                    ? 'bg-green-100 text-green-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="md:w-3/4 bg-white p-6 rounded-xl shadow border border-gray-100">
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        {message && <p className="text-sm text-green-600 mb-3">{message}</p>}

        {menu === 'general' && (
          <>
            <h3 className="text-xl font-semibold mb-4 text-green-900">Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="text"
                  value={user?.email}
                  disabled
                  className="w-full p-3 border rounded-md bg-gray-100 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Current Time</label>
                <input
                  type="text"
                  value={currentTime}
                  disabled
                  className="w-full p-3 border rounded-md bg-gray-100 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Session Duration</label>
                <input
                  type="text"
                  value={sessionDuration}
                  disabled
                  className="w-full p-3 border rounded-md bg-gray-100 text-gray-500"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                className="mt-4 py-2 px-4 rounded text-white font-medium"
                style={{ background: 'linear-gradient(to right, #1a8c00, #43e794)' }}
              >
                Save Changes
              </button>
            </div>
          </>
        )}

        {menu === 'password' && (
          <>
            <h3 className="text-xl font-semibold mb-4 text-green-900">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <button
                onClick={handleChangePassword}
                className="mt-4 py-2 px-4 rounded text-white font-medium"
                style={{ background: 'linear-gradient(to right, #1a8c00, #43e794)' }}
              >
                Update Password
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
