import React, { useState, useEffect } from "react";
import { View, TextInput, Alert, StyleSheet, Text, TouchableOpacity, Keyboard, ScrollView, ActivityIndicator } from "react-native";
import ClanCard from "@/components/ClanCard";
import { getClanByTag } from "@/services/ClanService";
import { getPlayerByTag } from "@/services/PlayerService";
import { getUserProfile } from "@/services/AuthService";
import Clan from "@/models/Clan";
import { auth } from "@/config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const getRandomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 60%, 70%)`;

const ClanScreen = () => {
  const [clantag, setClantag] = useState("");
  const [clan, setClan] = useState<Clan | null>(null);
  const [clanColor, setClanColor] = useState("");
  const [linkedClans, setLinkedClans] = useState<Clan[]>([]);
  const [linkedClansColors, setLinkedClansColors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [showLinked, setShowLinked] = useState(true);
  const [noClanFound, setNoClanFound] = useState(false);

  const fetchLinkedClans = async () => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }
  
    setLoading(true);
    setLinkedClans([]);
  
    try {
      const userData = await getUserProfile(auth.currentUser.uid);
      if (!userData?.linkedAccounts || userData.linkedAccounts.length === 0) {
        setLinkedClans([]);
        setLinkedClansColors({});
        setLoading(false);
        return;
      }
  
      const uniqueClans: { [key: string]: Clan } = {};
  
      for (const playerTag of userData.linkedAccounts) {
        try {
          const playerData = await getPlayerByTag(playerTag);
          if (playerData?.clan?.tag && !uniqueClans[playerData.clan.tag]) {
            const clanData = await getClanByTag(playerData.clan.tag);
            uniqueClans[playerData.clan.tag] = clanData;
          }
        } catch (error) {}
      }
  
      const validClans = Object.values(uniqueClans);
      setLinkedClans(validClans);
  
      const newColors: { [key: string]: string } = {};
      validClans.forEach(clan => {
        newColors[clan.tag] = getRandomColor();
      });
  
      setLinkedClansColors(newColors);
    } catch (error) {
      setLinkedClans([]);
      setLinkedClansColors({});
    }
  
    setLoading(false);
  };  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchLinkedClans();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const searchClan = async () => {
    if (!clantag.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un clantag.");
      return;
    }

    setLoading(true);
    setShowLinked(false);
    setClan(null);
    setNoClanFound(false);
    setClanColor(getRandomColor());
    Keyboard.dismiss();

    try {
      const clanData = await getClanByTag(clantag);
      setClan(clanData);
    } catch {
      setClan(null);
      setNoClanFound(true);
    }

    setLoading(false);
  };

  const handleShowLinked = async () => {
    setShowLinked(true);
    setLinkedClans([]);
    setLinkedClansColors({});
    setLoading(true);
    await fetchLinkedClans();
    setLoading(false);
  };

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      <View style={styles.searchContainer}>
        <Text style={styles.hash}>#</Text>
        <TextInput
          style={styles.input}
          placeholder="Clantag"
          placeholderTextColor="#aaa"
          value={clantag}
          onChangeText={setClantag}
          onSubmitEditing={searchClan}
          returnKeyType="search"
        />
      </View>

      <View style={styles.topSpacing} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.myClansButton]} onPress={handleShowLinked}>
          <Text style={styles.buttonText}>Mes clans</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.searchButton]} onPress={searchClan}>
          <Text style={styles.buttonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardSpacing} />

      {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}

      {!loading && showLinked && linkedClans.length === 0 && (
        <Text style={styles.noAccountsText}>Vous n'avez aucun clan.</Text>
      )}

      {!loading && showLinked && linkedClans.map((c, index) => (
        <ClanCard key={index} clan={c} color={linkedClansColors[c.tag]} />
      ))}

      {!loading && !showLinked && noClanFound && (
        <Text style={styles.noAccountsText}>Aucun clan trouvé.</Text>
      )}

      {!loading && !showLinked && clan && <ClanCard clan={clan} color={clanColor} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 40,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "80%",
    marginBottom: 8,
  },
  hash: { fontSize: 18, fontWeight: "bold", marginRight: 5 },
  input: { flex: 1, height: 50, fontSize: 16 },

  topSpacing: { height: 5 },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },

  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },

  myClansButton: { backgroundColor: "#28A745" },
  searchButton: { backgroundColor: "#007AFF" },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },

  cardSpacing: { height: 20 },
  noAccountsText: { color: "#aaa", fontSize: 16, marginTop: 20 },

  loader: { marginTop: 20 },
});

export default ClanScreen;