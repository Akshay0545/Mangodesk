import React, { useEffect, useState, useMemo } from 'react';
import { summaryAPI } from '../services/api';

export default function SummaryEditor({ summary, onSave }) {
  const [content, setContent] = useState(summary?.content || '');
  const [saving, setSaving] = useState(false);

  const wordCount = useMemo(() => (content ? content.trim().split(/\s+/).length : 0), [content]);

  useEffect(() => {
    setContent(summary?.content || '');
  }, [summary]);

  const handleSave = async () => {
    if (!summary?._id) return;
    setSaving(true);
    try {
      const res = await summaryAPI.updateSummary(summary._id, { content });
      onSave?.(res.summary);
    } catch (e) {
      console.error('Failed to save summary:', e);
      alert('Failed to save summary. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Summary</h2>
        <span className="text-xs text-gray-500">{wordCount} words</span>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={16}
        className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="flex items-center justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}
