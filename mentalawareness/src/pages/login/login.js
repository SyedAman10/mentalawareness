import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
} from "react-native";
import { TextInput, Button, Provider as PaperProvider } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
// import theme from "../../styles/theme/theme";

const theme = {
  colors: {
    primary: "#6A85B6",
    accent: "#B6CEE8",
    background: "#F2F6FF",
    text: "#333333",
    placeholder: "#7A7A7A",
    buttonText: "#FFFFFF",
  },
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <PaperProvider theme={theme}>
      <LinearGradient
        colors={["#6A85B6", "#B6CEE8"]}
        style={styles.gradientBackground}
      >
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <View style={styles.formContainer}>
            <Text style={styles.headerText}>Welcome Back</Text>
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
              onPress={() => console.log("Log-In Pressed")}
              style={styles.button}
              theme={{ colors: { primary: theme.colors.accent } }}
            >
              Log In
            </Button>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.footerText}>
                Don't have an account?{" "}
                <Text style={styles.linkText}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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
  forgotPasswordText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  linkText: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
});
