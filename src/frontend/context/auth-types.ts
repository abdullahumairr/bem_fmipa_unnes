export type UserRole = 'admin' | 'member';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface AuthState {
  session: import('@supabase/supabase-js').Session | null;
  user: import('@supabase/supabase-js').User | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
}

export interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: string | null; needsApproval: boolean }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
