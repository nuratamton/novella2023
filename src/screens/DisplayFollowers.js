import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Avatar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const DisplayFollowers = ({ route }) => {
  const [userDoc, setDoc] = useState([]);

  // A function which gets the list of followers from firebase
  const followersList = async () => {
    const currDoc = doc(db, "users", route.params.uid);
    await getDoc(currDoc).then(async (querySnapshot) => {
      querySnapshot.data().followers.forEach(async (follower) => {
        await getDoc(doc(db, "users", follower)).then((item) => {
          setDoc((prev) => [...prev, item]);
        });
      });
    });
  };

  // on load of the page call the function which renders followers from the backend
  useEffect(() => {
    followersList();
  }, []);

  // the render method for the flatlist
  renderPost = (post) => {
    // Each item in the flatlist should display the following
    return (
      <View>
        <TouchableOpacity style={styles.item}>
          <View style={styles.picture}>
            <Avatar.Image
              source={{ uri: post.data().profilePicsrc }}
              size={40}
              style={{ marginRight: 12 }}
            />
          </View>

          <View>
            <Text style={{ fontSize: 25, fontWeight: "100" }}>
              {post.data().username}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // the content displayed when on this page
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "500",
            color: "#351c75",
            textShadowColor: "black",
            textShadowOffset: { width: 5, height: 5 },
          }}
        >
          {" "}
          Followers{" "}
        </Text>
      </View>

      {/* flatlist to dynamically render data */}
      <FlatList
        style={styles.feed}
        data={userDoc}
        renderItem={({ item }) => renderPost(item)}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default DisplayFollowers;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    margin: 2,
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 16,
    borderBottomColor: "#f2f2f2",
    backgroundColor: "#e6e6fa",
    shadowColor: "#fff",
    shadowOpacity: 1,
    shadowRadius: 10,
  },

  header: {
    alignItems: "center",
    padding: 20,
  },
});
