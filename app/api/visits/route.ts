import { NextResponse } from 'next/server';
import { recordVisit } from '@/lib/queries';

/** One row per page view. The visitor id is a random value the browser keeps,
 *  so repeat visits from the same person count as one visitor. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const visitorId = String(body?.visitorId ?? '');
    const page = String(body?.page ?? '');
    if (!/^[\w-]{8,64}$/.test(visitorId)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await recordVisit(visitorId, page);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
