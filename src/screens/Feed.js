import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  FlatList,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/novella.png";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Card, Avatar } from "react-native-paper";
import {
  getDocs,
  getDoc,
  updateDoc,
  collection,
  doc,
  orderBy,
  query,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";

import { AntDesign } from "@expo/vector-icons";

import { IconButton } from "react-native-paper";

import { auth, db } from "../firebase";
import { async } from "@firebase/util";

export const postID = () => {
  // console.warn(id)
  return { id };
};

const Feed = ({ navigation }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [likeCounter, setlikeCounter] = useState(0);
  const [scrapbooks, getScrapbooks] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [likePressed, setLikePressed] = useState(false);

  const [id, setId] = useState(1);
  useEffect(() => {}, [scrapbooks]);

  const FollowerListtttt = async () => {
    const currDoc = doc(db, "users", auth.currentUser.uid);
    await getDoc(currDoc).then(async (QuerySnapshot) => {
      QuerySnapshot.data().following.forEach(async (element) => {
        const ref = collection(db, "users", element, "Scrapbooks");
        await getDocs(ref).then((data) => {
          data.forEach((item) => {
            getScrapbooks((prev) => [...prev, item.data()]);
          });
        });
      });
    });
  };

  useEffect(() => {
    FollowerListtttt();
  }, []);

  renderPost = (post) => {
    return (
      <>
        <Card style={[styles.post]}>
          <TouchableOpacity style={{flexDirection:"row"}} onPress={()=>navigation.navigate("Profile", {item: post.uid})}>
            <Card.Actions >
              <Avatar.Image
                source={{ uri: post.profilepic ? post.profilepic : "" }}
                size={25}
              />
              <Text styles={styles.cardSubTitle}>{post.username}</Text>
            </Card.Actions>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Post", { item: post })}
          >
            <Card.Cover
              source={{ uri: post.CoverImg ? post.CoverImg : "" }}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <Card.Title
            style={styles.postHeader}
            title={post.title}
            titleStyle={styles.cardTitle}
            subtitleStyle={styles.cardSubTitle}
            leftStyle={styles.profilePicture}
          />
        </Card>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} /> */}
      <View
        style={[
          styles.header,
          // { height: windowHeight * 0.08 },
          // { width: windowWidth},
        ]}
      >
        <Image
          source={Logo}
          style={[
            styles.logo,
            { height: windowHeight * 0.04 },
            { width: windowWidth * 0.09 },
          ]}
          resizeMode="contain"
        />
        <TouchableOpacity style={{ marginBottom: 5 }}>
          <Ionicons name="chatbubble-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.feed}
        data={scrapbooks.sort(function (a, b) {
          if (a.timestamp > b.timestamp) return -1;
          if (a.timestamp < b.timestamp) return 1;
          return 0;
        })}
        renderItem={({ item }) => renderPost(item)}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 100,
    height: "100%",
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 10,
    // paddingVertical: 10,
    zIndex: 1,
    height: "10%",
  },
  logo: {
    justifyContent: "space-around",
    alignContent: "center",
    maxWidth: 100,
    maxHeight: 100,
    marginBottom: 30,
    left: 10,
    bottom: 4,
  },
  feed: {
    marginHorizontal: 20,
    marginBottom: 37,
  },
  post: {
    marginVertical: 8,
    // maxWidth: 500,
    // alignSelf:"center"
    backgroundColor: "white",
  },
  postHeader: {
    position: "relative",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardSubTitle: {
    position: "absolute",
    top: -4,
    left: 35,
    fontSize: 15,
    top: 0.3,
  },
  cardTitle: {
    position: "absolute",
    fontSize: 22,
    fontWeight: "600",
    left: 0.5,
    // bottom: 0.2,
    zIndex: 1,
  },
  profilePicture: {
    position: "absolute",
    left: 17,
    bottom: 10,
  },
});
