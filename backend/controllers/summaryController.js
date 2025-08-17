const Summary = require('../models/Summary');
const AIService = require('../utils/aiService');
const EmailService = require('../utils/emailService');
const crypto = require('crypto');

const aiService = new AIService();
const emailService = new EmailService();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const summaryController = {
  // Generate new summary
  async generateSummary(req, res) {
    try {
      const { transcript, prompt, title } = req.body;

      if (!transcript || typeof transcript !== 'string' || !transcript.trim()) {
        return res.status(400).json({ error: 'Transcript is required' });
      }

      const summaryContent = await aiService.generateSummary(transcript, prompt);

      const summary = new Summary({
        title: title?.trim() || 'Untitled Summary',
        content: summaryContent,                  // <- store ONLY the summary here
        originalTranscript: transcript,          // raw transcript stored separately
        prompt: prompt || 'Generate a concise summary of this transcript'
      });

      await summary.save();

      return res.status(201).json({
        message: 'Summary generated successfully',
        summary
      });
    } catch (error) {
      console.error('Generate summary error:', error);
      return res.status(500).json({ error: 'Failed to generate summary' });
    }
  },

  // Get all summaries
  async getAllSummaries(req, res) {
    try {
      const summaries = await Summary.find().sort({ createdAt: -1 });
      return res.json(summaries);
    } catch (error) {
      console.error('Get summaries error:', error);
      return res.status(500).json({ error: 'Failed to fetch summaries' });
    }
  },

  // Get single summary
  async getSummary(req, res) {
    try {
      const { id } = req.params;
      const summary = await Summary.findById(id);
      if (!summary) return res.status(404).json({ error: 'Summary not found' });
      return res.json(summary);
    } catch (error) {
      console.error('Get summary error:', error);
      return res.status(500).json({ error: 'Failed to fetch summary' });
    }
  },

  // Update summary (only provided fields)
  async updateSummary(req, res) {
    try {
      const { id } = req.params;
      const updates = {};
      if (typeof req.body.content === 'string') updates.content = req.body.content;
      if (typeof req.body.title === 'string') updates.title = req.body.title;

      if (!Object.keys(updates).length) {
        return res.status(400).json({ error: 'Nothing to update' });
      }

      const summary = await Summary.findByIdAndUpdate(id, { $set: updates }, { new: true });
      if (!summary) return res.status(404).json({ error: 'Summary not found' });

      return res.json({ message: 'Summary updated successfully', summary });
    } catch (error) {
      console.error('Update summary error:', error);
      return res.status(500).json({ error: 'Failed to update summary' });
    }
  },

  // Delete summary
  async deleteSummary(req, res) {
    try {
      const { id } = req.params;
      const summary = await Summary.findByIdAndDelete(id);
      if (!summary) return res.status(404).json({ error: 'Summary not found' });
      return res.json({ message: 'Summary deleted successfully' });
    } catch (error) {
      console.error('Delete summary error:', error);
      return res.status(500).json({ error: 'Failed to delete summary' });
    }
  },

  // Share summary via email
  async shareSummary(req, res) {
    try {
      const { id } = req.params;
      const raw = req.body.emails;

      // Accept array or comma-separated string
      const emails = Array.isArray(raw)
        ? raw
        : String(raw || '')
            .split(',')
            .map(e => e.trim())
            .filter(Boolean);

      if (!emails.length) {
        return res.status(400).json({ error: 'At least one email is required' });
      }
      const invalid = emails.filter(e => !EMAIL_RE.test(e));
      if (invalid.length) {
        return res.status(400).json({ error: `Invalid emails: ${invalid.join(', ')}` });
      }

      const summary = await Summary.findById(id);
      if (!summary) {
        return res.status(404).json({ error: 'Summary not found' });
      }

      // Generate share token if not exists
      if (!summary.shareToken) {
        summary.shareToken = crypto.randomBytes(16).toString('hex');
      }

      // De-duplicate; only add new recipients
      const existing = new Set((summary.sharedWith || []).map(s => s.email));
      const toAdd = emails.filter(e => !existing.has(e.toLowerCase()));
      if (toAdd.length) {
        summary.sharedWith.push(...toAdd.map(email => ({ email: email.toLowerCase() })));
        summary.isShared = true;
        await summary.save();
      }

      // Public URL (prefer frontend domain)
      const FE_BASE = process.env.FRONTEND_PUBLIC_BASE_URL?.trim();
      const BE_BASE = process.env.PUBLIC_BASE_URL?.trim() || `${req.protocol}://${req.get('host')}`;
      const viewUrl = FE_BASE
        ? `${FE_BASE}/shared/${summary.shareToken}`
        : `${BE_BASE}/api/summary/shared/${summary.shareToken}`;

      // Email ONLY the summary content + public link
      const summaryOnly = summary.content || '';
      const target = toAdd.length ? toAdd : emails;
      for (const email of target) {
        await emailService.sendSummaryEmail(email, summary.title, summaryOnly, viewUrl);
      }

      return res.json({ message: 'Summary shared successfully', summary });
    } catch (error) {
      console.error('Share summary error:', error);
      return res.status(500).json({ error: 'Failed to share summary' });
    }
  },

  // Get shared summary (read-only link)
  async getSharedSummary(req, res) {
    try {
      const { token } = req.params;
      const summary = await Summary.findOne({ shareToken: token });
      if (!summary) return res.status(404).json({ error: 'Shared summary not found' });
      return res.json(summary);
    } catch (error) {
      console.error('Get shared summary error:', error);
      return res.status(500).json({ error: 'Failed to fetch shared summary' });
    }
  }
};

module.exports = summaryController;
