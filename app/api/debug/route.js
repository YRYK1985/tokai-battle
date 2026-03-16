import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  const debug = {
    hasKvUrl: !!process.env.KV_REST_API_URL,
    kvUrlPrefix: process.env.KV_REST_API_URL ? process.env.KV_REST_API_URL.substring(0, 30) + '...' : 'NOT SET',
    hasKvToken: !!process.env.KV_REST_API_TOKEN,
    tokenPrefix: process.env.KV_REST_API_TOKEN ? process.env.KV_REST_API_TOKEN.substring(0, 10) + '...' : 'NOT SET',
  };

  try {
    // Test write
    await kv.set('debug_test', 'hello');
    debug.writeTest = 'OK';

    // Test read
    const val = await kv.get('debug_test');
    debug.readTest = val;

    // Check existing data
    const matchCount = await kv.get('matchCount');
    debug.matchCount = matchCount;

    const ratings = await kv.hgetall('ratings');
    debug.ratingsCount = ratings ? Object.keys(ratings).length : 0;

    // Cleanup
    await kv.del('debug_test');
  } catch (error) {
    debug.error = error.message;
    debug.errorStack = error.stack?.split('\n').slice(0, 3).join(' | ');
  }

  return NextResponse.json(debug);
}
