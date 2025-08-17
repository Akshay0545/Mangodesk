// import React, { useEffect, useState } from 'react';
// import { summaryAPI } from '../services/api';
// import Spinner from './Spinner';

// export default function SummaryList({ selectedId, onSelect }) {
//   const [items, setItems] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const load = async () => {
//     setLoading(true);
//     try {
//       const list = await summaryAPI.getAllSummaries();
//       setItems(list);
//     } catch (e) {
//       console.error(e);
//       setItems([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { load(); }, []);

//   return (
//     <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
//       <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3">
//         <h3 className="text-sm font-semibold dark:text-gray-100">Recent Summaries</h3>
//         <button onClick={load} className="text-xs text-blue-600 hover:underline">Refresh</button>
//       </div>
//       {loading ? (
//         <div className="px-4 py-8"><Spinner label="Loading summaries…" /></div>
//       ) : (!items || items.length === 0) ? (
//         <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No summaries yet. Generate one to get started.</div>
//       ) : (
//         <ul className="max-h-[360px] divide-y divide-gray-100 dark:divide-gray-800 overflow-auto">
//           {items.map((s) => (
//             <li
//               key={s._id}
//               role="button"
//               tabIndex={0}
//               onClick={() => onSelect?.(s)}
//               onKeyDown={(e)=>{ if (e.key === 'Enter') onSelect?.(s); }}
//               className={[
//                 "cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-400",
//                 selectedId === s._id ? "bg-blue-50 dark:bg-blue-950/30" : ""
//               ].join(' ')}
//             >
//               <div className="flex items-start justify-between gap-3">
//                 <div>
//                   <div className="text-sm font-medium line-clamp-1 dark:text-gray-100">{s.title || 'Untitled'}</div>
//                   <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
//                     {new Date(s.createdAt).toLocaleString()}
//                   </div>
//                 </div>
//                 <span className="text-[10px] text-gray-500 dark:text-gray-400">#{s._id.slice(-6)}</span>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
