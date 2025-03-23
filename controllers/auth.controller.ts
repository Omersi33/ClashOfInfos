import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "@/config/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const handleLogout = async () => {
  await signOut(auth);
  await AsyncStorage.removeItem("userData");
};

export const handleLogin = async (email: string, password: string) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Utilisateur introuvable.");
  return { id: snap.id, ...snap.data() };
};

export const handleRegister = async (
  email: string,
  password: string,
  username: string,
  photoBase64?: string
) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  const ref = doc(db, "users", user.uid);
  const payload = { username, email, photoBase64: photoBase64 || "" };
  await setDoc(ref, payload);
  return { id: ref.id, ...payload };
};