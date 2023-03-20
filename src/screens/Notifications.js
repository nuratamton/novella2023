import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import { Avatar } from "react-native-paper";
import React, { useEffect, useState, useRef } from "react";
import InputBox from "../components/InputBox";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import {
  doc,
  getDocs,
  updateDoc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
  setDoc,
  collection,
  getDoc,
  arrayRemove,
  increment,
} from "firebase/firestore";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [status, setStatus] = useState(true);
  const isFocused = useIsFocused();

  const fetch = async () => {
    let temp = [];
    const ref = collection(db, "users", auth.currentUser.uid, "Notifications");
    await getDocs(ref).then((querySnapshot) => {
      querySnapshot.forEach((item) => {
        temp.push(item.data());
      });
    });
    setNotifications(temp);
  };
  useEffect(() => {
    console.log(status);
  }, [status]);
  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    fetch();
  }, [isFocused]);

  const acceptRequest = async (post) => {
    const currDoc = doc(db, "users", auth.currentUser.uid);
    const uid = doc(
      db,
      "users",
      auth.currentUser.uid,
      "Notifications",
      post.id
    );
    await getDoc(currDoc).then(async (QuerySnapshot) => {
      await updateDoc(doc(db, "users", post.From), {
        following: arrayUnion(auth.currentUser.uid),
        followingCount: increment(1),
      });
      await updateDoc(currDoc, {
        followers: arrayUnion(post.From),
        requests: arrayRemove(post.From),
        followerCount: increment(1),
      });
    });
  };

  renderPost = (post) => {
    return (
      <View style={[styles.notifications]}>
        <View style={styles.notificationBox}>
          <View style={styles.picture}>
            <Avatar.Image
              source={{ uri: post.profilePic }}
              size={40}
              style={{ marginRight: 12 }}
            />
          </View>
          <View styles={styles.textFollowButton}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "300",
                alignContent: "center",
                padding: 5,
                marginRight: 10,
              }}
            >
              {post.message},
            </Text>
            <Text style={{ fontSize: 10, fontWeight: "400" }}>
              {"  "}
              {moment(post.timestamp.toDate()).fromNow()}
            </Text>

            {post.type === "Follow" ? (
              !post.followBack && status ? (
                <TouchableOpacity
                  disabled={!status}
                  onPress={() => setStatus(false)}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}> Follow </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  disabled={!status}
                  onPress={() => setStatus(false)}
                  style={{
                    backgroundColor: "purple",
                    marginTop: 10,
                    paddingVertical: 4,
                    borderRadius: 25,
                    width: "35%",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.buttonText}> Following </Text>
                </TouchableOpacity>
              )
            ) : (
              ""
            )}

            {post.type === "Request" && post.request ? (
              <TouchableOpacity
              disabled={!status}
                onPress={() => {acceptRequest(post) , setStatus(false)}}
                style={{
                  backgroundColor: "purple",
                  marginTop: 10,
                  paddingVertical: 4,
                  borderRadius: 25,
                  width: "25%",
                  alignItems: "center",
                }}
              >
                <Text style={styles.buttonText}> {status? "Accept" : "Accepted"} </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} /> */}

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
          Notifications
        </Text>
      </View>

      <FlatList
        style={styles.feed}
        data={notifications}
        renderItem={({ item }) => renderPost(item)}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "purple",
    marginTop: 10,
    paddingVertical: 6,
    borderRadius: 25,
    width: "20%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
  notifications: {
    width: "100%",

    // backgroundColor: "#ffffff",
  },
  header: {
    alignItems: "center",
    padding: 20,
  },
  notificationBox: {
    padding: 20,
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
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  picture: {
    width: "15%",
    height: "100%",
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
    // opacity: 0.9,

    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0, height: 5
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: 10,
    // marginBottom: 30
  },
});
