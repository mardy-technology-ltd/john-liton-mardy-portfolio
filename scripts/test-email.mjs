import { Resend } from 'resend';
import fs from 'fs';

const env = fs.readFileSync('./.env.local', 'utf8');
const keyMatch = env.match(/RESEND_API_KEY=(.*)/);
const emailMatch = env.match(/CONTACT_NOTIFICATION_EMAIL=(.*)/);
const fromMatch = env.match(/RESEND_FROM_EMAIL=(.*)/);

const apiKey = keyMatch ? keyMatch[1].trim() : '';
const targetEmail = 'mardytechnologyltd@gmail.com';
const fromEmail = fromMatch ? fromMatch[1].trim() : 'Portfolio Leads <onboarding@resend.dev>';

console.log('Testing Resend with Key:', apiKey ? apiKey.substring(0, 8) + '...' : 'NONE');
console.log('Target Recipient Email:', targetEmail);

if (!apiKey || !targetEmail) {
  console.error('RESEND_API_KEY or CONTACT_NOTIFICATION_EMAIL is missing in .env.local');
  process.exit(1);
}

const resend = new Resend(apiKey);

try {
  const result = await resend.emails.send({
    from: fromEmail,
    to: targetEmail,
    subject: '⚡ Live Test: John Liton Mardy Portfolio Email Service Connected!',
    html: `
      <div style="font-family: Arial, sans-serif; background: #070b14; color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #00ffff;">
        <h2 style="color: #00ffff; margin-top: 0;">🚀 Resend Email Service Connected Successfully!</h2>
        <p style="color: #cbd5e1; font-size: 15px;">Congratulations! Your portfolio's automated lead notification service is now fully operational.</p>
        <div style="background: #0f172a; padding: 14px; border-radius: 8px; margin: 16px 0; font-size: 13px; color: #94a3b8;">
          <div><strong>Timestamp:</strong> ${new Date().toUTCString()}</div>
          <div><strong>Notification Target:</strong> ${targetEmail}</div>
        </div>
        <p style="color: #4ade80; font-weight: bold; font-size: 14px;">✓ Incoming client inquiries will now be delivered straight to this inbox.</p>
      </div>
    `,
  });

  console.log('✓ RESEND EMAIL SENT SUCCESSFULLY! ID:', result.data?.id || result);
} catch (error) {
  console.error('Resend test failed:', error);
}
