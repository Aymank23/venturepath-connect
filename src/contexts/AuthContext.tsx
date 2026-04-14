import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'applicant' | 'reviewer' | 'mentor' | 'admin';
type PortalPreference = 'participant' | 'staff';

const AUTH_PREFERENCE_STORAGE_KEY = 'iep-auth-preference';

interface StoredAuthPreference {
  userId: string | null;
  activeRole: AppRole | null;
  portal: PortalPreference | null;
}

const emptyStoredPreference: StoredAuthPreference = {
  userId: null,
  activeRole: null,
  portal: null,
};

const readStoredPreference = (): StoredAuthPreference => {
  if (typeof window === 'undefined') return emptyStoredPreference;

  try {
    const rawPreference = window.sessionStorage.getItem(AUTH_PREFERENCE_STORAGE_KEY);
    if (!rawPreference) return emptyStoredPreference;

    const parsedPreference = JSON.parse(rawPreference) as Partial<StoredAuthPreference>;

    return {
      userId: typeof parsedPreference.userId === 'string' ? parsedPreference.userId : null,
      activeRole: parsedPreference.activeRole ?? null,
      portal: parsedPreference.portal ?? null,
    };
  } catch {
    return emptyStoredPreference;
  }
};

interface SignInOptions {
  portal?: PortalPreference;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  activeRole: AppRole | null;
  setActiveRole: (role: AppRole) => void;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string, options?: SignInOptions) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [activeRole, setActiveRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const activeRoleRef = useRef<AppRole | null>(null);
  const currentUserIdRef = useRef<string | null>(null);
  const storedPreferenceRef = useRef<StoredAuthPreference>(readStoredPreference());
  const portalPreferenceRef = useRef<PortalPreference | null>(storedPreferenceRef.current.portal);

  const persistPreference = (nextPreference: StoredAuthPreference) => {
    storedPreferenceRef.current = nextPreference;

    if (typeof window === 'undefined') return;

    if (!nextPreference.userId && !nextPreference.activeRole && !nextPreference.portal) {
      window.sessionStorage.removeItem(AUTH_PREFERENCE_STORAGE_KEY);
      return;
    }

    window.sessionStorage.setItem(AUTH_PREFERENCE_STORAGE_KEY, JSON.stringify(nextPreference));
  };

  const updateStoredPreference = (updates: Partial<StoredAuthPreference>) => {
    persistPreference({
      ...storedPreferenceRef.current,
      ...updates,
    });
  };

  const resetAuthState = () => {
    currentUserIdRef.current = null;
    activeRoleRef.current = null;
    portalPreferenceRef.current = null;
    setRoles([]);
    setActiveRole(null);
    persistPreference(emptyStoredPreference);
  };

  const applyActiveRole = (role: AppRole | null, userId: string | null = currentUserIdRef.current) => {
    activeRoleRef.current = role;
    setActiveRole(role);

    updateStoredPreference({
      userId,
      activeRole: role,
      portal: portalPreferenceRef.current,
    });
  };

  const setSelectedRole = (role: AppRole) => {
    portalPreferenceRef.current = role === 'applicant' ? 'participant' : 'staff';
    applyActiveRole(role, currentUserIdRef.current);
  };

  const resolveActiveRole = (availableRoles: AppRole[], userId: string) => {
    const storedActiveRole = storedPreferenceRef.current.userId === userId
      ? storedPreferenceRef.current.activeRole
      : null;

    if (currentUserIdRef.current === userId && activeRoleRef.current && availableRoles.includes(activeRoleRef.current)) {
      return activeRoleRef.current;
    }

    if (storedActiveRole && availableRoles.includes(storedActiveRole)) {
      return storedActiveRole;
    }

    const preferredStaffRole = availableRoles.find(role => role !== 'applicant');

    if (portalPreferenceRef.current === 'staff' && preferredStaffRole) {
      return preferredStaffRole;
    }

    if (portalPreferenceRef.current === 'participant' && availableRoles.includes('applicant')) {
      return 'applicant';
    }

    return availableRoles[0] ?? null;
  };

  const fetchRoles = async (userId: string) => {
    currentUserIdRef.current = userId;

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (error) {
      setRoles([]);
      applyActiveRole(null, userId);
      return [];
    }

    const userRoles = (data?.map(r => r.role) || []) as AppRole[];
    setRoles(userRoles);
    applyActiveRole(resolveActiveRole(userRoles, userId), userId);
    return userRoles;
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        portalPreferenceRef.current = storedPreferenceRef.current.portal;
        await fetchRoles(session.user.id);
      } else {
        resetAuthState();
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        portalPreferenceRef.current = storedPreferenceRef.current.portal;
        await fetchRoles(session.user.id);
      } else {
        resetAuthState();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    return { error };
  };

  const signIn = async (email: string, password: string, options?: SignInOptions) => {
    portalPreferenceRef.current = options?.portal ?? null;
    persistPreference({
      userId: null,
      activeRole: null,
      portal: portalPreferenceRef.current,
    });

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      resetAuthState();
    }
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    resetAuthState();
  };

  const hasRole = (role: AppRole) => roles.includes(role);

  return (
    <AuthContext.Provider value={{ user, session, roles, activeRole, setActiveRole: setSelectedRole, loading, signUp, signIn, signOut, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
