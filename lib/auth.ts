import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { sql } from './db';
import { verifyPassword } from './password';

/** Username and password sign-in for the admin area.
 *
 *  Accounts live in the site_admins table and are created from the command
 *  line with `npm run admin:add`. There is no sign-up form: the only way to
 *  get an account is for someone with database access to make one. */

/** An account is locked for this long after this many wrong passwords. */
const MAX_FAILURES = 10;
const WINDOW_MINUTES = 15;

type AdminRow = {
  user_id: string;
  username: string;
  password_hash: string;
  display_name: string;
};

async function recentFailures(username: string): Promise<number> {
  const rows = (await sql`
    select count(*)::int as n from admin_login_attempts
    where lower(username) = lower(${username})
      and succeeded = false
      and attempted_at > now() - make_interval(mins => ${WINDOW_MINUTES})
  `) as { n: number }[];
  return rows[0]?.n ?? 0;
}

async function recordAttempt(username: string, succeeded: boolean): Promise<void> {
  await sql`
    insert into admin_login_attempts (username, succeeded)
    values (${username.slice(0, 80)}, ${succeeded})
  `;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 14 },
  pages: { signIn: '/admin' },
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const username = String(credentials?.username ?? '').trim();
        const password = String(credentials?.password ?? '');
        if (!username || !password) return null;

        // Too many wrong guesses recently: refuse without even checking,
        // so the lock cannot be worn down by guessing faster.
        if ((await recentFailures(username)) >= MAX_FAILURES) {
          return null;
        }

        const rows = (await sql`
          select user_id, username, password_hash, display_name
          from site_admins
          where lower(username) = lower(${username})
          limit 1
        `) as AdminRow[];
        const admin = rows[0];

        // Checked even when there is no such account, so the time this takes
        // does not reveal which usernames exist.
        const ok = await verifyPassword(password, admin?.password_hash ?? '');

        await recordAttempt(username, ok && !!admin);
        if (!ok || !admin) return null;

        return {
          id: admin.user_id,
          name: admin.display_name || admin.username,
          // Carried on the session so the admin area can show who is signed in
          email: admin.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.adminId = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.adminId) session.user.id = String(token.adminId);
      return session;
    },
  },
});

/** The signed-in admin, re-checked against the database on every call so that
 *  removing an account takes effect at once rather than when the cookie expires. */
export async function currentAdmin(): Promise<{ id: string; username: string; name: string } | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  const rows = (await sql`
    select user_id, username, display_name from site_admins where user_id = ${id} limit 1
  `) as { user_id: string; username: string; display_name: string }[];
  const admin = rows[0];
  if (!admin) return null;

  return {
    id: admin.user_id,
    username: admin.username,
    name: admin.display_name || admin.username,
  };
}

/** Every admin action calls this first. Throws when there is no admin session. */
export async function requireAdmin(): Promise<string> {
  const admin = await currentAdmin();
  if (!admin) throw new Error('You are not signed in. Please sign in and try again.');
  return admin.id;
}
