import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-paper";
import React, { useEffect, useState, useRef } from "react";
import InputBox from "../components/InputBox";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
  setDoc,
  arrayRemove,
  onSnapshot
} from "firebase/firestore";
import uuid from "react-native-uuid";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

const Comments = ({ navigation, route }) => {
  const UUID = uuid.v4();
  const [comment, setComment] = useState("");
  const [profilePic, setPic] = useState("");
  const [username, setUsername] = useState("");
  const [changed, setChanged] = useState(false);
  const [commentArray, setCommentArray] = useState([]);

  useEffect(() => {
    const comments = route.params.item.comments;
    setCommentArray(comments);
    const docu = route.params.item.groupId ? doc(db,
        "users",
        route.params.item.uid,
        "Groups",
        route.params.item.groupId,
        "Scrapbooks",
        route.params.item.docId):doc(db,
          "users",
          route.params.item.uid,
          "Scrapbooks",
          route.params.item.docId)
    const unsub = onSnapshot(docu,(snapshot)=>{
           fetchComments()
           fetch()
          })
  }, []);

  useEffect(() => {
    fetchCommentsArray();
  }, [changed]);

  useEffect(() => {
    console.log(commentArray);
  }, [commentArray]);

  const fetchComments = async () => {
    const docu = route.params.item.groupId ? doc(db,
      "users",
      route.params.item.uid,
      "Groups",
      route.params.item.groupId,
      "Scrapbooks",
      route.params.item.docId):doc(db,
        "users",
        route.params.item.uid,
        "Scrapbooks",
        route.params.item.docId)
    await getDoc(docu).then((item) => {
      setCommentArray(item.data().comments)
    })
  }
  const fetch = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    await getDoc(docRef).then((QuerySnapshot) => {
      setUsername(QuerySnapshot.data().username);
      setPic(QuerySnapshot.data().profilePicsrc);
    });
  };

  const fetchCommentsArray = async () => {
    if (route.params.item.groupId) {
      const groupDoc = doc(
        db,
        "users",
        route.params.item.uid,
        "Groups",
        route.params.item.groupId,
        "Scrapbooks",
        route.params.item.docId
      );
      await getDoc(groupDoc).then((QuerySnapshot) => {
        setCommentArray(QuerySnapshot.data().comments);
      });
    } else {
      const currDoc = doc(
        db,
        "users",
        route.params.item.uid,
        "Scrapbooks",
        route.params.item.docId
      );
      await getDoc(currDoc).then((QuerySnapshot) => {
        setCommentArray(QuerySnapshot.data().comments);
      });
    }

    setChanged(false);
  };

  const postComment = async () => {
    if (route.params.item.groupId) {
      const groupDoc = doc(
        db,
        "users",
        route.params.item.uid,
        "Groups",
        route.params.item.groupId,
        "Scrapbooks",
        route.params.item.docId
      );

      await updateDoc(groupDoc, {
        comments: arrayUnion({
          comment: comment,
          uid: auth.currentUser.uid,
          docId: route.params.item.docId,
          timestamp: Timestamp.now(),
          profilePic: profilePic,
          username: username,
        }),
      });
    } else {
      const currDoc = doc(
        db,
        "users",
        route.params.item.uid,
        "Scrapbooks",
        route.params.item.docId
      );
      await updateDoc(currDoc, {
        comments: arrayUnion({
          comment: comment,
          uid: auth.currentUser.uid,
          docId: route.params.item.docId,
          timestamp: Timestamp.now(),
          profilePic: profilePic,
          username: username,
        }),
      });
    }

    sendCommentNotification();
    setChanged(true);
  };

  const sendCommentNotification = async () => {
    const currDoc = doc(db, "users", auth.currentUser.uid);
    const receiver = doc(
      db,
      "users",
      route.params.item.uid,
      "Notifications",
      UUID
    );
    await getDoc(currDoc).then(async (QuerySnapshot) => {
      await setDoc(receiver, {
        id: UUID,
        message: `${
          QuerySnapshot.data().username
        } has commented on your scrapbook ${route.params.item.title}`,
        From: auth.currentUser.uid,
        profilePic: QuerySnapshot.data().profilePicsrc,
        scrapbookID: route.params.item.docId,
        timestamp: serverTimestamp(),
      });
    });
  };

  const deleteComment = async (post) => {
    if (route.params.item.groupId) {
      const currDoc = doc(
        db,
        "users",
        route.params.item.uid,
        "Groups",
        route.params.item.groupId,
        "Scrapbooks",
        route.params.item.docId
      );
      await updateDoc(currDoc, {
        comments: arrayRemove(post),
      });
    } else {
      const currDoc = doc(
        db,
        "users",
        route.params.item.uid,
        "Scrapbooks",
        route.params.item.docId
      );
      await updateDoc(currDoc, {
        comments: arrayRemove(post),
      });
    }
  };

  renderPost = (post) => {
    return (
      // <View style={[styles.notifications]}>
      <View style={styles.notificationBox}>
        <View style={styles.picture}>
          <Avatar.Image
            source={{ uri: post.profilePic }}
            size={40}
            style={{ marginRight: 12 }}
          />
        </View>
        <View style={{ width: "90%" }}>
          <Text style={{ fontSize: 20, fontWeight: "100" }}>
            {post.username}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "300",
              alignContent: "center",
              padding: 5,
              marginRight: 100,
            }}
          >
            {post.comment}
          </Text>
          {auth.currentUser.uid === route.params.item.uid ? (
            <TouchableOpacity
              style={{ position: "absolute", right: "20%", top: "25%" }}
              onPress={() => deleteComment(post)}
            >
              <MaterialCommunityIcons
                name="delete-circle-outline"
                size={20}
                color="black"
              />
            </TouchableOpacity>
          ) : (
            ""
          )}
        </View>
      </View>
      // </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.header}> */}
      <Text
        style={{
          fontSize: 30,
          fontWeight: "500",
          color: "#351c75",
          textShadowColor: "black",
          textShadowOffset: { width: 5, height: 5 },
        }}
      >
        Comments
      </Text>
      {/* </View> */}

      <TouchableOpacity
        style={{ left: "45%", top: "35%", zIndex: 1 }}
        onPress={() => {
          navigation.navigate("Feedback", { item: route.params.item });
        }}
      >
        <MaterialIcons name="navigate-next" size={64} color="grey" />
      </TouchableOpacity>

      <FlatList
        style={styles.feed}
        data={commentArray}
        renderItem={({ item, index }) => renderPost(item)}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        directionalLockEnabled={true}
      />

      {/* <View style={{flex:1, flexDirection:"row", margin:20}}> */}
      <InputBox
        value={comment}
        setValue={setComment}
        placeholder="Type a comment"
      />
      <TouchableOpacity
        onPress={() => {
          postComment();
          setComment("");
        }}
      >
        <Ionicons
          name="send"
          size={24}
          color="black"
          style={{ position: "absolute", left: "35%", bottom: 20 }}
        />
      </TouchableOpacity>

      {/* </View> */}
    </SafeAreaView>
  );
};

export default Comments;

const styles = StyleSheet.create({
  notifications: {
    width: "100%",

    // backgroundColor: "#ffffff",
  },
  header: {
    alignItems: "center",
    margin: 0,
    padding: 0,
    // padding: 20,
  },
  notificationBox: {
    // padding: 20,
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    // margin: 2,
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 16,
    borderBottomColor: "#f2f2f2",
    backgroundColor: "#e6e6fa",
    width: "100%",
    shadowColor: "#fff",
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  picture: {
    width: "15%",
    height: "100%",
    margin: 7,
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
    alignItems: "center",

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
