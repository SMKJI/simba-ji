
import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

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

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        console.log('Fetching demo accounts...');
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email, role')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching accounts:', error);
          setError(error.message);
          setLoading(false);
          return;
        }
        
        if (data) {
          console.log('Demo accounts fetched:', data);
          setAccounts(data);
        }
      } catch (err) {
        console.error('Error in fetchAccounts:', err);
        setError('Failed to load accounts');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <Card className="mb-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="available-accounts">
          <AccordionTrigger className="px-4 py-3">
            <div className="flex items-center text-primary">
              <Info className="w-4 h-4 mr-2" />
              Akun Tersedia untuk Akses
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3 text-sm mt-2">
              <p className="font-medium text-muted-foreground mb-2">
                Detail akun yang tersedia di sistem:
              </p>
              
              {loading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : accounts.length === 0 ? (
                <p className="text-center text-muted-foreground">Tidak ada akun ditemukan</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {accounts.map((account) => (
                    <div 
                      key={account.id}
                      className={`p-3 border rounded-md ${onSelectAccount ? 'hover:bg-muted cursor-pointer' : ''}`}
                      onClick={() => onSelectAccount && onSelectAccount(account.email)}
                    >
                      <p className="font-semibold">{account.name}</p>
                      <p className="text-xs text-muted-foreground">Email: {account.email}</p>
                      <p className="text-xs font-medium mt-1">Peran: {account.role}</p>
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
