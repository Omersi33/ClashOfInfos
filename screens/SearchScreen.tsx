import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import PlayerCard from "../components/PlayerCard";
import { fetchPlayerData } from "../controllers/PlayerController";

const SearchScreen = () => {
  const [playerTag, setPlayerTag] = useState("");
  const [playerData, setPlayerData] = useState<any>(null);

  const searchPlayer = async () => {
    try {
      const data = await fetchPlayerData(playerTag);
      setPlayerData(data);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rechercher un joueur</Text>
      <Input placeholder="Player Tag" value={playerTag} onChangeText={setPlayerTag} />
      <Button title="Rechercher" onPress={searchPlayer} />
      {playerData && <PlayerCard name={playerData.name} tag={playerData.tag} trophies={playerData.trophies} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});

export default SearchScreen;