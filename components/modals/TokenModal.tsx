import React, { useState } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/common/Input";

interface TokenModalProps {
  visible: boolean;
  onClose: () => void;
  onValidate: (token: string) => void;
}

const TokenModal: React.FC<TokenModalProps> = ({ visible, onClose, onValidate }) => {
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    Keyboard.dismiss();
    setTimeout(onClose, 100);
  };

  const handleValidate = () => {
    if (!token.trim()) {
      setErrorMessage("⚠ Le token est vide !");
      return;
    }
    onValidate(token);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Entrez votre token</Text>
          <Input 
            placeholder="Token" 
            value={token} 
            onChangeText={(text) => {
              setToken(text);
              setErrorMessage("");
            }} 
          />
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleClose} style={styles.iconButton}>
              <Ionicons name="close" size={30} color="red" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleValidate} style={styles.iconButton}>
              <Ionicons name="checkmark" size={30} color="green" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  iconButton: {
    marginHorizontal: 10,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
});

export default TokenModal;