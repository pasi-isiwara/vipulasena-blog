import type { DefaultSession } from 'next-auth';

/** The admin's row id is carried on the session so every request can look the
 *  account up again rather than trusting what the cookie says about it. */
declare module 'next-auth' {
  interface Session {
    user: { id: string } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    adminId?: string;
  }
}
