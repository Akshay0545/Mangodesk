import React from 'react';

export default function Spinner({ label }) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-gray-600">
      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-75" d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" />
      </svg>
      {label || 'Loading...'}
    </div>
  );
}
