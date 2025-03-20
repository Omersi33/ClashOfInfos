import React, { useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Input from "../components/Input"
import Button from "../components/Button"
import { handleLogin } from "../controllers/AuthController"
import { useRouter } from "expo-router"

const LoginScreen = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onLogin = async () => {
    try {
      const user = await handleLogin(email, password)
      await AsyncStorage.setItem("userData", JSON.stringify(user))
      router.replace("/(tabs)/gamer")
    } catch (error) {
      alert((error as Error).message)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Input placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Se connecter" onPress={onLogin} />
      <Button title="Créer un compte" onPress={() => router.push("/register")} color="#28a745" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
})

export default LoginScreen