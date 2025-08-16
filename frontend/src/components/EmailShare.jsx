import React, { useState } from 'react';
import { summaryAPI } from '../services/api';

const EmailShare = ({ summaryId, onShared }) => {
  const [emails, setEmails] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [sharedEmails, setSharedEmails] = useState([]);

  const handleShare = async (e) => {
    e.preventDefault();
    
    const emailList = emails
      .split(',')
      .map(email => email.trim())
      .filter(email => email && isValidEmail(email));

    if (emailList.length === 0) {
      alert('Please enter at least one valid email address');
      return;
    }

    setIsSharing(true);
    try {
      const result = await summaryAPI.shareSummary(summaryId, emailList);
      setSharedEmails([...sharedEmails, ...emailList]);
      setEmails('');
      onShared(result.summary);
      alert(`Summary shared with ${emailList.length} email(s)!`);
    } catch (error) {
      console.error('Failed to share summary:', error);
      alert('Failed to share summary. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="email-share">
      <h3>Share Summary via Email</h3>
      
      <form onSubmit={handleShare} className="share-form">
        <div className="form-group">
          <label htmlFor="emails">Email addresses (comma-separated):</label>
          <input
            type="text"
            id="emails"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="email1@example.com, email2@example.com"
            className="email-input"
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSharing}
            className="share-btn"
          >
            {isSharing ? 'Sharing...' : 'Share Summary'}
          </button>
        </div>

        {sharedEmails.length > 0 && (
          <div className="shared-list">
            <h4>Shared with:</h4>
            <ul>
              {sharedEmails.map((email, index) => (
                <li key={index}>{email}</li>
              ))}
            </ul>
          </div>
        )}
      </form>

      <style jsx>{`
        .email-share {
          max-width: 600px;
          margin: 2rem auto;
          padding: 1.5rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background-color: white;
        }

        h3 {
          margin-top: 0;
          color: #333;
        }

        .share-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        label {
          margin-bottom: 0.5rem;
          font-weight: bold;
          color: #555;
        }

        .email-input {
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }

        .form-actions {
          margin-top: 1rem;
        }

        .share-btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s;
        }

        .share-btn:hover:not(:disabled) {
          background-color: #0056b3;
        }

        .share-btn:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }

        .shared-list {
          margin-top: 1rem;
          padding: 1rem;
          background-color: #f8f9fa;
          border-radius: 4px;
        }

        .shared-list h4 {
          margin-top: 0;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .shared-list ul {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }

        .shared-list li {
          padding: 0.25rem 0;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default EmailShare;
