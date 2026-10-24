/**
 * Firebase *client* (browser) SDK – lazy singletons.
 *
 * Only import this from Client Components, and only call the getters from event handlers
 * or effects (never during render) so the SDK is not initialised on the server.
 * The web config below is public by design; access is enforced by Auth + security rules.
 */
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, type Auth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage, type FirebaseStorage } from 'firebase/storage';
import { isFirebaseClientConfigured, publicEnv } from '@/lib/env';

const useEmulators = publicEnv.NEXT_PUBLIC_USE_FIREBASE_EMULATORS;
const connected = { auth: false, firestore: false, storage: false };

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseClientConfigured) {
    throw new Error(
      'Firebase web config is missing. Set the NEXT_PUBLIC_FIREBASE_* variables (see .env.example).',
    );
  }
  if (getApps().length > 0) return getApp();
  return initializeApp({
    apiKey: publicEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: publicEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: publicEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: publicEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: publicEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: publicEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
}

export function getFirebaseAuth(): Auth {
  const auth = getAuth(getFirebaseApp());
  if (useEmulators && !connected.auth) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connected.auth = true;
  }
  return auth;
}

export function getFirebaseFirestore(): Firestore {
  const db = getFirestore(getFirebaseApp());
  if (useEmulators && !connected.firestore) {
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connected.firestore = true;
  }
  return db;
}

export function getFirebaseStorage(): FirebaseStorage {
  const storage = getStorage(getFirebaseApp());
  if (useEmulators && !connected.storage) {
    connectStorageEmulator(storage, '127.0.0.1', 9199);
    connected.storage = true;
  }
  return storage;
}
