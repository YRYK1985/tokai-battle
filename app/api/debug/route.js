import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Cleanup debug test entries
    await kv.hdel('ratings', 'debug_winner', 'debug_loser');
    // Decrement matchCount by 1 (debug added 1)
    await kv.decr('matchCount');

    const [ratings, matchCount] = await Promise.all([
      kv.hgetall('ratings'),
      kv.get('matchCount'),
    ]);

    return NextResponse.json({
      status: 'ALL GOOD',
      matchCount,
      ratingsCount: ratings ? Object.keys(ratings).length : 0,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
