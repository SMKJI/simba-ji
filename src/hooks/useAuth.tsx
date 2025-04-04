
import { useState, useEffect, createContext, useContext } from 'react';
import { useRegistrations } from './useRegistrations';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useRegistrations();
  const [error, setError] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ user: currentUser, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
