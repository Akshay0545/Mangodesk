import React, { useState } from 'react';

const PromptInput = ({ onPromptChange, defaultPrompt = "Generate a concise summary of this transcript" }) => {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [isExpanded, setIsExpanded] = useState(false);

  const promptTemplates = [
    "Generate a concise summary of this transcript",
    "Create a detailed summary highlighting key decisions and action items",
    "Extract the main topics and key points discussed",
    "Generate a bullet-point summary of important information",
    "Create an executive summary suitable for stakeholders",
    "Summarize the transcript focusing on technical details",
    "Create a timeline of events discussed in the transcript"
  ];

  const handlePromptChange = (newPrompt) => {
    setPrompt(newPrompt);
    onPromptChange(newPrompt);
  };

  return (
    <div className="prompt-input">
      <h3>AI Prompt</h3>
      
      <div className="prompt-section">
        <label htmlFor="custom-prompt">Customize your summary prompt:</label>
        <textarea
          id="custom-prompt"
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Enter your custom prompt..."
          rows={3}
        />
        
        <button 
          className="toggle-templates"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Hide' : 'Show'} Prompt Templates
        </button>
        
        {isExpanded && (
          <div className="prompt-templates">
            <h4>Quick Templates:</h4>
            {promptTemplates.map((template, index) => (
              <button
                key={index}
                className="template-button"
                onClick={() => handlePromptChange(template)}
              >
                {template}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .prompt-input {
          max-width: 600px;
          margin: 2rem auto;
          padding: 1.5rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background-color: #f9f9f9;
        }

        h3 {
          margin-top: 0;
          color: #333;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
          color: #555;
        }

        textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-family: inherit;
          resize: vertical;
          min-height: 80px;
        }

        .toggle-templates {
          background: none;
          border: none;
          color: #007bff;
          cursor: pointer;
          text-decoration: underline;
          margin: 0.5rem 0;
          padding: 0;
        }

        .prompt-templates {
          margin-top: 1rem;
          padding: 1rem;
          background-color: white;
          border-radius: 4px;
          border: 1px solid #e0e0e0;
        }

        .prompt-templates h4 {
          margin-top: 0;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .template-button {
          display: block;
          width: 100%;
          text-align: left;
          padding: 0.5rem;
          margin: 0.25rem 0;
          background: none;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .template-button:hover {
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default PromptInput;
