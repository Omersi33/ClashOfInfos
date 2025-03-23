import React, { useState, useEffect } from "react";
import { View, TextInput, Alert, StyleSheet, Text, TouchableOpacity, Keyboard, ScrollView, ActivityIndicator } from "react-native";
import PlayerCard from "@/components/cards/PlayerCard";
import { getPlayerByTag } from "@/services/player.service";
import { getUserProfile } from "@/services/auth.service";
import Player from "@/models/Player";
import { auth } from "@/config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const getRandomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 60%, 70%)`;

const GamerScreen = () => {
  const [gamertag, setGamertag] = useState("");
  const [player, setPlayer] = useState<Player | null>(null);
  const [playerColor, setPlayerColor] = useState("");
  const [linkedPlayers, setLinkedPlayers] = useState<Player[]>([]);
  const [linkedPlayersColors, setLinkedPlayersColors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [showLinked, setShowLinked] = useState(true);
  const [noPlayerFound, setNoPlayerFound] = useState(false);

  const fetchLinkedAccounts = async () => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const userData = await getUserProfile(auth.currentUser.uid);

      if (!userData?.linkedAccounts || !Array.isArray(userData.linkedAccounts) || userData.linkedAccounts.length === 0) {
        setLinkedPlayers([]);
        setLinkedPlayersColors({});
        setLoading(false);
        return;
      }

      const players = await Promise.all(
        userData.linkedAccounts.map(async (tag) => {
          if (!tag || typeof tag !== "string" || tag.trim() === "") {
            return null;
          }
          try {
            return await getPlayerByTag(tag);
          } catch {
            return null;
          }
        })
      );

      const validPlayers = players.filter(p => p !== null) as Player[];
      setLinkedPlayers(validPlayers);

      const newColors: { [key: string]: string } = {};
      validPlayers.forEach(player => {
        newColors[player.tag] = getRandomColor();
      });

      setLinkedPlayersColors(newColors);
    } catch {
      setLinkedPlayers([]);
      setLinkedPlayersColors({});
    }

    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchLinkedAccounts();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const searchPlayer = async () => {
    if (!gamertag.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un gamertag.");
      return;
    }

    setLoading(true);
    setShowLinked(false);
    setPlayer(null);
    setPlayerColor(getRandomColor());
    setNoPlayerFound(false);
    Keyboard.dismiss();

    try {
      const playerData = await getPlayerByTag(gamertag);
      setPlayer(playerData);
    } catch {
      setPlayer(null);
      setNoPlayerFound(true);
    }

    setLoading(false);
  };

  const handleShowLinked = async () => {
    setLinkedPlayers([]);
    setLinkedPlayersColors({});
    setShowLinked(true);
    setLoading(true);
    await fetchLinkedAccounts();
    setLoading(false);
  };

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      <View style={styles.searchContainer}>
        <Text style={styles.hash}>#</Text>
        <TextInput
          style={styles.input}
          placeholder="Gamertag"
          placeholderTextColor="#aaa"
          value={gamertag}
          onChangeText={setGamertag}
          onSubmitEditing={searchPlayer}
          returnKeyType="search"
        />
      </View>

      <View style={styles.topSpacing} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.myAccountsButton]} onPress={handleShowLinked}>
          <Text style={styles.buttonText}>Mes comptes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.searchButton]} onPress={searchPlayer}>
          <Text style={styles.buttonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardSpacing} />

      {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}

      {!loading && showLinked && linkedPlayers.length === 0 && (
        <Text style={styles.noAccountsText}>Vous n'avez lié aucun compte.</Text>
      )}

      {!loading && showLinked && linkedPlayers.map((p, index) => (
        <PlayerCard key={index} player={p} color={linkedPlayersColors[p.tag]} />
      ))}

      {!loading && !showLinked && noPlayerFound && (
        <Text style={styles.noAccountsText}>Aucun joueur n'a été trouvé.</Text>
      )}

      {!loading && !showLinked && player && <PlayerCard player={player} color={playerColor} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, width: "100%" },
  scrollContent: { alignItems: "center", padding: 20, paddingBottom: 40 },
  searchContainer: {
    flexDirection: "row", alignItems: "center", borderColor: "#ccc", borderWidth: 1,
    borderRadius: 8, paddingHorizontal: 10, width: "80%", marginBottom: 8,
  },
  hash: { fontSize: 18, fontWeight: "bold", marginRight: 5 },
  input: { flex: 1, height: 50, fontSize: 16 },
  topSpacing: { height: 5 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", width: "80%" },
  button: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingVertical: 12, borderRadius: 10, marginHorizontal: 5,
  },
  myAccountsButton: { backgroundColor: "#28A745" },
  searchButton: { backgroundColor: "#007AFF" },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16, textAlign: "center" },
  cardSpacing: { height: 20 },
  noAccountsText: { color: "#aaa", fontSize: 16, marginTop: 20 },
  loader: { marginTop: 20 },
});

export default GamerScreen;