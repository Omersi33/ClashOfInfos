import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Input from "../components/Input";
import Button from "../components/Button";
import { handleRegister } from "../controllers/AuthController";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const router = useRouter();

  const resizeImage = async (uri: string) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1080 } }], // Redimensionne à 1080p max
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    return manipulatedImage.base64;
  };

  const pickImage = async () => {
      const choice = await new Promise((resolve) => {
        Alert.alert("Choisir une option", "Galerie ou appareil photo ?", [
          { text: "Annuler", style: "cancel", onPress: () => resolve(null) },
          { text: "Galerie", onPress: () => resolve("gallery") },
          { text: "Appareil photo", onPress: () => resolve("camera") },
        ]);
      });
    
      if (!choice) return;
    
      let result;
      if (choice === "gallery") {
        result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
      } else {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status !== "granted") return alert("Permission caméra refusée.");
        result = await ImagePicker.launchCameraAsync({ quality: 1 });
      }
    
      if (!result.canceled) {
        const resizedBase64 = await resizeImage(result.assets[0].uri);
        setPhotoBase64(`data:image/jpeg;base64,${resizedBase64}`);
      }
    };

  const onRegister = async () => {
    try {
      const newUser = await handleRegister(email, password, username, photoBase64);
      await AsyncStorage.setItem("userData", JSON.stringify(newUser)); // 🔥 Stocke en cache
      router.replace("/");
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      {photoBase64 && <Image source={{ uri: photoBase64 }} style={styles.avatar} />}
      <Button title="Choisir une photo" onPress={pickImage} />
      <Input placeholder="Pseudo" value={username} onChangeText={setUsername} />
      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Input placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="S'inscrire" onPress={onRegister} />
      <Button title="Déjà un compte ? Se connecter" onPress={() => router.replace("/login")} color="#28a745" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
});

export default RegisterScreen;