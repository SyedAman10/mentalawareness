// authStorage.js
import * as Keychain from "react-native-keychain";

const TOKEN_KEY = "firebase_access_token";

const saveToken = async (token) => {
  try {
    await Keychain.setGenericPassword(TOKEN_KEY, token);
    console.log("Token saved successfully");
    return true; //indicate the operation was successful
  } catch (error) {
      console.error("Error saving token:", error);
    return false; //indicate the operation was not successful
  }
};

const getToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
        console.log("Token retrieved successfully");
      return credentials.password;
    }
      console.log("No token found");
    return null;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

const deleteToken = async () => {
  try {
    await Keychain.resetGenericPassword();
      console.log("Token deleted successfully");
      return true; //indicate the operation was successful
  } catch (error) {
    console.error("Error deleting token:", error);
    return false;//indicate the operation was not successful
  }
};

export { saveToken, getToken, deleteToken };