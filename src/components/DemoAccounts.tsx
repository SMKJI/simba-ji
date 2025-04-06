
import { useState, useEffect } from 'react';
import { Info, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface DemoAccountsProps {
  onSelectAccount?: (email: string) => void;
}

interface AccountUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const DemoAccounts = ({ onSelectAccount }: DemoAccountsProps) => {
  const [accounts, setAccounts] = useState<AccountUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDemoAccountsClicked, setCreateDemoAccountsClicked] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      console.log('Fetching staff accounts...');
      setLoading(true);
      setError(null);
      
      // Fetch profiles with staff roles (admin, helpdesk, content)
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .in('role', ['admin', 'helpdesk', 'content', 'helpdesk_offline'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching accounts:', error);
        setError(error.message);
        setLoading(false);
        return;
      }
      
      if (data && Array.isArray(data)) {
        console.log('Staff accounts fetched:', data);
        setAccounts(data);
      } else {
        setError('Tidak dapat memuat data akun staff');
      }
    } catch (err) {
      console.error('Error in fetchAccounts:', err);
      setError('Gagal memuat akun staff');
    } finally {
      setLoading(false);
    }
  };

  const createDemoAccounts = async () => {
    try {
      setCreateDemoAccountsClicked(true);
      console.log('Creating demo accounts...');
      
      // Create admin account
      const { data: adminData, error: adminError } = await supabase.auth.signUp({
        email: 'admin@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'Administrator',
            role: 'admin'
          }
        }
      });
      
      if (adminError) {
        console.error('Error creating admin account:', adminError);
      }
      
      // Create helpdesk account
      const { data: helpdeskData, error: helpdeskError } = await supabase.auth.signUp({
        email: 'helpdesk@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'Helpdesk Staff',
            role: 'helpdesk'
          }
        }
      });
      
      if (helpdeskError) {
        console.error('Error creating helpdesk account:', helpdeskError);
      }
      
      // Create content account
      const { data: contentData, error: contentError } = await supabase.auth.signUp({
        email: 'content@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'Content Manager',
            role: 'content'
          }
        }
      });
      
      if (contentError) {
        console.error('Error creating content account:', contentError);
      }
      
      // Update admin role
      if (adminData && adminData.user) {
        const { error: updateAdminError } = await supabase
          .rpc('update_user_role', {
            user_id: adminData.user.id,
            new_role: 'admin'
          });
        
        if (updateAdminError) {
          console.error('Error updating admin role:', updateAdminError);
        }
      }
      
      // Update helpdesk role
      if (helpdeskData && helpdeskData.user) {
        const { error: updateHelpdeskError } = await supabase
          .rpc('update_user_role', {
            user_id: helpdeskData.user.id,
            new_role: 'helpdesk'
          });
        
        if (updateHelpdeskError) {
          console.error('Error updating helpdesk role:', updateHelpdeskError);
        }
      }
      
      // Update content role
      if (contentData && contentData.user) {
        const { error: updateContentError } = await supabase
          .rpc('update_user_role', {
            user_id: contentData.user.id,
            new_role: 'content'
          });
        
        if (updateContentError) {
          console.error('Error updating content role:', updateContentError);
        }
      }
      
      // Refresh accounts list
      await fetchAccounts();
      
    } catch (err) {
      console.error('Error creating demo accounts:', err);
    }
  };

  return (
    <Card className="mb-8">
      <Accordion type="single" collapsible className="w-full" defaultValue="available-accounts">
        <AccordionItem value="available-accounts">
          <AccordionTrigger className="px-4 py-3">
            <div className="flex items-center text-primary">
              <Info className="w-4 h-4 mr-2" />
              Akun Staff Tersedia
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3 text-sm mt-2">
              <Alert variant="default" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Informasi Login</AlertTitle>
                <AlertDescription>
                  Password default untuk akun staff adalah: <span className="font-mono font-semibold">password123</span>
                </AlertDescription>
              </Alert>
              
              {loading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="text-center text-red-500">
                  <AlertCircle className="h-4 w-4 mx-auto mb-2" />
                  <p>{error}</p>
                </div>
              ) : accounts.length === 0 ? (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">Tidak ada akun staff ditemukan</p>
                  {!createDemoAccountsClicked && (
                    <Button 
                      onClick={createDemoAccounts}
                      size="sm" 
                      className="mt-2"
                    >
                      Buat Akun Demo
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {accounts.map((account) => (
                    <div 
                      key={account.id}
                      className={`p-3 border rounded-md ${onSelectAccount ? 'hover:bg-muted cursor-pointer transition-colors' : ''}`}
                      onClick={() => onSelectAccount && onSelectAccount(account.email)}
                    >
                      <p className="font-semibold">{account.name}</p>
                      <p className="text-xs text-muted-foreground">Email: {account.email}</p>
                      <p className="text-xs font-medium mt-1 capitalize">Peran: {account.role.replace('_', ' ')}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default DemoAccounts;
