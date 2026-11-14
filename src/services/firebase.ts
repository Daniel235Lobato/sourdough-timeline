import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

function cleanEnv(val: string | undefined, keyPrefix: string): string {
  if (!val) return '';
  const trimmed = val.trim();
  const prefix = `${keyPrefix}=`;
  return trimmed.startsWith(prefix) ? trimmed.slice(prefix.length).trim() : trimmed;
}

export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY, 'VITE_FIREBASE_API_KEY'),
  authDomain: cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, 'VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID, 'VITE_FIREBASE_PROJECT_ID'),
  storageBucket: cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, 'VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, 'VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID, 'VITE_FIREBASE_APP_ID')
};

const STORAGE_FIREBASE_CONFIG_KEY = 'levain_firebase_config';

export function saveFirebaseConfig(config: FirebaseConfig) {
  localStorage.setItem(STORAGE_FIREBASE_CONFIG_KEY, JSON.stringify(config));
  window.location.reload();
}

export function getActiveFirebaseConfig(): FirebaseConfig {
  try {
    const localConfig = localStorage.getItem(STORAGE_FIREBASE_CONFIG_KEY);
    if (localConfig) {
      const parsed = JSON.parse(localConfig);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[Firebase] Failed reading local config:', e);
  }

  return DEFAULT_FIREBASE_CONFIG;
}

let app: FirebaseApp;
const config = getActiveFirebaseConfig();

try {
  app = getApps().length === 0 ? initializeApp(config) : getApp();
} catch (err) {
  console.error('[Firebase] Init failed:', err);
  app = initializeApp(config);
}

const auth: Auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, auth, googleProvider };
