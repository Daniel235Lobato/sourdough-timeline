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

export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: "AIzaSyAeOPmy_VpSv00xvOIeG396aVB9s5oObZg",
  authDomain: "levain-a0c29.firebaseapp.com",
  projectId: "levain-a0c29",
  storageBucket: "levain-a0c29.firebasestorage.app",
  messagingSenderId: "921954582254",
  appId: "1:921954582254:web:7ec0911e755078a367fdff"
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

  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  if (envApiKey && envProjectId) {
    return {
      apiKey: envApiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
      projectId: envProjectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
      appId: import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId
    };
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
