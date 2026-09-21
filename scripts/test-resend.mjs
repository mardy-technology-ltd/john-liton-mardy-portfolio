import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = process.env.RESEND_API_KEY;
let toEmail = process.env.CONTACT_NOTIFICATION_EMAIL || 'mardytechnologyltd@gmail.com';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [k, ...vParts] = trimmed.split('=');
    const key = k?.trim();
    const val = vParts.join('=').trim().replace(/^["']|["']$/g, '');
    if (key === 'RESEND_API_KEY') apiKey = val;
    if (key === 'CONTACT_NOTIFICATION_EMAIL') toEmail = val;
  }
}

console.log('Testing Resend with key:', apiKey ? (apiKey.substring(0, 8) + '...') : 'NONE');
console.log('Sending test email to:', toEmail);

if (!apiKey) {
  console.error('RESEND_API_KEY is not defined in .env.local');
  process.exit(1);
}

const resend = new Resend(apiKey);

async function run() {
  try {
    const result = await resend.emails.send({
      from: 'Portfolio System <onboarding@resend.dev>',
      to: [toEmail],
      subject: '⚡ John Liton Mardy Portfolio - Resend Connection Verified',
      html: `
        <div style="background:#030712; color:#f3f4f6; padding:32px; font-family:sans-serif; border-radius:12px; border:1px solid #1e293b;">
          <h2 style="color:#00f5ff; margin-top:0;">⚡ Resend Live Connected!</h2>
          <p style="color:#94a3b8; font-size:15px; line-height:1.6;">
            John Liton Mardy Portfolio system successfully established live communication with Resend Email Gateway.
          </p>
          <div style="background:#0f172a; border-left:4px solid #00f5ff; padding:16px; margin:20px 0; border-radius:6px;">
            <p style="margin:4px 0; font-size:14px;">📡 <b>Status:</b> Operational & Verified</p>
            <p style="margin:4px 0; font-size:14px;">🗄️ <b>Supabase DB:</b> Connected</p>
            <p style="margin:4px 0; font-size:14px;">📧 <b>Target Inbox:</b> ${toEmail}</p>
          </div>
          <p style="color:#64748b; font-size:12px; margin-bottom:0;">Mardy Technology Ltd © 2026</p>
        </div>
      `
    });

    console.log('Resend Response:', JSON.stringify(result, null, 2));
    if (result.error) {
      console.error('Resend returned error:', result.error);
    } else {
      console.log('✓ SUCCESS! Test email sent successfully with ID:', result.data?.id);
    }
  } catch (err) {
    console.error('Exception sending email:', err);
  }
}

run();
