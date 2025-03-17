import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ClanCardProps {
  name: string;
  tag: string;
  level: number;
}

const ClanCard: React.FC<ClanCardProps> = ({ name, tag, level }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.tag}>Tag : {tag}</Text>
      <Text style={styles.level}>🏆 Niveau {level}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#eef2ff",
    marginVertical: 5,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: "bold" },
  tag: { fontSize: 14, color: "#666" },
  level: { fontSize: 16, color: "#007bff" },
});

export default ClanCard;