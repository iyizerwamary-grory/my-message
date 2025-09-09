
"use client";

import type { User as FirebaseUser } from 'firebase/auth'; // Firebase's User type
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db, app as firebaseApp, isFirebaseConfigured } from '@/lib/firebase'; // Firebase app instance, import app
import type { User as AppUser, UserStatus } from '@/lib/types'; // Your app's User type
import { doc, setDoc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDatabase, ref, onValue, onDisconnect, set, goOnline, goOffline } from "firebase/database";

interface AuthContextType {
  user: AppUser | null; // Use your AppUser type
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to map FirebaseUser to AppUser
const mapFirebaseUserToAppUser = (firebaseUser: FirebaseUser | null, status?: UserStatus): AppUser | null => {
  if (!firebaseUser) return null;
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    status: status || 'offline',
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
        console.warn("Firebase is not configured. Running in mock mode.");
        const mockUserJson = localStorage.getItem('mockUser');
        if (mockUserJson) {
            const parsed = JSON.parse(mockUserJson)
            setUser({...parsed, status: 'online'});
        }
        setLoading(false);
        return;
    }

    if (!firebaseApp) {
      setLoading(false);
      return;
    }

    const rtdb = getDatabase(firebaseApp);
    const authInstance = auth!;

    const unsubscribe = onAuthStateChanged(authInstance, (firebaseUser) => {
      if (firebaseUser) {
        // --- Realtime Database Presence ---
        const userStatusRef = ref(rtdb, `status/${firebaseUser.uid}`);
        const presenceRef = ref(rtdb, `.info/connected`);
        
        goOnline(rtdb);

        onValue(presenceRef, (snap) => {
          if (snap.val() === true) {
            set(userStatusRef, 'online');
            onDisconnect(userStatusRef).set('offline');
          }
        });

        // --- Firestore User Data Sync ---
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, (userDocSnap) => {
          if (userDocSnap.exists()) {
            const firestoreUserData = userDocSnap.data();
             setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firestoreUserData.displayName || firebaseUser.displayName,
                photoURL: firestoreUserData.photoURL || firebaseUser.photoURL,
                status: firestoreUserData.status || 'offline',
            });
          } else {
             // This case may happen if user is created but firestore doc fails.
             setUser(mapFirebaseUserToAppUser(firebaseUser, 'offline'));
          }
        });

        // Sync RTDB status to Firestore
        const unsubscribeRtdb = onValue(userStatusRef, (snap) => {
            const status = snap.val();
             if (status) {
                updateDoc(userDocRef, { status: status, lastChanged: serverTimestamp() }).catch(err => console.log("Failed to update status in firestore", err));
             }
        });

        setLoading(false);
        // Return a cleanup function for all listeners
        return () => {
          unsubscribeFirestore();
          unsubscribeRtdb();
          goOffline(rtdb);
        }

      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe(); 
  }, []);

  const login = async (email: string, pass: string) => {
    if (!isFirebaseConfigured) {
        setLoading(true);
        const mockUser: AppUser = {
            uid: `mock_${email}`,
            email: email,
            displayName: email.split('@')[0],
            photoURL: `https://placehold.co/100x100.png?text=${email.substring(0,1).toUpperCase()}`,
            status: 'online',
        };
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        setUser(mockUser);
        setLoading(false);
        return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth!, email, pass);
      // onAuthStateChanged will handle the rest
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      throw error; 
    }
  };

  const logout = async () => {
    if (user && isFirebaseConfigured) {
        // Set offline in RTDB before signing out
        const rtdb = getDatabase(firebaseApp!);
        const userStatusRef = ref(rtdb, `status/${user.uid}`);
        await set(userStatusRef, 'offline');
    }
    if (!isFirebaseConfigured) {
        setLoading(true);
        localStorage.removeItem('mockUser');
        setUser(null);
        setLoading(false);
        return;
    }
    setLoading(true);
    try {
      await firebaseSignOut(auth!);
    } catch (error) {
      console.error("Logout error: ", error);
    } finally {
      setUser(null); 
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
     if (!isFirebaseConfigured) {
        setLoading(true);
        const mockUser: AppUser = {
            uid: `mock_${email}`,
            email: email,
            displayName: name,
            photoURL: `https://placehold.co/100x100.png?text=${name.substring(0,1).toUpperCase()}`,
            status: 'online',
        };
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        setUser(mockUser);
        setLoading(false);
        return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth!, email, pass);
      const firebaseUser = userCredential.user;
      
      await updateProfile(firebaseUser, { displayName: name });

      const userDocRef = doc(db, "users", firebaseUser.uid);
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: name,
        photoURL: firebaseUser.photoURL || `https://placehold.co/100x100.png?text=${name.substring(0,1)}`,
        createdAt: serverTimestamp(),
        status: 'online', // Set initial status to online
      });
      // onAuthStateChanged will handle the rest
    } catch (error) {
      console.error("Signup error:", error);
      setLoading(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
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
