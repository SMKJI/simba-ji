
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, School, Calendar, MapPin, Save } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, authenticated } = useRegistrations();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    birthdate: '',
    address: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!authenticated) {
      navigate('/login');
    }
    
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        phone: '08123456789', // Sample data
        school: 'SMP Negeri 1 Kendal', // Sample data
        birthdate: '2006-05-15', // Sample data
        address: 'Jl. Soekarno Hatta No. 123, Kendal' // Sample data
      });
    }
  }, [authenticated, currentUser, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate saving profile
    setTimeout(() => {
      toast({
        title: 'Profil disimpan',
        description: 'Perubahan profil Anda telah berhasil disimpan',
      });
      setIsEditing(false);
    }, 800);
  };

  if (!authenticated || !currentUser) {
    return null;
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Profil Pengguna
          </h1>
          <p className="text-gray-600 mt-2">
            Informasi profil dan data pendaftaran Anda
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Card className="border-0 shadow-lg rounded-xl overflow-hidden mb-8">
            <CardHeader className="bg-primary/5 border-b p-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-semibold text-primary">
                    Informasi Pribadi
                  </CardTitle>
                  <CardDescription>
                    Data diri calon murid
                  </CardDescription>
                </div>
                <Button 
                  type={isEditing ? "submit" : "button"}
                  onClick={() => !isEditing && setIsEditing(true)}
                  variant={isEditing ? "default" : "outline"}
                >
                  {isEditing ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Simpan
                    </>
                  ) : (
                    "Edit Profil"
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="flex items-center mb-2">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    Nama Lengkap
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="flex items-center mb-2">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={true}
                    className="bg-gray-50"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="flex items-center mb-2">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    Nomor Telepon
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                
                <div>
                  <Label htmlFor="school" className="flex items-center mb-2">
                    <School className="mr-2 h-4 w-4 text-muted-foreground" />
                    Asal Sekolah
                  </Label>
                  <Input
                    id="school"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                
                <div>
                  <Label htmlFor="birthdate" className="flex items-center mb-2">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    Tanggal Lahir
                  </Label>
                  <Input
                    id="birthdate"
                    name="birthdate"
                    type="date"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="address" className="flex items-center mb-2">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    Alamat
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
        
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
      </div>
    </PageLayout>
  );
};

export default Profile;
