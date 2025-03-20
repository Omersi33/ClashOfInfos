import React from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity, Keyboard } from "react-native";

interface ConfirmationModalProps {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ visible, message, onConfirm, onCancel }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel}>
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.confirm]} onPress={onConfirm}>
              <Text style={styles.buttonText}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modal: { width: "80%", padding: 20, backgroundColor: "white", borderRadius: 10, alignItems: "center" },
  message: { fontSize: 16, marginBottom: 15 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  button: { flex: 1, padding: 10, borderRadius: 5, marginHorizontal: 5, alignItems: "center" },
  cancel: { backgroundColor: "gray" },
  confirm: { backgroundColor: "red" },
  buttonText: { color: "white", fontWeight: "bold" },
});

export default ConfirmationModal;