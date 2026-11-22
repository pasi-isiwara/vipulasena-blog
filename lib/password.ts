import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

/* Passwords are hashed with scrypt, which is built into Node - no native module
   to compile and nothing extra to install. Each password gets its own random
   salt, and the stored value is:

     scrypt$<salt in hex>$<hash in hex>

   scrypt is deliberately slow, which is what makes guessing passwords in bulk
   impractical. It is also what throttles the sign-in form. */

const SALT_BYTES = 16;
const KEY_BYTES = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const key = await scrypt(password, salt, KEY_BYTES);
  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`;
}

/** Checks a password against a stored hash.
 *
 *  Always does the same amount of work, whether or not the stored hash is
 *  usable, so the time it takes cannot reveal whether an account exists. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  const usable = parts.length === 3 && parts[0] === 'scrypt';

  // A dummy salt for the no-account case, so the work below still happens
  const salt = usable ? Buffer.from(parts[1], 'hex') : randomBytes(SALT_BYTES);
  const expected = usable ? Buffer.from(parts[2], 'hex') : randomBytes(KEY_BYTES);

  let key: Buffer;
  try {
    key = await scrypt(password, salt, expected.length || KEY_BYTES);
  } catch {
    return false;
  }

  if (!usable || key.length !== expected.length) return false;
  return timingSafeEqual(key, expected);
}

/** What a password has to clear before it is accepted, returned as a message
 *  to show the person choosing it, or null when it is fine. */
export function passwordProblem(password: string): string | null {
  if (password.length < 10) return 'The password must be at least 10 characters long.';
  if (password.length > 200) return 'That password is too long.';
  if (!/[a-z]/i.test(password)) return 'The password must contain at least one letter.';
  if (!/\d/.test(password)) return 'The password must contain at least one number.';
  return null;
}

export function usernameProblem(username: string): string | null {
  if (!/^[a-zA-Z0-9._-]{3,40}$/.test(username)) {
    return 'The username must be 3 to 40 characters: letters, numbers, dot, dash or underscore.';
  }
  return null;
}
