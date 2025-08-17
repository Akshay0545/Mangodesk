import React, { useState } from 'react';

export default function UploadForm({ onTranscriptLoaded }) {
  const [transcriptText, setTranscriptText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const readFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result || '';
      setTranscriptText(text);
      onTranscriptLoaded?.(text);
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (e) => readFile(e.target.files?.[0]);
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); readFile(e.dataTransfer.files?.[0]); };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setTranscriptText(text);
    onTranscriptLoaded?.(text);
  };

  return (
    <div className="w-full space-y-3">
      <h2 className="text-lg font-semibold">Transcript</h2>

      <div
        className={[
          "w-full border-2 border-dashed rounded-2xl p-6 transition",
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
        ].join(' ')}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Drop a .txt transcript file here"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <svg width="44" height="44" viewBox="0 0 24 24" className="text-gray-500" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <p className="text-sm text-gray-600">
            Drag & drop a <span className="font-medium">.txt</span> file here or
          </p>
          <label
            htmlFor="file-upload"
            className="inline-flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700"
          >
            Choose File
          </label>
          <input id="file-upload" type="file" accept=".txt,text/plain" onChange={handleFileUpload} className="hidden" />
        </div>
      </div>

      {fileName && (
        <div className="rounded-lg bg-gray-50 p-3 text-gray-700 text-sm">
          Loaded: <span className="font-medium">{fileName}</span>
        </div>
      )}

      <div>
        <label htmlFor="transcript-text" className="block text-sm font-medium text-gray-700 mb-1">
          Or paste your transcript
        </label>
        <textarea
          id="transcript-text"
          value={transcriptText}
          onChange={handleTextChange}
          placeholder="Paste your transcript here..."
          rows={10}
          className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </div>
  );
}
