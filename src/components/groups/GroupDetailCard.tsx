
import { useState } from 'react';
import { Copy, ExternalLink, Check, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Group } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

interface GroupDetailCardProps {
  group: Group;
}

const GroupDetailCard = ({ group }: GroupDetailCardProps) => {
  const { toast } = useToast();
  const { confirmGroupJoin, currentUser } = useRegistrations();
  const [copySuccess, setCopySuccess] = useState(false);
  const [confirming, setConfirming] = useState(false);

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

  const handleConfirmJoin = async () => {
    setConfirming(true);
    const result = await confirmGroupJoin();
    setConfirming(false);
    
    if (result.success) {
      toast({
        title: 'Berhasil!',
        description: 'Konfirmasi bergabung ke grup WhatsApp telah berhasil.',
      });
    } else {
      toast({
        title: 'Gagal!',
        description: result.error || 'Gagal mengkonfirmasi bergabung ke grup WhatsApp.',
        variant: 'destructive',
      });
    }
  };

  const memberCount = group.member_count || group.count || 0;

  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden mb-8">
      <CardHeader className="bg-primary/5 border-b p-6">
        <CardTitle className="text-xl font-semibold text-primary">
          Informasi Grup
        </CardTitle>
        <CardDescription>
          Informasi tentang grup WhatsApp {group.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="mr-3 h-5 w-5 text-muted-foreground" />
              <div>
                <h2 className="font-medium">{group.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Grup WhatsApp untuk pendaftaran
                </p>
              </div>
            </div>
            <div className="text-sm font-medium">
              {memberCount} / {group.capacity}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Status Kapasitas</span>
              <span>{group.isFull ? 'Penuh' : 'Tersedia'}</span>
            </div>
            <Progress 
              value={(memberCount / group.capacity) * 100} 
              className={`h-2 ${group.isFull ? 'bg-secondary/20' : 'bg-primary/20'}`}
            />
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              Link Grup WhatsApp
            </h3>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                value={group.invite_link || group.link || "https://chat.whatsapp.com/example"}
                readOnly
                className="flex-1 p-2 border rounded bg-white text-sm w-full"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(group.invite_link || group.link || "https://chat.whatsapp.com/example")}
                className={`${copySuccess ? "bg-green-100 text-green-600" : ""} w-full sm:w-auto`}
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
          
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Button
              variant="default"
              size="lg"
              className="w-full sm:w-auto sm:flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => window.open(group.invite_link || group.link || "https://chat.whatsapp.com/example", '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Buka Grup WhatsApp
            </Button>
            
            <Button
              variant={currentUser?.joinConfirmed ? "secondary" : "outline"}
              size="lg"
              className="w-full sm:w-auto sm:flex-1"
              disabled={currentUser?.joinConfirmed || confirming}
              onClick={handleConfirmJoin}
            >
              {confirming ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengkonfirmasi...
                </span>
              ) : currentUser?.joinConfirmed ? (
                <span className="flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  Sudah Bergabung
                </span>
              ) : (
                "Konfirmasi Sudah Bergabung"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupDetailCard;
