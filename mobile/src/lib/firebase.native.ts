import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  type Auth,
  type Persistence,
  type ReactNativeAsyncStorage,
} from 'firebase/auth';

import { firebaseConfig } from '@/lib/firebase-config';

// Metro bundles the React Native build of Firebase Auth, which exports this, but TypeScript
// resolves the web typings, which don't declare it.
declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: ReactNativeAsyncStorage): Persistence;
}

const isFirstInit = !getApps().length;
const app = isFirstInit ? initializeApp(firebaseConfig) : getApp();

// iOS/Android: keep the user signed in across app restarts. initializeAuth may only run once,
// so fast refresh reuses the existing instance.
export const auth: Auth = isFirstInit
  ? initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
  : getAuth(app);
