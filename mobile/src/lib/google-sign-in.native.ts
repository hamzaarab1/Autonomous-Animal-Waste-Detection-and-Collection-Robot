import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential, signOut, type User } from 'firebase/auth';

import { auth } from '@/lib/firebase';
import { googleWebClientId } from '@/lib/firebase-config';

GoogleSignin.configure({ webClientId: googleWebClientId });

/**
 * Shows the native Google account picker, then signs that account into Firebase.
 * Resolves to null if the user backs out of the picker.
 */
export async function signInWithGoogle(): Promise<User | null> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();
  if (!isSuccessResponse(response)) return null;

  const { idToken } = response.data;
  if (!idToken) throw new Error('Google did not return an ID token. Check EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.');

  const result = await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
  return result.user;
}

/** Signs out of Firebase and Google, so the account picker shows again next time. */
export async function signOutOfGoogle(): Promise<void> {
  await GoogleSignin.signOut();
  await signOut(auth);
}
