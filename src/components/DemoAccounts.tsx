
import { Info } from 'lucide-react';
import { DEMO_ACCOUNTS } from '@/hooks/useRegistrations';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card } from '@/components/ui/card';

interface DemoAccountsProps {
  onSelectAccount?: (email: string) => void;
}

const DemoAccounts = ({ onSelectAccount }: DemoAccountsProps) => {
  return (
    <Card className="mb-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="demo-accounts">
          <AccordionTrigger className="px-4 py-3">
            <div className="flex items-center text-primary">
              <Info className="w-4 h-4 mr-2" />
              Akun Demo untuk Testing
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3 text-sm mt-2">
              <p className="font-medium text-muted-foreground mb-2">
                Detail akun untuk testing berbagai peran:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DEMO_ACCOUNTS.map((account) => (
                  <div 
                    key={account.id}
                    className={`p-3 border rounded-md ${onSelectAccount ? 'hover:bg-muted cursor-pointer' : ''}`}
                    onClick={() => onSelectAccount && onSelectAccount(account.email)}
                  >
                    <p className="font-semibold">{account.name}</p>
                    <p className="text-xs text-muted-foreground">Email: {account.email}</p>
                    <p className="text-xs text-muted-foreground">Password: password123</p>
                    <p className="text-xs font-medium mt-1">Peran: {account.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default DemoAccounts;
