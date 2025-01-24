import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  ActivityIndicator,
  TextInput as RNTextInput,
} from "react-native";
import { Button, Provider as PaperProvider } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../../../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from "../../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from "react-native-vector-icons";

const theme = {
  colors: {
    primary: "#faaca8",
    accent: "#ddd6f3",
    background: "#F2F6FF",
    text: "#333333",
    placeholder: "#7A7A7A",
    buttonText: "#FFFFFF",
  },
};

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState(""); // Store user type selection
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const handleSignUp = async (selectedUserType) => {
    if (!selectedUserType) {
      Alert.alert("Error", "Please select a user type (Therapist or User).");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: firstName,
      });

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        displayName: firstName,
        firstName: firstName,
        userType: selectedUserType, // Save userType
      });

      Alert.alert("Success", "Signed up successfully!", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error) {
      console.error("Error during sign up:", error);
      Alert.alert("Sign Up Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <LinearGradient
        colors={["#ddd6f3", "#faaca8"]}
        style={styles.gradientBackground}
      >
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <View style={styles.formContainer}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
            />
            <Text style={styles.headerText}>Create Account</Text>

            <RNTextInput
              placeholder="First Name"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              style={styles.input}
            />
            <RNTextInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              keyboardType="email-address"
            />
            <View style={styles.passwordContainer}>
              <RNTextInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={styles.input}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeIconContainer}
              >
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#7A7A7A"
                />
              </TouchableOpacity>
            </View>

            {/* Buttons for Sign Up as Therapist or User */}
            <View style={styles.buttonContainer}>
              <Button
                icon="account-tie"
                mode="contained"
                onPress={() => handleSignUp("therapist")}
                style={styles.button}
                theme={{ colors: { primary: theme.colors.accent } }}
                disabled={loading}
              >
                Sign Up as Therapist
              </Button>

              {/* Line separator with OR */}
              <View style={styles.orContainer}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.orLine} />
              </View>

              <Button
                icon="account"
                mode="contained"
                onPress={() => handleSignUp("user")}
                style={styles.button}
                theme={{ colors: { primary: theme.colors.primary } }}
                disabled={loading}
              >
                Sign Up as User
              </Button>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
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
    width: "100%",
    paddingVertical: 10,
    paddingLeft: 12,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIconContainer: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  button: {
    marginBottom: 10,
    paddingVertical: 8,
    width: "100%",
  },
  buttonContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: theme.colors.placeholder,
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
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 10,
  },
});
