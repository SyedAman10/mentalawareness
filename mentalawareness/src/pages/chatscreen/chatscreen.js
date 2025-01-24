import React, { useState, useEffect, useRef } from "react";
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Alert,
    ActivityIndicator,
    StatusBar,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { auth } from "../../../firebaseConfig";
import { db } from "../../../firebaseConfig";
import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot,
    serverTimestamp,
    doc,
} from "firebase/firestore";
import { PaperProvider, useTheme } from "react-native-paper";

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

export default function ChatScreen({ route }) {
    const theme = useTheme();
    const [messages, setMessages] = useState([]); 
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);
    const { selectedUserId } = route.params || {};
    const statusBarHeight = StatusBar.currentHeight || 0;

    useEffect(() => {
        if (Platform.OS === 'ios') {
            setKeyboardVerticalOffset(80)
        } else {
            setKeyboardVerticalOffset(0)
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            if (user) {
                const conversationRef = doc(db, 'users', user.uid, 'conversations', selectedUserId);
                const messagesQuery = query(
                    collection(conversationRef, "messages"),
                    orderBy("createdAt", "asc")
                );
                const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
                    const messagesData = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setMessages(messagesData);
                     setLoading(false);
                });

                    if (messages.length > 0)
                        scrollToBottom();

                return () => {
                    unsubscribeMessages();
                     setLoading(false)
                }
            }
              setLoading(false);
        });
           return () => unsubscribeAuth();
    }, [selectedUserId]);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    const scrollToBottom = () => {
        flatListRef.current?.scrollToEnd({ animated: true });
    };

    const handleSendMessage = async () => {
        if (!currentUser) {
            Alert.alert("Not Logged In", "You must be logged in to send messages.");
            return;
        }
        if (newMessage.trim() === "") return;

        try {
            const conversationRef = doc(db, 'users', currentUser.uid, 'conversations', selectedUserId);

            await addDoc(collection(conversationRef, 'messages'), {
                text: newMessage,
                createdAt: serverTimestamp(),
                user: currentUser.uid,
            });

            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
            Alert.alert("Error", "Failed to send message. Please try again.");
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ marginTop: 10, color: theme.colors.text }}>
                    Loading Messages...
                </Text>
            </View>
        );
    }
    const renderItem = ({ item }) => {
        const isCurrentUser = item.user === currentUser?.uid;
        return (
            <View
                style={[
                    styles.messageContainer,
                    isCurrentUser ? styles.myMessage : styles.otherMessage,
                ]}
            >
                <Text style={styles.messageText}>{item.text}</Text>
            </View>
        );
    };

    return (
        <PaperProvider theme={theme}>
            <LinearGradient
                colors={["#ddd6f3", "#faaca8"]}
                style={styles.gradientBackground}
            >
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={keyboardVerticalOffset}
                >
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        style={[styles.messageList, { marginTop: statusBarHeight }]}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                        showsVerticalScrollIndicator={false}
                    />

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type your message..."
                            value={newMessage}
                            onChangeText={(text) => setNewMessage(text)}
                            placeholderTextColor={theme.colors.placeholder}
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                            <MaterialIcons name="send" size={24} color={theme.colors.buttonText} />
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
    },
    container: {
        flex: 1,
        padding: 10,
    },
    messageList: {
        flex: 1,
        paddingBottom: 10,
    },
    messageContainer: {
        maxWidth: "70%",
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
    },
    myMessage: {
        backgroundColor: theme.colors.accent,
        alignSelf: "flex-end",
    },
    otherMessage: {
        backgroundColor: "#e5e5ea",
        alignSelf: "flex-start",
    },
    messageText: {
        color: theme.colors.text,
        fontSize: 16,
    },
    senderText: {
        fontSize: 12,
        color: "#888",
        marginTop: 3,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        padding: 5,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        padding: 10,
        marginRight: 10,
        backgroundColor: "white",
        color: theme.colors.text,
    },
    sendButton: {
        backgroundColor: theme.colors.accent,
        borderRadius: 25,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
    },
});