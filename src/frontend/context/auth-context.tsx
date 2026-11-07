'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { Session, User } from '@supabase/supabase-js';

import { getSupabaseBrowser } from '@/backend/lib/supabase';
import type {
  AuthContextValue,
  Profile,
  UserRole,
} from '@/frontend/context/auth-types';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function translateAuthError(message: string | undefined): string {
  if (!message) return 'Terjadi kesalahan. Silakan coba lagi.';
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials')) {
    return 'Email atau password salah.';
  }
  if (lower.includes('user already registered')) {
    return 'Email sudah terdaftar. Silakan masuk.';
  }
  if (lower.includes('password should be at least')) {
    return 'Password minimal 6 karakter.';
  }
  if (lower.includes('email')) {
    return 'Format email tidak valid.';
  }
  return 'Terjadi kesalahan. Silakan coba lagi.';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseBrowser();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, role, created_at')
        .eq('id', userId)
        .maybeSingle();
      if (error) return null;
      return (data as Profile) ?? null;
    },
    [supabase]
  );

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const p = await fetchProfile(user.id);
    setProfile(p);
  }, [user, fetchProfile]);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      const s = data.session;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        const p = await fetchProfile(s.user.id);
        if (!active) return;
        setProfile(p);
      }
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      (async () => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          const p = await fetchProfile(s.user.id);
          setProfile(p);
        } else {
          setProfile(null);
        }
        setLoading(false);
      })();
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error ? translateAuthError(error.message) : null };
    },
    [supabase]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        return { error: translateAuthError(error.message), needsApproval: false };
      }
      const created = Boolean(data.user && data.session);
      return { error: null, needsApproval: created };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      role: (profile?.role as UserRole) ?? null,
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [session, user, profile, loading, signIn, signUp, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  }
  return ctx;
}
