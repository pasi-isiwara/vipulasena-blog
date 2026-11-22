'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signInAdmin, type SignInState } from '@/app/admin/sign-in';

const INITIAL: SignInState = { error: null };

export function SignInForm() {
  const [state, action] = useActionState(signInAdmin, INITIAL);

  return (
    <form className="admin-login" action={action}>
      <label className="field">
        <span>Username</span>
        <input
          name="username"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          maxLength={40}
          required
          autoFocus
        />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          maxLength={200}
          required
        />
      </label>
      <SubmitButton />
      <p className="admin-login-error" role="status" aria-live="polite">
        {state.error}
      </p>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn" disabled={pending}>
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  );
}
