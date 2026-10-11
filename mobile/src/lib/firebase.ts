import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { firebaseConfig } from '@/lib/firebase-config';

// Web: the browser build of Firebase Auth persists the session in IndexedDB by default.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
