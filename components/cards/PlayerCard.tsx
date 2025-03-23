import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { verifyToken } from "@/services/player.service";
import { updateLinkedAccounts } from "@/services/auth.service";
import TokenModal from "@/components/modals/TokenModal";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import Player from "@/models/Player";
import ClanMember from "@/models/ClanMember";

interface PlayerCardProps {
  player: Player | ClanMember;
  color: string;
  hideClan?: boolean;
  defaultClosed?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, color, hideClan = false, defaultClosed = false }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(!defaultClosed);
  const [isLinked, setIsLinked] = useState("tag" in player && (user?.linkedAccounts ?? []).includes(player.tag));
  const [isTokenModalVisible, setIsTokenModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const animation = useState(new Animated.Value(isOpen ? 1 : 0))[0];

  useEffect(() => {
    if ("tag" in player) {
      setIsLinked((user?.linkedAccounts ?? []).includes(player.tag));
    }
  }, [user, player]);

  const toggleOpen = () => {
    Animated.timing(animation, {
      toValue: isOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsOpen(!isOpen);
  };

  const handleToggleSwitch = () => {
    if (!isLinked) {
      setIsTokenModalVisible(true);
    } else {
      setIsConfirmModalVisible(true);
    }
  };

  const handleValidateToken = async (token: string) => {
    try {
      const verificationResult = await verifyToken(player.tag, token);
      if (verificationResult.status !== "ok") return;
      if (!user?.id) return;
      const newLinkedAccounts = [...(user.linkedAccounts ?? []), player.tag];
      await updateLinkedAccounts(user.id, newLinkedAccounts);
      setIsLinked(true);
      setIsTokenModalVisible(false);
    } catch (error) {}
  };

  const handleConfirmUnlink = async () => {
    try {
      if (!user) return;
      const newLinkedAccounts = (user.linkedAccounts ?? []).filter((tag: string) => tag !== player.tag);
      await updateLinkedAccounts(user.id, newLinkedAccounts);
      setIsLinked(false);
      setIsConfirmModalVisible(false);
    } catch (error) {}
  };

  return (
    <View style={[styles.card, { borderColor: color }]}>
      <View style={{ backgroundColor: color }}>
        <TouchableOpacity style={styles.header} onPress={toggleOpen} activeOpacity={0.8}>
          <Text style={styles.name}>{player.name}</Text>
          <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={{
          overflow: "hidden",
          maxHeight: animation.interpolate({
            inputRange: [0, 1.8],
            outputRange: [0, 300],
          }),
        }}
      >
        <View style={styles.content}>
          <Text><Text style={styles.label}>Gamertag :</Text> {player.tag}</Text>
          <Text><Text style={styles.label}>Niveau :</Text> {player.expLevel}</Text>
          <Text><Text style={styles.label}>HDV :</Text> {player.townHallLevel}</Text>
          <Text><Text style={styles.label}>Trophées :</Text> {player.trophies}</Text>

          {!hideClan && "clan" in player && player.clan && (
            <Text><Text style={styles.label}>Clan :</Text> {player.clan.name} ({player.clan.tag})</Text>
          )}

          {"tag" in player && (
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Relier</Text>
              <Switch value={isLinked} onValueChange={handleToggleSwitch} />
            </View>
          )}
        </View>
      </Animated.View>

      <TokenModal
        visible={isTokenModalVisible}
        onClose={() => setIsTokenModalVisible(false)}
        onValidate={handleValidateToken}
      />
      <ConfirmationModal
        visible={isConfirmModalVisible}
        message="Voulez-vous vraiment délier ce compte ?"
        onConfirm={handleConfirmUnlink}
        onCancel={() => setIsConfirmModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderWidth: 3, borderRadius: 10, marginVertical: 10, width: "100%", backgroundColor: "#f9f9f9" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15 },
  name: { fontSize: 18, fontWeight: "bold", color: "white" },
  content: { padding: 15 },
  label: { fontWeight: "bold" },
  switchContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
});

export default PlayerCard;