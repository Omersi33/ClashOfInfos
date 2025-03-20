import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadUserFromCache = async () => {
      try {
        const cachedUser = await AsyncStorage.getItem("userData");

        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        } else {
          console.log("❌ Aucun utilisateur détecté en cache.");
        }
      } catch (error) {
        console.error("⚠️ Erreur de lecture du cache :", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadUserFromCache();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const unsubscribe = auth.onAuthStateChanged(async (authUser) => {

        if (authUser) {
          const userRef = doc(db, "users", authUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUser(userData);
            await AsyncStorage.setItem("userData", JSON.stringify(userData));
          } else {
            setUser(null);
            await AsyncStorage.removeItem("userData");
          }
        } else {
          setUser(null);
          await AsyncStorage.removeItem("userData");
        }
      });

      return () => unsubscribe();
    }
  }, [isLoaded]);

  return { user };
};