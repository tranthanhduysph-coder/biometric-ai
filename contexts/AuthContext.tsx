
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import firebase from 'firebase/app';
import { auth, isFirebaseConfigured } from '../firebaseConfig';

// Mock User for Demo Mode
const MOCK_USER: any = {
  uid: 'demo-user-123',
  displayName: 'Demo Teacher',
  email: 'teacher@demo.edu',
  photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  isAnonymous: true,
};

interface AuthContextType {
  user: firebase.User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  isDemo: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(!isFirebaseConfigured);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        setUser(currentUser);
        setLoading(false);
        setIsDemo(false);
      });
      return () => unsubscribe();
    } else {
      // Immediate load for demo mode
      setLoading(false);
      setIsDemo(true);
    }
  }, []);

  const signInWithGoogle = async () => {
    if (isFirebaseConfigured && auth) {
      const provider = new firebase.auth.GoogleAuthProvider();
      try {
        await auth.signInWithPopup(provider);
      } catch (error) {
        console.error("Error signing in with Google", error);
        alert("Real authentication failed. Falling back to Demo Mode.");
        setUser(MOCK_USER);
        setIsDemo(true);
      }
    } else {
      // Simulate login delay
      setLoading(true);
      setTimeout(() => {
        setUser(MOCK_USER);
        setIsDemo(true);
        setLoading(false);
      }, 800);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth) {
      try {
        await auth.signInWithEmailAndPassword(email, pass);
      } catch (error: any) {
        console.error("Login failed", error);
        alert(`Login failed: ${error.message}`);
        throw error;
      }
    } else {
      // Demo Mode
      setLoading(true);
      setTimeout(() => {
        const demoUser = { ...MOCK_USER, email: email, displayName: email.split('@')[0] };
        setUser(demoUser);
        setIsDemo(true);
        setLoading(false);
      }, 800);
    }
  };

  const registerWithEmail = async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth) {
      try {
        await auth.createUserWithEmailAndPassword(email, pass);
      } catch (error: any) {
        console.error("Registration failed", error);
        alert(`Registration failed: ${error.message}`);
        throw error;
      }
    } else {
      // Demo Mode
      setLoading(true);
      setTimeout(() => {
        const demoUser = { ...MOCK_USER, email: email, displayName: email.split('@')[0] };
        setUser(demoUser);
        setIsDemo(true);
        setLoading(false);
      }, 800);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await auth.signOut();
      } catch (error) {
        console.error("Error signing out", error);
      }
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, loginWithEmail, registerWithEmail, logout, isDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
