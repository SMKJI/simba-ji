
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
            is_active,
            operator_id (
              id:user_id, 
              profiles:user_id (name)
            )
          `)
          .order('name');

        if (error) {
          throw error;
        }

        // Format the data to match our Counter interface
        const formattedCounters: Counter[] = data.map(counter => {
          // Handle the case when operator_id is null or profiles is null
          const operatorInfo = counter.operator_id;
          
          // Check if operatorInfo exists and is an object (not null/undefined)
          let operatorName = 'Unknown';
          let operatorId = '';
          
          if (operatorInfo && typeof operatorInfo === 'object') {
            // Access the profiles property safely
            const profilesData = operatorInfo.profiles;
            
            if (profilesData && typeof profilesData === 'object') {
              // If it's a single object with name property
              if ('name' in profilesData) {
                operatorName = profilesData.name || 'Unknown';
              } 
              // If it's an array of objects with name property
              else if (Array.isArray(profilesData) && profilesData.length > 0 && 'name' in profilesData[0]) {
                operatorName = profilesData[0].name || 'Unknown';
              }
            }
            
            operatorId = operatorInfo.id || '';
          }
          
          return {
            id: counter.id,
            name: counter.name,
            description: counter.name, // Using name as description since description doesn't exist
            is_active: counter.is_active,
            operators: operatorInfo ? [{
              id: operatorId,
              name: operatorName
            }] : undefined
          };
        });

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
