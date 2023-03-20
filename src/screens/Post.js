import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Card, Avatar, IconButton } from "react-native-paper";
import { postId } from "./Feed";
import uuid from "react-native-uuid";
import { auth, db } from "../firebase";

import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  arrayRemove,
  arrayUnion,
  increment,
  deleteDoc,
  query,
  collection,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { FontAwesome } from "@expo/vector-icons";

const Post = ({ navigation, route }) => {
  const scrollx = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get("screen");

  const widthCard = width * 0.7;
  const heightCard = widthCard * 1.54;
  const UUID = uuid.v4();
  const topRef = useRef();
  const bottomRef = useRef();
  const [actIndex, setactIndex] = useState(0);
  const [likes, setLikes] = useState(0);
  const [likePressed, setLikePressed] = useState(false);
  const [likesArray, setLikesArray] = useState([]);


  useEffect(() => {
    retrieveLikes();
    likeStatus();
  }, []);

  useEffect(() => {
    retrieveLikes();
    likeStatus();
  }, [likesArray]);

  const sendLikeNotification = async () => {
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
        message: `${QuerySnapshot.data().username} has liked your post ${
          route.params.item.title
        }`,
        From: auth.currentUser.uid,
        profilePic: QuerySnapshot.data().profilePicsrc,
        scrapbookID: route.params.item.docId,
        timestamp: serverTimestamp(),
      });
    });
  };



  const removeLikeNotification = async () => {
    const receiver = collection(
      db,
      "users",
      route.params.item.uid,
      "Notifications"
    );
    const q = query(
      receiver,
      where("From", "==", auth.currentUser.uid),
      where("scrapbookID", "==", route.params.item.docId)
    );
    await getDocs(q).then(async (QuerySnapshot) => {
      QuerySnapshot.forEach(async (item) => {
        await deleteDoc(
          doc(
            db,
            "users",
            route.params.item.uid,
            "Notifications",
            item.data().id
          )
        );
      });
      //   await deleteDoc(doc(db,"users", route.params.item.uid,"Notifications",doc.data().id))
    });
  };

  const retrieveLikes = async () => {
    const id = route.params.item.docId;
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
        setLikesArray(QuerySnapshot.data().likesArray);
        setLikes(QuerySnapshot.data().likes);
      });
    } else {
      const currDoc = doc(db, "users", route.params.item.uid, "Scrapbooks", id);
      await getDoc(currDoc).then((QuerySnapshot) => {
        setLikesArray(QuerySnapshot.data().likesArray);
        setLikes(QuerySnapshot.data().likes);
      });
    }
  };

  const likePost = async () => {
    // get the scrapbook id of the current scrapbook
    const id = route.params.item.docId;
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
      await getDoc(groupDoc).then(async (QuerySnapshot) => {
        if (QuerySnapshot.data().likesArray.includes(auth.currentUser.uid)) {
          setLikePressed(false);
          setLikes(likes);
          await updateDoc(groupDoc, {
            likesArray: arrayRemove(auth.currentUser.uid),
            likes: increment(-1),
          });
          removeLikeNotification();
        } else {
          setLikes(likes);
          setLikePressed(true);
          await updateDoc(groupDoc, {
            likesArray: arrayUnion(auth.currentUser.uid),
            likes: increment(1),
          });
          sendLikeNotification();
        }
      });
    } else {
      const currDoc = doc(db, "users", route.params.item.uid, "Scrapbooks", id);
      await getDoc(currDoc).then(async (QuerySnapshot) => {
        if (QuerySnapshot.data().likesArray.includes(auth.currentUser.uid)) {
          setLikePressed(false);
          setLikes(likes);
          await updateDoc(currDoc, {
            likesArray: arrayRemove(auth.currentUser.uid),
            likes: increment(-1),
          });
          removeLikeNotification();
        } else {
          setLikes(likes);
          setLikePressed(true);
          await updateDoc(currDoc, {
            likesArray: arrayUnion(auth.currentUser.uid),
            likes: increment(1),
          });
          sendLikeNotification();
        }
      });
    }
  };

  const likeStatus = async () => {
    const id = route.params.item.docId;
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
      await getDoc(groupDoc).then(async (QuerySnapshot) => {
        if (QuerySnapshot.data().likesArray.includes(auth.currentUser.uid)) {
          setLikePressed(true);
        } else {
          setLikePressed(false);
        }
      });
    } else {
      const currDoc = doc(db, "users", route.params.item.uid, "Scrapbooks", id);
      await getDoc(currDoc).then(async (QuerySnapshot) => {
        if (QuerySnapshot.data().likesArray.includes(auth.currentUser.uid)) {
          setLikePressed(true);
        } else {
          setLikePressed(false);
        }
      });
    }
  };

  const setActiveIndex = (index) => {
    setactIndex(index);
    topRef?.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
    if (index * (80 + 12) - 80 / 2 > width / 2) {
      bottomRef?.current?.scrollToOffset({
        offset: index * (80 + 12) - width / 2 + 80 / 2,
        animated: true,
      });
    } else {
      bottomRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar hidden />

      <View style={StyleSheet.absoluteFillObject}>
        {route.params.item.images.map((item, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const opacity = scrollx.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
          });
          return (
            <Animated.Image
              key={`image-${index}`}
              source={{ uri: item }}
              style={[
                StyleSheet.absoluteFillObject,
                {
                  opacity,
                },
              ]}
              blurRadius={50}
            />
          );
        })}
      </View>

      <Animated.FlatList
        ref={topRef}
        data={route.params.item.images}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollx } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={(ev) => {
          setActiveIndex(Math.floor(ev.nativeEvent.contentOffset.x / width));
        }}
        keyExtractor={(_, index) => index.toString()}
        horizontal={true}
        pagingEnabled
        showsHorizontalScrollIndicatior={false}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                width,
                justifyContent: "center",
                alignItems: "center",

                shadowColor: "#000",
                shadowOpacity: 0.7,
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowRadius: 30,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  // justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    backgroundColor: "black",
                    height: "14%",
                    width: "100%",
                    borderTopRadius: 10,
                    left: "6%",
                    alignItems: "flex-start",
                    paddingRight: "100%",
                    paddingLeft: "30%",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      marginTop: 10,
                      fontSize: 20,
                      bottom: "30%",
                    }}
                  >
                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                      {route.params.item.profilepic ? (
                        <Avatar.Image
                          source={{ uri: route.params.item.profilepic }}
                          size={35}
                          style={{
                            //  marginRight: 3,
                            //  marginTop: 20,
                            right: "90%",
                          }}
                        />
                      ) : (
                        <Avatar.Image
                          source={{ uri: route.params.item.groupIcon }}
                          size={35}
                          style={{
                            //  marginRight: 3,
                            //  marginTop: 20,
                            right: "90%",
                          }}
                        />
                      )}
                      {route.params.item.username ? (
                        <Text
                          style={{
                            color: "white",
                            zIndex: 1,
                            position: "absolute",
                            //  left:'2%',
                            top: "9%",
                            left: -35,
                          }}
                        >
                          {route.params.item.username}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            color: "white",
                            zIndex: 1,
                            position: "absolute",
                            //  left:'2%',
                            top: "9%",
                            left: -35,
                          }}
                        >
                          {route.params.item.groupname}
                        </Text>
                      )}
                      <Text style={styles.cardTitle}>
                        {route.params.item.title}
                      </Text>
                    </View>
                  </View>

                  <View style={{ position: "absolute", left: 310 }}>
                    <IconButton
                      style={{
                        backgroundColor: "white",
                        borderRadius: 100,
                        width: 27,
                        height: 27,
                        top: 1,

                        position: "absolute",
                      }}
                      icon={likePressed ? "heart" : "heart-outline"}
                      iconColor="purple"
                      size={20}
                      onPress={() => {
                        likePost();
                      }}
                    />

                    <Text
                      style={{
                        // position: "absolute",
                        left: 40,
                        top: 10,
                        color: "white",
                        fontWeight: "600",
                      }}
                    >
                      {likes}
                    </Text>
                    <IconButton
                      style={{
                        backgroundColor: "white",
                        borderRadius: 100,
                        width: 27,
                        height: 27,
                        top: 15,
                        // position: "absolute",
                      }}
                      icon={"comment-multiple-outline"}
                      iconColor="black"
                      size={20}
                      onPress={() => {
                        navigation.navigate("ReactionStack", {
                          screen: "Comments",
                          params: { item: route.params.item },
                        });
                      }}
                    />
                    <IconButton
                      style={{
                        backgroundColor: "white",
                        borderRadius: 100,
                        width: 27,
                        height: 27,
                        top: 7,
                        // position: "absolute",
                      }}
                      icon={"share-outline"}
                      iconColor="black"
                      size={20}
                      onPress={()=>navigation.navigate("Share", {post: route.params.item})}
                    />
                  </View>
                </View>

                {/* View- aligned right */}
                <View
                  style={{
                    flexDirection: "column",
                    position: "absolute",
                    right: 10,

                    height: "14%",
                    width: "30%",
                    bottom: "86%",
                  }}
                ></View>
              </View>

              <Image
                source={{ uri: item }}
                style={{
                  width: widthCard,
                  height: heightCard,
                  resizeMode: "cover",
                  borderRadius: 20,
                  position: "absolute",
                  bottom: "25%",
                }}
              />
            </View>
          );
        }}
      />
      <Animated.FlatList
        ref={bottomRef}
        data={route.params.item.images}
        keyExtractor={(item) => item.toString()}
        showsHorizontalScrollIndicator={false}
        style={{ position: "absolute", bottom: 80, marginLeft: 60 }}
        contentContainerStyle={{
          paddingHorizontal: 10,
          justifyContent: "center",
        }}
        horizontal
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => setActiveIndex(index)}>
              <Image
                source={{ uri: item }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  marginRight: 10,
                  borderWidth: 2,
                  borderColor: actIndex === index ? "#fff" : "transparent",
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  cardTitle: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "500",
    position: "absolute",
    top: "50%",
    // right: '2%'
    // left: 45
    // right: '1%',
    top: "40%",
    left: -35,
  },
  likeContainer: {
    position: "relative",
    backgroundColor: "#000100",
    borderRadius: 100,
    // height: "5%",
    width: 60,
    // paddingLeft: 3,
    // top: "10%",
    zIndex: 1,
    // right: 200,
  },
  likeButton: {
    position: "absolute",
    top: "1%",
    zIndex: 1,
  },
});
