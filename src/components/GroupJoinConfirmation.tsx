
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Group } from '@/types/supabase';
import { Check, Copy, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const GroupJoinConfirmation = () => {
  const { getUserAssignedGroup, confirmGroupJoin, currentUser, stats } = useRegistrations();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copySuccess, setCopySuccess] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [assignedGroup, setAssignedGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      const group = await getUserAssignedGroup();
      setAssignedGroup(group);
      setLoading(false);
    };
    
    fetchGroup();
  }, [getUserAssignedGroup]);
  
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
  
  const navigateToAvailableGroup = () => {
    // Find a group that isn't full
    const availableGroup = stats.groups.find(g => !g.isFull);
    
    if (availableGroup) {
      navigate(`/group-detail/${availableGroup.id}`);
    } else {
      toast({
        title: 'Tidak ada grup tersedia',
        description: 'Semua grup saat ini penuh. Silakan coba lagi nanti.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
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
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              Anda belum ditugaskan ke grup WhatsApp. Silakan bergabung dengan salah satu grup yang tersedia.
            </p>
          </div>
          
          <div className="mt-6 space-y-4">
            <h3 className="font-medium">Grup WhatsApp yang tersedia:</h3>
            
            {stats.groups.map((group) => (
              <div key={group.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-medium">{group.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {group.member_count} pendaftar dari {group.capacity} kapasitas
                    </p>
                  </div>
                  <Button
                    variant={group.isFull ? "secondary" : "outline"}
                    size="sm"
                    disabled={group.isFull}
                    onClick={() => navigate(`/group-detail/${group.id}`)}
                  >
                    {group.isFull ? 'Penuh' : 'Lihat Detail'}
                  </Button>
                </div>
                <Progress 
                  value={(group.member_count / group.capacity) * 100} 
                  className={`h-2 ${group.isFull ? 'bg-secondary/20' : 'bg-primary/20'}`}
                />
              </div>
            ))}
            
            <div className="p-4 bg-primary/5 rounded-lg mt-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                <p className="text-sm">
                  Bergabunglah dengan grup WhatsApp untuk mendapatkan informasi terbaru tentang penerimaan murid baru.
                </p>
              </div>
            </div>
            
            <Button
              className="mt-4 w-full"
              onClick={navigateToAvailableGroup}
            >
              Cari Grup Tersedia
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b p-6">
        <CardTitle className="text-xl font-semibold text-primary">
          Grup WhatsApp Anda
        </CardTitle>
        <CardDescription>
          Informasi grup WhatsApp untuk calon murid baru
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div>
                <h2 className="font-medium">{assignedGroup.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Grup WhatsApp untuk pendaftaran
                </p>
              </div>
            </div>
            <div className="text-sm font-medium">
              {assignedGroup.member_count} / {assignedGroup.capacity}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Status Kapasitas</span>
              <span>{assignedGroup.isFull ? 'Penuh' : 'Tersedia'}</span>
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
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                value={assignedGroup.invite_link}
                readOnly
                className="flex-1 p-2 border rounded bg-white text-sm w-full"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(assignedGroup.invite_link)}
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
              onClick={() => window.open(assignedGroup.invite_link, '_blank')}
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

export default GroupJoinConfirmation;
