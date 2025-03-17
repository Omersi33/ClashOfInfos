import { db } from "../firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

// Définition du type des notifications
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
  
      // Convertir les documents Firestore en tableau de Notification[]
      const notifications: Notification[] = querySnapshot.docs.map(doc => ({
        message: doc.data().message || "Aucune notification",
      }));
  
      return notifications;
    } catch (error) {
      console.error("Erreur Firebase :", error);
      return []; // Retourne un tableau vide en cas d’erreur
    }
  };