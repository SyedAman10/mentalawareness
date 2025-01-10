import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
  Platform,
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

export default function MainUserScreen() {
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const [mediaUri, setMediaUri] = useState(null);
  //Placeholder user id for demonstration
  const userId = "user123"
  //Placeholder user name for demonstration
  const userName = "John Doe";
  
  const handleCreatePost = () => {
    if (postText.trim() || mediaUri) {
       const newPost = {
        id: posts.length + 1,
        userId: userId, // add this for user identification
        user: userName,
        profilePic: null, // we will add profile pic in the next step
        content: postText,
        media: mediaUri,
        likes: 0,
        likedByCurrentUser: false, // Track if the current user has liked this post
        comments: [],
        timestamp: new Date().toISOString() // Add a timestamp to each post
      };
      setPosts([newPost, ...posts]);
      setPostText("");
      setMediaUri(null);
    } else {
      Alert.alert("Error", "Please enter some text or select a media file.");
    }
  };


 const handleLikePost = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.likedByCurrentUser ? post.likes - 1 : post.likes + 1,
             likedByCurrentUser: !post.likedByCurrentUser,
          };
        }
        return post;
      })
    );
  };

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

  const handlePickMedia = async () => {
    const permissionResult =
      Platform.OS === "web"
        ? { granted: true }
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "You need to grant media library permissions to select a file."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
    }
  };
    // Helper function to format timestamps
    const formatTimestamp = (isoTimestamp) => {
      const date = new Date(isoTimestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
      {item.profilePic ? (
        <Image
          source={{ uri: item.profilePic }}
          style={styles.profilePic}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.defaultProfilePic}>
          <Text style={styles.defaultProfilePicText}>
            {item.user.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
        <View>
            <Text style={styles.postUser}>{item.user}</Text>
            <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
        </View>
      </View>
      <Text style={styles.postText}>{item.content}</Text>
      {item.media && (
        <Image
          source={{ uri: item.media }}
          style={styles.mediaPreview}
          resizeMode="cover"
        />
      )}
      <View style={styles.postActions}>
         <TouchableOpacity onPress={() => handleLikePost(item.id)}>
          <Text style={styles.likeText}>
            {item.likedByCurrentUser ? "❤️" : "👍"} {item.likes} Likes
          </Text>
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

   const renderHeader = () => (
        <View style={styles.inputCard}>
            <TextInput
            value={postText}
            onChangeText={(text) => setPostText(text)}
            placeholder="What's on your mind?"
            style={styles.input}
            multiline
            />
            {mediaUri && (
            <Image
                source={{ uri: mediaUri }}
                style={styles.mediaPreview}
                resizeMode="cover"
            />
            )}
            <View style={styles.buttonRow}>
            <IconButton
                icon="image"
                size={30}
                onPress={handlePickMedia}
                color={theme.colors.primary}
            />
            <TouchableOpacity
                style={styles.postButton}
                onPress={handleCreatePost}
            >
                <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
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
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={renderHeader}
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
  inputCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postButton: {
    backgroundColor: theme.colors.accent,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginLeft: 10,
  },
  postButtonText: {
    color: theme.colors.buttonText,
    fontWeight: "bold",
    fontSize: 16,
  },
  mediaPreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 10,
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
  postUser: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
     },
    timestamp: {
    fontSize: 12,
    color: theme.colors.placeholder,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    defaultProfilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#faaca8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    defaultProfilePicText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
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