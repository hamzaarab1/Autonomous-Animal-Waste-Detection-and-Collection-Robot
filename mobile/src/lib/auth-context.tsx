import { onAuthStateChanged, type User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { auth } from '@/lib/firebase';
import { signOutOfGoogle } from '@/lib/google-sign-in';

type AuthState = {
  /** The signed-in Firebase user, or null when signed out. */
  user: User | null;
  /** True until Firebase has restored (or ruled out) a saved session. */
  initializing: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, (next) => {
        setUser(next);
        setInitializing(false);
      }),
    [],
  );

  return (
    <AuthContext.Provider value={{ user, initializing, signOut: signOutOfGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>.');
  return value;
}
