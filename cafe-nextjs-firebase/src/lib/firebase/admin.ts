import 'server-only';
import { applicationDefault, cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

export { FieldValue, type QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { publicEnv } from '@/lib/env';
import { getServerEnv } from '@/lib/env.server';

/**
 * Firebase *Admin* SDK – the ONLY module allowed to import `firebase-admin`
 * (enforced by an ESLint rule). It is marked `server-only`, so importing it from a
 * Client Component fails the build. Admin credentials never reach the browser.
 *
 * Credentials, in order of precedence:
 *   1. FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY (explicit service account, local dev)
 *   2. Application Default Credentials: GOOGLE_APPLICATION_CREDENTIALS, or the runtime
 *      service account on Firebase App Hosting / Cloud Run (no secrets required).
 *   3. Local emulators (FIRESTORE_EMULATOR_HOST / FIREBASE_AUTH_EMULATOR_HOST) – no creds.
 */

/**
 * Cheap, side-effect-free check used to decide whether to even try Firestore.
 * Lets `next build` and local dev run without any Firebase credentials.
 */
export function isFirebaseAdminConfigured(): boolean {
  if (!publicEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return false;
  const env = process.env;
  const { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = getServerEnv();
  return Boolean(
    (FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) ||
    env.GOOGLE_APPLICATION_CREDENTIALS ||
    env.FIRESTORE_EMULATOR_HOST ||
    env.FIREBASE_AUTH_EMULATOR_HOST ||
    env.K_SERVICE || // running on Cloud Run / App Hosting
    env.FIREBASE_CONFIG,
  );
}

function createAdminApp(): App {
  const projectId = publicEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = publicEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = getServerEnv();

  if (FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY && projectId) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,
      }),
      projectId,
      storageBucket,
    });
  }

  return initializeApp({ credential: applicationDefault(), projectId, storageBucket });
}

export function getAdminApp(): App {
  return getApps()[0] ?? createAdminApp();
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

let firestore: Firestore | undefined;

export function getAdminDb(): Firestore {
  if (!firestore) {
    firestore = getFirestore(getAdminApp());
    try {
      firestore.settings({ ignoreUndefinedProperties: true });
    } catch {
      // Already configured (happens on hot reload in development).
    }
  }
  return firestore;
}
