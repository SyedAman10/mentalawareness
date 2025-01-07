import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const theme = {
  colors: {
    primary: "#6A85B6",
    accent: "#B6CEE8",
    text: "#333333",
    buttonText: "#FFFFFF",
  },
};

export default function RoleSelectionScreen({ navigation }) {
  return (
    <LinearGradient
      colors={["#6A85B6", "#B6CEE8"]}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Who are you?</Text>
        <Text style={styles.subtitle}>Let us know to personalize your experience!</Text>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("TherapistScreen")}
        >
          <MaterialCommunityIcons
            name="stethoscope"
            size={40}
            color={theme.colors.primary}
          />
          <Text style={styles.optionText}>I’m a Therapist</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("UserScreen")}
        >
          <MaterialCommunityIcons
            name="account-circle"
            size={40}
            color={theme.colors.accent}
          />
          <Text style={styles.optionText}>I’m a User</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.buttonText,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.buttonText,
    marginBottom: 30,
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  optionText: {
    fontSize: 18,
    color: theme.colors.primary,
    marginTop: 10,
    fontWeight: "bold",
  },
});
