
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ProfileForm from '@/components/profile/ProfileForm';
import RegistrationStatus from '@/components/profile/RegistrationStatus';
import { useRegistrations } from '@/hooks/useRegistrations';

const Profile = () => {
  const { currentUser } = useRegistrations();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Profil Pengguna</h1>
          <p className="text-muted-foreground">
            Kelola informasi akun Anda
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="col-span-2">
            <ProfileForm currentUser={currentUser} />
          </div>
          <div>
            <RegistrationStatus />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
