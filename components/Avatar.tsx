import React from "react";
import { Image, TouchableOpacity, StyleSheet } from "react-native";

interface AvatarProps {
  uri: string;
  onPress?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({ uri, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={{ uri }} style={styles.avatar} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ddd",
  },
});

export default Avatar;