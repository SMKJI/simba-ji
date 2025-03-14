
import { useState } from 'react';
import { Check, Pencil, Trash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export interface Faq {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  order: number;
}

interface FaqItemProps {
  faq: Faq;
  onUpdate: (id: string, field: 'question' | 'answer', value: string) => void;
  onUpdateStatus: (id: string) => void;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
}

const FaqItem = ({ 
  faq, 
  onUpdate, 
  onUpdateStatus, 
  onSave, 
  onDelete 
}: FaqItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className={`border-0 shadow-md rounded-xl overflow-hidden ${!faq.isActive ? 'opacity-70' : ''}`}>
      <CardHeader className="bg-primary/5 border-b p-4 flex-row items-start justify-between space-y-0">
        {isEditing ? (
          <Input 
            className="font-semibold text-lg mb-1"
            value={faq.question}
            onChange={(e) => onUpdate(faq.id, 'question', e.target.value)}
          />
        ) : (
          <CardTitle className="text-lg font-semibold">
            {faq.question}
          </CardTitle>
        )}
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                size="sm"
                onClick={() => {
                  onSave(faq.id);
                  setIsEditing(false);
                }}
              >
                <Check className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onUpdateStatus(faq.id)}
              >
                {faq.isActive ? 'Nonaktifkan' : 'Aktifkan'}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onDelete(faq.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isEditing ? (
          <Textarea 
            className="min-h-[100px]"
            value={faq.answer}
            onChange={(e) => onUpdate(faq.id, 'answer', e.target.value)}
          />
        ) : (
          <p className="text-sm">{faq.answer}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default FaqItem;
