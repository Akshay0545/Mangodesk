import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import PromptInput from '../components/PromptInput';
import SummaryEditor from '../components/SummaryEditor';
import EmailShare from '../components/EmailShare';
import SummaryList from '../components/SummaryList';
import Spinner from '../components/Spinner';
import { summaryAPI } from '../services/api';

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [prompt, setPrompt] = useState('Generate a concise summary of this transcript');
  const [summaryDoc, setSummaryDoc] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async () => {
    if (!transcript.trim()) {
      alert('Please provide a transcript first');
      return;
    }
    setIsGenerating(true);
    try {
      const res = await summaryAPI.generateSummary({ transcript, prompt, title: 'Generated Summary' });
      setSummaryDoc(res.summary);
    } catch (e) {
      console.error(e);
      alert('Failed to generate summary.');
    } finally {
      setIsGenerating(false);
    }
  };

  const onPickSummary = (doc) => setSummaryDoc(doc);
  const onSaved = (updated) => setSummaryDoc(updated);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      {/* Top grid: inputs */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <UploadForm onTranscriptLoaded={setTranscript} />
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <PromptInput onPromptChange={setPrompt} defaultPrompt={prompt} />
          <div className="mt-4 flex items-center justify-end">
            <button
              onClick={generate}
              disabled={!transcript || isGenerating}
              className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-white text-sm font-medium hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? <Spinner label="Generating…" /> : 'Generate Summary'}
            </button>
          </div>
        </section>
      </div>

      {/* Bottom grid: left list, right editor/share */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_2fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <SummaryList selectedId={summaryDoc?._id} onSelect={onPickSummary} />
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          {summaryDoc ? (
            <div className="grid gap-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={summaryDoc.title || ''}
                  onChange={(e) =>
                    setSummaryDoc((prev) => ({ ...prev, title: e.target.value }))
                  }
                  onBlur={async () => {
                    try {
                      if (summaryDoc?._id) {
                        const res = await summaryAPI.updateSummary(summaryDoc._id, { title: summaryDoc.title });
                        setSummaryDoc(res.summary);
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <SummaryEditor summary={summaryDoc} onSave={onSaved} />
              <EmailShare summaryId={summaryDoc._id} onShared={setSummaryDoc} />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              Select a summary on the left or generate a new one to start editing.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
