import { initializeApp, cert } from 'firebase-admin/app';

let initialized = false;

// Lazy init — safe to call multiple times, no-op after first success.
export function initFirebase(): void {
  if (initialized) return;
  try {
    const serviceAccount = require('../../serviceAccountKey.json');
    initializeApp({ credential: cert(serviceAccount) });
    initialized = true;
    console.log('✅ Firebase Admin ready');
  } catch {
    console.warn('⚠️  Firebase not configured — push notifications disabled');
  }
}
