'use client';

import { useState } from 'react';

export default function DuplicateButton({ sourceId }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDuplicate = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId }), // no newId needed
      });

      const result = await res.json();

      if (result.success) {
        setMessage('✅ Member duplicated with auto ID!');
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (err) {
      setMessage(`❌ Request failed: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <div>
      <button
        onClick={handleDuplicate}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        disabled={loading}
      >
        {loading ? 'Duplicating...' : 'Duplicate Member'}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
