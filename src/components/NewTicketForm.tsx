
import { useState } from 'react';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewTicketFormProps {
  onClose: () => void;
  onTicketCreated: () => void;
}

const NewTicketForm = ({ onClose, onTicketCreated }: NewTicketFormProps) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTicket } = useRegistrations();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast({
        title: 'Form tidak lengkap',
        description: 'Subjek dan pesan harus diisi',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    const ticket = createTicket(subject.trim(), message.trim());
    setIsSubmitting(false);
    
    if (ticket) {
      toast({
        title: 'Tiket berhasil dibuat',
        description: 'Tiket bantuan Anda telah dibuat. Tim helpdesk akan segera menghubungi Anda.',
      });
      onTicketCreated();
    } else {
      toast({
        title: 'Gagal membuat tiket',
        description: 'Terjadi kesalahan saat membuat tiket',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b p-6">
        <CardTitle className="text-xl font-semibold text-primary flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Buat Tiket Bantuan Baru
        </CardTitle>
        <CardDescription>
          Sampaikan pertanyaan atau masalah Anda kepada tim helpdesk
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subjek
            </label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Misalnya: Kendala pendaftaran, Pertanyaan jurusan, dll."
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Pesan
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Jelaskan dengan detail pertanyaan atau masalah yang Anda hadapi..."
              rows={5}
              required
            />
          </div>
        </CardContent>
        
        <CardFooter className="px-6 pb-6 pt-0 flex flex-col sm:flex-row gap-2">
          <Button 
            type="submit" 
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </span>
            ) : (
              'Kirim Tiket'
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Batal
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default NewTicketForm;
