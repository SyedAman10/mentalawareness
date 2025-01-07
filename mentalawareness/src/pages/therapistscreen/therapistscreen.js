import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { TextInput, Button, Provider as PaperProvider } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
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

export default function TherapistScreen() {
  const [fullName, setFullName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [experience, setExperience] = useState("");
  const [document, setDocument] = useState(null);

  const handleDocumentPick = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({});
      if (res.type === "success") {
        setDocument(res);
      }
    } catch (err) {
      console.error("Error picking document", err);
      Alert.alert("Error", "Failed to select document. Please try again.");
    }
  };

  const handleSubmit = () => {
    if (!fullName || !licenseNumber || !experience || !document) {
      Alert.alert("Error", "Please fill in all fields and upload a document.");
    } else {
      Alert.alert("Success", "Your verification request has been submitted.");
      // Add further handling here for form submission (e.g., send to backend)
    }
  };

  return (
    <PaperProvider theme={theme}>
      <LinearGradient
        colors={["#faaca8", "#faaca8"]}
        style={styles.gradientBackground}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Therapist Verification</Text>
          <Text style={styles.subtitle}>Please fill out the form and upload your documents for verification.</Text>

          <TextInput
            label="Full Name"
            value={fullName}
            onChangeText={(text) => setFullName(text)}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: theme.colors.primary } }}
          />
          <TextInput
            label="License Number"
            value={licenseNumber}
            onChangeText={(text) => setLicenseNumber(text)}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
            theme={{ colors: { primary: theme.colors.primary } }}
          />
          <TextInput
            label="Experience (in years)"
            value={experience}
            onChangeText={(text) => setExperience(text)}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
            theme={{ colors: { primary: theme.colors.primary } }}
          />
          
          <TouchableOpacity style={styles.documentButton} onPress={handleDocumentPick}>
            <Text style={styles.documentText}>
              {document ? `Document Selected: ${document.name}` : "Upload Professional License"}
            </Text>
          </TouchableOpacity>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            theme={{ colors: { primary: theme.colors.accent } }}
          >
            Submit for Verification
          </Button>
        </View>
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
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F2F6FF",
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  input: {
    width: "100%",
    marginBottom: 15,
  },
  documentButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    marginBottom: 20,
    alignItems: "center",
  },
  documentText: {
    color: theme.colors.primary,
    fontSize: 16,
  },
  submitButton: {
    paddingVertical: 10,
    width: "100%",
  },
});
