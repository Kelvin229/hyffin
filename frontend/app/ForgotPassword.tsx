import React, { useState } from "react";
import { Text, TextInput, View, StyleSheet, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Add this import

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email to reset password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset email sent. Please check your inbox.");
      router.push("/Login"); // Navigate back to the login screen after sending the email
    } catch (error: any) {
      let errorMessage = "An unknown error occurred";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email format.";
          break;
        case "auth/user-not-found":
          errorMessage = "User not found.";
          break;
        default:
          errorMessage = error.message;
          break;
      }
      console.error("Forgot Password Error: ", error.code, error.message);
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Ionicons
        name="arrow-back"
        size={24}
        color="white"
        onPress={() => router.back()}
        style={styles.backButton}
      />
      <View style={styles.container}>
        <Image
          source={{
            uri: "https://static.vecteezy.com/system/resources/previews/005/867/120/non_2x/black-and-white-alphabet-h-letter-logo-icon-with-wings-design-creative-template-for-company-and-business-vector.jpg",
          }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Forgot Password</Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          placeholderTextColor="#C0C0C0"
          value={email}
          onChangeText={setEmail}
        />

        <CustomButton
          handlePress={handleForgotPassword}
          style={styles.resetButton}
          title="Reset Password"
        />
      </View>
      <StatusBar backgroundColor="#000000" style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    zIndex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  logo: {
    width: 120, // Increased the size of the logo
    height: 120, // Increased the size of the logo
    alignSelf: "center", // Center the logo
    marginBottom: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    color: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#C0C0C0",
    fontWeight: "400",
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: "#0000FF",
    width: "100%",
    height: 48,
  },
});

export default ForgotPassword;
