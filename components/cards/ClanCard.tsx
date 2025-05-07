import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Clan from "@/models/Clan";
import Player from "@/models/Player";
import { getClanMembers } from "@/services/clan.service";
import { getPlayerByTag } from "@/services/player.service";
import PlayerCard from "./PlayerCard";
import ClanMember from "@/models/ClanMember";

const getRandomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 60%, 70%)`;

const ClanCard = ({ clan, color }: { clan: Clan; color: string }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [memberList, setMemberList] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [playerColors, setPlayerColors] = useState<{ [key: string]: string }>({});

  const animation = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (isMembersOpen && memberList.length === 0) {
      fetchMembers();
    }
  }, [isMembersOpen]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const clanMembers: ClanMember[] = await getClanMembers(clan.tag);
      const players = await Promise.all(
        clanMembers.map(async (member) => {
          try {
            return await getPlayerByTag(member.tag);
          } catch {
            return null;
          }
        })
      );
      const validPlayers = players.filter(p => p !== null) as Player[];
      setMemberList(validPlayers);

      const generatedColors: { [key: string]: string } = {};
      validPlayers.forEach(player => {
        generatedColors[player.tag] = getRandomColor();
      });
      setPlayerColors(generatedColors);
    } catch {
      setMemberList([]);
    }
    setLoading(false);
  };

  const toggleOpen = () => {
    Animated.timing(animation, {
      toValue: isOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsOpen(!isOpen);
  };

  const toggleMembersOpen = () => {
    setIsMembersOpen(!isMembersOpen);
  };

  return (
    <View style={[styles.card, { borderColor: color }]}>
      <View style={{ backgroundColor: color }}>
        <TouchableOpacity style={styles.header} onPress={toggleOpen} activeOpacity={0.8}>
          <Text style={styles.name}>{clan.name}</Text>
          <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={{
          overflow: "hidden",
          maxHeight: animation.interpolate({ inputRange: [0, 1], outputRange: [0, 5000] }),
        }}
      >
        <View style={styles.content}>
          <Text><Text style={styles.label}>Clantag :</Text> {clan.tag}</Text>
          <Text><Text style={styles.label}>Niveau :</Text> {clan.level}</Text>
          <Text><Text style={styles.label}>Description :</Text> {clan.description}</Text>
          <Text><Text style={styles.label}>Trophées :</Text> {clan.trophies}</Text>

          <TouchableOpacity onPress={toggleMembersOpen} style={styles.memberToggle}>
            <Text><Text style={styles.label}>Membres :</Text> {clan.members}/50</Text>
            <Ionicons name={isMembersOpen ? "chevron-up" : "chevron-down"} size={20} />
          </TouchableOpacity>

          {loading && <ActivityIndicator size="large" color="#007AFF" />}
          {isMembersOpen && memberList.map((member) => (
            <PlayerCard key={member.tag} player={member} color={playerColors[member.tag]} hideClan defaultClosed />
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderWidth: 3, borderRadius: 10, marginVertical: 10, width: "100%", backgroundColor: "#f9f9f9" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15 },
  name: { fontSize: 18, fontWeight: "bold", color: "white" },
  content: { padding: 15 },
  label: { fontWeight: "bold" },
  memberToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
});

export default ClanCard;