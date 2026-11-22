'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/lib/auth';

export type SignInState = { error: string | null };

/** Signs an admin in. Whatever goes wrong, the same message comes back: saying
 *  which half was wrong would tell someone guessing which usernames exist. */
export async function signInAdmin(
  _previous: SignInState,
  form: FormData,
): Promise<SignInState> {
  const username = String(form.get('username') ?? '').trim();
  const password = String(form.get('password') ?? '');

  if (!username || !password) {
    return { error: 'Please enter your username and password.' };
  }

  try {
    await signIn('credentials', {
      username,
      password,
      redirectTo: '/admin',
    });
    return { error: null };
  } catch (error) {
    // A successful sign-in redirects by throwing; that must not be caught here.
    if (error instanceof AuthError) {
      return { error: 'That username and password do not match an account.' };
    }
    throw error;
  }
}
