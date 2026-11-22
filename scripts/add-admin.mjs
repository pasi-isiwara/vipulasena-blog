/* Manages the accounts that can sign in to the admin area.
 *
 *   npm run admin:add                   -- asks for a username and password
 *   npm run admin:add -- <username>     -- asks for the password only
 *   npm run admin:list                  -- shows who can sign in
 *   npm run admin:remove -- <username>  -- takes an account away
 *
 * The password is typed hidden, so it never reaches the shell history or any
 * file. Only its scrypt hash is stored. Running "add" for a username that
 * already exists changes that account's password. */
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';
import { randomUUID } from 'node:crypto';
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { hashPassword, passwordProblem, usernameProblem } from '../lib/password.ts';

config({ path: '.env.local', quiet: true });
config({ path: '.env', quiet: true });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env.local first.');
  process.exit(1);
}
const sql = neon(process.env.DATABASE_URL);

/* Prompts.
   On a terminal each answer is read as it is typed, and the password is not
   echoed. When stdin is a pipe or a file - a setup script, or CI - the whole
   input is read first and the answers are taken from it in order, because a
   piped readline delivers every line at once and later prompts would miss them. */
let rl = null;
let piped = null;

async function pipedLines() {
  if (piped) return piped;
  let text = '';
  for await (const chunk of stdin) text += chunk;
  piped = text.split('\n').map((line) => line.replace(/\r$/, ''));
  return piped;
}

function terminal() {
  if (!rl) {
    rl = createInterface({ input: stdin, output: stdout, terminal: true });
    rl.on('close', () => { rl = null; });
  }
  return rl;
}

async function ask(question) {
  if (!stdin.isTTY) {
    const lines = await pipedLines();
    const answer = lines.shift() ?? '';
    stdout.write(question + answer + String.fromCharCode(10));
    return answer.trim();
  }
  return new Promise((resolve) => terminal().question(question, (a) => resolve(a.trim())));
}

/** Reads a line without echoing it, so the password is not left on screen. */
async function askHidden(question) {
  if (!stdin.isTTY) {
    const lines = await pipedLines();
    stdout.write(question + String.fromCharCode(10));
    return lines.shift() ?? '';
  }
  return new Promise((resolve) => {
    const line = terminal();
    const echo = line._writeToOutput.bind(line);
    let muted = false;
    line._writeToOutput = (text) => { if (!muted) echo(text); };
    line.question(question, (answer) => {
      muted = false;
      line._writeToOutput = echo;
      stdout.write(String.fromCharCode(10));
      resolve(answer);
    });
    muted = true; // after the prompt itself has been written
  });
}

function done(code = 0) {
  if (rl) rl.close();
  process.exit(code);
}

const args = process.argv.slice(2);
const command = args.find((a) => a.startsWith('--'))?.slice(2) ?? 'add';
const given = args.find((a) => !a.startsWith('--'));

if (command === 'list') {
  const rows = await sql`
    select username, display_name, added_at, password_hash <> '' as has_password
    from site_admins order by added_at
  `;
  if (!rows.length) {
    console.log('No admin accounts yet. Run:  npm run admin:add');
  } else {
    console.log('Admins who can sign in at /admin:\n');
    for (const row of rows) {
      const when = new Date(row.added_at).toISOString().slice(0, 10);
      console.log(
        `  ${String(row.username ?? '(none)').padEnd(22)}` +
          `${String(row.display_name || '').padEnd(26)}added ${when}` +
          (row.has_password ? '' : '   NO PASSWORD SET'),
      );
    }
  }
  done(0);
}

if (command === 'remove') {
  const username = given ?? (await ask('Username to remove: '));
  if (!username) {
    console.error('No username given.');
    done(1);
  }
  const rows = await sql`
    delete from site_admins where lower(username) = lower(${username}) returning username
  `;
  if (!rows.length) {
    console.error(`No admin called "${username}".`);
    done(1);
  }
  console.log(`Removed "${rows[0].username}". That account can no longer sign in.`);
  done(0);
}

if (command !== 'add') {
  console.error(`Unknown option --${command}. Use --list or --remove.`);
  done(1);
}

const username = given ?? (await ask('Username: '));
const usernameIssue = usernameProblem(username);
if (usernameIssue) {
  console.error(usernameIssue);
  done(1);
}

const existing = await sql`
  select user_id, username from site_admins
  where lower(username) = lower(${username}) limit 1
`;
if (existing.length) {
  console.log(`"${existing[0].username}" already exists. Setting a new password for it.`);
}

const password = await askHidden('Password (at least 10 characters, including a number): ');
const passwordIssue = passwordProblem(password);
if (passwordIssue) {
  console.error(passwordIssue);
  done(1);
}
if ((await askHidden('Type it again: ')) !== password) {
  console.error('The two passwords do not match. Nothing was changed.');
  done(1);
}

const hash = await hashPassword(password);

if (existing.length) {
  await sql`update site_admins set password_hash = ${hash} where user_id = ${existing[0].user_id}`;
  console.log(`\nPassword changed for "${existing[0].username}".`);
} else {
  const displayName = await ask('Name to show in the admin area (optional): ');
  await sql`
    insert into site_admins (user_id, username, display_name, password_hash, email)
    values (${randomUUID()}, ${username}, ${displayName}, ${hash}, '')
  `;
  console.log(`\nAdmin "${username}" created. Sign in at /admin.`);
}
