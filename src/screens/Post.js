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

import { auth, db } from "../firebase";

import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { FontAwesome } from "@expo/vector-icons";


const Post = ({ navigation, route }) => {
  const scrollx = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get("screen");

  const widthCard = width * 0.7;
  const heightCard = widthCard * 1.54;

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

  const retrieveLikes = async () => {
    const id = route.params.item.docId;
    const docRef = doc(db, "users", route.params.item.uid, "Scrapbooks", id);
    await getDoc(docRef).then((QuerySnapshot) => {
      setLikesArray(QuerySnapshot.data().likesArray);
      setLikes(QuerySnapshot.data().likes);
    });
  };

  const likePost = async () => {
    // get the scrapbook id of the current scrapbook
    const id = route.params.item.docId;
    const currDoc = doc(db, "users", route.params.item.uid, "Scrapbooks", id);
    await getDoc(currDoc).then(async (QuerySnapshot) => {
      if (QuerySnapshot.data().likesArray.includes(auth.currentUser.uid)) {
        setLikePressed(false);
        setLikes(likes);
        await updateDoc(currDoc, {
          likesArray: arrayRemove(auth.currentUser.uid),
          likes: increment(-1),
        });
      } else {
        setLikes(likes);
        setLikePressed(true);
        await updateDoc(currDoc, {
          likesArray: arrayUnion(auth.currentUser.uid),
          likes: increment(1),
        });
      }
    });
  };

  const likeStatus = async () => {
    const id = route.params.item.docId;
    const currDoc = doc(db, "users", route.params.item.uid, "Scrapbooks", id);
    await getDoc(currDoc).then(async (QuerySnapshot) => {
      if (QuerySnapshot.data().likesArray.includes(auth.currentUser.uid)) {
        setLikePressed(true);
      } else {
        setLikePressed(false);
      }
    });
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
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    backgroundColor: "black",
                    height: "14%",
                    width: "60%",
                    borderTopRadius: 10,
                    left: "6%",
                    paddingRight: 385,
                    paddingLeft: 100,
                  }}
                >
                  <View
                    style={{ flex: 1, flexDirection: "row", marginTop: 10 }}
                  >
                    <Text style={styles.cardTitle}>
                      {route.params.item.title}
                    </Text>
                    <Avatar.Image
                      source={{ uri: route.params.item.profilepic }}
                      size={25}
                      style={{
                        marginRight: 5,
                        marginTop: 20,
                        alignSelf: "center ",
                      }}
                    />
                    <Text
                      style={{
                        color: "white",
                        zIndex: 1,
                        position: "absolute",
                        left: 35,
                        top: 23,
                      }}
                    >
                      {route.params.item.username}
                    </Text>
                  </View>
                </View>

                {/* View- aligned right */}
                <View
                  style={{
                    flexDirection: "row",
                    position: "absolute",
                    right: 50,
                    backgroundColor: "red",
                    height: "14%",
                    width: "27%",
                  }}
                >
                  <View
                    style={{
                      position:"relative",
                      backgroundColor: "white",
                      borderRadius: 100,
                      width: 38,
                      height: 20,
                      margin: 10,
                     
                    }}
                  >
                    <IconButton
                      style={{
                        position: "absolute",
                        alignSelf: "center",
                        justifyContent: "center",
                      }}
                      icon={likePressed ? "heart" : "heart-outline"}
                      iconColor="purple"
                      size={25}
                      onPress={() => {
                        likePost();
                      }}
                    />
                    <Text
                      style={{
                        position: "absolute",
                        left: 45,
                        top: 17,
                      }}
                    >
                      {likes}
                    </Text>
                  </View>

                  <TouchableOpacity onPress={()=>navigation.navigate("Comments" , {item: route.params.item})}>
                    <View
                      style={{
                        backgroundColor: "white",
                        borderRadius: 100,
                        width: 38,
                      }}
                    >
                      <FontAwesome
                        name="comments-o"
                        size={24}
                        color="black"
                        style={{ paddingLeft: 7 }}
                      />
                    </View>
                  </TouchableOpacity>

                  {/*share */}
                </View>
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
    fontSize: 15,
    fontWeight: "600",
    position: "absolute",
  },
  likeContainer: {
    position: "relative",
    backgroundColor: "#000100",
    borderRadius: 100,
    height: "5%",
    width: 60,
    top: "3%",
    zIndex: 1,
    right: 100,
  },
  likeButton: {
    position: "absolute",
    top: "1%",
    zIndex: 1,
  },
});
