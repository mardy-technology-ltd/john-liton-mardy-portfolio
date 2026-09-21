import { NextResponse } from 'next/server';
import { signSessionToken, getSessionCookieOptions, checkRateLimit, recordFailedAttempt, resetRateLimit } from '@/lib/auth';

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    
    // Check rate limit
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed authorization attempts. Security cooldown active for ${rateCheck.remainingSec} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    const expectedEmail = process.env.ADMIN_EMAIL || 'admin@johnlitonmardy.com';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin@123456';

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const isEmailValid = email.trim().toLowerCase() === expectedEmail.trim().toLowerCase();
    const isPasswordValid = password === expectedPassword;

    if (!isEmailValid || !isPasswordValid) {
      recordFailedAttempt(ip);
      const remainingAttempts = Math.max(0, (rateCheck.maxAttempts || 5) - (rateCheck.attempts || 0) - 1);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid security credentials. Access denied.',
          remainingAttempts,
        },
        { status: 401 }
      );
    }

    // Success: Reset rate limits
    resetRateLimit(ip);

    // Generate signed session token
    const token = await signSessionToken({
      email: expectedEmail,
      role: 'admin',
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Security credentials verified. Access granted.',
        user: { email: expectedEmail, role: 'admin' },
      },
      { status: 200 }
    );

    // Set HttpOnly secure cookie
    const cookieOptions = getSessionCookieOptions();
    response.cookies.set(cookieOptions.name, token, cookieOptions);

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server authorization error.' },
      { status: 500 }
    );
  }
}
