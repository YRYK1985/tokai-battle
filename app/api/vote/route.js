import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const K = 32;
function expectedScore(ra, rb) {
  return 1 / (1 + Math.pow(10, (rb - ra) / 400));
}

export async function POST(request) {
  try {
    const { winnerId, loserId } = await request.json();
    if (!winnerId || !loserId) {
      return NextResponse.json({ error: 'Missing winnerId or loserId' }, { status: 400 });
    }

    // Get current ratings from hash (2 commands → 1 command with hmget)
    const values = await kv.hmget('ratings', winnerId, loserId) || {};
    const rW = values[winnerId] ?? 1200;
    const rL = values[loserId] ?? 1200;

    // Calculate new Elo
    const eW = expectedScore(rW, rL);
    const eL = expectedScore(rL, rW);
    const newW = Math.round(rW + K * (1 - eW));
    const newL = Math.round(rL + K * (0 - eL));

    // Save new ratings, increment match count, and record win/match stats
    await Promise.all([
      kv.hset('ratings', { [winnerId]: newW, [loserId]: newL }),
      kv.incr('matchCount'),
      kv.hincrby('wins', winnerId, 1),
      kv.hincrby('matches', winnerId, 1),
      kv.hincrby('matches', loserId, 1),
    ]);

    return NextResponse.json({
      winnerId, loserId,
      winnerElo: newW, loserElo: newL,
    });
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
