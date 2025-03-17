import React from "react";
import { TextInput, StyleSheet, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  isDisabled?: boolean;
  selectOnFocus?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false, 
  isDisabled = false, 
  selectOnFocus = false, // ✅ Désactivé par défaut
  keyboardType = "default",
  autoCapitalize = "none",
}) => {
  return (
    <View style={isDisabled ? styles.disabledContainer : styles.container}>
      <TextInput 
        style={styles.input} 
        placeholder={placeholder} 
        value={value} 
        onChangeText={!isDisabled ? onChangeText : undefined}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        selectTextOnFocus={selectOnFocus} // ✅ Désactive totalement la sélection automatique
        editable={!isDisabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "80%" },
  disabledContainer: { width: "80%", opacity: 0.5 },
  input: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});

export default Input;