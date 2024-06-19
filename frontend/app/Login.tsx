import React, { useState } from "react";
import { Image, Text, TextInput, View, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, getIdToken } from "firebase/auth";
import { auth } from "../firebase";
import CustomButton from "../components/CustomButton";
import CustomLoginBtn from "../components/CustomLoginBtn";
import { router } from "expo-router";
import { Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons"; // Add this import

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await getIdToken(userCredential.user);
      await AsyncStorage.setItem('token', token);  // Store the token using AsyncStorage
      router.push("/(tabs)/home");
    } catch (error: any) {
      let errorMessage = "An unknown error occurred";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email format.";
          break;
        case "auth/user-disabled":
          errorMessage = "This user has been disabled.";
          break;
        case "auth/user-not-found":
          errorMessage = "User not found.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
        default:
          errorMessage = error.message;
          break;
      }
      console.error("SignIn Error: ", error.code, error.message);
      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const token = await getIdToken(userCredential.user);
      
      router.push("/(tabs)/home");
    } catch (error: any) {
      let errorMessage = "An unknown error occurred";
      switch (error.code) {
        case "auth/account-exists-with-different-credential":
          errorMessage = "Account exists with different credentials.";
          break;
        case "auth/cancelled-popup-request":
          errorMessage = "Popup request was cancelled.";
          break;
        case "auth/popup-blocked":
          errorMessage = "Popup was blocked.";
          break;
        case "auth/popup-closed-by-user":
          errorMessage = "Popup closed by user.";
          break;
        case "auth/unauthorized-domain":
          errorMessage = "Unauthorized domain.";
          break;
        default:
          errorMessage = error.message;
          break;
      }
      console.error("Google SignIn Error: ", error.code, error.message);
      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <Ionicons
        name="arrow-back"
        size={24}
        color="white"
        onPress={() => router.back()}
        style={styles.backButton}
      /> */}
      <View style={styles.container}>
        <Image
          source={{
            uri: "https://static.vecteezy.com/system/resources/previews/005/867/120/non_2x/black-and-white-alphabet-h-letter-logo-icon-with-wings-design-creative-template-for-company-and-business-vector.jpg",
          }}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Welcome to Hyffin</Text>
        </View>

        <View style={styles.loginButtonsContainer}>
          <CustomLoginBtn
            handlePress={handleGoogleSignIn}
            title="Login with Google"
            name="google"
          />
        </View>

        <Text style={styles.orDivider}>or</Text>

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

          <Text style={styles.forgotPasswordLink} onPress={() => router.push("/ForgotPassword")}>
            Forgot Password?
          </Text>

          <CustomButton
            handlePress={handleSignIn}
            style={styles.signInButton}
            title="Login"
          />
        </View>

        <View style={styles.signUpRedirect}>
          <Text style={styles.redirectText}>Don't have an account? </Text>
          <Text
            style={styles.redirectLink}
            onPress={() => router.push("/SignUp")}
          >
            Sign Up
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
    backgroundColor: '#000000',
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
    justifyContent: 'center',
  },
  logo: {
    width: 120, // Increased the size of the logo
    height: 120, // Increased the size of the logo
    alignSelf: "center", // Center the logo
    marginBottom: 16,
  },
  signInContainer: {
    alignItems: 'center',
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 28, // Add margin bottom to move the text a bit lower
  },
  loginButtonsContainer: {
    marginTop: 28,
  },
  orDivider: {
    marginVertical: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  inputContainer: {
    justifyContent: 'space-between',
  },
  input: {
    color: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#C0C0C0',
    fontWeight: '400',
    marginBottom: 16,
  },
  forgotPasswordLink: {
    color: '#0000FF',
    textAlign: 'right',
    marginBottom: 16,
  },
  signInButton: {
    backgroundColor: '#0000FF',
    width: '100%',
    height: 48,
    marginTop: 28,
  },
  signUpRedirect: {
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

export default Login;
