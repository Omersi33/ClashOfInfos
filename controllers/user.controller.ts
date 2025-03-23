import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "@/config/firebaseConfig";
import { updateUserProfile as updateUserProfileService } from "@/services/auth.service";

export const updateUserProfile = async ({
  username,
  photoBase64,
}: {
  username: string;
  photoBase64: string;
}) => {
  if (!auth.currentUser) throw new Error("Aucun utilisateur connecté.");
  await updateUserProfileService({
    newUsername: username,
    newPhotoBase64: photoBase64,
    newEmail: "",
    password: "",
  });
  const updatedUser = {
    username,
    photoBase64,
    email: auth.currentUser.email,
  };
  await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
  return updatedUser;
};