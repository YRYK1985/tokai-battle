import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Clean up test data from previous debug
    await kv.hdel('ratings', 'test_a');

    // Reset matchCount that was incremented by debug test
    const mc = await kv.get('matchCount');
    if (mc === 1) {
      await kv.del('matchCount');
    }

    const [ratings, matchCount] = await Promise.all([
      kv.hgetall('ratings'),
      kv.get('matchCount'),
    ]);

    return NextResponse.json({
      status: 'OK',
      matchCount: matchCount ?? 0,
      ratingsCount: ratings ? Object.keys(ratings).length : 0,
      cleanup: 'done',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
