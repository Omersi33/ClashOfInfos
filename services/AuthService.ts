import { auth, db, storage } from "../firebaseConfig";
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

export const getUserProfile = async (uid: string) => {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);
  return userDoc.exists() ? userDoc.data() : {};
};

export const uploadProfileImage = async (uid: string) => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) return null;

    const response = await fetch(result.assets[0].uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `profile_pictures/${uid}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image :", error);
    throw error;
  }
};

export const updateUserProfile = async ({
  newEmail,
  newUsername,
  newPhotoBase64,
  password,
}: {
  newEmail: string;
  newUsername: string;
  newPhotoBase64: string | null;
  password: string; // 🔥 On demande le mot de passe pour l'authentification
}) => {
  if (!auth.currentUser) {
    throw new Error("Aucun utilisateur connecté !");
  }

  try {
    const user = auth.currentUser;
    const userDocRef = doc(db, "users", user.uid);

    const updateData: { username?: string; email?: string; photoBase64?: string } = {};

    // 🔥 Si l'email a changé, on doit réauthentifier l'utilisateur
    if (newEmail && newEmail !== user.email) {
      if (!password) {
        throw new Error("Veuillez entrer votre mot de passe pour changer l'email.");
      }

      const credential = EmailAuthProvider.credential(user.email as string, password);
      await reauthenticateWithCredential(user, credential); // ✅ Réauthentification

      await updateEmail(user, newEmail); // ✅ Mise à jour de l'email dans Firebase Auth
      updateData.email = newEmail;
    }

    // 🔥 Mise à jour du pseudo
    if (newUsername) {
      updateData.username = newUsername;
    }

    // 🔥 Mise à jour de la photo
    if (newPhotoBase64) {
      updateData.photoBase64 = newPhotoBase64;
    }

    // 🔥 Mise à jour Firestore
    if (Object.keys(updateData).length > 0) {
      await updateDoc(userDocRef, updateData);
    }

    console.log("✅ Profil mis à jour !");
  } catch (error) {
    console.error("⚠️ Erreur lors de la mise à jour du profil :", error);
    throw error;
  }
};