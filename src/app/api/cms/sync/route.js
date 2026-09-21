import { NextResponse } from 'next/server';
import { fetchCMSDataFromDB, saveCMSDataToDB } from '@/lib/supabase';

export async function GET() {
  try {
    const cloudData = await fetchCMSDataFromDB();
    if (!cloudData) {
      return NextResponse.json({ success: false, data: null }, { status: 200 });
    }
    return NextResponse.json({ success: true, data: cloudData }, { status: 200 });
  } catch (error) {
    console.error('CMS GET sync error:', error);
    return NextResponse.json({ success: false, data: null }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const saved = await saveCMSDataToDB(body);
    return NextResponse.json({ success: saved }, { status: saved ? 200 : 500 });
  } catch (error) {
    console.error('CMS POST sync error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
