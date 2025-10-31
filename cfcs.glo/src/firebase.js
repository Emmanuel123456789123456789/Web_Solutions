/* global __app_id, __firebase_config, __initial_auth_token */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// --- Environment Variable Handling ---
// In this specific execution environment, we MUST use the global variables 
// injected by the runtime for configuration and authentication to work.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : null);
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- Initialize Services ---
let app = null;
let db = null;
let auth = null;

if (firebaseConfig) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
} else {
    console.error("Firebase config is missing. Database and Auth services are NOT initialized.");
}

// --- Export Services and Globals ---
export { db, auth, appId, initialAuthToken };
