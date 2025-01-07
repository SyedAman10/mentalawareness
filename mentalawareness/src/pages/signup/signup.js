import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  Image
} from "react-native";
import { TextInput, Button, Provider as PaperProvider } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const theme = {
    colors: {
      primary: "#faaca8",
      accent: "#faaca8",
      background: "#F2F6FF",
      text: "#333333",
      placeholder: "#7A7A7A",
      buttonText: "#FFFFFF",
    },
  };

export default function SignUpScreen({navigation}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <PaperProvider theme={theme}>
      <LinearGradient
       colors={["#ddd6f3", "#faaca8"]}
        style={styles.gradientBackground}
      >
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <View style={styles.formContainer}>
          <Image
                        source={require("../../assets/images/logo.png")} // Path to your logo
                        style={styles.logo}
                      />
            <Text style={styles.headerText}>Create Your Account</Text>
            <TextInput
              label="Name"
              value={name}
              onChangeText={(text) => setName(text)}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: theme.colors.primary } }}
            />
            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              theme={{ colors: { primary: theme.colors.primary } }}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              mode="outlined"
              secureTextEntry
              theme={{ colors: { primary: theme.colors.primary } }}
            />
            <Button
              mode="contained"
              onPress={() => navigation.navigate("RoleSelection")} // Navigate to RoleSelection
              style={styles.button}
              theme={{ colors: { primary: theme.colors.accent } }}
            >
              Sign Up
            </Button>
            <TouchableOpacity  onPress={() => navigation.navigate("Login")}>
              <Text style={styles.footerText}>
                Already have an account? <Text style={styles.linkText}>Log In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  logo: {
    width: 100, // Adjust the width as per your logo size
    height: 100, // Adjust the height as per your logo size
    resizeMode: "contain", // Ensure the logo is not stretched
    alignSelf: "center", // Center the logo
    marginBottom: 10, // Space between logo and form
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  footerText: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  linkText: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
});
