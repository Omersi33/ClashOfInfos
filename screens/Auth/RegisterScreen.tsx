import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { handleRegister } from "../../controllers/AuthController";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";

const RegisterScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

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

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission refusée pour accéder aux images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setPhotoBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const onRegister = async () => {
    try {
      const newUser = await handleRegister(email, password, username, photoBase64);

      await AsyncStorage.setItem("userData", JSON.stringify(newUser));

      navigation.replace("Home");
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>

      <TouchableOpacity onPress={pickImage}>
        <Image 
          source={{ uri: photoBase64 || "https://via.placeholder.com/150" }} 
          style={styles.avatar} 
        />
      </TouchableOpacity>

      <Input placeholder="Pseudo" value={username} onChangeText={setUsername} autoCapitalize="none" />
      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Input placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="S'inscrire" onPress={onRegister} />
      <Button title="Déjà un compte ? Se connecter" onPress={() => navigation.navigate("Login")} color="#28a745" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10, borderWidth: 1, borderColor: "#ccc" },
});

export default RegisterScreen;