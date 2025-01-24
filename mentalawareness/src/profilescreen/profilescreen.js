import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { db, auth } from "../../firebaseConfig"; // Import Firebase config
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";

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
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicUri, setProfilePicUri] = useState(null);
  const [userId, setUserId] = useState(null);

  // Fetch user data
  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.displayName || "");
        setBio(userData.bio || "");
        setProfilePicUri(userData.profilePic || null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user data: " + error.message);
    }
  };

  // Save profile data
  const handleSaveProfile = async () => {
    if (!userId) {
      Alert.alert("Error", "User not logged in.");
      return;
    }
    try {
      await setDoc(
        doc(db, "users", userId),
        {
          displayName: name,
          bio: bio,
          profilePic: profilePicUri,
        },
        { merge: true }
      );
      Alert.alert("Profile Updated", "Your profile has been successfully updated.");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile: " + error.message);
    }
  };

  // Pick profile picture
  const handlePickProfilePic = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Media library access is required.");
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

  // Check for logged-in user
  useEffect(() => {
    const checkAuth = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserId(user.uid);
          await AsyncStorage.setItem("userId", user.uid);
          fetchUserData(user.uid);
        } else {
          const storedUserId = await AsyncStorage.getItem("userId");
          if (storedUserId) {
            setUserId(storedUserId);
            fetchUserData(storedUserId);
          } else {
            Alert.alert("Error", "User not logged in.");
          }
        }
      });
    };
    checkAuth();
  }, []);

  return (
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
