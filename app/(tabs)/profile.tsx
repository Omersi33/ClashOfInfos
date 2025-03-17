import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Alert } from "react-native";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";
import { updateUserProfile } from "../../controllers/AuthController";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";

const ProfileScreen = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photoBase64, setPhotoBase64] = useState(user?.photoBase64 || "");

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

  const onUpdateProfile = async () => {
    try {
      await updateUserProfile({ username, photoBase64 });
      alert("Profil mis à jour !");
    } catch (error) {
      alert("Erreur : " + (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>
      <Image source={{ uri: photoBase64 || "https://via.placeholder.com/150" }} style={styles.avatar} />
      <Button title="Modifier la photo" onPress={pickImage} />
      <Input placeholder="Pseudo" value={username} onChangeText={setUsername} />
      <Input placeholder="Email" value={email} onChangeText={setEmail} editable={false} selectTextOnFocus={false} />
      <Button title="Mettre à jour" onPress={onUpdateProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
  avatar: { width: 100, height: 100, borderRadius: 50, marginVertical: 10 },
});

export default ProfileScreen;