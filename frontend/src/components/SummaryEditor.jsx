import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { summaryAPI } from '../services/api';
import useDebouncedEffect from '../hooks/useDebouncedEffect';
import { useToast } from './Toast';

function mdToHtml(md = '') {
  return md
    .replace(/^### (.*)$/gm, '<h3 class="mt-3 mb-1 font-semibold">$1</h3>')
    .replace(/^## (.*)$/gm, '<h2 class="mt-4 mb-2 text-lg font-semibold">$1</h2>')
    .replace(/^# (.*)$/gm, '<h1 class="mt-4 mb-2 text-xl font-bold">$1</h1>')
    .replace(/^- (.*)$/gm, '<li>$1</li>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br/>');
}

export default function SummaryEditor({ summary, onSave }) {
  const [content, setContent] = useState(summary?.content || '');
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('edit'); // 'edit' | 'preview'
  const toast = useToast();

  const wordCount = useMemo(() => (content ? content.trim().split(/\s+/).length : 0), [content]);

  useEffect(() => setContent(summary?.content || ''), [summary]);

  const doSave = useCallback(async () => {
    if (!summary?._id) return;
    setSaving(true);
    try {
      const res = await summaryAPI.updateSummary(summary._id, { content });
      onSave?.(res.summary);
      toast.push('Saved', 'success', 1500);
    } catch (e) {
      console.error('Failed to save summary:', e);
      toast.push('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  }, [content, onSave, summary?._id, toast]);

  // Autosave after 1.2s idle
  useDebouncedEffect(() => { if (content !== summary?.content) doSave(); }, [content], 1200);

  // Cmd/Ctrl+S manual save
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        doSave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doSave]);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold dark:text-gray-100">Summary</h2>
        <div className="flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300">
          <span>{wordCount} words</span>
          <span className="select-none">{saving ? 'Saving…' : 'Saved'}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1">
        {['edit', 'preview'].map(k => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={[
              "rounded-md px-3 py-1.5 text-sm",
              tab === k
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            ].join(' ')}
          >
            {k === 'edit' ? 'Edit' : 'Preview'}
          </button>
        ))}
      </div>

      {tab === 'edit' ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={16}
          className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-400 dark:text-gray-100"
        />
      ) : (
        <div
          // 🔧 high contrast text in preview
          className="prose max-w-none rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-sm text-gray-800 dark:text-gray-100 dark:prose-invert"
        >
          <div dangerouslySetInnerHTML={{ __html: mdToHtml(content) }} />
        </div>
      )}

      {/* Sticky save on small screens */}
      <div className="md:hidden sticky bottom-3 flex justify-end">
        <button
          onClick={doSave}
          className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-white shadow-lg"
        >
          Save
        </button>
      </div>

      {/* Desktop save */}
      <div className="hidden md:flex items-center justify-end">
        <button
          onClick={doSave}
          disabled={saving}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}
