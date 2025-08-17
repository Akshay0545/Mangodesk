import React, { useEffect, useState } from 'react';
import { summaryAPI } from '../services/api';
import Spinner from './Spinner';

export default function SummaryList({ selectedId, onSelect }) {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const list = await summaryAPI.getAllSummaries();
      setItems(list);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <Spinner label="Loading summaries…" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold">Recent Summaries</h3>
        <button
          onClick={load}
          className="text-xs text-blue-600 hover:underline"
        >
          Refresh
        </button>
      </div>
      {(!items || items.length === 0) ? (
        <div className="px-4 py-8 text-center text-sm text-gray-500">No summaries yet. Generate one to get started.</div>
      ) : (
        <ul className="max-h-[360px] divide-y overflow-auto">
          {items.map((s) => (
            <li
              key={s._id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect?.(s)}
              className={[
                "cursor-pointer px-4 py-3 hover:bg-gray-50",
                selectedId === s._id ? "bg-blue-50" : ""
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium line-clamp-1">{s.title || 'Untitled'}</div>
                  <div className="mt-0.5 text-xs text-gray-500">
                    {new Date(s.createdAt).toLocaleString()}
                  </div>
                </div>
                <span className="text-[10px] text-gray-500">#{s._id.slice(-6)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
