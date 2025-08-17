import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import PromptInput from '../components/PromptInput';
import SummaryEditor from '../components/SummaryEditor';
import EmailShare from '../components/EmailShare';
import Spinner from '../components/Spinner';
import { summaryAPI } from '../services/api';
import { useToast } from '../components/Toast';
import PreviewModal from '../components/PreviewModal';
import TemplateModal from '../components/TemplateModal';

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [prompt, setPrompt] = useState('Generate a concise summary of this transcript');
  const [summaryDoc, setSummaryDoc] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [openPreview, setOpenPreview] = useState(false);
  const [openTemplate, setOpenTemplate] = useState(false);

  const toast = useToast();

  const generate = async () => {
    if (!transcript.trim()) {
      toast.push('Please provide a transcript first', 'error');
      return;
    }
    setIsGenerating(true);
    try {
      const res = await summaryAPI.generateSummary({
        transcript,
        prompt,
        title: summaryDoc?.title || 'Generated Summary',
      });
      setSummaryDoc(res.summary);
      toast.push('Summary generated', 'success');
    } catch (e) {
      console.error(e);
      toast.push('Failed to generate summary', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const onSaved = (updated) => setSummaryDoc(updated);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      {/* Top: transcript / prompt */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold dark:text-gray-100">Transcript</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpenTemplate(true)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                title="Open prompt templates"
              >
                Templates
              </button>
            </div>
          </div>
          <UploadForm onTranscriptLoaded={setTranscript} />
        </section>

        <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold dark:text-gray-100">AI Prompt</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpenTemplate(true)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                title="Edit prompt template"
              >
                Edit Template
              </button>
            </div>
          </div>

          <PromptInput onPromptChange={setPrompt} defaultPrompt={prompt} />

          <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpenPreview(true)}
              disabled={!summaryDoc?.content}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              title="Preview current summary"
            >
              Preview
            </button>

            <button
              onClick={generate}
              disabled={!transcript || isGenerating}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-white text-sm font-medium hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? <Spinner label="Generating…" /> : 'Generate Summary'}
            </button>
          </div>
        </section>
      </div>

      {/* Bottom: editor & share (render ONLY when a summary exists) */}
      {summaryDoc && (
        <div className="mt-6">
          <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
            <div className="grid gap-6">
              {/* Title (auto-save on blur) */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  value={summaryDoc.title || ''}
                  onChange={(e) => setSummaryDoc((prev) => ({ ...prev, title: e.target.value }))}
                  onBlur={async () => {
                    try {
                      if (summaryDoc?._id) {
                        const res = await summaryAPI.updateSummary(summaryDoc._id, {
                          title: summaryDoc.title,
                        });
                        setSummaryDoc(res.summary);
                        toast.push('Title saved', 'success', 1200);
                      }
                    } catch (e) {
                      console.error(e);
                      toast.push('Failed to save title', 'error');
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 dark:text-gray-100"
                />
              </div>

              {/* Editor */}
              <SummaryEditor summary={summaryDoc} onSave={onSaved} />

              {/* Share */}
              <EmailShare summaryId={summaryDoc._id} onShared={setSummaryDoc} />
            </div>
          </section>
        </div>
      )}

      {/* Modals */}
      <PreviewModal
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        title={summaryDoc?.title || 'Preview'}
        body={summaryDoc?.content || ''}
      />

      <TemplateModal
        open={openTemplate}
        onClose={() => setOpenTemplate(false)}
        initial={prompt}
        onSave={(val) => {
          setPrompt(val);
          toast.push('Template applied', 'success', 1200);
        }}
      />
    </main>
  );
}
