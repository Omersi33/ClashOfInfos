import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false); // 🔥 Fix: Assure que tout est bien chargé

  useEffect(() => {
    const loadUserFromCache = async () => {
      try {
        const cachedUser = await AsyncStorage.getItem("userData");

        if (cachedUser) {
          console.log("🔹 Chargement user depuis cache :", JSON.parse(cachedUser).username);
          setUser(JSON.parse(cachedUser));
        } else {
          console.log("❌ Aucun utilisateur détecté en cache.");
        }
      } catch (error) {
        console.error("⚠️ Erreur de lecture du cache :", error);
      } finally {
        setIsLoaded(true); // ✅ Fix: Marquer comme chargé
      }
    };

    loadUserFromCache();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
        console.log("🔥 Auth State Changed:", authUser);

        if (authUser) {
          console.log("✅ Firebase détecte une connexion, récupération Firestore...");
          const userRef = doc(db, "users", authUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            console.log("✅ User chargé depuis Firestore :", userData.username);
            setUser(userData);
            await AsyncStorage.setItem("userData", JSON.stringify(userData)); // 🔥 Sauvegarde locale mise à jour
          } else {
            console.log("❌ User non trouvé en Firestore, suppression du cache...");
            setUser(null);
            await AsyncStorage.removeItem("userData");
          }
        } else {
          console.log("❌ Aucun utilisateur authentifié. Suppression du cache...");
          setUser(null);
          await AsyncStorage.removeItem("userData");
        }
      });

      return () => unsubscribe();
    }
  }, [isLoaded]); // ✅ Fix: On attend que le cache soit chargé avant d'écouter Firebase

  return { user };
};