import { createClient } from '@supabase/supabase-js';
import type { SignUpCredentials, SignInCredentials } from './types';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signUpWithSupabase({ email, password, username }: SignUpCredentials) {
  // First, check if username is already taken
  const { data: existingUser, error: checkError } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single();

  if (existingUser) {
    throw new Error('Username already taken');
  }

  // If username is available, proceed with signup
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username, // This will be used by the trigger to create the profile
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signInWithSupabase({ username, password }: SignInCredentials) {
  try {
    // Assume username is email for now
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });

    if (error) {
      console.error('Supabase auth error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function signOutFromSupabase() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSupabaseSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

export async function getCurrentUser() {
  const session = await getSupabaseSession();
  if (!session) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error) throw error;
  return profile;
}