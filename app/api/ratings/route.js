import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [ratings, matchCount, wins, matches] = await Promise.all([
      kv.hgetall('ratings'),
      kv.get('matchCount'),
      kv.hgetall('wins'),
      kv.hgetall('matches'),
    ]);

    return NextResponse.json({
      ratings: ratings || {},
      matchCount: matchCount ?? 0,
      wins: wins || {},
      matches: matches || {},
    }, {
      headers: { 'Cache-Control': 's-maxage=10, stale-while-revalidate=30' },
    });
  } catch (error) {
    console.error('Ratings error:', error);
    return NextResponse.json({ ratings: {}, matchCount: 0 }, { status: 500 });
  }
}
