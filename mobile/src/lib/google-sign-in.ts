import { FirebaseError } from 'firebase/app';
import { GoogleAuthProvider, signInWithPopup, signOut, type User } from 'firebase/auth';

import { auth } from '@/lib/firebase';

/** Signs in with a Google popup. Resolves to null if the user closes the popup. */
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    return result.user;
  } catch (e) {
    if (
      e instanceof FirebaseError &&
      (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request')
    ) {
      return null;
    }
    throw e;
  }
}

/** Signs out of Firebase. */
export async function signOutOfGoogle(): Promise<void> {
  await signOut(auth);
}
