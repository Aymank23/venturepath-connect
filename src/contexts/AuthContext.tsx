import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'applicant' | 'reviewer' | 'mentor' | 'admin';
type PortalPreference = 'participant' | 'staff';

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
  const portalPreferenceRef = useRef<PortalPreference | null>(null);

  const applyActiveRole = (role: AppRole | null) => {
    activeRoleRef.current = role;
    setActiveRole(role);
  };

  const setSelectedRole = (role: AppRole) => {
    portalPreferenceRef.current = role === 'applicant' ? 'participant' : 'staff';
    applyActiveRole(role);
  };

  const resolveActiveRole = (availableRoles: AppRole[]) => {
    if (activeRoleRef.current && availableRoles.includes(activeRoleRef.current)) {
      return activeRoleRef.current;
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
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    const userRoles = (data?.map(r => r.role) || []) as AppRole[];
    setRoles(userRoles);
    applyActiveRole(resolveActiveRole(userRoles));
    return userRoles;
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchRoles(session.user.id);
      } else {
        setRoles([]);
        portalPreferenceRef.current = null;
        applyActiveRole(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchRoles(session.user.id);
      } else {
        setRoles([]);
        portalPreferenceRef.current = null;
        applyActiveRole(null);
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      portalPreferenceRef.current = null;
    }
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRoles([]);
    portalPreferenceRef.current = null;
    applyActiveRole(null);
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
