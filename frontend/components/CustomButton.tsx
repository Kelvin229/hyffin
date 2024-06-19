import { Text, TouchableOpacity, TouchableOpacityProps, StyleSheet } from "react-native";
import React from "react";

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  handlePress: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, handlePress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0000FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 50,
    marginTop: 28,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 20,
  },
});

export default CustomButton;
