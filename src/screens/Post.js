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

import { doc, getDoc, updateDoc, arrayRemove, arrayUnion, increment } from "firebase/firestore";
import { async } from "@firebase/util";

const Post = ({ navigation, route }) => {
  const scrollx = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get("screen");

  const widthCard = width * 0.7;
  const heightCard = widthCard * 1.54;

  const topRef = useRef();
  const bottomRef = useRef();
  const [actIndex, setactIndex] = useState(0);
  const [likes, setLikes] = useState(2);
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
        setLikes(likes)
        await updateDoc(currDoc, {
          likesArray: arrayRemove(auth.currentUser.uid),
          likes: increment(-1),
        });
      } else {
        setLikes(likes)
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
              <IconButton
                icon={likePressed ? "heart" : "heart-outline"}
                iconColor="purple"
                size={30}
                onPress={() => {
                  likePost();
                }}
              />
              <Text style={{}}> {likes} </Text>
              <Image
                source={{ uri: item }}
                style={{
                  width: widthCard,
                  height: heightCard,
                  resizeMode: "cover",
                  borderRadius: 20,
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

const styles = StyleSheet.create({});
