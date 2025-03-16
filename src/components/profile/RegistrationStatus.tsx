
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const RegistrationStatus = () => {
  const navigate = useNavigate();
  const { currentUser, getUserAssignedGroup } = useRegistrations();
  const assignedGroup = getUserAssignedGroup();
  
  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden mb-8">
      <CardHeader className="bg-primary/5 border-b p-6">
        <CardTitle className="text-xl font-semibold text-primary">
          Status Pendaftaran
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium text-gray-700">Nomor Pendaftaran</h3>
              <p className="text-lg text-primary font-semibold mt-1">{currentUser?.id || '1234567'}</p>
            </div>
            <Badge className="bg-green-500 hover:bg-green-600 px-3 py-1.5 flex items-center gap-1">
              <Check className="h-3.5 w-3.5" />
              <span>Terdaftar</span>
            </Badge>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-700">Grup WhatsApp</h3>
              <Badge variant="outline" className="px-3 py-1 border-primary text-primary">
                {assignedGroup?.name || 'Grup 2'}
              </Badge>
            </div>
            
            <Separator className="my-3" />
            
            <div className="flex justify-between items-center mt-3">
              <div className="text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                  Bergabunglah dengan grup WhatsApp untuk mendapatkan informasi terbaru
                </span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/group-detail/2')}
                  className="flex items-center"
                >
                  <ExternalLink className="mr-1 h-4 w-4" />
                  Lihat Grup
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-5 border rounded-lg bg-primary/5">
            <h3 className="font-medium text-primary mb-3">Langkah Berikutnya</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="ml-2">Unggah dokumen pendaftaran yang diperlukan (Rapor, Ijazah, dll.)</span>
              </li>
              <li className="flex items-start">
                <span className="ml-2">Bergabung dengan grup WhatsApp untuk mendapatkan informasi terbaru</span>
              </li>
              <li className="flex items-start">
                <span className="ml-2">Ikuti tes seleksi pada 15 Juli 2023 (lokasi akan diinformasikan)</span>
              </li>
              <li className="flex items-start">
                <span className="ml-2">Pantau pengumuman hasil seleksi pada 20 Juli 2023</span>
              </li>
            </ol>
            
            <div className="mt-4 text-sm text-gray-500 bg-white p-3 rounded-md border border-gray-200">
              <p className="flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 text-blue-500" />
                Informasi lebih lanjut akan disampaikan melalui grup WhatsApp dan email yang terdaftar
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistrationStatus;
