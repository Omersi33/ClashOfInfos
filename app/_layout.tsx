import { Stack, useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
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
          await AsyncStorage.removeItem("userData");
        }
      } catch {
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
        router.replace("/(tabs)/gamer");
      } else {
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

  return <Stack screenOptions={{ headerShown: false }} />;
}