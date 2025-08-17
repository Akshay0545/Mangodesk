// utils/emailService.js
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    const host = process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com';
    const portStr = process.env.EMAIL_PORT || process.env.SMTP_PORT || '465';
    const user = process.env.EMAIL_USER || process.env.SMTP_USER;
    const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

    if (!user || !pass) {
      console.warn('⚠️  Email configuration missing. Email service will be disabled.');
      this.transporter = null;
      return;
    }

    const port = Number(portStr);
    const secure = port === 465;

    try {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });
    } catch (error) {
      console.error('Failed to create email transporter:', error.message);
      this.transporter = null;
    }
  }

  // Minimal Markdown → HTML (safe subset). No links/buttons.
  _mdToHtml(md = '') {
    return md
      .replace(/^### (.*)$/gm, '<h3 style="margin:12px 0 6px;">$1</h3>')
      .replace(/^## (.*)$/gm, '<h2 style="margin:14px 0 8px;">$1</h2>')
      .replace(/^# (.*)$/gm, '<h1 style="margin:16px 0 10px;">$1</h1>')
      .replace(/^- (.*)$/gm, '<li>$1</li>')
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/\n/g, '<br/>');
  }

  /**
   * Send ONLY the summary body. No "View Online" link or button.
   * @param {string} toEmail
   * @param {string} summaryTitle
   * @param {string} summaryMarkdown  // ONLY the summary text in Markdown
   */
  async sendSummaryEmail(toEmail, summaryTitle, summaryMarkdown) {
    if (!this.transporter) {
      console.warn('Email service disabled - configuration missing');
      return { messageId: 'mock-email-id', warning: 'Email service disabled' };
    }

    const from = process.env.EMAIL_FROM || process.env.SMTP_FROM || process.env.EMAIL_USER;
    const subject = `Summary: ${summaryTitle || 'Shared Summary'}`;

    // Build a very simple HTML with just the summary content
    const htmlSummary = this._mdToHtml(summaryMarkdown || '');
    const html =
`<div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; max-width: 680px; margin: 0 auto;">
  <h2 style="margin:0 0 12px;">${summaryTitle || 'Shared Summary'}</h2>
  <div style="border:1px solid #eee; border-radius:12px; padding:16px; background:#fafafa;">
    <p style="margin:0;">${htmlSummary}</p>
  </div>
</div>`;

    // Plain-text fallback (just the markdown)
    const text = summaryMarkdown || '';

    try {
      const result = await this.transporter.sendMail({ from, to: toEmail, subject, text, html });
      console.log('Email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Email Service Error:', error);
      throw new Error('Failed to send email');
    }
  }
}

module.exports = EmailService;
