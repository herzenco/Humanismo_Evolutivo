"use client";
import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/integrations/supabase/client';
export function useAdmin() {
  const [state, setState] = useState<{ isAdmin: boolean; loading: boolean; user: User | null }>({
    isAdmin: false, loading: isSupabaseConfigured, user: null,
  });
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    let revision = 0;
    let timer: ReturnType<typeof setTimeout>;
    async function check() {
      const current = ++revision;
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        let isAdmin = false;
        if (user) {
          const { data, error } = await supabase.from('user_roles').select('role')
            .eq('user_id', user.id).eq('role', 'admin').maybeSingle();
          if (error) throw error;
          isAdmin = Boolean(data);
        }
        if (active && current === revision) setState({ isAdmin, loading: false, user });
      } catch {
        if (active && current === revision) setState({ isAdmin: false, loading: false, user: null });
      }
    }
    void check();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      ++revision;
      if (!session) setState({ isAdmin: false, loading: false, user: null });
      clearTimeout(timer);
      timer = setTimeout(() => { void check(); }, 0);
    });
    return () => { active = false; ++revision; clearTimeout(timer); subscription.unsubscribe(); };
  }, []);
  return state;
}
