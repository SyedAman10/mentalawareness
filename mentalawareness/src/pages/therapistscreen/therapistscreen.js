import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TherapistScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, Therapist!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F6FF",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6A85B6",
  },
});
