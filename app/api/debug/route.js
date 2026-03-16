import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  const debug = {
    hasKvUrl: !!process.env.KV_REST_API_URL,
    hasKvToken: !!process.env.KV_REST_API_TOKEN,
  };

  try {
    // Test basic set/get
    await kv.set('debug_test', 'hello');
    const val = await kv.get('debug_test');
    debug.basicTest = val === 'hello' ? 'OK' : 'FAIL';
    await kv.del('debug_test');

    // Test hmget (same as vote API uses)
    try {
      const hmgetResult = await kv.hmget('ratings', 'test_a', 'test_b');
      debug.hmgetTest = { result: hmgetResult, type: typeof hmgetResult };
    } catch (e) {
      debug.hmgetError = e.message;
    }

    // Test hset (same as vote API uses)
    try {
      await kv.hset('ratings', { 'test_a': 1200 });
      debug.hsetTest = 'OK';
    } catch (e) {
      debug.hsetError = e.message;
    }

    // Test incr (same as vote API uses)
    try {
      await kv.incr('matchCount');
      const mc = await kv.get('matchCount');
      debug.incrTest = 'OK';
      debug.matchCount = mc;
    } catch (e) {
      debug.incrError = e.message;
    }

    // Check ratings
    const ratings = await kv.hgetall('ratings');
    debug.ratingsCount = ratings ? Object.keys(ratings).length : 0;
    debug.ratingsPreview = ratings ? Object.entries(ratings).slice(0, 3) : null;

    // Cleanup test data
    await kv.hdel('ratings', 'test_a');

  } catch (error) {
    debug.error = error.message;
  }

  return NextResponse.json(debug);
}
