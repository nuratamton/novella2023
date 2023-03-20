import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { getDocs, getDoc, collection, doc } from "firebase/firestore";
import { db } from "../firebase";
import { async } from "@firebase/util";
import { Avatar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const DisplayFollowing = ({ navigation, route }) => {
  const [following, setFollowing] = useState("");
  const [userDoc, setDoc] = useState([]);

  const followingList = async () => {
    const currDoc = doc(db, "users", route.params.uid);
    await getDoc(currDoc).then(async (querySnapshot) => {
      querySnapshot.data().following.forEach(async (following) => {
        await getDoc(doc(db, "users", following)).then((item) => {
          setDoc((prev) => [...prev, item]);
        });
      });
    });
  };

  useEffect(() => {
    followingList();
  }, []);

  renderPost = (post) => {
    return (
      <View style={[styles.notifications]}>
        <TouchableOpacity style={styles.notificationBox}>
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
          Following{" "}
        </Text>
      </View>
      <FlatList
        style={styles.feed}
        data={userDoc}
        renderItem={({ item }) => renderPost(item)}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default DisplayFollowing;

const styles = StyleSheet.create({
  notificationBox: {
    // padding: 20,
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
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  header: {
    alignItems: "center",
    padding: 20,
  },
});
