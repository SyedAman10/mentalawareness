import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../../../firebaseConfig';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';
import { PaperProvider, useTheme } from 'react-native-paper';
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

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

export default function UserListScreen({ navigation }) {
    const theme = useTheme();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const uid = await AsyncStorage.getItem('uid');
                if (uid) {
                    setCurrentUserId(uid);
                    const usersQuery = query(
                        collection(db, 'users'),
                        where("uid", "!=", uid)
                    );
                    const querySnapshot = await getDocs(usersQuery);
                    const usersList = [];
                     querySnapshot.forEach((doc) => {
                      if (doc.data().uid !== uid) {
                        usersList.push({ id: doc.id, ...doc.data()});
                      }
                    });
                    setUsers(usersList);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);


    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ marginTop: 10, color: theme.colors.text }}>Loading users...</Text>
            </View>
        );
    }

     const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.userCard}
            onPress={() => navigation.navigate('ChatScreen', { selectedUserId: item.uid })}
        >
          <View style={styles.cardContent}>
               <View style={styles.profileIconContainer}>
                <MaterialIcons name="person" size={48} color={theme.colors.placeholder} />
            </View>
            <Text style={styles.userName}>{item.displayName || item.uid}</Text>
           <View style={styles.actionIcons}>
                <TouchableOpacity style={styles.iconButton} onPress={() => alert('Voice call')}>
                    <MaterialIcons name="call" size={24} color={theme.colors.placeholder} />
                </TouchableOpacity>
               <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('ChatScreen', { selectedUserId: item.uid })}>
                    <MaterialIcons name="chat" size={24} color={theme.colors.placeholder} />
                </TouchableOpacity>
               <TouchableOpacity style={styles.iconButton} onPress={() => alert('Video call')}>
                     <MaterialIcons name="videocam" size={24} color={theme.colors.placeholder} />
                </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
    );

    return (
        <PaperProvider theme={theme}>
            <LinearGradient
                colors={["#ddd6f3", "#faaca8"]}
                style={styles.gradientBackground}
            >
                <View style={styles.container}>
                    <FlatList
                        data={users}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />
                </View>
            </LinearGradient>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    gradientBackground: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 10,
    },
    userCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    cardContent:{
        padding: 15,
        alignItems: 'center',
    },
      profileIconContainer: {
        alignItems: "center",
          marginBottom: 10,
    },
    userName: {
        fontSize: 18,
        color: '#333',
          marginBottom: 10,
    },
     actionIcons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
     iconButton: {
        padding: 5,
        marginHorizontal: 5,
    },
});