import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey && !resendApiKey.includes('your_resend') ? new Resend(resendApiKey) : null;

export function isEmailServiceConfigured() {
  return Boolean(resend);
}

/**
 * Generate Cyberpunk themed HTML email for the Portfolio Owner (Admin Notification)
 */
export function generateAdminLeadEmailHtml(data) {
  const { name, email, subject, message, budget, timeline, source } = data;
  const sourceLabel = source === 'hire_modal' ? '🚀 Project Hire Inquiry' : '📬 General Contact Form';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070b14; color: #e2e8f0; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #0c1222; border: 1px solid #1e293b; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #0f172a, #1e1b4b); padding: 28px 24px; border-bottom: 2px solid #00ffff; }
    .badge { display: inline-block; background: rgba(0, 255, 255, 0.12); color: #00ffff; border: 1px solid rgba(0, 255, 255, 0.35); padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
    .title { color: #ffffff; font-size: 20px; font-weight: 800; margin: 0; }
    .content { padding: 24px; }
    .meta-grid { background: #070b14; border: 1px solid #1e293b; border-radius: 10px; padding: 16px; margin-bottom: 20px; }
    .meta-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; }
    .meta-row:last-child { border-bottom: none; }
    .meta-label { color: #94a3b8; font-weight: 500; }
    .meta-value { color: #ffffff; font-weight: 600; text-align: right; }
    .message-box { background: #070b14; border-left: 3px solid #00ffff; border-radius: 0 8px 8px 0; padding: 16px; margin-top: 14px; color: #f1f5f9; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
    .btn { display: inline-block; background: linear-gradient(135deg, #00ffff, #a855f7); color: #000000; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 20px; text-align: center; }
    .footer { padding: 18px 24px; background: #070b14; border-top: 1px solid #1e293b; text-align: center; font-size: 11px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">${sourceLabel}</div>
      <h1 class="title">New Client Inquiry Received</h1>
    </div>
    <div class="content">
      <div class="meta-grid">
        <div class="meta-row">
          <span class="meta-label">Client Name:</span>
          <span class="meta-value">${name}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Email Address:</span>
          <span class="meta-value"><a href="mailto:${email}" style="color: #00ffff; text-decoration: none;">${email}</a></span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Project / Subject:</span>
          <span class="meta-value">${subject || 'General Discussion'}</span>
        </div>
        ${budget ? `
        <div class="meta-row">
          <span class="meta-label">Budget Range:</span>
          <span class="meta-value" style="color: #4ade80;">${budget}</span>
        </div>` : ''}
        ${timeline ? `
        <div class="meta-row">
          <span class="meta-label">Desired Timeline:</span>
          <span class="meta-value">${timeline}</span>
        </div>` : ''}
      </div>

      <div style="font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Client Message:</div>
      <div class="message-box">${message}</div>

      <div style="text-align: center;">
        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Your inquiry on John Liton Mardy Portfolio')}" class="btn">
          ✉️ Reply Directly to Client
        </a>
      </div>
    </div>
    <div class="footer">
      Sent automatically from your John Liton Mardy Portfolio CMS • ${new Date().toUTCString()}
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate Cyberpunk confirmation auto-reply HTML for the client
 */
export function generateClientAutoReplyHtml(data) {
  const { name, subject } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070b14; color: #e2e8f0; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #0c1222; border: 1px solid #1e293b; border-radius: 14px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0f172a, #1e1b4b); padding: 28px 24px; border-bottom: 2px solid #a855f7; text-align: center; }
    .title { color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: 0.05em; }
    .subtitle { color: #00ffff; font-size: 12px; font-weight: 600; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.1em; }
    .content { padding: 28px 24px; line-height: 1.7; font-size: 14px; color: #cbd5e1; }
    .highlight-card { background: #070b14; border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 10px; padding: 18px; margin: 20px 0; }
    .footer { padding: 20px 24px; background: #070b14; border-top: 1px solid #1e293b; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">John Liton Mardy</h1>
      <div class="subtitle">Full-Stack Software Engineer &amp; 3D Specialist</div>
    </div>
    <div class="content">
      <p style="color: #ffffff; font-size: 16px; font-weight: 600;">Hi ${name},</p>
      <p>
        Thank you for reaching out regarding <strong>&quot;${subject || 'your project'}&quot;</strong>. I have received your message and will review the details carefully.
      </p>
      
      <div class="highlight-card">
        <div style="color: #a855f7; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;">⚡ Typical Response Time</div>
        <div style="color: #ffffff; font-size: 13px;">I usually reply within <strong>12–24 business hours</strong>. If your request is urgent, feel free to connect directly via LinkedIn.</div>
      </div>

      <p>Looking forward to collaborating and bringing your ideas to life!</p>
      
      <p style="margin-top: 24px; color: #ffffff;">
        Best regards,<br>
        <strong>John Liton Mardy</strong><br>
        <span style="font-size: 12px; color: #94a3b8;">Software Engineer &amp; Solution Architect</span>
      </p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} John Liton Mardy Portfolio • Rajshahi, Bangladesh
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send email notifications via Resend API
 */
export async function sendLeadNotificationEmails(messageData) {
  if (!isEmailServiceConfigured()) {
    console.log('[Email Service] Resend API key not set in .env.local. Email dispatch skipped in local mode.');
    return { success: false, reason: 'unconfigured' };
  }

  const notificationTarget = process.env.CONTACT_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'admin@johnlitonmardy.com';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Portfolio Leads <onboarding@resend.dev>';

  const results = { adminEmail: null, clientEmail: null };

  try {
    // 1. Send Alert to Admin
    const adminResult = await resend.emails.send({
      from: fromEmail,
      to: notificationTarget,
      subject: `🚨 New Lead: ${messageData.name} - ${messageData.subject || messageData.projectType || 'Portfolio Inquiry'}`,
      html: generateAdminLeadEmailHtml(messageData),
      replyTo: messageData.email,
    });
    results.adminEmail = adminResult;

    // 2. Send Auto-Reply to Client (if valid email provided)
    if (messageData.email && messageData.email.includes('@')) {
      try {
        const clientResult = await resend.emails.send({
          from: fromEmail,
          to: messageData.email,
          subject: `✓ Received: Thank you for contacting John Liton Mardy`,
          html: generateClientAutoReplyHtml(messageData),
        });
        results.clientEmail = clientResult;
      } catch (clientErr) {
        console.warn('Auto-reply to client skipped/failed:', clientErr);
      }
    }

    return { success: true, results };
  } catch (error) {
    console.error('Resend email delivery error:', error);
    return { success: false, error: error.message };
  }
}
