import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const clientIp = forwardedFor?.split(',')[0] || realIp || 'unknown';
    const tweet = await fetch(process.env.TWITTER_API_URL!, {
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': clientIp,
        'X-Real-IP': clientIp,
      }
    });
    const tweets = await tweet.json();
    return NextResponse.json({ tweets });
  } catch {
    return NextResponse.json(
      { tweets: [], message: 'Failed to fetch tweet IDs' },
      { status: 500 }
    );
  }
}