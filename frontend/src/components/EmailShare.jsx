import React, { useState } from 'react';
import { summaryAPI } from '../services/api';

export default function EmailShare({ summaryId, onShared }) {
  const [emails, setEmails] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [sharedEmails, setSharedEmails] = useState([]);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleShare = async (e) => {
    e.preventDefault();

    const emailList = emails
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x && isValidEmail(x));

    if (emailList.length === 0) {
      alert('Please enter at least one valid email address');
      return;
    }

    setIsSharing(true);
    try {
      const result = await summaryAPI.shareSummary(summaryId, emailList);
      setSharedEmails((prev) => [...prev, ...emailList]);
      setEmails('');
      onShared?.(result.summary);
    } catch (err) {
      console.error(err);
      alert('Failed to share summary. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="text-lg font-semibold">Share Summary via Email</h3>

      <form onSubmit={handleShare} className="mt-3 space-y-3">
        <div>
          <label htmlFor="emails" className="block text-sm font-medium text-gray-700 mb-1">
            Email addresses (comma-separated)
          </label>
          <input
            id="emails"
            type="text"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="email1@example.com, email2@example.com"
            className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={isSharing}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSharing ? 'Sharing...' : 'Share Summary'}
          </button>
        </div>

        {sharedEmails.length > 0 && (
          <div className="rounded-lg bg-gray-50 p-3">
            <h4 className="font-medium text-gray-800 mb-1">Shared with:</h4>
            <ul className="text-sm text-gray-600 list-disc ml-5">
              {sharedEmails.map((email, i) => (
                <li key={`${email}-${i}`}>{email}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}
