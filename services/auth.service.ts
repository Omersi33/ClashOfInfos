import { auth, db, storage } from "@/config/firebaseConfig";
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

export const uploadProfileImage = async (uid: string) => {
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
  password: string;
}) => {
  if (!auth.currentUser) throw new Error("Aucun utilisateur connecté !");
  const user = auth.currentUser;
  const userDocRef = doc(db, "users", user.uid);
  const updateData: { username?: string; email?: string; photoBase64?: string } = {};

  if (newEmail && newEmail !== user.email) {
    if (!password) throw new Error("Mot de passe requis pour changer l'email.");
    const credential = EmailAuthProvider.credential(user.email as string, password);
    await reauthenticateWithCredential(user, credential);
    await updateEmail(user, newEmail);
    updateData.email = newEmail;
  }

  if (newUsername) updateData.username = newUsername;
  if (newPhotoBase64) updateData.photoBase64 = newPhotoBase64;

  if (Object.keys(updateData).length > 0) {
    await updateDoc(userDocRef, updateData);
  }
};

export const updateLinkedAccounts = async (
  userId: string,
  linkedAccounts: string[] | ((prev: string[]) => string[])
) => {
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);
  const prevData = snapshot.exists() ? snapshot.data()?.linkedAccounts || [] : [];
  const finalArray = typeof linkedAccounts === "function" ? linkedAccounts(prevData) : linkedAccounts;
  await updateDoc(userRef, { linkedAccounts: finalArray });
};

export const getUserProfile = async (uid: string) => {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);
  return userDoc.exists() ? userDoc.data() : {};
};