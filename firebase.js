// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/d ocs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC74Yy1umbex7FlZbo3WLb9Skr3YRyDGDA",
  authDomain: "n423-6048d.firebaseapp.com",
  projectId: "n423-6048d",
  // storageBucket: "n423-6048d.firebasestorage.app",
  storageBucket: "n423-6048d.appspot.com",
  messagingSenderId: "358545178901",
  appId: "1:358545178901:web:19ce544398e43bb601e91c",
  measurementId: "G-72TXE25F8B",
};

// Initialize (guard against duplicate) and export shared services
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Analytics can throw in non-browser contexts; wrap
let analytics = null;
try {
  if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }
} catch (e) {
  // ignore analytics init errors (e.g. in unsupported env)
}

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Debug logging
console.log("Firebase initialized:", {
  app: !!app,
  auth: !!auth,
  db: !!db,
  storage: !!storage,
});

export { app };
