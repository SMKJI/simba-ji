
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import PageTitle from '@/components/ui/PageTitle';
import { useRegistrations } from '@/hooks/useRegistrations';
import ProfileForm from '@/components/profile/ProfileForm';
import RegistrationStatus from '@/components/profile/RegistrationStatus';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, authenticated } = useRegistrations();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!authenticated) {
      navigate('/login');
    }
  }, [authenticated, navigate]);

  if (!authenticated || !currentUser) {
    return null;
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <PageTitle 
          title="Profil Pengguna"
          description="Informasi profil dan data pendaftaran Anda"
        />
        
        <ProfileForm currentUser={currentUser} />
        <RegistrationStatus />
      </div>
    </MainLayout>
  );
};

export default Profile;
