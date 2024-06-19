import { AntDesign } from "@expo/vector-icons";
import { Text, TouchableOpacity, TouchableOpacityProps, StyleSheet } from "react-native";
import React from "react";

interface CustomLoginBtnProps extends TouchableOpacityProps {
  title: string;
  name: "google" | "apple";
  handlePress: () => void;
}

const CustomLoginBtn: React.FC<CustomLoginBtnProps> = ({ title, name, handlePress }) => {
  const icons = (name: "google" | "apple") => {
    switch (name) {
      case "google":
        return <AntDesign name="google" size={24} color="white" />;
      case "apple":
        return <AntDesign name="apple1" size={24} color="white" />;
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
    >
      {icons(name)}
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    marginVertical: 8,
    borderRadius: 50,
    borderColor: '#D1D1D1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#C0C0C0',
    fontWeight: '600',
  },
});

export default CustomLoginBtn;
