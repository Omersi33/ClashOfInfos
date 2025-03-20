import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export const handleLogout = async () => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem("userData");
  } catch (error) {
    console.error("❌ Erreur lors de la déconnexion :", error);
    throw error;
  }
};


export const handleLogin = async (email: string, password: string) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password)
  const ref = doc(db, "users", user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error("Utilisateur introuvable.")
  return { id: snap.id, ...snap.data() }
}

export const handleRegister = async (
  email: string,
  password: string,
  username: string,
  photoBase64?: string
) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  const ref = doc(db, "users", user.uid)
  const payload = { username, email, photoBase64: photoBase64 || "" }
  await setDoc(ref, payload)
  return { id: ref.id, ...payload }
}

export const updateUserProfile = async ({
  username,
  photoBase64,
}: {
  username: string
  photoBase64: string
}) => {
  if (!auth.currentUser) throw new Error("Aucun utilisateur connecté.")
  const ref = doc(db, "users", auth.currentUser.uid)
  await updateDoc(ref, { username, photoBase64 })
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error("Utilisateur introuvable.")
  return { id: snap.id, ...snap.data() }
}