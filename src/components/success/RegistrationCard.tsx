
import { useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export interface RegistrationResult {
  registrationId: number;
  assignedGroup: string;
  groupLink: string;
  timestamp: string;
}

interface RegistrationCardProps {
  data: RegistrationResult;
}

const RegistrationCard = ({ data }: RegistrationCardProps) => {
  const { toast } = useToast();
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess(true);
        toast({
          title: 'Tersalin ke clipboard',
          description: 'Link grup WhatsApp telah disalin',
        });
        
        setTimeout(() => setCopySuccess(false), 2000);
      },
      () => {
        toast({
          title: 'Gagal menyalin',
          description: 'Tidak dapat menyalin link. Silakan coba lagi.',
          variant: 'destructive',
        });
      }
    );
  };

  // Format date in Indonesian locale
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden animate-scale-in">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-primary/70 uppercase tracking-wide mb-1">
              Nomor Pendaftaran
            </h3>
            <p className="text-2xl font-bold text-primary">
              {data.registrationId}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
              Waktu Pendaftaran
            </h3>
            <p className="font-medium">
              {formatDate(data.timestamp)}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
              Grup WhatsApp yang Ditugaskan
            </h3>
            <p className="font-medium text-secondary">
              {data.assignedGroup}
            </p>
          </div>
          
          <div className="bg-accent/10 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-accent-foreground/70 uppercase tracking-wide mb-2">
              Link Grup WhatsApp
            </h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={data.groupLink}
                readOnly
                className="flex-1 p-2 border rounded bg-white text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(data.groupLink)}
                className={copySuccess ? "bg-green-100 text-green-600" : ""}
              >
                {copySuccess ? (
                  <>
                    <Check className="h-4 w-4 mr-1" /> Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" /> Salin
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Button
              variant="default"
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => window.open(data.groupLink, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Gabung Grup WhatsApp Sekarang
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>
              Silakan gabung dengan grup WhatsApp yang telah ditentukan untuk mendapatkan informasi lebih lanjut
              mengenai proses penerimaan murid baru.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistrationCard;
