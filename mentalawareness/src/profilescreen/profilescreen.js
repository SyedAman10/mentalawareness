import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { IconButton, Provider as PaperProvider } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";

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

export default function ProfileScreen() {
  const [name, setName] = useState("John Doe");
  const [bio, setBio] = useState("Hello! I love connecting with people.");
  const [profilePicUri, setProfilePicUri] = useState(null);

  const handlePickProfilePic = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "You need to grant media library permissions to select a file."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicUri(result.assets[0].uri);
    }
  };

  const handleSaveProfile = () => {
    Alert.alert("Profile Updated", "Your profile has been successfully updated.");
    // Add logic to save profile changes (e.g., API calls or state updates)
  };

  return (
    <PaperProvider theme={theme}>
      <LinearGradient
        colors={["#ddd6f3", "#faaca8"]}
        style={styles.gradientBackground}
      >
        <View style={styles.container}>
          <Text style={styles.header}>Edit Profile</Text>

          {/* Profile Picture */}
          <TouchableOpacity onPress={handlePickProfilePic}>
            {profilePicUri ? (
              <Image
                source={{ uri: profilePicUri }}
                style={styles.profilePicLarge}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.defaultProfilePicLarge}>
                <Text style={styles.defaultProfilePicText}>
                  {name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.profilePicText}>Tap to change profile picture</Text>

          {/* Name Input */}
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            style={styles.input}
          />

          {/* Bio Input */}
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Write a short bio"
            style={[styles.input, styles.bioInput]}
            multiline
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
     </View>
      </LinearGradient>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 20,
  },
  profilePicLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  defaultProfilePicLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#faaca8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  defaultProfilePicText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 24,
  },
  profilePicText: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.placeholder,
    marginBottom: 20,
    color: theme.colors.text,
  },
  bioInput: {
    height: 80,
    textAlignVertical: "top",
  },
  saveButton: {
    width: "100%",
    padding: 15,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: theme.colors.buttonText,
    fontSize: 16,
    fontWeight: "bold",
  },
});
