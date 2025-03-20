import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { auth } from "../config/firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import Input from "../components/Input";
import { updateUserProfile, getUserProfile, uploadProfileImage } from "../services/AuthService";
import { Camera } from "expo-camera";

const ProfileScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!auth.currentUser) {
        console.error("Aucun utilisateur connecté !");
        return;
      }

      try {
        const userData = await getUserProfile(auth.currentUser.uid);
        setUsername(userData.username || "");
        setEmail(auth.currentUser.email || ""); 
        setPhotoBase64(userData.photoBase64 || null);
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
      }
    };

    loadUserProfile();
  }, []);

  const pickImage = async () => {
    const choice = await new Promise((resolve) => {
      Alert.alert("Choisir une option", "Galerie ou appareil photo ?", [
        { text: "Galerie", onPress: () => resolve("gallery") },
        { text: "Appareil photo", onPress: () => resolve("camera") },
        { text: "Annuler", style: "cancel", onPress: () => resolve(null) },
      ]);
    });
  
    if (!choice) return;
  
    let result;
    if (choice === "gallery") {
      result = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7 });
    } else {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") return alert("Permission caméra refusée.");
      result = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 });
    }
  
    if (!result.canceled) {
      setPhotoBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };
  
  <TouchableOpacity onPress={pickImage}>
    <Text>Choisir une image</Text>
  </TouchableOpacity>

  const handlePickImage = async () => {
    if (!auth.currentUser) {
      console.error("Aucun utilisateur connecté !");
      return;
    }

    try {
      const newPhotoBase64 = await uploadProfileImage(auth.currentUser.uid);
      if (newPhotoBase64) {
        setPhotoBase64(newPhotoBase64);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'image :", error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) {
      console.error("Aucun utilisateur connecté !");
      return;
    }

    try {
      await updateUserProfile({
        newEmail: email,
        newUsername: username,
        newPhotoBase64: photoBase64,
        password,
      });

    } catch (error) {
      console.error("⚠️ Erreur lors de la mise à jour du profil :", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>
      <TouchableOpacity onPress={handlePickImage}>
        <Image 
          source={{ uri: photoBase64 || "https://via.placeholder.com/150" }} 
          style={styles.avatar} 
        />
      </TouchableOpacity>
      <Input
        placeholder="Pseudo"
        value={username}
        onChangeText={setUsername}
        selectOnFocus={true}
      />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        isDisabled={true}
      />
      <Input
        placeholder="Mot de passe actuel"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Mettre à jour" onPress={handleUpdateProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  input: { width: "80%", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginBottom: 10 }
});

export default ProfileScreen;