import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from "react-native";
import { TextInput, Button, Provider as PaperProvider } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage


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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track auth status

  useEffect(() => {
    // Function to attempt auto-login with stored token
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authToken");
        if (storedToken) {
            // If you have a more robust system using firebase with id tokens, 
            // you'd want to verify that token with firebase here and if verified
            // set isAuthenticated to true, else remove token and redirect to login
            // you can also use auth.currentUser.getIdToken() to get the token of the current user
            console.log('Token found, attempting auto login');
            setIsAuthenticated(true)
            navigation.navigate('ProfileScreen')
        }
      } catch (error) {
        console.error("Error checking token:", error);
        // Optionally handle token reading errors
      } finally {
        setLoading(false); // Loading complete regardless
      }
    };

    checkToken();
  }, []);


  const handleSignIn = async () => {
    try {
        setLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();
      await AsyncStorage.setItem("authToken", token); // Store the token
      console.log("User Logged in:", auth.currentUser);
      setIsAuthenticated(true)
      Alert.alert("Success", "Logged in successfully!", [
        { text: "OK", onPress: () => navigation.navigate("ProfileScreen") },
      ]);
    } catch (error) {
      console.error("Error during sign in:", error);
      Alert.alert("Login Error", error.message);
    } finally {
          setLoading(false)
      }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  if(loading){
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Loading...</Text>
           </View>
         )
      }


  if (isAuthenticated) {
    // User is already logged in, navigate away directly
    return null;
  }


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
            <View style={styles.passwordInputContainer}>
            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={[styles.input, styles.passwordInput]} // Apply passwordInput styles
              mode="outlined"
              secureTextEntry={!isPasswordVisible}
              theme={{ colors: { primary: theme.colors.primary } }}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
                  <MaterialIcons
                    name={isPasswordVisible ? "visibility" : "visibility-off"}
                    size={24}
                    color={theme.colors.placeholder}
                  />
                </TouchableOpacity>
          </View>
            <Button
              mode="contained"
              onPress={handleSignIn}
              style={styles.button}
              theme={{ colors: { primary: theme.colors.accent } }}
              loading={loading}
              disabled={loading}
            >
              Log In
            </Button>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.footerText}>
                Don't have an account? <Text style={styles.linkText}>Sign Up</Text>
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
    passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
     marginBottom: 15,
  },
  passwordInput: {
        flex: 1, // Ensure password input takes up available space
    marginRight: 0,
  },
    eyeIconContainer: {
    position: "absolute",
    right: 10,
    padding: 5,
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
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 10,
  },
});