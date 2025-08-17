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

  /**
   * Sends ONLY the summary body, plus a "View Online" button.
   * @param {string} toEmail
   * @param {string} summaryTitle
   * @param {string} summaryMarkdown  // ONLY the summary
   * @param {string} viewUrl          // public URL (not localhost)
   */
  async sendSummaryEmail(toEmail, summaryTitle, summaryMarkdown, viewUrl) {
    if (!this.transporter) {
      console.warn('Email service disabled - configuration missing');
      return { messageId: 'mock-email-id', warning: 'Email service disabled' };
    }

    const from = process.env.EMAIL_FROM || process.env.SMTP_FROM || process.env.EMAIL_USER;

    // Convert a simple subset of Markdown bullets to HTML (minimal safe)
    const htmlSummary = summaryMarkdown
      .replace(/^### (.*)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*)$/gm, '<h1>$1</h1>')
      .replace(/^- (.*)$/gm, '<li>$1</li>')
      .replace(/\n{2,}/g, '</p><p>');

    const html =
`<div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; max-width: 680px; margin: 0 auto;">
  <h2 style="margin: 0 0 12px;">${summaryTitle || 'Shared Summary'}</h2>
  <p style="margin: 0 0 16px; color: #555;">Here’s the summary you were sent.</p>
  <div style="border:1px solid #eee; border-radius:12px; padding:16px; background:#fafafa;">
    <div>
      <p>${htmlSummary}</p>
    </div>
  </div>
  ${viewUrl ? `
  <p style="margin: 16px 0 0;">
    <a href="${viewUrl}" style="background:#2563eb;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;display:inline-block;">View Online</a>
  </p>
  <p style="color:#777; font-size:12px; margin-top:8px;">
    If the button doesn't work, copy this link: ${viewUrl}
  </p>` : ''}
</div>`;

    const subject = `Summary: ${summaryTitle || 'Shared Summary'}`;
    const text = summaryMarkdown + (viewUrl ? `\n\nView online: ${viewUrl}` : '');

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
