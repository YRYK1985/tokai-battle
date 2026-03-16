import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 2 commands only: hgetall + get
    const [ratings, matchCount] = await Promise.all([
      kv.hgetall('ratings'),
      kv.get('matchCount'),
    ]);

    return NextResponse.json({
      ratings: ratings || {},
      matchCount: matchCount ?? 0,
    }, {
      headers: { 'Cache-Control': 's-maxage=10, stale-while-revalidate=30' },
    });
  } catch (error) {
    console.error('Ratings error:', error);
    return NextResponse.json({ ratings: {}, matchCount: 0 }, { status: 500 });
  }
}
