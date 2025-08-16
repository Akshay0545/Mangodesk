const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Check if email configuration is provided
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️  Email configuration missing. Email service will be disabled.');
      this.transporter = null;
      return;
    }

    try {
      this.transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } catch (error) {
      console.error('Failed to create email transporter:', error.message);
      this.transporter = null;
    }
  }

  async sendSummaryEmail(toEmail, summaryTitle, shareUrl) {
    if (!this.transporter) {
      console.warn('Email service disabled - configuration missing');
      return { messageId: 'mock-email-id', warning: 'Email service disabled' };
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: `Shared Summary: ${summaryTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Summary Shared with You</h2>
            <p>Hello,</p>
            <p>A summary titled "<strong>${summaryTitle}</strong>" has been shared with you via MangoDesk.</p>
            <p>
              <a href="${shareUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                View Summary
              </a>
            </p>
            <p style="color: #666; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              ${shareUrl}
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">
              This email was sent from MangoDesk - AI-powered transcript summarization tool.
            </p>
          </div>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Email Service Error:', error);
      throw new Error('Failed to send email');
    }
  }

  async testConnection() {
    if (!this.transporter) {
      console.warn('Email service disabled - configuration missing');
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('Email service is ready');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

module.exports = EmailService;
