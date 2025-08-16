const Summary = require('../models/Summary');
const AIService = require('../utils/aiService');
const EmailService = require('../utils/emailService');
const crypto = require('crypto');

const aiService = new AIService();
const emailService = new EmailService();

const summaryController = {
  // Generate new summary
  async generateSummary(req, res) {
    try {
      const { transcript, prompt, title } = req.body;

      if (!transcript) {
        return res.status(400).json({ error: 'Transcript is required' });
      }

      const summaryContent = await aiService.generateSummary(transcript, prompt);

      const summary = new Summary({
        title: title || 'Untitled Summary',
        content: summaryContent,
        originalTranscript: transcript,
        prompt: prompt || 'Generate a concise summary of this transcript'
      });

      await summary.save();

      res.status(201).json({
        message: 'Summary generated successfully',
        summary
      });
    } catch (error) {
      console.error('Generate summary error:', error);
      res.status(500).json({ error: 'Failed to generate summary' });
    }
  },

  // Get all summaries
  async getAllSummaries(req, res) {
    try {
      const summaries = await Summary.find().sort({ createdAt: -1 });
      res.json(summaries);
    } catch (error) {
      console.error('Get summaries error:', error);
      res.status(500).json({ error: 'Failed to fetch summaries' });
    }
  },

  // Get single summary
  async getSummary(req, res) {
    try {
      const { id } = req.params;
      const summary = await Summary.findById(id);

      if (!summary) {
        return res.status(404).json({ error: 'Summary not found' });
      }

      res.json(summary);
    } catch (error) {
      console.error('Get summary error:', error);
      res.status(500).json({ error: 'Failed to fetch summary' });
    }
  },

  // Update summary
  async updateSummary(req, res) {
    try {
      const { id } = req.params;
      const { content, title } = req.body;

      const summary = await Summary.findByIdAndUpdate(
        id,
        { content, title },
        { new: true }
      );

      if (!summary) {
        return res.status(404).json({ error: 'Summary not found' });
      }

      res.json({
        message: 'Summary updated successfully',
        summary
      });
    } catch (error) {
      console.error('Update summary error:', error);
      res.status(500).json({ error: 'Failed to update summary' });
    }
  },

  // Delete summary
  async deleteSummary(req, res) {
    try {
      const { id } = req.params;
      const summary = await Summary.findByIdAndDelete(id);

      if (!summary) {
        return res.status(404).json({ error: 'Summary not found' });
      }

      res.json({ message: 'Summary deleted successfully' });
    } catch (error) {
      console.error('Delete summary error:', error);
      res.status(500).json({ error: 'Failed to delete summary' });
    }
  },

  // Share summary via email
  async shareSummary(req, res) {
    try {
      const { id } = req.params;
      const { emails } = req.body;

      if (!emails || !Array.isArray(emails) || emails.length === 0) {
        return res.status(400).json({ error: 'At least one email is required' });
      }

      const summary = await Summary.findById(id);
      if (!summary) {
        return res.status(404).json({ error: 'Summary not found' });
      }

      // Generate share token if not exists
      if (!summary.shareToken) {
        summary.shareToken = crypto.randomBytes(16).toString('hex');
      }

      // Add emails to sharedWith
      const newEmails = emails.filter(email => 
        !summary.sharedWith.some(shared => shared.email === email)
      );

      summary.sharedWith.push(...newEmails.map(email => ({ email })));
      await summary.save();

      // Send emails
      const shareUrl = `${req.protocol}://${req.get('host')}/api/summary/shared/${summary.shareToken}`;
      
      for (const email of emails) {
        await emailService.sendSummaryEmail(email, summary.title, shareUrl);
      }

      res.json({
        message: 'Summary shared successfully',
        summary
      });
    } catch (error) {
      console.error('Share summary error:', error);
      res.status(500).json({ error: 'Failed to share summary' });
    }
  },

  // Get shared summary
  async getSharedSummary(req, res) {
    try {
      const { token } = req.params;
      const summary = await Summary.findOne({ shareToken: token });

      if (!summary) {
        return res.status(404).json({ error: 'Shared summary not found' });
      }

      res.json(summary);
    } catch (error) {
      console.error('Get shared summary error:', error);
      res.status(500).json({ error: 'Failed to fetch shared summary' });
    }
  }
};



module.exports = summaryController;
