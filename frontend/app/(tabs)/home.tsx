import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { router } from "expo-router";

const Home: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/Login");
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: "https://static.vecteezy.com/system/resources/previews/005/867/120/non_2x/black-and-white-alphabet-h-letter-logo-icon-with-wings-design-creative-template-for-company-and-business-vector.jpg",
            }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        {email && <Text style={styles.emailText}>{email}</Text>}
      </View>
      <View style={styles.container}>
        <CustomButton
          handlePress={handleLogout}
          style={styles.logoutButton}
          title="Logout"
        />
      </View>
      <StatusBar backgroundColor="#000000" style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    borderColor: "#FFFFFF",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
  },
  emailText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#FF0000",
    width: "80%",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
