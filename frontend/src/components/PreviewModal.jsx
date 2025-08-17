import React from 'react';

export default function PreviewModal({ open, onClose, title = 'Preview', body = '' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
      <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Close preview"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[65vh] overflow-auto rounded-lg border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
          <pre className="whitespace-pre-wrap break-words">{body || 'No content.'}</pre>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
