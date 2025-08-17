import React, { useState } from 'react';
import { summaryAPI } from '../services/api';
import { useToast } from './Toast';

export default function EmailShare({ summaryId, onShared }) {
  const [emails, setEmails] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shared, setShared] = useState([]);
  const toast = useToast();

  const isValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const share = async (e) => {
    e.preventDefault();
    const list = emails.split(',').map((s) => s.trim()).filter((s) => s && isValid(s));
    if (!list.length) {
      toast.push('Enter at least one valid email', 'error');
      return;
    }
    setIsSharing(true);
    try {
      const res = await summaryAPI.shareSummary(summaryId, list);
      setShared((prev) => [...prev, ...list]);
      setEmails('');
      onShared?.(res.summary);
      toast.push('Shared successfully', 'success');
    } catch (err) {
      console.error(err);
      toast.push('Failed to share', 'error');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      <h2 className="text-lg font-semibold dark:text-gray-100">Share via Email</h2>
      <form onSubmit={share} className="space-y-2">
        <input
          type="text"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          placeholder="email1@example.com, email2@example.com"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-400 dark:text-gray-100"
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
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3">
          <div className="text-sm text-gray-700 dark:text-gray-200">
            Shared with: <span className="font-medium">{shared.join(', ')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
