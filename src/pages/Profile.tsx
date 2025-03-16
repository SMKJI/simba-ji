
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ProfileForm from '@/components/profile/ProfileForm';
import RegistrationStatus from '@/components/profile/RegistrationStatus';
import { useRegistrations } from '@/hooks/useRegistrations';

const Profile = () => {
  const { currentUser } = useRegistrations();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-0 space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Profil Pengguna</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Kelola informasi akun Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="md:col-span-2 order-2 md:order-1">
            <ProfileForm currentUser={currentUser} />
          </div>
          <div className="order-1 md:order-2">
            <RegistrationStatus />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
