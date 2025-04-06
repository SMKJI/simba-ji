import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { programData } from '@/data/programData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface StudentRegistrationFormProps {
  onSuccess?: () => void;
}

const StudentRegistrationForm = ({ onSuccess }: StudentRegistrationFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useRegistrations();
  const { refreshUser } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentWhatsapp, setParentWhatsapp] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [preferredProgram, setPreferredProgram] = useState('');
  const [programReason, setProgramReason] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };
  
  const isFormValid = () => {
    return (
      name.trim() !== '' && 
      email.trim() !== '' && 
      password.trim() !== '' && 
      confirmPassword.trim() !== '' && 
      previousSchool.trim() !== '' && 
      whatsappNumber.trim() !== '' && 
      parentName.trim() !== '' && 
      parentWhatsapp.trim() !== '' &&
      birthPlace.trim() !== '' &&
      birthDate.trim() !== '' &&
      gender.trim() !== '' &&
      address.trim() !== '' &&
      preferredProgram.trim() !== ''
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    if (!isFormValid()) {
      setError('Semua kolom harus diisi kecuali alasan memilih program keahlian');
      setIsSubmitting(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Kata sandi dan konfirmasi kata sandi tidak sama');
      setIsSubmitting(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Kata sandi harus memiliki minimal 6 karakter');
      setIsSubmitting(false);
      return;
    }
    
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
    if (!phoneRegex.test(whatsappNumber)) {
      setError('Format nomor WhatsApp tidak valid (contoh: 08123456789)');
      setIsSubmitting(false);
      return;
    }
    
    if (!phoneRegex.test(parentWhatsapp)) {
      setError('Format nomor WhatsApp orang tua tidak valid (contoh: 08123456789)');
      setIsSubmitting(false);
      return;
    }
    
    try {
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            whatsappNumber,
            parentName,
            parentWhatsapp,
            birthPlace,
            birthDate,
            gender,
            address,
            previousSchool,
            preferredProgram,
            programReason
          }
        }
      });

      if (error) {
        console.error("Registration error:", error);
        setError(error.message || "Pendaftaran gagal. Silakan coba lagi.");
        setIsSubmitting(false);
        return;
      }
      
      if (!data.user) {
        setError("Pendaftaran gagal. Silakan coba lagi.");
        setIsSubmitting(false);
        return;
      }
      
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          previous_school: previousSchool,
          whatsapp_number: whatsappNumber,
          parent_name: parentName,
          parent_whatsapp: parentWhatsapp,
          birth_place: birthPlace,
          birth_date: birthDate,
          gender: gender,
          address: address,
          preferred_program: preferredProgram,
          program_reason: programReason
        })
        .eq('id', data.user.id);
      
      if (profileUpdateError) {
        console.error("Profile update error:", profileUpdateError);
      }
      
      toast({
        title: 'Pendaftaran Berhasil',
        description: 'Akun Anda telah dibuat. Silakan periksa email Anda untuk konfirmasi.',
      });
      
      sessionStorage.setItem('studentData', JSON.stringify({
        previousSchool,
        whatsappNumber,
        parentName,
        parentWhatsapp,
        birthPlace,
        birthDate,
        gender,
        address,
        preferredProgram,
        programReason
      }));
      
      await refreshUser();
      
      if (onSuccess) {
        onSuccess();
      } else {
        if (data.session) {
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        } else {
          setTimeout(() => {
            navigate('/login', { state: { email } });
          }, 1000);
        }
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || 'Terjadi kesalahan saat mendaftar');
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Nama Lengkap
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Nama lengkap Anda"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="birthPlace" className="block text-sm font-medium">
            Tempat Lahir
          </label>
          <Input
            id="birthPlace"
            type="text"
            placeholder="Tempat lahir"
            value={birthPlace}
            onChange={(e) => setBirthPlace(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="birthDate" className="block text-sm font-medium">
            Tanggal Lahir
          </label>
          <Input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="gender" className="block text-sm font-medium">
          Jenis Kelamin
        </label>
        <Select
          value={gender}
          onValueChange={setGender}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih jenis kelamin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="laki-laki">Laki-laki</SelectItem>
            <SelectItem value="perempuan">Perempuan</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="address" className="block text-sm font-medium">
          Alamat Lengkap
        </label>
        <Textarea
          id="address"
          placeholder="Alamat lengkap Anda"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="min-h-[80px]"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="previousSchool" className="block text-sm font-medium">
          Asal Sekolah
        </label>
        <Input
          id="previousSchool"
          type="text"
          placeholder="Nama sekolah asal"
          value={previousSchool}
          onChange={(e) => setPreviousSchool(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="whatsappNumber" className="block text-sm font-medium">
          Nomor WhatsApp
        </label>
        <Input
          id="whatsappNumber"
          type="text"
          placeholder="08123456789"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="parentName" className="block text-sm font-medium">
          Nama Orang Tua/Wali
        </label>
        <Input
          id="parentName"
          type="text"
          placeholder="Nama orang tua/wali"
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="parentWhatsapp" className="block text-sm font-medium">
          Nomor WhatsApp Orang Tua/Wali
        </label>
        <Input
          id="parentWhatsapp"
          type="text"
          placeholder="08123456789"
          value={parentWhatsapp}
          onChange={(e) => setParentWhatsapp(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="preferredProgram" className="block text-sm font-medium">
          Program Keahlian yang Diminati
        </label>
        <Select
          value={preferredProgram}
          onValueChange={setPreferredProgram}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih program keahlian" />
          </SelectTrigger>
          <SelectContent>
            {programData.map(program => (
              <SelectItem key={program.id} value={program.id}>
                {program.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="programReason" className="block text-sm font-medium">
          Alasan Memilih Program Keahlian
        </label>
        <Textarea
          id="programReason"
          placeholder="Jelaskan alasan memilih program keahlian tersebut (opsional)"
          value={programReason}
          onChange={(e) => setProgramReason(e.target.value)}
          className="min-h-[80px]"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Kata Sandi
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimal 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={toggleShowPassword}
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          Konfirmasi Kata Sandi
        </label>
        <Input
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          placeholder="Ulangi kata sandi Anda"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Mendaftar...
          </>
        ) : (
          'Daftar'
        )}
      </Button>
    </form>
  );
};

export default StudentRegistrationForm;
