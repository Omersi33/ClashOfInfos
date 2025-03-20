import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export const handleRegister = async (email: string, password: string, username: string, photoBase64: string | null) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!db) {
      throw new Error("🔥 Firestore n'est pas initialisé !");
    }

    const userData = {
      uid: user.uid,
      username,
      email,
      photoBase64: photoBase64 || null,
    };

    await setDoc(doc(db, "users", user.uid), userData);

    return userData;
  } catch (error) {
    console.error("❌ Erreur d'inscription : ", error);
    throw error;
  }
};

export const handleLogin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      throw new Error("Utilisateur introuvable dans Firestore !");
    }

    const userData = userDoc.data();

    return userData;
  } catch (error) {
    console.error("❌ Erreur de connexion :", error);
    throw error;
  }
};

export const handleLogout = async () => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem("userData");
  } catch (error) {
    console.error("❌ Erreur lors de la déconnexion :", error);
    throw error;
  }
};


export const updateUserProfile = async ({ username, photoBase64 }: { username: string; photoBase64: string }) => {
  if (!auth.currentUser) return;

  const userRef = doc(db, "users", auth.currentUser.uid);

  try {
    await updateDoc(userRef, { username, photoBase64 });
  } catch (error) {
    console.error("Erreur mise à jour :", error);
    throw error;
  }
};