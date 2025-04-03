
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, EyeIcon, EyeOffIcon } from 'lucide-react';

interface StudentRegistrationFormProps {
  onSuccess?: () => void;
}

const StudentRegistrationForm = ({ onSuccess }: StudentRegistrationFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, loading } = useRegistrations();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentWhatsapp, setParentWhatsapp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    // Validation
    if (!name || !email || !password || !confirmPassword || !previousSchool || !whatsappNumber || !parentName || !parentWhatsapp) {
      setError('Semua kolom harus diisi');
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
    
    // Validate WhatsApp number format
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
      const result = await register(email, password, name);
      
      if (result.success) {
        // Store additional information to be used in the profile
        sessionStorage.setItem('studentData', JSON.stringify({
          previousSchool,
          whatsappNumber,
          parentName,
          parentWhatsapp
        }));
        
        toast({
          title: 'Pendaftaran Berhasil',
          description: 'Akun Anda telah dibuat. Silakan periksa email Anda untuk konfirmasi.',
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          // If user is automatically logged in, redirect after 3 seconds
          if (result.user) {
            setTimeout(() => {
              navigate('/dashboard');
            }, 3000);
          }
        }
      } else {
        setError(result.error || 'Pendaftaran gagal. Silakan coba lagi.');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mendaftar');
    } finally {
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
        disabled={isSubmitting || loading}
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
