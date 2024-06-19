import React, { useState } from "react";
import { Image, Text, TextInput, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { createUserWithEmailAndPassword, getIdToken } from "firebase/auth";
import { auth } from "../firebase";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await getIdToken(userCredential.user);
      await AsyncStorage.setItem('token', token);  // Store the token using AsyncStorage
      router.push("/(tabs)/home");
    } catch (error: any) {
      let errorMessage = "An unknown error occurred";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already in use.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email format.";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Operation not allowed.";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak.";
          break;
        default:
          errorMessage = error.message;
          break;
      }
      console.error("SignUp Error: ", error.code, error.message);
      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <Image
          source={{
            uri: "https://static.vecteezy.com/system/resources/previews/005/867/120/non_2x/black-and-white-alphabet-h-letter-logo-icon-with-wings-design-creative-template-for-company-and-business-vector.jpg",
          }}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Sign up for Hyffin</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            style={styles.input}
            placeholderTextColor="#C0C0C0"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            style={styles.input}
            placeholderTextColor="#C0C0C0"
            value={password}
            onChangeText={setPassword}
          />
          <CustomButton
            handlePress={handleSignUp}
            style={styles.signUpButton}
            title="Sign Up"
          />
        </View>

        <View style={styles.signInRedirect}>
          <Text style={styles.redirectText}>Already have an account? </Text>
          <Text
            style={styles.redirectLink}
            onPress={() => router.push("/Login")}
          >
            Login
          </Text>
        </View>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        {snackbarMessage}
      </Snackbar>
      <StatusBar backgroundColor="#000000" style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    zIndex: 1,
  },
  logo: {
    width: 120, // Increased the size of the logo
    height: 120, // Increased the size of the logo
    alignSelf: "center", // Center the logo
    marginBottom: 16,
  },
  signUpContainer: {
    alignItems: 'center',
  },
  signUpText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 28,
  },
  inputContainer: {
    justifyContent: "space-between",
    marginTop: 28,
  },
  input: {
    color: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#C0C0C0",
    fontWeight: "400",
    marginBottom: 20,
  },
  signUpButton: {
    backgroundColor: "#0000FF",
    width: "100%",
    height: 48,
    marginTop: 28,
  },
  signInRedirect: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  redirectText: {
    color: "#C0C0C0",
  },
  redirectLink: {
    color: "#0000FF",
    fontWeight: "600",
  },
});

export default SignUp;
