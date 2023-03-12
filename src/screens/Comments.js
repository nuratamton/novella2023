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

} from "firebase/firestore";
import uuid from "react-native-uuid";

const Comments = ({ navigation, route }) => {
  const UUID = uuid.v4();
  const [comment, setComment] = useState("");
  const [profilePic, setPic] = useState("");
  const [username, setUsername] = useState("");
  const [changed, setChanged] = useState(false);
  const [commentArray, setCommentArray] = useState([])
  
  useEffect(() => {
    const comments = route.params.item.comments;
    setCommentArray(comments)
    fetch();
  }, []);

  useEffect(()=>{
    fetchCommentsArray()
  }, [changed])

  useEffect(()=>{
    console.log(commentArray)
  },[commentArray])

  const fetch = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    await getDoc(docRef).then((QuerySnapshot) => {
      setUsername(QuerySnapshot.data().username)
      setPic(QuerySnapshot.data().profilePicsrc)
    });
  };

  const fetchCommentsArray = async ()=>{
    const currDoc = doc(db, "users", route.params.item.uid, "Scrapbooks", route.params.item.docId);
    await getDoc(currDoc).then((QuerySnapshot)=> {
        setCommentArray(QuerySnapshot.data().comments)
    })
    setChanged(false)
  }

  const postComment = async () => {
    const currDoc = doc(db, "users", route.params.item.uid, "Scrapbooks", route.params.item.docId);
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
    sendCommentNotification()
    setChanged(true)
  };

  const sendCommentNotification = async () => {
    const currDoc = doc(db,"users", auth.currentUser.uid);
    const receiver = doc(db,"users",route.params.item.uid,"Notifications",UUID)
    await getDoc(currDoc).then(async (QuerySnapshot) => {
      await setDoc(receiver , {
          id:UUID,
          message: `${QuerySnapshot.data().username} has commented on your scrapbook ${route.params.item.title}`,
          From: auth.currentUser.uid,
          profilePic: QuerySnapshot.data().profilePicsrc,
          scrapbookID: route.params.item.docId,
          timestamp: serverTimestamp()
        
      })
    })
  }

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
            <View>
              <Text style={{ fontSize: 25, fontWeight: "100" }}>
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
          Comments
        </Text>
      </View>

      <FlatList
        style={styles.feed}
        data={commentArray}
        renderItem={({ item, index }) => renderPost(item)}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
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
          style={{ position: "absolute", right: "10%", bottom: 50 }}
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
    padding: 20,
  },
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
  picture: {
    width: "15%",
    height: "100%",
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
