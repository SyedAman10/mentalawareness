import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Button, Provider as PaperProvider } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

// Define a simple theme
const theme = {
  colors: {
    primary: "#faaca8",      // Soft Peach
    accent: "#faaca8",       // Soft Peach
    background: "#F2F6FF",   // Light Background
    text: "#333333",         // Dark Text for better readability
    placeholder: "#7A7A7A",  // Placeholder Text Color
    buttonText: "#FFFFFF",   // Button Text Color
  },
};

// Main user home screen
export default function UserHomePage() {
  const [postText, setPostText] = useState(""); // Track new post text
  const [posts, setPosts] = useState([]); // Store all posts

  // Function to create a new post
  const handleCreatePost = () => {
    if (postText.trim()) {
      const newPost = {
        id: posts.length + 1,
        content: postText,
        likes: 0,
        comments: [],
      };
      setPosts([newPost, ...posts]); // Add new post to the top
      setPostText(""); // Clear the input field
    } else {
      Alert.alert("Error", "Please enter some text for your post.");
    }
  };

  // Function to handle like on a post
  const handleLikePost = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  // Function to handle comment on a post
  const handleCommentPost = (postId, commentText) => {
    if (commentText.trim()) {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, commentText] }
            : post
        )
      );
    } else {
      Alert.alert("Error", "Please enter a comment.");
    }
  };

  // Render each post with likes and comments
  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postText}>{item.content}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity onPress={() => handleLikePost(item.id)}>
          <Text style={styles.likeText}>👍 {item.likes} Likes</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          onSubmitEditing={(e) => handleCommentPost(item.id, e.nativeEvent.text)}
        />

        <View style={styles.commentsContainer}>
          {item.comments.length > 0 ? (
            item.comments.map((comment, index) => (
              <Text key={index} style={styles.commentText}>
                - {comment}
              </Text>
            ))
          ) : (
            <Text style={styles.noComments}>No comments yet.</Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <PaperProvider theme={theme}>
      <LinearGradient
        colors={["#faaca8", "#faaca8"]}
        style={styles.gradientBackground}
      >
        <View style={styles.container}>
          <Text style={styles.header}>Community Forum</Text>

          <TextInput
            value={postText}
            onChangeText={(text) => setPostText(text)}
            placeholder="What's on your mind?"
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: theme.colors.primary } }}
          />
          <Button
            mode="contained"
            onPress={handleCreatePost}
            style={styles.button}
            theme={{ colors: { primary: theme.colors.accent } }}
          >
            Post
          </Button>

          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id.toString()}
            style={styles.postsList}
          />
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
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F2F6FF",
    borderRadius: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    marginBottom: 20,
    paddingVertical: 10,
  },
  postsList: {
    width: "100%",
    paddingHorizontal: 20,
  },
  postContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  postText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 10,
  },
  postActions: {
    marginTop: 10,
  },
  likeText: {
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    padding: 8,
    width: "100%",
    marginBottom: 10,
  },
  commentsContainer: {
    marginTop: 10,
  },
  commentText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 5,
  },
  noComments: {
    fontSize: 14,
    color: theme.colors.placeholder,
    fontStyle: "italic",
  },
});
