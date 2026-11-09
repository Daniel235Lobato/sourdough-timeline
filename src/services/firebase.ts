import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';

const STORAGE_FIREBASE_CONFIG_KEY = 'levain_firebase_config';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

// 1. Check local storage for user-pasted config
// 2. Check Vite environment variables
export function getActiveFirebaseConfig(): FirebaseConfig | null {
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

  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  if (envApiKey && envProjectId) {
    return {
      apiKey: envApiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${envProjectId}.firebaseapp.com`,
      projectId: envProjectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
    };
  }

  return null;
}

export function saveFirebaseConfig(config: FirebaseConfig) {
  localStorage.setItem(STORAGE_FIREBASE_CONFIG_KEY, JSON.stringify(config));
  window.location.reload();
}

export function clearFirebaseConfig() {
  localStorage.removeItem(STORAGE_FIREBASE_CONFIG_KEY);
  window.location.reload();
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const config = getActiveFirebaseConfig();
if (config) {
  try {
    app = getApps().length === 0 ? initializeApp(config) : getApp();
    auth = getAuth(app);
  } catch (err) {
    console.error('[Firebase] Init failed:', err);
  }
}

export { app, auth, googleProvider };
