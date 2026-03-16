import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  const debug = {};

  try {
    // Simulate exact same operations as vote API
    const winnerId = 'debug_winner';
    const loserId = 'debug_loser';

    // Step 1: hmget
    const values = await kv.hmget('ratings', winnerId, loserId);
    debug.step1_hmget = { raw: values, isNull: values === null };

    // Step 2: null guard (the fix)
    const safe = values || {};
    const rW = safe[winnerId] ?? 1200;
    const rL = safe[loserId] ?? 1200;
    debug.step2_values = { rW, rL };

    // Step 3: hset
    await kv.hset('ratings', { [winnerId]: 1216, [loserId]: 1184 });
    debug.step3_hset = 'OK';

    // Step 4: incr
    await kv.incr('matchCount');
    debug.step4_incr = 'OK';

    // Step 5: verify
    const [ratings, matchCount] = await Promise.all([
      kv.hgetall('ratings'),
      kv.get('matchCount'),
    ]);
    debug.step5_verify = {
      matchCount,
      ratingsCount: ratings ? Object.keys(ratings).length : 0,
      ratings: ratings,
    };

    // Cleanup debug data
    await kv.hdel('ratings', winnerId, loserId);
    await kv.set('matchCount', 0);

  } catch (error) {
    debug.error = error.message;
    debug.errorAt = error.stack?.split('\n')[1]?.trim();
  }

  return NextResponse.json(debug);
}
