import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { handleLogout } from "../../controllers/AuthController";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const router = useRouter();

  const onLogout = async () => {
    try {
      await handleLogout();
      router.replace("/login");
    } catch (error) {
      alert("Erreur lors de la déconnexion !");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Clash of Infos</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("../search")}>
        <Text style={styles.buttonText}>Rechercher un joueur</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push("../profile")}>
        <Text style={styles.buttonText}>Profil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.buttonText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
  button: { backgroundColor: "#007bff", padding: 10, borderRadius: 5, marginVertical: 10 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  logoutButton: { backgroundColor: "#dc3545", padding: 10, borderRadius: 5, marginTop: 20 }
});

export default HomeScreen;