import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import PromptInput from '../components/PromptInput';
import SummaryEditor from '../components/SummaryEditor';
import EmailShare from '../components/EmailShare';
import { summaryAPI } from '../services/api';

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [prompt, setPrompt] = useState('Generate a concise summary of this transcript');
  const [summaryDoc, setSummaryDoc] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSummary = async () => {
    if (!transcript.trim()) {
      alert('Please provide a transcript first');
      return;
    }
    setIsGenerating(true);
    try {
      const res = await summaryAPI.generateSummary({
        transcript,
        prompt,
        title: 'Generated Summary',
      });
      // res.summary is the whole document ({ _id, content, ... })
      setSummaryDoc(res.summary);
    } catch (err) {
      console.error(err);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveFromEditor = (updated) => {
    // If API returns { ok, summary: "<string>" }, update the field only
    if (typeof updated === 'string') {
      setSummaryDoc((prev) => ({ ...prev, content: updated }));
    } else {
      // If API returns the full doc, just set it
      setSummaryDoc(updated);
    }
  };

  const handleShared = (updatedDoc) => {
    if (updatedDoc?._id) setSummaryDoc(updatedDoc);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center">
          <h1 className="text-3xl font-bold">Minutes-AI</h1>
          <p className="mt-1 text-white/90">AI-powered transcript summarization</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <UploadForm onTranscriptLoaded={setTranscript} />
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <PromptInput onPromptChange={setPrompt} defaultPrompt={prompt} />
        </section>

        <section className="flex justify-center">
          <button
            onClick={handleGenerateSummary}
            disabled={!transcript || isGenerating}
            className="inline-flex items-center rounded-lg bg-green-600 px-5 py-2.5 text-white text-sm font-medium hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGenerating ? 'Generating...' : 'Generate Summary'}
          </button>
        </section>

        {summaryDoc && (
          <>
            <section>
              <SummaryEditor summary={summaryDoc} onSave={handleSaveFromEditor} />
            </section>

            <section>
              <EmailShare summaryId={summaryDoc._id} onShared={handleShared} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
