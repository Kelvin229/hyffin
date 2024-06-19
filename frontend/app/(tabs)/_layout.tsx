import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import React from "react";

const TabLayout: React.FC = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#737373",
        tabBarInactiveTintColor: "#3A3A3A",
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <View style={styles.tabItem}>
              <FontAwesome name="home" size={24} color={color} />
              <Text style={[styles.tabText, { color }]}>Home</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          title: "Results",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <View style={styles.tabItem}>
              <FontAwesome name="list" size={24} color={color} />
              <Text style={[styles.tabText, { color }]}>Results</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <View style={styles.tabItem}>
              <FontAwesome name="upload" size={24} color={color} />
              <Text style={[styles.tabText, { color }]}>Upload</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#000000",
    borderTopWidth: 1,
    borderTopColor: "#232533",
    height: 65,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
  },
  tabText: {
    fontWeight: "600",
    fontSize: 12,
  },
});

export default TabLayout;
