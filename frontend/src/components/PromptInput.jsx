import React, { useState } from 'react';

export default function PromptInput({ onPromptChange, defaultPrompt = 'Generate a concise summary of this transcript' }) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [showTemplates, setShowTemplates] = useState(false);

  const promptTemplates = [
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
    <div className="w-full">
      <h2 className="text-lg font-semibold">AI Prompt</h2>
      <div className="mt-2 space-y-2">
        <textarea
          value={prompt}
          onChange={(e) => apply(e.target.value)}
          rows={3}
          placeholder="Enter your custom prompt..."
          className="w-full min-h-[80px] rounded-lg border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="button"
          onClick={() => setShowTemplates((s) => !s)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showTemplates ? 'Hide' : 'Show'} Prompt Templates
        </button>

        {showTemplates && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <h4 className="mb-2 font-medium text-gray-800">Quick Templates</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {promptTemplates.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => apply(tpl)}
                  className="w-full text-left rounded-lg border border-gray-200 bg-white p-2 text-sm hover:bg-gray-50"
                >
                  {tpl}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
