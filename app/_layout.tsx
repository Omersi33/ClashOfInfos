import { Stack, useRouter } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkCache = async () => {
      try {
        const cachedUser = await AsyncStorage.getItem("userData");

        if (!cachedUser) {
          console.log("🔄 Aucun utilisateur détecté, suppression du cache...");
          await AsyncStorage.removeItem("userData");
        }
      } catch (error) {
        console.error("⚠️ Erreur lors du chargement du cache :", error);
      } finally {
        setIsLoading(false);
        setIsReady(true);
      }
    };

    checkCache();
  }, []);

  useEffect(() => {
    if (isReady) {
      if (user) {
        console.log(`✅ Utilisateur connecté : ${user.username}`);
        router.replace("/");
      } else {
        console.log("🔄 Redirection vers Login...");
        router.replace("/login");
      }
    }
  }, [user, isReady]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      {user ? (
        <>
          <Stack.Screen name="(tabs)/index" options={{ title: "Accueil" }} />
          <Stack.Screen name="(tabs)/search" options={{ title: "Rechercher" }} />
          <Stack.Screen name="(tabs)/profile" options={{ title: "Profil" }} />
        </>
      ) : (
        <>
          <Stack.Screen name="login" options={{ title: "Connexion" }} />
          <Stack.Screen name="register" options={{ title: "Inscription" }} />
        </>
      )}
    </Stack>
  );
}