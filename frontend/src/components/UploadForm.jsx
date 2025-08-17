import React, { useState } from "react";

export default function UploadForm({ onTranscriptLoaded }) {
  const [transcriptText, setTranscriptText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const readFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result || "";
      setTranscriptText(text);
      onTranscriptLoaded?.(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold dark:text-gray-100">Transcript</h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {transcriptText.length} chars
        </span>
      </div>

      <div
        className={[
          "w-full border-2 border-dashed rounded-2xl p-6 transition",
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
            : "border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700",
        ].join(" ")}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          readFile(e.dataTransfer.files?.[0]);
        }}
        role="button"
        tabIndex={0}
        aria-label="Drop a .txt transcript file here"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            className="text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Drag & drop a <span className="font-medium">.txt</span> file here or
          </p>
          <label
            htmlFor="file-upload"
            className="inline-flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700"
          >
            Choose File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".txt,text/plain"
            onChange={(e) => readFile(e.target.files?.[0])}
            className="hidden"
          />
        </div>
      </div>

      {fileName && (
        <div className="rounded-lg bg-gray-50 p-3 text-gray-700 text-sm dark:bg-gray-800 dark:text-gray-200">
          Loaded: <span className="font-medium">{fileName}</span>
        </div>
      )}

      <details className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-0 open:pb-3">
        <summary className="cursor-pointer list-none px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
          Paste transcript instead
        </summary>
        <div className="px-3">
          <textarea
            value={transcriptText}
            onChange={(e) => {
              setTranscriptText(e.target.value);
              onTranscriptLoaded?.(e.target.value);
            }}
            placeholder="Paste your transcript here..."
            rows={8}
            className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm p-3 outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </details>
    </div>
  );
}
