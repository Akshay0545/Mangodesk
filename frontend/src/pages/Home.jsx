import React, { useState, useEffect } from 'react';
import UploadForm from '../components/UploadForm';
import PromptInput from '../components/PromptInput';
import SummaryEditor from '../components/SummaryEditor';
import EmailShare from '../components/EmailShare';
import { summaryAPI } from '../services/api';

const Home = () => {
  const [transcript, setTranscript] = useState('');
  const [prompt, setPrompt] = useState('Generate a concise summary of this transcript');
  const [summary, setSummary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTranscriptLoaded = (text) => {
    setTranscript(text);
  };

  const handlePromptChange = (newPrompt) => {
    setPrompt(newPrompt);
  };

  const handleGenerateSummary = async () => {
    if (!transcript.trim()) {
      alert('Please provide a transcript first');
      return;
    }

    setIsGenerating(true);
    try {
      const newSummary = await summaryAPI.generateSummary({
        transcript,
        prompt,
        title: 'Generated Summary'
      });
      setSummary(newSummary.summary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSummaryUpdate = (updatedSummary) => {
    setSummary(updatedSummary);
  };

  return (
    <div className="home">
      <header className="app-header">
        <h1>MangoDesk</h1>
        <p>AI-powered transcript summarization tool</p>
      </header>

      <main className="main-content">
        <section className="upload-section">
          <UploadForm onTranscriptLoaded={handleTranscriptLoaded} />
        </section>

        <section className="prompt-section">
          <PromptInput 
            onPromptChange={handlePromptChange}
            defaultPrompt={prompt}
          />
        </section>

        <section className="generate-section">
          <button 
            onClick={handleGenerateSummary}
            disabled={!transcript || isGenerating}
            className="generate-btn"
          >
            {isGenerating ? 'Generating...' : 'Generate Summary'}
          </button>
        </section>

        {summary && (
          <>
            <section className="summary-section">
              <SummaryEditor 
                summary={summary} 
                onUpdate={handleSummaryUpdate}
              />
            </section>

            <section className="share-section">
              <EmailShare 
                summaryId={summary._id}
                onShared={handleSummaryUpdate}
              />
            </section>
          </>
        )}
      </main>

      <style jsx>{`
        .home {
          min-height: 100vh;
          background-color: #f5f5f5;
        }

        .app-header {
          background-color: #007bff;
          color: white;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .app-header h1 {
          margin: 0;
          font-size: 2.5rem;
        }

        .app-header p {
          margin: 0.5rem 0 0;
          opacity: 0.9;
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .upload-section,
        .prompt-section,
        .generate-section,
        .summary-section,
        .share-section {
          margin-bottom: 2rem;
        }

        .generate-btn {
          display: block;
          margin: 0 auto;
          background-color: #28a745;
          color: white;
          border: none;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .generate-btn:hover:not(:disabled) {
          background-color: #218838;
        }

        .generate-btn:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 1rem;
          }
          
          .app-header {
            padding: 1rem;
          }
          
          .app-header h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
