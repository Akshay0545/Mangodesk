import React, { useState } from 'react';

const UploadForm = ({ onTranscriptLoaded }) => {
  const [transcriptText, setTranscriptText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        setTranscriptText(text);
        onTranscriptLoaded(text);
      };
      reader.readAsText(file);
    }
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setTranscriptText(text);
    onTranscriptLoaded(text);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/plain') {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        setTranscriptText(text);
        onTranscriptLoaded(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="upload-form">
      <h2>Upload Transcript</h2>
      
      <div 
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="drop-zone-content">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <p>Drag & drop transcript file here or <span className="browse-link">browse</span></p>
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="file-input"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="file-label">
            Choose File
          </label>
        </div>
      </div>

      {fileName && (
        <div className="file-info">
          <p>Loaded: {fileName}</p>
        </div>
      )}

      <div className="text-input-section">
        <label htmlFor="transcript-text">Or paste your transcript:</label>
        <textarea
          id="transcript-text"
          value={transcriptText}
          onChange={handleTextChange}
          placeholder="Paste your transcript here..."
          rows={10}
        />
      </div>

      <style jsx>{`
        .upload-form {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
        }

        .drop-zone {
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
        }

        .drop-zone.dragging {
          border-color: #007bff;
          background-color: #f8f9fa;
        }

        .drop-zone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .file-input {
          display: none;
        }

        .file-label {
          background-color: #007bff;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .file-label:hover {
          background-color: #0056b3;
        }

        .text-input-section {
          margin-top: 2rem;
        }

        .text-input-section label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }

        textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-family: inherit;
          resize: vertical;
        }

        .file-info {
          background-color: #f8f9fa;
          padding: 1rem;
          border-radius: 4px;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
};

export default UploadForm;
