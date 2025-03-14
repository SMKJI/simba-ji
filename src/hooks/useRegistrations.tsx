
import { useState, useEffect } from 'react';

// This would be replaced with a real API call in a production app
const MOCK_DATA = {
  total: 1327,
  groups: [
    { id: 1, name: 'Grup 1', count: 1000, isFull: true },
    { id: 2, name: 'Grup 2', count: 327, isFull: false },
    { id: 3, name: 'Grup 3', count: 0, isFull: false },
  ]
};

export interface RegistrationStats {
  total: number;
  groups: {
    id: number;
    name: string;
    count: number;
    isFull: boolean;
  }[];
}

export const useRegistrations = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<RegistrationStats>(MOCK_DATA);
  const [error, setError] = useState<string | null>(null);

  // In a real app, this would fetch from an API endpoint
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from an API endpoint
        // const response = await fetch('/api/registration-stats');
        // const data = await response.json();
        // setStats(data);
        
        // For demo, we'll just simulate a loading delay and use mock data
        setTimeout(() => {
          setStats(MOCK_DATA);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load registration data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to simulate submitting a registration form
  const submitRegistration = async (formData: any) => {
    setLoading(true);
    
    try {
      // In a real app, you would post to an API endpoint
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // const data = await response.json();
      
      // For demo, we'll simulate a successful registration after a delay
      return new Promise((resolve) => {
        setTimeout(() => {
          // Determine the group based on current counts
          let assignedGroup = stats.groups.find(group => !group.isFull);
          
          if (!assignedGroup) {
            assignedGroup = {
              id: stats.groups.length + 1,
              name: `Grup ${stats.groups.length + 1}`,
              count: 0,
              isFull: false
            };
          }
          
          // Simulate updating the stats
          const updatedStats = {...stats};
          updatedStats.total += 1;
          
          const groupIndex = updatedStats.groups.findIndex(g => g.id === assignedGroup!.id);
          if (groupIndex >= 0) {
            updatedStats.groups[groupIndex].count += 1;
            
            // Check if group is now full
            if (updatedStats.groups[groupIndex].count >= 1000) {
              updatedStats.groups[groupIndex].isFull = true;
            }
          }
          
          setStats(updatedStats);
          setLoading(false);
          
          resolve({
            success: true,
            data: {
              registrationId: Math.floor(1000000 + Math.random() * 9000000),
              assignedGroup: assignedGroup!.name,
              groupLink: "https://chat.whatsapp.com/example",
              timestamp: new Date().toISOString()
            }
          });
        }, 1500);
      });
    } catch (err) {
      setError('Failed to submit registration');
      setLoading(false);
      throw err;
    }
  };

  return { stats, loading, error, submitRegistration };
};
