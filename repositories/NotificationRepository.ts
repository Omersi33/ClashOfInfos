import { db } from "../config/firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

interface Notification {
    message: string;
  }

export const sendNotificationToUser = async (userId: string, type: string, message: string) => {
  await addDoc(collection(db, "notifications"), {
    userId,
    type,
    message,
    timestamp: Date.now(),
  });
  
};


export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
    try {
      const q = query(collection(db, "notifications"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
  
      const notifications: Notification[] = querySnapshot.docs.map(doc => ({
        message: doc.data().message || "Aucune notification",
      }));
  
      return notifications;
    } catch (error) {
      console.error("Erreur Firebase :", error);
      return [];
    }
  };