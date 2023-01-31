import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/novella.png";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Card, Avatar } from "react-native-paper";
import {
  getDocs,
  getDoc,
  collection,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  increment,
} from "firebase/firestore";

import { auth, db } from "../firebase";

const posts = [
  {
    id: "1",
    userName: "abc",
    userImage: "https://bit.ly/dan-abramov",
    postTime: "10 mins ago",
    postText: "Stop following me",
    postImage:
      "https://i.gaw.to/content/photos/39/08/390843_Mercedes-Benz_G-Class.jpg?1024x640",
    postTitle: "Car",
  },
  {
    id: "2",
    userName: "gaurangchitnis",
    userImage:
      "https://w7.pngwing.com/pngs/1008/377/png-transparent-computer-icons-avatar-user-profile-avatar-heroes-black-hair-computer.png",
    postTime: "420 mins ago",
    postText:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    postImage:
      "https://media.npr.org/assets/img/2016/03/29/ap_090911089838_sq-3271237f28995f6530d9634ff27228cae88e3440-s1100-c50.jpg",
    postTitle: "Sad",
  },
  {
    id: "3",
    userName: "testusername",
    userImage:
      "https://w7.pngwing.com/pngs/312/283/png-transparent-man-s-face-avatar-computer-icons-user-profile-business-user-avatar-blue-face-heroes.png",
    postTime: "69 mins ago",
    postText: "Stop following me",
    postImage:
      "https://www.highlandernews.org/wp-content/uploads/2016/02/ops.meme_.nba_-1024x768.jpg",
    postTitle: "Uncle",
  },
  {
    id: "4",
    userName: "testusername",
    userImage: "https://bit.ly/dan-abramov",
    postTime: "14 mins ago",
    postText: "Stop following me",
    postImage:
      "http://images7.memedroid.com/images/UPLOADED743/60416b642824c.jpeg",
    postTitle: "Title",
  },
  {
    id: "5",
    userName: "helloworld",
    userImage:
      "https://callstack.github.io/react-native-paper/screenshots/avatar-image.png",
    postTime: "1h ago",
    postText: "Stop following me",
    postImage:
      "https://stickerly.pstatic.net/sticker_pack/tuhLgeeNbLotJ5dQNtjBYg/KQ7T1T/6/d4e3f6b7-2a08-47f4-b722-99f5994419a9.png",
    postTitle: "surprised",
  },
];

export const postID = () => {
  // console.warn(id)
  return { id };
};

const Feed = ({ navigation }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const [scrapbooks, getScrapbooks] = useState([]);

  const [Loading, setLoading] = useState(false);

  const [id, setId] = useState(1);
  useEffect(() => {
    console.log(scrapbooks)
  }, [scrapbooks])

  const FollowerListtttt = async () => {
    const currDoc = doc(db, "users", auth.currentUser.uid);
    await getDoc(currDoc).then(async (QuerySnapshot) => {
      QuerySnapshot.data().following.forEach(async (element) => {
        const ref = collection(db, "users", element, "Scrapbooks");
        await getDocs(ref).then((data) => {
          data.forEach((item) => {
            getScrapbooks((prev) => [...prev, item.data()]);
          })
        })
      });
    });
  };
  useEffect(() => {
    FollowerListtttt();
  }, []);

  // async function Scrapbooks(uid) {
  //   await getDocs(ref).then((data) => {
  //     data.forEach((item) => {
  //       getScrapbooks((prev) => [...prev, item.data()]);
  //     });
  //   })
  //   setLoading(false);
  //   };
const test = () => {
  console.log(scrapbooks)
}


  renderPost = (post) => {
    selectPost = () => {
      setId(post.id);
      console.warn(post.id);
    };

    return (
      <Card style={[styles.post]}>
        <TouchableOpacity onPress={() => navigation.navigate('Post')}>
          <Card.Cover source={{ uri: post.CoverImg }} resizeMode="cover" />
        </TouchableOpacity>
        <Card.Title
          style={styles.postHeader}
          title={post.postTitle}
          titleStyle={styles.cardTitle}
          subtitle={post.username}
          subtitleStyle={styles.cardSubTitle}
          right={(props) => <Text>{post.postTime}</Text>}
          // rightStyle={}
          left={(props) => (
            <Avatar.Image source={{ uri: post.profilepic }} size={25} />
          )}
          leftStyle={styles.profilePicture}
        />
      </Card>
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
        data={scrapbooks}
        renderItem={({ item }) => renderPost(item)}
        keyExtractor={(item) => item.id}
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
  },
  cardTitle: {
    position: "absolute",
    bottom: 5,
  },
  profilePicture: {
    position: "absolute",
    left: 17,
    bottom: 10,
  },
});
