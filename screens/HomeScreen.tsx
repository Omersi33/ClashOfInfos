import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleLogout } from "../controllers/AuthController";

const HomeScreen = ({ navigation }: any) => {
  const onLogout = async () => {
    await handleLogout();
    await AsyncStorage.removeItem("userData");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Clash of Infos</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Search")}>
        <Text style={styles.buttonText}>Rechercher un joueur</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Profile")}>
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