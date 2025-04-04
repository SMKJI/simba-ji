import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { HelpdeskCounter, HelpdeskOperator } from '@/types/supabase';

const OfflineHelpdesk = () => {
  const { currentUser, hasRole, fetchHelpdeskOperators } = useRegistrations();
  const { toast } = useToast();
  const [counters, setCounters] = useState<HelpdeskCounter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (currentUser && hasRole('admin')) {
      fetchCounters();
    }
  }, [currentUser]);

  const fetchCounters = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('helpdesk_counters')
        .select(`
          *,
          operators:helpdesk_operators (
            id,
            user_id,
            is_active,
            is_offline,
            updated_at
          )
        `)
        .order('name');

      if (error) throw error;
      setCounters(data as HelpdeskCounter[]);
    } catch (error) {
      console.error('Error fetching counters:', error);
      toast({
        title: 'Error',
        description: 'Failed to load helpdesk counters',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCounter = async () => {
    const name = prompt('Enter counter name:');
    if (!name) return;

    try {
      const { error } = await supabase
        .from('helpdesk_counters')
        .insert({ name });

      if (error) throw error;
      fetchCounters();
      toast({
        title: 'Success',
        description: 'Counter created successfully',
      });
    } catch (error) {
      console.error('Error creating counter:', error);
      toast({
        title: 'Error',
        description: 'Failed to create counter',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateCounter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('helpdesk_counters')
        .update({ name: editName })
        .eq('id', id);

      if (error) throw error;
      fetchCounters();
      setIsEditing(null);
      toast({
        title: 'Success',
        description: 'Counter updated successfully',
      });
    } catch (error) {
      console.error('Error updating counter:', error);
      toast({
        title: 'Error',
        description: 'Failed to update counter',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteCounter = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this counter?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('helpdesk_counters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchCounters();
      toast({
        title: 'Success',
        description: 'Counter deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting counter:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete counter',
        variant: 'destructive'
      });
    }
  };

  if (!currentUser || !hasRole('admin')) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Offline Helpdesk Management</h1>
            <p className="text-muted-foreground">Manage helpdesk counters</p>
          </div>
          <Button onClick={handleCreateCounter}>Create Counter</Button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <Card className="overflow-hidden border-0 shadow-md">
            <CardHeader className="bg-muted/50 p-4">
              <CardTitle>Helpdesk Counters</CardTitle>
              <CardDescription>List of available helpdesk counters</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Counter Name
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Operator
                      </th>
                      <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {counters.map((counter) => (
                      <tr key={counter.id}>
                        <td className="p-2 border">
                          <div className="flex items-center">
                            <span className="font-medium">{counter.name}</span>
                            {counter.operator_id && (
                              <Badge variant="outline" className="ml-2 bg-green-50 text-green-600">
                                Active
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-2 border">
                          {counter.operators && Array.isArray(counter.operators) && counter.operators.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {counter.operators?.map((op) => (
                                <div key={op.id} className="text-sm">
                                  {op.name}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">No operator assigned</span>
                          )}
                        </td>
                        <td className="p-2 border">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant={isEditing === counter.id ? "default" : "outline"}
                              onClick={() => setIsEditing(isEditing === counter.id ? null : counter.id)}
                            >
                              {isEditing === counter.id ? "Cancel" : "Edit"}
                            </Button>
                            {isEditing !== counter.id && (
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteCounter(counter.id)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                          {isEditing === counter.id && (
                            <div className="mt-2 flex flex-col gap-2">
                              <Input 
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="Counter name"
                                className="text-sm"
                              />
                              <Button 
                                size="sm" 
                                onClick={() => handleUpdateCounter(counter.id)}
                                disabled={!editName.trim()}
                              >
                                Save
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OfflineHelpdesk;
