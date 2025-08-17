import React, { useState } from 'react';
import { summaryAPI } from '../services/api';

export default function EmailShare({ summaryId, onShared }) {
  const [emails, setEmails] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shared, setShared] = useState([]);

  const isValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const share = async (e) => {
    e.preventDefault();
    const list = emails.split(',').map((s) => s.trim()).filter((s) => s && isValid(s));
    if (!list.length) {
      alert('Please enter at least one valid email address.');
      return;
    }
    setIsSharing(true);
    try {
      const res = await summaryAPI.shareSummary(summaryId, list);
      setShared((prev) => [...prev, ...list]);
      setEmails('');
      onShared?.(res.summary);
    } catch (err) {
      console.error(err);
      alert('Failed to share summary.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      <h2 className="text-lg font-semibold">Share via Email</h2>
      <form onSubmit={share} className="space-y-2">
        <input
          type="text"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          placeholder="email1@example.com, email2@example.com"
          className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={!summaryId || isSharing}
          className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-white text-sm font-medium hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSharing ? 'Sharing…' : 'Share Summary'}
        </button>
      </form>

      {shared.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="text-sm text-gray-700">
            Shared with: <span className="font-medium">{shared.join(', ')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
