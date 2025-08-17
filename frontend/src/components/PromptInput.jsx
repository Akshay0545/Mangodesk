import React, { useState } from 'react';

export default function PromptInput({
  onPromptChange,
  defaultPrompt = 'Generate a concise summary of this transcript',
}) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [showTemplates, setShowTemplates] = useState(false);

  const templates = [
    'Generate a concise summary of this transcript',
    'Create an executive summary with 6–10 bullets',
    'Only output Action Items (Owner — Task — Due)',
    'Highlight Decisions and Risks only',
    'Create a timeline of events discussed',
    'Summarize focusing on technical details',
  ];

  const apply = (val) => {
    setPrompt(val);
    onPromptChange?.(val);
  };

  return (
    <div className="w-full space-y-2">
      {/* <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Prompt</h2> */}

      <textarea
        value={prompt}
        onChange={(e) => apply(e.target.value)}
        rows={3}
        placeholder="Enter your custom prompt..."
        className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400
                   dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
      />

      <button
        type="button"
        onClick={() => setShowTemplates((s) => !s)}
        className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        {showTemplates ? 'Hide' : 'Show'} templates
      </button>

      {showTemplates && (
        <div className="grid gap-2 sm:grid-cols-2">
          {templates.map((tpl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => apply(tpl)}
              className="w-full text-left rounded-lg border p-2 text-sm
                         border-gray-200 bg-white text-gray-800 hover:bg-gray-50
                         dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              {tpl}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
