import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Active session found:', currentSession);
        setSession(currentSession);
      } catch (error) {
        console.error('Error getting session:', error);
        setSession(null);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, 'New session:', newSession);
        setSession(newSession);
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing state');
          setSession(null);
          queryClient.clear();
          navigate('/auth');
        } else if (event === 'SIGNED_IN') {
          console.log('User signed in successfully');
          navigate('/');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, queryClient]);

  return { session };
};