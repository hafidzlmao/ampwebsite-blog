import { signUpWithSupabase, signInWithSupabase, signOutFromSupabase, getSupabaseSession } from './supabase';
import { signUpSchema } from './validation';
import type { SignUpCredentials, SignInCredentials, AuthError } from './types';

export async function signUp(credentials: SignUpCredentials) {
  try {
    // Validate credentials
    const validatedData = signUpSchema.parse(credentials);
    
    // Attempt signup
    const data = await signUpWithSupabase(validatedData);
    return data;
  } catch (error) {
    const authError: AuthError = {
      message: error.message || 'Failed to sign up',
      code: error.code,
    };
    throw authError;
  }
}

export async function signIn(credentials: SignInCredentials) {
  try {
    // Log the attempt
    console.log('Attempting to sign in with:', credentials.username);
    
    const data = await signInWithSupabase(credentials);
    
    if (!data || !data.user) {
      throw new Error('No user data returned from authentication');
    }
    
    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    const authError: AuthError = {
      message: error.message || 'Invalid username or password',
      code: error.code || 'AUTH_ERROR',
    };
    throw authError;
  }
}

export async function signOut() {
  await signOutFromSupabase();
}

export async function getSession() {
  return getSupabaseSession();
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}