
import { useState } from 'react';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Group } from '@/types/supabase'; // Updated import
import { Check, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const GroupJoinConfirmation = () => {
  const { getUserAssignedGroup, confirmGroupJoin, currentUser } = useRegistrations();
  const { toast } = useToast();
  const [copySuccess, setCopySuccess] = useState(false);
  const [confirming, setConfirming] = useState(false);
  
  const assignedGroup = getUserAssignedGroup();
  
  if (!assignedGroup) {
    return (
      <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-primary/5 border-b p-6">
          <CardTitle className="text-xl font-semibold text-primary">
            Grup WhatsApp
          </CardTitle>
          <CardDescription>
            Informasi grup WhatsApp untuk calon murid baru
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-1">Grup belum tersedia</h3>
            <p className="text-sm text-yellow-700">
              Anda belum ditugaskan ke grup WhatsApp. Silakan hubungi helpdesk jika ini adalah kesalahan.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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

  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b p-6">
        <CardTitle className="text-xl font-semibold text-primary">
          Grup WhatsApp Anda
        </CardTitle>
        <CardDescription>
          Silakan bergabung dengan grup WhatsApp untuk informasi selanjutnya
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">{assignedGroup.name}</h3>
            <div className="text-sm text-gray-600 mb-2">
              <p>Grup WhatsApp untuk calon murid baru. Bergabunglah untuk mendapatkan informasi terbaru.</p>
            </div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Kapasitas</span>
              <span>{assignedGroup.member_count} / {assignedGroup.capacity}</span>
            </div>
            <Progress 
              value={(assignedGroup.member_count / assignedGroup.capacity) * 100} 
              className={`h-2 ${assignedGroup.isFull ? 'bg-secondary/20' : 'bg-primary/20'}`}
            />
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              Link Grup WhatsApp
            </h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={assignedGroup.invite_link || "https://chat.whatsapp.com/example"}
                readOnly
                className="flex-1 p-2 border rounded bg-white text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(assignedGroup.invite_link || "https://chat.whatsapp.com/example")}
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
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="default"
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white flex-1"
              onClick={() => window.open(assignedGroup.link || "https://chat.whatsapp.com/example", '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Buka Grup WhatsApp
            </Button>
            
            <Button
              variant={currentUser?.joinConfirmed ? "secondary" : "outline"}
              size="lg"
              className="flex-1"
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
          
          {!currentUser?.joinConfirmed && (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-1">Penting!</h3>
              <p className="text-sm text-yellow-700">
                Setelah bergabung dengan grup WhatsApp, jangan lupa untuk mengklik tombol konfirmasi di atas.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupJoinConfirmation;
