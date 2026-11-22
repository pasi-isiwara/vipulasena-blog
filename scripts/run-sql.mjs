/* Runs a .sql file against the database in DATABASE_URL.
   Usage: node scripts/run-sql.mjs database/neon-schema.sql */
import { readFileSync } from 'node:fs';
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env.local', quiet: true });
config({ path: '.env', quiet: true });

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/run-sql.mjs <file.sql>');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env.local first.');
  process.exit(1);
}

/** Splits a script into single statements.
 *
 *  Neon's HTTP driver takes one statement per request, so the file cannot be
 *  sent whole. Splitting on ";" alone is not safe either: the trigger functions
 *  have semicolons inside $$ ... $$ bodies, and the seed data has them inside
 *  quoted strings. This walks the text and only splits at a top-level ";". */
function splitStatements(sql) {
  const statements = [];
  let start = 0;
  let i = 0;

  while (i < sql.length) {
    const c = sql[i];

    if (c === '-' && sql[i + 1] === '-') {
      const nl = sql.indexOf('\n', i);
      i = nl < 0 ? sql.length : nl + 1;
      continue;
    }
    if (c === '/' && sql[i + 1] === '*') {
      const end = sql.indexOf('*/', i + 2);
      i = end < 0 ? sql.length : end + 2;
      continue;
    }
    if (c === "'" || c === '"') {
      i++;
      while (i < sql.length) {
        if (sql[i] === c) {
          // '' and "" inside a literal are an escaped quote, not the end
          if (sql[i + 1] === c) i += 2;
          else { i++; break; }
        } else i++;
      }
      continue;
    }
    if (c === '$') {
      const tag = /^\$[A-Za-z_]*\$/.exec(sql.slice(i));
      if (tag) {
        const end = sql.indexOf(tag[0], i + tag[0].length);
        i = end < 0 ? sql.length : end + tag[0].length;
        continue;
      }
    }
    if (c === ';') {
      statements.push(sql.slice(start, i));
      start = i + 1;
    }
    i++;
  }

  statements.push(sql.slice(start));
  return statements.map((s) => s.trim()).filter(Boolean);
}

const sql = neon(process.env.DATABASE_URL);
const text = readFileSync(file, 'utf8');

// A statement that is only comments and whitespace has nothing to send
const statements = splitStatements(text).filter((s) =>
  s.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '').trim(),
);

let done = 0;
for (const statement of statements) {
  try {
    await sql.query(statement);
    done++;
  } catch (error) {
    console.error(`${file}: failed on statement ${done + 1}`);
    console.error(statement.trim().split('\n').slice(0, 4).join('\n'));
    console.error('---');
    console.error(error.message);
    process.exit(1);
  }
}

console.log(`${file}: ${done} statement${done === 1 ? '' : 's'} run`);
