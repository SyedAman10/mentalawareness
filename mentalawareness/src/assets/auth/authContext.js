import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  authToken: null,
  login: async (token, uid) => {},
  logout: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;

    const initializeAuth = async () => {
      setLoading(true);
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedUID = await AsyncStorage.getItem('uid');

        if (storedToken && storedUID) {
          console.log('Token found, validating user...');
          unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
              console.log('User is valid, auto-login successful.');
              setAuthToken(storedToken);
              setIsAuthenticated(true);
              setUser(currentUser);
            } else {
              console.log('No valid user session, logging out...');
              await AsyncStorage.removeItem('authToken');
              await AsyncStorage.removeItem('uid');
              setIsAuthenticated(false);
            }
            setInitialLoading(false);
            setLoading(false);
          });
        } else {
          console.log('No token found, user not authenticated.');
          setIsAuthenticated(false);
          setInitialLoading(false);
        }
      } catch (error) {
        console.error('Error during authentication initialization:', error);
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('uid');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Cleanup listener on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const login = async (token, uid) => {
    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('uid', uid);
      setAuthToken(token);
      setIsAuthenticated(true);
      setUser(auth.currentUser);
    } catch (err) {
      console.error('Error during login token save:', err);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('uid');
      setIsAuthenticated(false);
      setUser(null);
      setAuthToken(null);
    } catch (err) {
      console.error('Error during logout token remove:', err);
    }
  };

  const value = {
    isAuthenticated,
    user,
    authToken,
    login,
    logout,
    loading,
    initialLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
