import { db } from "../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export const updateUserClan = async (playerTag: string, clanTag: string) => {
  const userDoc = doc(db, "users", playerTag);
  const userSnapshot = await getDoc(userDoc);

  if (userSnapshot.exists()) {
    await updateDoc(userDoc, { linkedClan: clanTag });
  }
};