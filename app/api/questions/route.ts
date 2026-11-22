import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';

/** Lengths match the checks in database/neon-schema.sql, so a message that
 *  passes here will not then be rejected by the database. */
const Question = z.object({
  name: z.string().trim().max(80).default(''),
  contact: z.string().trim().max(120).default(''),
  question: z.string().trim().min(2).max(3000),
  language: z.enum(['en', 'si']).default('en'),
});

const MAX_PER_HOUR = 5;

/** A one-way hash of the sender's address. Enough to count repeats without
 *  keeping anyone's IP address. */
function senderHash(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for') ?? '';
  const ip = (forwarded.split(',')[0] || 'unknown').trim();
  const secret = process.env.AUTH_SECRET ?? 'vp';
  return createHash('sha256').update(secret + '|' + ip).digest('hex').slice(0, 32);
}

export async function POST(request: Request) {
  let parsed;
  try {
    parsed = Question.safeParse(await request.json());
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const hash = senderHash(request);
  try {
    const recent = (await sql`
      select count(*)::int as n from questions
      where sender_hash = ${hash} and created_at > now() - interval '1 hour'
    `) as { n: number }[];

    if ((recent[0]?.n ?? 0) >= MAX_PER_HOUR) {
      return NextResponse.json({ ok: false, reason: 'rate' }, { status: 429 });
    }

    const { name, contact, question, language } = parsed.data;
    await sql`
      insert into questions (name, contact, question, language, sender_hash)
      values (${name}, ${contact}, ${question}, ${language}, ${hash})
    `;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
