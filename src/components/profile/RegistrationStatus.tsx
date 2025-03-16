
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RegistrationStatus = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden mb-8">
      <CardHeader className="bg-primary/5 border-b p-6">
        <CardTitle className="text-xl font-semibold text-primary">
          Status Pendaftaran
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-medium">Nomor Pendaftaran</h3>
              <p className="text-sm text-primary font-semibold">1234567</p>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium">
              Terdaftar
            </div>
          </div>
          
          <div className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-medium">Grup WhatsApp</h3>
              <p className="text-sm text-secondary font-semibold">Grup 2</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/group-detail/2')}
            >
              Lihat Grup
            </Button>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Langkah Berikutnya</h3>
            <ul className="list-disc list-inside text-sm space-y-2 text-gray-600">
              <li>Unggah dokumen pendaftaran yang diperlukan</li>
              <li>Bergabung dengan grup WhatsApp</li>
              <li>Ikuti tes seleksi pada 15 Juli 2023</li>
              <li>Tunggu pengumuman hasil seleksi pada 20 Juli 2023</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistrationStatus;
