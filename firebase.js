import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

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

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
let analytics = null;
try {
  if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }
} catch (e) {}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

console.log("Firebase initialized:", {
  app: !!app,
  auth: !!auth,
  db: !!db,
  storage: !!storage,
});

export { app };
