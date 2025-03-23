import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Alert } from "react-native";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { updateUserProfile } from "@/controllers/user.controller";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photoBase64, setPhotoBase64] = useState(user?.photoBase64 || "");
  const [buttonWidth, setButtonWidth] = useState<number>(0);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setPhotoBase64(user.photoBase64 || "");
    }
  }, [user]);

  const resizeImage = async (uri: string) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1080 } }],
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

  const onUpdateProfile = async () => {
    try {
      const updatedUser = await updateUserProfile({ username, photoBase64 });
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
      alert("Profil mis à jour !");
    } catch (error) {
      alert("Erreur : " + (error as Error).message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("userData");
      Alert.alert("Déconnexion", "Vous avez été déconnecté.");
    } catch {
      Alert.alert("Erreur", "Échec de la déconnexion.");
    }
  };

  const onModifierPhotoLayout = (e: any) => {
    setButtonWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: photoBase64 || "https://via.placeholder.com/150" }}
        style={styles.avatar}
      />

      <View onLayout={onModifierPhotoLayout}>
        <Button title="Modifier la photo" onPress={pickImage} />
      </View>

      <Input placeholder="Pseudo" value={username} onChangeText={setUsername} />
      <Input placeholder="Email" value={email} onChangeText={setEmail} editable={false} />

      <View style={[styles.actionButton, { width: buttonWidth }]}>
        <Button title="Mettre à jour" onPress={onUpdateProfile} />
      </View>
      <View style={[styles.actionButton, { width: buttonWidth }]}>
        <Button title="Se déconnecter" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  avatar: { width: 100, height: 100, borderRadius: 50, marginVertical: 10 },
  actionButton: { alignSelf: "center" },
});

export default ProfileScreen;