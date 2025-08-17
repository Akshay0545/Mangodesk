import React, { useState, useEffect } from 'react';

export default function TemplateModal({ open, onClose, initial = '', onSave }) {
  const [template, setTemplate] = useState(initial);

  useEffect(() => setTemplate(initial || ''), [initial]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
      <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Template</h2>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Close template"
          >
            ✕
          </button>
        </div>

        <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-gray-100">
          Prompt Template
        </label>
        <textarea
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          rows={10}
          className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          placeholder="e.g. Summarize in 6–10 bullets. Include Action Items (Owner — Task — Due) and Decisions."
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => { onSave?.(template); onClose?.(); }}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}
