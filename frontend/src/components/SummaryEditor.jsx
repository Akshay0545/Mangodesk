import React, { useState, useEffect } from 'react';
import { summaryAPI } from '../services/api';

export default function SummaryEditor({ summary, onSave }) {
  const [content, setContent] = useState(summary?.content || '');

  useEffect(() => {
    setContent(summary?.content || '');
  }, [summary]);

  const handleSave = async () => {
    if (!summary?._id) return;
    try {
      const res = await summaryAPI.updateSummary(summary._id, { content });
      onSave?.(res.summary); // pass updated string or doc depending on API
    } catch (err) {
      console.error('Failed to save summary:', err);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="text-lg font-semibold">Summary</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={14}
        className="mt-3 w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="pt-3">
        <button
          onClick={handleSave}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}
