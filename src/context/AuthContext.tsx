import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  isAnonymous: boolean;
  setAnonymousMode: (anonymous: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Check for anonymous mode preference
    checkAnonymousMode();

    return unsubscribe;
  }, []);

  const checkAnonymousMode = async () => {
    try {
      const anonymousMode = await AsyncStorage.getItem('anonymousMode');
      setIsAnonymous(anonymousMode === 'true');
    } catch (error) {
      console.error('Error checking anonymous mode:', error);
    }
  };

  const setAnonymousMode = async (anonymous: boolean) => {
    try {
      await AsyncStorage.setItem('anonymousMode', anonymous.toString());
      setIsAnonymous(anonymous);
    } catch (error) {
      console.error('Error setting anonymous mode:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAnonymous(false);
      await AsyncStorage.setItem('anonymousMode', 'false');
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Here you would typically save additional user data to Firestore
      console.log('User created:', userCredential.user);
      setIsAnonymous(false);
      await AsyncStorage.setItem('anonymousMode', 'false');
    } catch (error) {
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setIsAnonymous(false);
      await AsyncStorage.setItem('anonymousMode', 'false');
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Google Sign-In implementation will be added here
      console.log('Google Sign-In not implemented yet');
      setIsAnonymous(false);
      await AsyncStorage.setItem('anonymousMode', 'false');
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut: signOutUser,
    signInWithGoogle,
    isAnonymous,
    setAnonymousMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
