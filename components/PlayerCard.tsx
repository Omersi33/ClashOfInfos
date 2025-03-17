import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface PlayerCardProps {
  name: string;
  tag: string;
  trophies: number;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ name, tag, trophies }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.tag}>Tag : {tag}</Text>
      <Text style={styles.trophies}>🏆 {trophies} trophées</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#f8f9fa",
    marginVertical: 5,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: "bold" },
  tag: { fontSize: 14, color: "#666" },
  trophies: { fontSize: 16, color: "#ffbf00" },
});

export default PlayerCard;