import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-paper";
import React from "react";

const notifications = [
  {
    id: "1",
    userName: "abc",
    userImage: "https://bit.ly/dan-abramov",
    postTime: "10 mins ago",
    postText: "Luffy has requested to follow you",
    postImage:
      "https://i.gaw.to/content/photos/39/08/390843_Mercedes-Benz_G-Class.jpg?1024x640",
    postTitle: "Car",
  },
  {
    id: "2",
    userName: "gaurangchitnis",
    userImage:
      "https://w7.pngwing.com/pngs/1008/377/png-transparent-computer-icons-avatar-user-profile-avatar-heroes-black-hair-computer.png",
    postTime: "14 mins ago",
    postText: "Gaurang Chit posted a new scrapbook",
    postImage:
      "https://media.npr.org/assets/img/2016/03/29/ap_090911089838_sq-3271237f28995f6530d9634ff27228cae88e3440-s1100-c50.jpg",
    postTitle: "Sad",
  },
  {
    id: "3",
    userName: "Devesh Pansaare ",
    userImage:
      "https://w7.pngwing.com/pngs/312/283/png-transparent-man-s-face-avatar-computer-icons-user-profile-business-user-avatar-blue-face-heroes.png",
    postTime: "42 mins ago",
    postText: "invited you to join his group dsefrfder",
    postImage:
      "https://www.highlandernews.org/wp-content/uploads/2016/02/ops.meme_.nba_-1024x768.jpg",
    postTitle: "Uncle",
  },
  {
    id: "4",
    userName: "testusername",
    userImage: "https://bit.ly/dan-abramov",
    postTime: "69 mins ago",
    postText: "Ben commented on your scrapbook",
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
    postText: "Sai Vunnava liked your post",
    postImage:
      "https://stickerly.pstatic.net/sticker_pack/tuhLgeeNbLotJ5dQNtjBYg/KQ7T1T/6/d4e3f6b7-2a08-47f4-b722-99f5994419a9.png",
    postTitle: "surprised",
  },
  {
    id: "6",
    userName: "helloworld",
    userImage:
      "https://callstack.github.io/react-native-paper/screenshots/avatar-image.png",
    postTime: "1h ago",
    postText: "Stop following me",
    postImage:
      "https://stickerly.pstatic.net/sticker_pack/tuhLgeeNbLotJ5dQNtjBYg/KQ7T1T/6/d4e3f6b7-2a08-47f4-b722-99f5994419a9.png",
    postTitle: "surprised",
  },
  {
    id: "7",
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

const Notifications = () => {
  renderPost = (post) => {
    const selectPost = () => {
      setId(post.id);
      console.warn(post.id);
    };

    return (
      <View style={[styles.notifications]}>
        <TouchableOpacity>
          <View style={styles.notificationBox}>
            <View style={styles.picture}>
              <Avatar.Image
                source={{ uri: post.postImage }}
                size={40}
                style={{ marginRight: 12 }}
              />
            </View>
            <View>
              <Text style={{ fontSize: 25, fontWeight: "100" }}>
                {" "}
                {post.userName}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "300",
                  alignContent: "center",
                  padding: 5,
                  marginRight: 10,
                }}
              >
                {post.postText},
              </Text>
              <Text style={{ fontSize: 10, fontWeight: "400" }}>
                {"  "}
                {post.postTime}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} /> */}

      <View style={styles.header}>
        <Text style={{ fontSize: 30, fontWeight: "500", color: "#351c75", textShadowColor: "black", textShadowOffset: {width: 5, height: 5} }}> Notifications</Text>
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
    
    shadowColor: '#fff',
    shadowOffset: {
      width: 0, height: 5
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
