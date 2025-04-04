
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface QueueTicket {
  id: string;
  number: number;
  status: 'waiting' | 'called' | 'serving' | 'completed' | 'skipped';
  created_at: string;
  applicant?: {
    id: string;
    name: string;
  };
  purpose?: string;
}

export const useQueue = () => {
  const { user } = useAuth();
  const [currentTicket, setCurrentTicket] = useState<QueueTicket | null>(null);
  const [nextTicket, setNextTicket] = useState<QueueTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentTicket = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('queue_tickets')
        .select(`
          id,
          queue_number,
          status,
          created_at,
          user_id,
          profiles:user_id(name)
        `)
        .eq('operator_id', user.id)
        .in('status', ['called', 'serving'])
        .order('served_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // Safely extract the name with proper null checking
        const profileData = data.profiles;
        const applicantName = profileData?.name ?? 'Unknown';

        setCurrentTicket({
          id: data.id,
          number: data.queue_number,
          status: data.status as 'waiting' | 'called' | 'serving' | 'completed' | 'skipped',
          created_at: data.created_at,
          applicant: {
            id: data.user_id,
            name: applicantName
          },
          purpose: ''  // Default empty string since purpose column doesn't exist
        });
      } else {
        setCurrentTicket(null);
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching current ticket:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const callNextTicket = async (counterId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data: nextTicket, error: fetchError } = await supabase
        .from('queue_tickets')
        .select(`
          id,
          queue_number,
          status,
          created_at,
          user_id,
          profiles:user_id(name)
        `)
        .eq('status', 'waiting')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (!nextTicket) {
        throw new Error('No tickets waiting');
      }

      const now = new Date().toISOString();
      const { data: updatedTicket, error: updateError } = await supabase
        .from('queue_tickets')
        .update({
          status: 'called',
          counter_id: counterId,
          operator_id: user.id,
          served_at: now,
          updated_at: now
        })
        .eq('id', nextTicket.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Safely extract the name with proper null checking
      const profileData = nextTicket.profiles;
      const applicantName = profileData?.name ?? 'Unknown';

      setCurrentTicket({
        id: updatedTicket.id,
        number: updatedTicket.queue_number,
        status: updatedTicket.status as 'waiting' | 'called' | 'serving' | 'completed' | 'skipped',
        created_at: updatedTicket.created_at,
        applicant: {
          id: updatedTicket.user_id,
          name: applicantName
        },
        purpose: ''  // Default empty string since purpose column doesn't exist
      });

      return updatedTicket;
    } catch (error: any) {
      console.error('Error calling next ticket:', error);
      throw error;
    }
  };

  const completeTicket = async (ticketId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('queue_tickets')
        .update({
          status: 'completed',
          completed_at: now,
          updated_at: now
        })
        .eq('id', ticketId);

      if (error) {
        throw error;
      }

      setCurrentTicket(null);
      await fetchCurrentTicket();
    } catch (error: any) {
      console.error('Error completing ticket:', error);
      throw error;
    }
  };

  const skipTicket = async (ticketId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('queue_tickets')
        .update({
          status: 'skipped',
          completed_at: now,
          updated_at: now
        })
        .eq('id', ticketId);

      if (error) {
        throw error;
      }

      setCurrentTicket(null);
      await fetchCurrentTicket();
    } catch (error: any) {
      console.error('Error skipping ticket:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCurrentTicket();
  }, [user]);

  return {
    currentTicket,
    nextTicket,
    loading,
    error,
    callNextTicket,
    completeTicket,
    skipTicket,
    fetchCurrentTicket
  };
};
