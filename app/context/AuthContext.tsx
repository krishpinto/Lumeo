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

interface AuthContextType {
  currentUser: User | null;
  signInWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  signInWithGoogle: async () => { throw new Error('Not implemented'); },
  logout: async () => { throw new Error('Not implemented'); },
  loading: true
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Sign in with Google
  const signInWithGoogle = async (): Promise<User> => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user.email);
      return result.user;
    } catch (error) {
      console.error("Google sign-in failed:", error);
      throw error;
    }
  };

  // Logout the current user
  const logout = async (): Promise<void> => {
    try {
      console.log("Logging out user:", currentUser?.email);
      await signOut(auth);
      router.push('/auth/login'); // Make sure this path is correct
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? user.email : "No user");
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  // Log when context value changes
  useEffect(() => {
    console.log("Auth context value updated:", 
      currentUser ? `User: ${currentUser.email}` : "No user", 
      "Loading:", loading);
  }, [currentUser, loading]);

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

export { AuthContext };