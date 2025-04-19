// app/context/AuthContext.tsx

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, provider } from '@/lib/firebase'
// Define types for context
interface AuthContextType {
  currentUser: User | null;
  signInWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  loading: boolean;
}

// Create the authentication context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  signInWithGoogle: async () => { throw new Error('Not implemented'); },
  logout: async () => { throw new Error('Not implemented'); },
  loading: true
});

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Export the AuthProvider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Sign in with Google
  const signInWithGoogle = async (): Promise<User> => {
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  // Logout the current user
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Context value to be provided
  const value: AuthContextType = {
    currentUser,
    signInWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Export AuthContext directly as well
export { AuthContext };