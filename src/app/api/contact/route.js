import { NextResponse } from 'next/server';
import { saveContactMessageToDB } from '@/lib/supabase';
import { sendLeadNotificationEmails } from '@/lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message, subject, budget, timeline, source } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    const leadData = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      subject: (subject || '').trim(),
      budget: budget || null,
      timeline: timeline || null,
      source: source || 'contact_form',
    };

    // 1. Save to Supabase (if configured)
    const savedRecord = await saveContactMessageToDB(leadData);

    // 2. Dispatch Email Notifications via Resend (if configured)
    const emailDispatch = await sendLeadNotificationEmails(leadData);

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been securely transmitted. Thank you!',
        data: {
          id: savedRecord?.id || 'msg_' + Date.now(),
          emailSent: emailDispatch.success,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact submission API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process inquiry transmission.' },
      { status: 500 }
    );
  }
}
