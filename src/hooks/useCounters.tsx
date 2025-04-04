
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Counter {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  operators?: {
    id: string;
    name: string;
  }[];
}

export const useCounters = () => {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const { data, error } = await supabase
          .from('helpdesk_counters')
          .select(`
            id, 
            name, 
            description, 
            is_active,
            operators:operator_id (
              id:user_id, 
              profiles:user_id (name)
            )
          `)
          .order('name');

        if (error) {
          throw error;
        }

        // Format the data to match our Counter interface
        const formattedCounters: Counter[] = data.map(counter => ({
          id: counter.id,
          name: counter.name,
          description: counter.description || '',
          is_active: counter.is_active,
          operators: counter.operators ? [{
            id: counter.operators.id,
            name: counter.operators.profiles?.name || 'Unknown'
          }] : undefined
        }));

        setCounters(formattedCounters);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching counters:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCounters();
  }, []);

  return { counters, loading, error };
};
