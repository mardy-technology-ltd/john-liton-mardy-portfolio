import { NextResponse } from 'next/server';
import { verifySessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function GET(request) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          email: session.email,
          role: session.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 500 }
    );
  }
}
