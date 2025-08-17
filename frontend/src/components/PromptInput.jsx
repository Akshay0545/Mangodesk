import React, { useState } from 'react';

export default function PromptInput({
  onPromptChange,
  defaultPrompt = 'Generate a concise summary of this transcript',
}) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [isExpanded, setIsExpanded] = useState(false);

  const promptTemplates = [
    'Generate a concise summary of this transcript',
    'Create a detailed summary highlighting key decisions and action items',
    'Extract the main topics and key points discussed',
    'Generate a bullet-point summary of important information',
    'Create an executive summary suitable for stakeholders',
    'Summarize the transcript focusing on technical details',
    'Create a timeline of events discussed in the transcript',
  ];

  const handlePromptChange = (val) => {
    setPrompt(val);
    onPromptChange?.(val);
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="text-lg font-semibold">AI Prompt</h3>

      <div className="mt-3 space-y-2">
        <label htmlFor="custom-prompt" className="block text-sm font-medium text-gray-700">
          Customize your summary prompt
        </label>
        <textarea
          id="custom-prompt"
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          rows={3}
          placeholder="Enter your custom prompt..."
          className="w-full min-h-[80px] rounded-lg border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="button"
          onClick={() => setIsExpanded((s) => !s)}
          className="text-sm text-blue-600 hover:underline"
        >
          {isExpanded ? 'Hide' : 'Show'} Prompt Templates
        </button>

        {isExpanded && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <h4 className="mb-2 font-medium text-gray-800">Quick Templates</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {promptTemplates.map((tpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePromptChange(tpl)}
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
