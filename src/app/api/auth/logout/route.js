import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request) {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Admin session terminated successfully.' },
      { status: 200 }
    );

    // Clear session cookie
    response.cookies.set(AUTH_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to logout session.' },
      { status: 500 }
    );
  }
}
