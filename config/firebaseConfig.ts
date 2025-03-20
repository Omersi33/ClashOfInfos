import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCt4bPtCfSojWRXbaPzo-0S2_jSP4fM-CY",
  authDomain: "com.clashofinfos",
  projectId: "clashofinfos1",
  storageBucket: "clashofinfos1.firebasestorage.app",
  appId: "1:988675151126:android:69d4c648ec9df572576c37"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };