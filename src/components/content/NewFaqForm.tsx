
import { useState } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface NewFaqFormProps {
  onAdd: (question: string, answer: string) => void;
}

const NewFaqForm = ({ onAdd }: NewFaqFormProps) => {
  const { toast } = useToast();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (!question || !answer) {
      toast({
        title: 'Form tidak lengkap',
        description: 'Pertanyaan dan jawaban harus diisi',
        variant: 'destructive',
      });
      return;
    }
    
    onAdd(question, answer);
    setQuestion('');
    setAnswer('');
    
    toast({
      title: 'FAQ Ditambahkan',
      description: 'FAQ baru telah berhasil ditambahkan',
    });
  };

  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden mb-8">
      <CardHeader className="bg-primary/5 border-b p-6">
        <CardTitle className="text-xl font-semibold text-primary">
          Tambah FAQ Baru
        </CardTitle>
        <CardDescription>
          Tambahkan pertanyaan dan jawaban untuk FAQ
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pertanyaan</label>
            <Input 
              placeholder="Masukkan pertanyaan" 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Jawaban</label>
            <Textarea 
              placeholder="Masukkan jawaban" 
              className="min-h-[120px]"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSubmit}>
              <FileText className="mr-2 h-4 w-4" />
              Tambah FAQ
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewFaqForm;
