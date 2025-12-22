// lib/email/mailer.ts
import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface SendEmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Send email
 */
export async function sendEmail({ to, subject, text, html }: SendEmailParams) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@portfolio.com',
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

/**
 * Send contact form notification to admin
 */
export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const adminEmail = process.env.EMAIL_TO || 'admin@example.com';

  const html = `
    <h2>Nouveau message de contact</h2>
    <p><strong>De:</strong> ${data.name} (${data.email})</p>
    ${data.subject ? `<p><strong>Sujet:</strong> ${data.subject}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p>${data.message.replace(/\n/g, '<br>')}</p>
    <hr>
    <p><small>Envoyé depuis votre portfolio</small></p>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `[Portfolio] ${data.subject || 'Nouveau message de contact'}`,
    text: `
De: ${data.name} (${data.email})
${data.subject ? `Sujet: ${data.subject}` : ''}

Message:
${data.message}
    `,
    html,
  });
}

/**
 * Verify email configuration
 */
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready');
    return true;
  } catch (error) {
    console.error('❌ Email server error:', error);
    return false;
  }
}
