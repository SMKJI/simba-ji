
import { useState } from 'react';
import { User, Phone, Mail, School, Calendar, MapPin, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ProfileFormProps {
  currentUser: {
    name: string;
    email: string;
  };
}

const ProfileForm = ({ currentUser }: ProfileFormProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: '08123456789', // Sample data
    school: 'SMP Negeri 1 Kendal', // Sample data
    birthdate: '2006-05-15', // Sample data
    address: 'Jl. Soekarno Hatta No. 123, Kendal' // Sample data
  });

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

  return (
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
  );
};

export default ProfileForm;
