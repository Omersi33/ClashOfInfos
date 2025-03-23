import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadUserFromCache = async () => {
      try {
        const cachedUser = await AsyncStorage.getItem("userData");
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        }
      } catch (error) {} 
      finally {
        setIsLoaded(true);
      }
    };
    loadUserFromCache();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const ref = doc(db, "users", authUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUser({ id: snap.id, ...snap.data() });
        } else {
          setUser({ id: authUser.uid, linkedAccounts: [] });
        }
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return { user };
};