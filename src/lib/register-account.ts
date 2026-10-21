import type { SupabaseClient } from '@supabase/supabase-js';

export type Registration = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

// Keep the exact Auth request shared by the server action and regression tests.
export async function registerAccount(
  auth: Pick<SupabaseClient['auth'], 'signUp'>,
  values: Registration,
  origin: string,
  next: string,
) {
  const confirmation = new URL('/auth/confirm', origin);
  confirmation.searchParams.set('next', next);
  return auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      emailRedirectTo: confirmation.toString(),
      data: {
        first_name: values.firstName,
        last_name: values.lastName,
        full_name: `${values.firstName} ${values.lastName}`,
      },
    },
  });
}
